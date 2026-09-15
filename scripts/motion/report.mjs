// Turns raw recordings into graded summaries, explanations and diffs.
//
// Grading uses only the timing pass (nothing forced layout while it ran). The
// trajectory pass supplies the "why": which properties animated on the main
// thread, which elements JS wrote styles to every frame, and whether tracked
// elements snapped, reversed or clamped.

// Budgets. Tune here, not at call sites, so every run grades the same way.
export const BUDGET = {
  // Frame interval percentiles, ms. 16.7 is one 60Hz frame.
  p90Warn: 18,
  p90Fail: 25,
  // Frames that took two or more intervals.
  longFramesWarn: 1,
  longFramesFail: 4,
  // Share of frames dropped inside the window.
  dropRateWarn: 0.05,
  dropRateFail: 0.15,
  // Long animation frames (LoAF), ms.
  loafFail: 150,
  // Scroll speed normalised to one 60Hz frame; above this reads as a snap.
  scrollSnapPx: 250,
  // Per-frame jump of a tracked element's top/height with no scroll to explain it.
  trackSnapPx: 120,
}

const COMPOSITOR = new Set(["opacity", "transform", "translate", "scale", "rotate", "filter", "backdrop-filter", "offset-distance"])
const PAINT_ONLY = new Set([
  "color",
  "background-color",
  "border-color",
  "border-top-color",
  "border-bottom-color",
  "box-shadow",
  "outline-color",
  "fill",
  "stroke",
  "text-decoration-color",
  "background-position",
  "clip-path",
])

const kebab = (p) => p.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())
export const classifyProperty = (prop) => {
  const p = kebab(prop.trim())
  if (COMPOSITOR.has(p) || p === "will-change") return "compositor"
  if (PAINT_ONLY.has(p) || /^border(-[a-z]+)*-color$/.test(p)) return "paint"
  if (p === "all") return "layout?"
  return "layout"
}

const median = (xs) => {
  const s = xs.filter((x) => Number.isFinite(x)).sort((a, b) => a - b)
  return s.length ? s[s.length >> 1] : 0
}
const round = (x, d = 1) => Math.round(x * 10 ** d) / 10 ** d

export function summarizeTiming(raw) {
  const frames = raw.frames.slice(1) // first delta measures the gap before recording
  const deltas = frames.map((f) => f.dt).sort((a, b) => a - b)
  const q = (p) => (deltas.length ? deltas[Math.min(deltas.length - 1, Math.floor(deltas.length * p))] : 0)
  const interval = Math.max(8, Math.min(q(0.5), 17.5)) // refresh interval, robust to jank
  let dropped = 0
  let longFrames = 0
  let scrollSnap = 0
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i]
    const slots = Math.round(f.dt / interval)
    if (slots >= 2) longFrames++
    dropped += Math.max(0, slots - 1)
    if (i > 0 && f.y !== null && frames[i - 1].y !== null) {
      const step = Math.abs(f.y - frames[i - 1].y)
      scrollSnap = Math.max(scrollSnap, step / Math.max(1, f.dt / 16.67))
    }
  }
  const loaf = raw.loaf || []
  return {
    frames: frames.length,
    p50: round(q(0.5)),
    p90: round(q(0.9)),
    p99: round(q(0.99)),
    worst: round(deltas.at(-1) ?? 0),
    longFrames,
    dropRate: round(dropped / Math.max(1, frames.length + dropped), 3),
    loafCount: loaf.length,
    loafMax: Math.round(Math.max(0, ...loaf.map((e) => e.duration))),
    loafBlocking: Math.round(loaf.reduce((a, e) => a + (e.blocking || 0), 0)),
    styleLayoutMax: Math.round(Math.max(0, ...loaf.map((e) => e.styleLayout || 0))),
    scrollSnapPx: Math.round(scrollSnap),
    cls: round((raw.shifts || []).filter((s) => !s.input).reduce((a, s) => a + s.value, 0), 4),
    loafScripts: topScripts(loaf),
  }
}

function topScripts(loaf) {
  const agg = {}
  for (const e of loaf) {
    for (const s of e.scripts) {
      if (s.src.startsWith("motion-probe")) continue
      const key = `${s.invoker || "?"} ${s.fn ? s.fn + " " : ""}(${s.src || "inline"})`
      agg[key] = (agg[key] || 0) + s.duration
    }
  }
  return Object.entries(agg)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([k, ms]) => ({ script: k, ms }))
}

export function aggregateRuns(runs) {
  const keys = Object.keys(runs[0]).filter((k) => typeof runs[0][k] === "number")
  const out = Object.fromEntries(keys.map((k) => [k, median(runs.map((r) => r[k]))]))
  out.runs = runs.length
  out.spreadP90 = round(Math.max(...runs.map((r) => r.p90)) - Math.min(...runs.map((r) => r.p90)))
  out.loafScripts = runs.flatMap((r) => r.loafScripts).sort((a, b) => b.ms - a.ms).slice(0, 5)
  return out
}

export function summarizeTrajectory(raw) {
  const mainThreadAnimations = Object.entries(raw.animations || {})
    .map(([key, frames]) => {
      const prop = key.split(" @ ")[0]
      return { key, frames, class: classifyProperty(prop) }
    })
    .filter((a) => a.class !== "compositor")
    .sort((a, b) => b.frames - a.frames)

  const jsStyleWrites = Object.entries(raw.styleWrites || {})
    .map(([key, writes]) => ({ key, writes, class: classifyProperty(key.split(" @ ")[0]) }))
    .sort((a, b) => b.writes - a.writes)
    .slice(0, 10)

  const frames = raw.frames
  let clampFrames = 0
  let scrollReversals = 0
  let lastDir = 0
  for (let i = 1; i < frames.length; i++) {
    const a = frames[i - 1]
    const b = frames[i]
    const atFloor = b.y >= b.dh - b.vh - 1
    if (atFloor && b.dh < a.dh && b.y < a.y) clampFrames++
    const dir = Math.sign(b.y - a.y)
    if (dir !== 0) {
      if (lastDir !== 0 && dir !== lastDir) scrollReversals++
      lastDir = dir
    }
  }

  const tracks = {}
  for (const [sel, samples] of Object.entries(raw.tracks || {})) {
    const present = samples.map((s, i) => (s ? { ...s, y: frames[i]?.y ?? 0 } : null))
    let maxStep = 0
    let maxHeightStep = 0
    let reversals = 0
    let settleT = 0
    let dirPrev = 0
    let seen = 0
    let minOpacity = 1
    for (let i = 0; i < present.length; i++) {
      const s = present[i]
      if (!s) continue
      seen++
      minOpacity = Math.min(minOpacity, s.opacity)
      const prev = present[i - 1]
      if (!prev) continue
      // Movement explained by the frame of reference is not motion: in-flow
      // content moves in the viewport exactly as far as the page scrolled,
      // sticky/fixed content stays put in the viewport while the page scrolls.
      // The smaller of the two deltas is what actually moved.
      const dView = s.top - prev.top
      const dDoc = dView + (s.y - prev.y)
      const dTop = Math.abs(dView) <= Math.abs(dDoc) ? dView : dDoc
      const dh = s.height - prev.height
      maxStep = Math.max(maxStep, Math.abs(dTop))
      maxHeightStep = Math.max(maxHeightStep, Math.abs(dh))
      if (Math.abs(dTop) > 0.5 || Math.abs(dh) > 0.5 || Math.abs(s.opacity - prev.opacity) > 0.01) settleT = s.t
      const dir = Math.abs(dTop) > 0.5 ? Math.sign(dTop) : 0
      if (dir !== 0) {
        if (dirPrev !== 0 && dir !== dirPrev) reversals++
        dirPrev = dir
      }
    }
    tracks[sel] = {
      seenFrames: seen,
      maxStepPx: round(maxStep),
      maxHeightStepPx: round(maxHeightStep),
      reversals,
      settleMs: settleT,
      minOpacity: round(minOpacity, 2),
    }
  }

  return { mainThreadAnimations, jsStyleWrites, clampFrames, scrollReversals, tracks }
}

export function grade(timing, trajectory) {
  const reasons = []
  let level = 0
  const bump = (l, msg) => {
    level = Math.max(level, l)
    reasons.push((l === 2 ? "FAIL " : "warn ") + msg)
  }
  if (timing.p90 > BUDGET.p90Fail) bump(2, `p90 frame ${timing.p90}ms > ${BUDGET.p90Fail}`)
  else if (timing.p90 > BUDGET.p90Warn) bump(1, `p90 frame ${timing.p90}ms > ${BUDGET.p90Warn}`)
  if (timing.longFrames >= BUDGET.longFramesFail) bump(2, `${timing.longFrames} frames took 2+ intervals`)
  else if (timing.longFrames >= BUDGET.longFramesWarn) bump(1, `${timing.longFrames} frame(s) took 2+ intervals`)
  if (timing.dropRate > BUDGET.dropRateFail) bump(2, `${Math.round(timing.dropRate * 100)}% frames dropped`)
  else if (timing.dropRate > BUDGET.dropRateWarn) bump(1, `${Math.round(timing.dropRate * 100)}% frames dropped`)
  if (timing.loafMax > BUDGET.loafFail) bump(2, `long animation frame ${timing.loafMax}ms`)
  if (timing.scrollSnapPx > BUDGET.scrollSnapPx) bump(2, `scroll snapped ${timing.scrollSnapPx}px in one frame`)
  if (trajectory) {
    if (trajectory.clampFrames > 0) bump(1, `${trajectory.clampFrames} scroll-clamp frame(s) (document shrank under the viewport)`)
    const layoutAnims = trajectory.mainThreadAnimations.filter((a) => a.class.startsWith("layout"))
    if (layoutAnims.length) bump(1, `layout-animating: ${layoutAnims.slice(0, 3).map((a) => a.key).join("; ")}`)
    const layoutWrites = trajectory.jsStyleWrites.filter((w) => w.class === "layout" && w.writes > 5)
    if (layoutWrites.length) bump(1, `JS writes layout styles per frame: ${layoutWrites.slice(0, 3).map((w) => w.key).join("; ")}`)
    // A compositor property written from JS every frame is still a main-thread
    // animation: it stalls whenever the main thread does (hydration, a React
    // commit). Motion's independent x/y/scale do this; a transform string does not.
    const jsDriven = trajectory.jsStyleWrites.filter((w) => w.class !== "layout" && w.writes > 10)
    if (jsDriven.length) bump(1, `JS-driven per-frame animation (stalls with the main thread): ${jsDriven.slice(0, 3).map((w) => w.key).join("; ")}`)
    for (const [sel, t] of Object.entries(trajectory.tracks)) {
      if (t.maxStepPx > BUDGET.trackSnapPx) bump(1, `${sel} jumped ${t.maxStepPx}px in one frame`)
      if (t.reversals > 1) bump(1, `${sel} reversed direction ${t.reversals}x`)
    }
  }
  return { verdict: ["ok", "warn", "FAIL"][level], reasons }
}

// ── Formatting ───────────────────────────────────────────────────────────

const pad = (s, n) => String(s).padEnd(n)
const lpad = (s, n) => String(s).padStart(n)

export function formatTable(results) {
  const head = `${pad("scenario", 20)}${pad("viewport", 9)}${lpad("p50", 6)}${lpad("p90", 7)}${lpad("worst", 7)}${lpad("long", 6)}${lpad("drop", 6)}${lpad("LoAF", 6)}${lpad("±p90", 6)}  verdict`
  const lines = [head, "-".repeat(head.length + 4)]
  for (const r of results) {
    if (r.error) {
      lines.push(`${pad(r.scenario, 20)}${pad(r.viewport, 9)}  ERROR ${r.error}`)
      continue
    }
    const t = r.timing
    lines.push(
      `${pad(r.scenario, 20)}${pad(r.viewport, 9)}${lpad(t.p50, 6)}${lpad(t.p90, 7)}${lpad(t.worst, 7)}${lpad(t.longFrames, 6)}${lpad(Math.round(t.dropRate * 100) + "%", 6)}${lpad(t.loafMax, 6)}${lpad(t.spreadP90, 6)}  ${r.grade.verdict}`,
    )
  }
  return lines.join("\n")
}

export function formatDetails(results) {
  const out = []
  for (const r of results) {
    if (r.error || r.grade.verdict === "ok") continue
    out.push(`\n${r.scenario} @ ${r.viewport}`)
    for (const reason of r.grade.reasons) out.push(`  ${reason}`)
    const tr = r.trajectory
    if (tr) {
      for (const a of tr.mainThreadAnimations.slice(0, 6)) out.push(`  anim   [${a.class}] ${a.key} x${a.frames}f`)
      for (const w of tr.jsStyleWrites.slice(0, 6)) out.push(`  write  [${w.class}] ${w.key} x${w.writes}`)
      for (const [sel, t] of Object.entries(tr.tracks)) {
        out.push(`  track  ${sel}: step ${t.maxStepPx}px, height step ${t.maxHeightStepPx}px, reversals ${t.reversals}, settles ${t.settleMs}ms`)
      }
    }
    for (const s of r.timing.loafScripts.slice(0, 3)) out.push(`  loaf   ${s.script} ${s.ms}ms`)
  }
  return out.join("\n")
}

export function formatCompare(baseline, current) {
  const warnings = []
  for (const k of ["cpu", "runs", "chrome", "headed"]) {
    if (JSON.stringify(baseline.meta[k]) !== JSON.stringify(current.meta[k])) {
      warnings.push(`meta.${k} differs (baseline ${JSON.stringify(baseline.meta[k])}, now ${JSON.stringify(current.meta[k])}): not a like-for-like comparison`)
    }
  }
  const index = Object.fromEntries(baseline.results.filter((r) => !r.error).map((r) => [`${r.scenario}@${r.viewport}`, r]))
  const lines = [`Compare against ${baseline.meta.label || baseline.meta.sha} (${baseline.meta.date})`]
  if (warnings.length) lines.push(...warnings.map((w) => `  ! ${w}`))
  const metrics = [
    ["p90", 2],
    ["worst", 8],
    ["longFrames", 1],
    ["loafMax", 20],
  ]
  for (const r of current.results) {
    if (r.error) continue
    const b = index[`${r.scenario}@${r.viewport}`]
    if (!b) {
      lines.push(`  ${pad(r.scenario + "@" + r.viewport, 30)} new`)
      continue
    }
    const parts = metrics.map(([m, noise]) => {
      const d = round(r.timing[m] - b.timing[m])
      const tag = Math.abs(d) <= noise ? "=" : d < 0 ? "better" : "WORSE"
      return `${m} ${b.timing[m]}->${r.timing[m]} ${tag}`
    })
    const verdict = b.grade.verdict === r.grade.verdict ? r.grade.verdict : `${b.grade.verdict}->${r.grade.verdict}`
    lines.push(`  ${pad(r.scenario + "@" + r.viewport, 30)} ${parts.join(" | ")} | ${verdict}`)
  }
  return lines.join("\n")
}
