#!/usr/bin/env node
// Motion probe: measures animation and scroll smoothness on real interaction
// flows, grades them against budgets, explains the jank, and diffs against a
// saved baseline. Documented in docs/profiling.md §4.
//
//   pnpm motion                                  all scenarios, phone + desktop
//   pnpm motion --scenario home --viewport phone
//   pnpm motion --save-baseline before           keep a named reference
//   pnpm motion --compare before                 grade a change against it
//   pnpm motion --filmstrip --scenario home.open contact sheet of the frames
//   pnpm motion --list
//
// Guards that exist because each one burned a retry once:
//   - refuses to measure `next dev` (on-demand compilation makes timings fiction)
//   - refuses a production build older than the source (you would be grading
//     the code from before your fix); --build rebuilds first
//   - every scenario verifies its end state, so a click that never landed fails
//     instead of reporting "no change"
//   - comparisons warn when CPU throttle, run count or Chrome version differ

import { execFileSync, spawn } from "node:child_process"
import { existsSync, readdirSync, statSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { createServer } from "node:net"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { launchChrome } from "./cdp.mjs"
import { openPage, VIEWPORTS } from "./page.mjs"
import { aggregateRuns, formatCompare, formatDetails, formatTable, grade, summarizeTiming, summarizeTrajectory } from "./report.mjs"
import { SCENARIOS, selectScenarios } from "./scenarios.mjs"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const OUT_DIR = path.join(ROOT, ".motion")
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function parseArgs(argv) {
  const opts = {
    viewport: "phone,desktop",
    cpu: 4,
    runs: 3,
    trajectory: true,
    filmstrip: false,
    build: false,
    allowStale: false,
    allowDev: false,
    headed: false,
  }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    const next = () => {
      const v = argv[++i]
      if (v === undefined) throw new Error(`${a} needs a value`)
      return v
    }
    switch (a) {
      case "--url": opts.url = next(); break
      case "--scenario": case "-s": opts.scenario = next(); break
      case "--viewport": case "-v": opts.viewport = next(); break
      case "--cpu": opts.cpu = Number(next()); break
      case "--runs": opts.runs = Number(next()); break
      case "--no-trajectory": opts.trajectory = false; break
      case "--filmstrip": opts.filmstrip = true; break
      case "--build": opts.build = true; break
      case "--allow-stale": opts.allowStale = true; break
      case "--allow-dev": opts.allowDev = true; break
      case "--headed": opts.headed = true; break
      case "--save-baseline": opts.saveBaseline = next(); break
      case "--compare": opts.compare = next(); break
      case "--label": opts.label = next(); break
      case "--list": opts.list = true; break
      case "--help": case "-h": opts.help = true; break
      default: throw new Error(`Unknown flag ${a}. See --help.`)
    }
  }
  return opts
}

const HELP = `motion probe: animation/scroll smoothness on real flows

  --scenario, -s <names>   comma list; a prefix selects a group (home, case, playbook)
  --viewport, -v <names>   phone,tablet,desktop (default phone,desktop)
  --cpu <n>                CPU throttle multiplier (default 4, a mid-range phone)
  --runs <n>               timing runs per scenario; medians are graded (default 3)
  --no-trajectory          skip the diagnostic pass (faster, no "why")
  --filmstrip              save frames + a contact sheet under .motion/film/
  --save-baseline <name>   also write .motion/baselines/<name>.json
  --compare <name|path>    diff against a saved baseline
  --label <text>           annotate this run in its JSON
  --url <origin>           probe an existing server (e.g. production) instead of
                           starting \`next start\` on the local build
  --build                  run \`pnpm build\` first
  --allow-stale            measure a build older than the source anyway
  --allow-dev              measure a dev server anyway (numbers are not valid)
  --headed                 visible Chrome with real GPU compositing
  --list                   print scenarios`

// ── Guards ───────────────────────────────────────────────────────────────

function newestSourceMtime() {
  const roots = ["app", "public", "next.config.mjs", "postcss.config.mjs", "package.json", "pnpm-lock.yaml"]
  let newest = { t: 0, file: "" }
  const visit = (p) => {
    if (!existsSync(p)) return
    const st = statSync(p)
    if (st.isDirectory()) {
      for (const e of readdirSync(p, { recursive: true, withFileTypes: true })) {
        if (!e.isFile()) continue
        const f = path.join(e.parentPath ?? e.path, e.name)
        const t = statSync(f).mtimeMs
        if (t > newest.t) newest = { t, file: f }
      }
    } else if (st.mtimeMs > newest.t) newest = { t: st.mtimeMs, file: p }
  }
  for (const r of roots) visit(path.join(ROOT, r))
  return newest
}

function checkBuildFresh(allowStale) {
  const idFile = path.join(ROOT, ".next", "BUILD_ID")
  if (!existsSync(idFile)) throw new Error("No production build (.next/BUILD_ID). Run with --build or `pnpm build` first.")
  const built = statSync(idFile).mtimeMs
  const newest = newestSourceMtime()
  if (newest.t > built) {
    const msg = `Build is older than the source (${path.relative(ROOT, newest.file)} changed after the build). You would be measuring the code from before your change. Run with --build.`
    if (!allowStale) throw new Error(msg)
    console.warn(`! ${msg} (continuing: --allow-stale)`)
  }
}

async function assertNotDev(origin, allowDev) {
  const html = await (await fetch(origin)).text()
  if (/hmr-client|react-refresh|webpack-hmr|next-devtools|__nextDevClientId/i.test(html)) {
    const msg = `${origin} looks like \`next dev\`. Dev compiles on demand and injects HMR, so frame timings are not valid.`
    if (!allowDev) throw new Error(msg + " Use the default local production server or --allow-dev.")
    console.warn(`! ${msg}`)
  }
}

// ── Server ───────────────────────────────────────────────────────────────

const freePort = () =>
  new Promise((resolve, reject) => {
    const srv = createServer()
    srv.unref()
    srv.on("error", reject)
    srv.listen(0, () => {
      const { port } = srv.address()
      srv.close(() => resolve(port))
    })
  })

async function startProdServer() {
  const port = await freePort()
  const bin = path.join(ROOT, "node_modules", ".bin", "next")
  const proc = spawn(bin, ["start", "-p", String(port)], { cwd: ROOT, stdio: ["ignore", "ignore", "pipe"], env: { ...process.env, NODE_ENV: "production" } })
  let stderr = ""
  proc.stderr.on("data", (d) => (stderr += d))
  const origin = `http://127.0.0.1:${port}`
  const t0 = Date.now()
  while (Date.now() - t0 < 30000) {
    if (proc.exitCode !== null) throw new Error(`next start exited: ${stderr.slice(-400)}`)
    try {
      const res = await fetch(origin)
      if (res.ok) return { origin, stop: () => proc.kill() }
    } catch {
      /* not up yet */
    }
    await sleep(250)
  }
  proc.kill()
  throw new Error("next start did not respond within 30s")
}

// ── Measurement ──────────────────────────────────────────────────────────

async function measureOnce(browser, origin, scenario, viewport, cpu, mode, { filmstrip = false } = {}) {
  const page = await openPage(browser, { baseUrl: origin, viewport: VIEWPORTS[viewport], cpu })
  try {
    const recOpts = { mode, track: mode === "trajectory" ? scenario.track ?? [] : [] }
    let stopFilm = null
    let raw

    if (scenario.load) {
      const { identifier } = await page.session.send("Page.addScriptToEvaluateOnNewDocument", {
        source: `window.__motion.start(${JSON.stringify(recOpts)});\n//# sourceURL=motion-probe-autostart.js`,
      })
      if (filmstrip) stopFilm = await page.startScreencast()
      const loaded = page.session.once("Page.loadEventFired", 45000)
      await page.session.send("Page.navigate", { url: new URL(scenario.route, origin).href })
      await loaded
      await sleep(scenario.windowMs)
      raw = await page.stopRecording()
      await page.session.send("Page.removeScriptToEvaluateOnNewDocument", { identifier })
    } else {
      await scenario.setup(page)
      if (filmstrip) stopFilm = await page.startScreencast()
      await page.startRecording(recOpts)
      await scenario.act(page)
      await sleep(scenario.windowMs)
      raw = await page.stopRecording()
    }

    const film = stopFilm ? await stopFilm() : null
    if (scenario.verify) await scenario.verify(page)
    if (!raw || raw.frames.length < 5) throw new Error(`recorded only ${raw?.frames.length ?? 0} frames: rAF starved or the page navigated away mid-window`)
    return { raw, film }
  } finally {
    await page.close().catch(() => {})
  }
}

async function writeFilmstrip(browser, scenario, viewport, frames) {
  if (!frames?.length) return null
  const dir = path.join(OUT_DIR, "film", `${scenario.name}@${viewport}`)
  await mkdir(dir, { recursive: true })
  const t0 = frames[0].ts
  const step = Math.max(1, Math.ceil(frames.length / 24))
  const picked = frames.filter((_, i) => i % step === 0)
  const cells = []
  for (let i = 0; i < picked.length; i++) {
    const f = picked[i]
    const name = `${String(i).padStart(3, "0")}.jpg`
    await writeFile(path.join(dir, name), Buffer.from(f.data, "base64"))
    cells.push(`<figure><img src="${name}"><figcaption>${Math.round((f.ts - t0) * 1000)}ms</figcaption></figure>`)
  }
  const cols = VIEWPORTS[viewport].width < 500 ? 6 : 4
  const html = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;padding:12px;background:#222;font:12px ui-monospace,monospace;color:#eee}
    h1{font-size:13px;margin:0 0 8px}
    .g{display:grid;grid-template-columns:repeat(${cols},1fr);gap:8px}
    figure{margin:0} img{width:100%;display:block;border:1px solid #444} figcaption{padding:2px 0}
  </style><h1>${scenario.name} @ ${viewport}: ${frames.length} frames, every ${step} shown</h1><div class="g">${cells.join("")}</div>`
  const sheet = path.join(dir, "sheet.html")
  await writeFile(sheet, html)

  const page = await openPage(browser, { baseUrl: "file:///", viewport: { width: 1600, height: 1000, deviceScaleFactor: 1, mobile: false }, cpu: 1 })
  try {
    const loaded = page.session.once("Page.loadEventFired")
    await page.session.send("Page.navigate", { url: `file://${sheet}` })
    await loaded
    await sleep(300)
    const { data } = await page.session.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true })
    const png = path.join(dir, "sheet.png")
    await writeFile(png, Buffer.from(data, "base64"))
    return path.relative(ROOT, png)
  } finally {
    await page.close().catch(() => {})
  }
}

function gitMeta() {
  try {
    const sha = execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim()
    const dirty = execFileSync("git", ["status", "--porcelain", "--", "app", "public"], { cwd: ROOT, encoding: "utf8" }).trim().length > 0
    const branch = execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim()
    return { sha, dirty, branch }
  } catch {
    return { sha: "unknown", dirty: false, branch: "unknown" }
  }
}

async function resolveBaseline(ref) {
  const file = existsSync(ref) ? ref : path.join(OUT_DIR, "baselines", `${ref}.json`)
  if (!existsSync(file)) throw new Error(`Baseline not found: ${ref} (looked for ${path.relative(ROOT, file)})`)
  return JSON.parse(await readFile(file, "utf8"))
}

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  if (opts.help) return console.log(HELP)
  if (opts.list) {
    for (const s of SCENARIOS) console.log(`${s.name.padEnd(20)} ${s.description}`)
    return
  }

  const scenarios = selectScenarios(opts.scenario)
  const viewports = opts.viewport.split(",").map((v) => v.trim())
  for (const v of viewports) if (!VIEWPORTS[v]) throw new Error(`Unknown viewport ${v}. Use ${Object.keys(VIEWPORTS).join(", ")}.`)
  const baseline = opts.compare ? await resolveBaseline(opts.compare) : null

  let server = null
  let origin = opts.url
  if (origin) {
    await assertNotDev(origin, opts.allowDev)
  } else {
    if (opts.build) {
      console.log("Building (pnpm build)...")
      execFileSync("pnpm", ["build"], { cwd: ROOT, stdio: "inherit" })
    }
    checkBuildFresh(opts.allowStale)
    server = await startProdServer()
    origin = server.origin
  }

  const chrome = await launchChrome({ headed: opts.headed })
  const cleanup = async () => {
    await chrome.close()
    server?.stop()
  }
  process.on("SIGINT", () => cleanup().finally(() => process.exit(130)))

  const results = []
  const git = gitMeta()
  console.log(`Probing ${origin} | ${scenarios.length} scenario(s) x ${viewports.join(",")} | cpu ${opts.cpu}x | ${opts.runs} run(s) | ${chrome.version}`)

  try {
    for (const viewport of viewports) {
      for (const scenario of scenarios) {
        const label = `${scenario.name}@${viewport}`
        process.stdout.write(`  ${label.padEnd(30)}`)
        try {
          const runs = []
          for (let i = 0; i < opts.runs; i++) {
            const { raw } = await measureOnce(chrome.browser, origin, scenario, viewport, opts.cpu, "timing")
            runs.push(summarizeTiming(raw))
            process.stdout.write(".")
          }
          const timing = aggregateRuns(runs)
          let trajectory = null
          let trajectoryRaw = null
          let filmstrip = null
          if (opts.trajectory || opts.filmstrip) {
            const { raw, film } = await measureOnce(chrome.browser, origin, scenario, viewport, opts.cpu, "trajectory", { filmstrip: opts.filmstrip })
            trajectory = summarizeTrajectory(raw)
            // Kept verbatim so a later session can re-read the per-frame path of
            // any tracked element without re-running the flow.
            trajectoryRaw = { frames: raw.frames, tracks: raw.tracks }
            if (film) filmstrip = await writeFilmstrip(chrome.browser, scenario, viewport, film)
            process.stdout.write("+")
          }
          const g = grade(timing, trajectory)
          results.push({ scenario: scenario.name, viewport, timing, runs, trajectory, trajectoryRaw, grade: g, filmstrip })
          console.log(` ${g.verdict}${filmstrip ? `  ${filmstrip}` : ""}`)
        } catch (err) {
          results.push({ scenario: scenario.name, viewport, error: err.message })
          console.log(` ERROR ${err.message}`)
        }
      }
    }
  } finally {
    await cleanup()
  }

  const report = {
    meta: {
      date: new Date().toISOString(),
      label: opts.label ?? null,
      ...git,
      origin: opts.url ?? "local next start",
      buildId: existsSync(path.join(ROOT, ".next", "BUILD_ID")) ? (await readFile(path.join(ROOT, ".next", "BUILD_ID"), "utf8")).trim() : null,
      chrome: chrome.version,
      cpu: opts.cpu,
      runs: opts.runs,
      headed: opts.headed,
      viewports,
    },
    results,
  }

  await mkdir(path.join(OUT_DIR, "runs"), { recursive: true })
  const stamp = report.meta.date.replace(/[:.]/g, "-")
  const runFile = path.join(OUT_DIR, "runs", `${stamp}-${git.sha}${git.dirty ? "-dirty" : ""}.json`)
  await writeFile(runFile, JSON.stringify(report, null, 2))
  await writeFile(path.join(OUT_DIR, "latest.json"), JSON.stringify(report, null, 2))
  if (opts.saveBaseline) {
    await mkdir(path.join(OUT_DIR, "baselines"), { recursive: true })
    await writeFile(path.join(OUT_DIR, "baselines", `${opts.saveBaseline}.json`), JSON.stringify(report, null, 2))
  }

  console.log("\n" + formatTable(results))
  const details = formatDetails(results)
  if (details) console.log(details)
  if (baseline) console.log("\n" + formatCompare(baseline, report))
  console.log(`\nSaved ${path.relative(ROOT, runFile)}${opts.saveBaseline ? ` and .motion/baselines/${opts.saveBaseline}.json` : ""}`)

  if (results.some((r) => r.error)) process.exitCode = 2
  else if (results.some((r) => r.grade.verdict === "FAIL")) process.exitCode = 1
}

main().catch((err) => {
  console.error(`motion probe: ${err.message}`)
  process.exit(2)
})
