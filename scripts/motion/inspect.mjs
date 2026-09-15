#!/usr/bin/env node
// Frame-by-frame reader for saved probe runs. Answers "what exactly happened
// on the frame the report flagged" from the JSON already on disk, so a
// suspicious number is investigated without re-running the flow.
//
//   pnpm motion:inspect                                   list flows in .motion/latest.json
//   pnpm motion:inspect before home.switch-down@desktop    every tracked element, per frame
//   pnpm motion:inspect latest case.zoom-open@phone ".modal-zoom svg" --around 120
//
// First argument: a baseline name, "latest", or a path to a run JSON.

import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const OUT = path.join(ROOT, ".motion")

const args = process.argv.slice(2)
const aroundIdx = args.indexOf("--around")
const around = aroundIdx >= 0 ? Number(args.splice(aroundIdx, 2)[1]) : null
const [ref = "latest", key, selector] = args

const file = existsSync(ref)
  ? ref
  : ref === "latest"
    ? path.join(OUT, "latest.json")
    : path.join(OUT, "baselines", `${ref}.json`)
if (!existsSync(file)) {
  console.error(`No run at ${path.relative(ROOT, file)}`)
  process.exit(2)
}
const report = JSON.parse(readFileSync(file, "utf8"))

if (!key) {
  console.log(`${path.relative(ROOT, file)}  (${report.meta.label ?? report.meta.sha}, ${report.meta.date})`)
  for (const r of report.results) {
    const tracked = r.trajectoryRaw ? Object.keys(r.trajectoryRaw.tracks).join(", ") : "no trajectory saved"
    console.log(`  ${`${r.scenario}@${r.viewport}`.padEnd(30)} ${r.error ? "ERROR " + r.error : r.grade.verdict.padEnd(5)}  ${tracked}`)
  }
  process.exit(0)
}

const [scenario, viewport] = key.split("@")
const result = report.results.find((r) => r.scenario === scenario && r.viewport === viewport)
if (!result) {
  console.error(`No ${key} in this run. Run without a flow name to list them.`)
  process.exit(2)
}
if (!result.trajectoryRaw) {
  console.error(`${key} has no saved trajectory (run was --no-trajectory, or predates raw capture).`)
  process.exit(2)
}

const { frames, tracks } = result.trajectoryRaw
const selectors = selector ? [selector] : Object.keys(tracks)
for (const sel of selectors) {
  if (!tracks[sel]) {
    console.error(`Not tracked in ${key}: ${sel}. Tracked: ${Object.keys(tracks).join(", ")}`)
    process.exit(2)
  }
}

// Flag the frame the report would call a snap: movement not explained by scroll.
const snapPx = 40
console.log(`${key}  ${result.grade.verdict}  (${frames.length} frames)`)
for (const r of result.grade.reasons) console.log(`  ${r}`)
for (const sel of selectors) {
  console.log(`\n${sel}`)
  console.log("     t     dt      y     dh |     top  height  opac |   dTop  dDoc     dH")
  const samples = tracks[sel]
  let flaggedT = null
  const rows = []
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i]
    const s = samples[i]
    const p = samples[i - 1]
    const pf = frames[i - 1]
    let dTop = "", dDoc = "", dH = "", flag = ""
    if (s && p && pf) {
      const dv = s.top - p.top
      const dd = dv + (f.y - pf.y)
      dTop = dv.toFixed(1)
      dDoc = dd.toFixed(1)
      dH = (s.height - p.height).toFixed(1)
      if (Math.min(Math.abs(dv), Math.abs(dd)) > snapPx || Math.abs(s.height - p.height) > 120) {
        flag = "  <- snap"
        flaggedT ??= f.t
      }
    }
    rows.push({
      t: f.t,
      line:
        `${String(f.t).padStart(6)} ${String(f.dt).padStart(6)} ${String(f.y).padStart(6)} ${String(f.dh).padStart(6)} | ` +
        (s
          ? `${String(s.top).padStart(7)} ${String(s.height).padStart(7)} ${String(s.opacity).padStart(5)} | ${dTop.padStart(6)} ${dDoc.padStart(5)} ${dH.padStart(6)}`
          : "      (not in DOM)          |") +
        flag,
    })
  }
  const center = around ?? flaggedT
  const shown = center === null ? rows : rows.filter((r) => Math.abs(r.t - center) <= 160)
  for (const r of shown) console.log(r.line)
  if (center !== null && shown.length < rows.length) console.log(`  (showing +/-160ms around ${center}ms; --around <ms> to move, omit to auto-center on the first snap)`)
}
