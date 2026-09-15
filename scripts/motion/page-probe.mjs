// In-page recorder, injected before any site script runs. Everything inside
// install() executes in the browser, so it must stay self-contained.
//
// Two recording modes, because measuring perturbs what is measured:
//   timing     rAF deltas + scrollY only. Nothing that forces layout, so the
//              frame numbers describe the page, not the probe.
//   trajectory adds per-frame geometry of tracked elements, document height,
//              the live animation inventory, and JS-driven style writes. These
//              reads force layout, so trajectory runs explain jank but never
//              grade it.

function install() {
  if (window.__motion) return
  const M = (window.__motion = { loaf: [], shifts: [], rec: null })

  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        M.loaf.push({
          t: e.startTime,
          duration: e.duration,
          blocking: e.blockingDuration,
          styleLayout: e.styleAndLayoutStart ? e.startTime + e.duration - e.styleAndLayoutStart : 0,
          scripts: (e.scripts || []).slice(0, 4).map((s) => ({
            src: (s.sourceURL || "").split("/").pop().split("?")[0],
            fn: s.sourceFunctionName || "",
            invoker: s.invoker || "",
            duration: Math.round(s.duration),
          })),
        })
      }
    }).observe({ type: "long-animation-frame", buffered: true })
  } catch {
    /* LoAF unsupported: frame deltas still work */
  }

  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        M.shifts.push({ t: e.startTime, value: e.value, input: e.hadRecentInput })
      }
    }).observe({ type: "layout-shift", buffered: true })
  } catch {
    /* unsupported */
  }

  const describe = (el) => {
    if (!el || el.nodeType !== 1) return "?"
    let s = el.tagName.toLowerCase()
    if (el.id) s += "#" + el.id
    const cls = typeof el.className === "string" ? el.className.trim().split(/\s+/).filter(Boolean) : []
    // Tailwind utilities say nothing about identity; prefer semantic classes.
    const named = cls.filter((c) => !/[:[\]()/]/.test(c) && !/^(flex|grid|block|hidden|relative|absolute|w-|h-|p[xytblr]?-|m[xytblr]?-|text-|bg-|border|rounded|gap-|items-|justify-|min-|max-|z-|top-|left-|right-|bottom-|inset|overflow|shrink|leading-|tracking-|font-|transition|duration-|ease-|sticky|fixed|mx-|my-|mt-|mb-|pt-|pb-|space-)/.test(c))
    if (named.length) s += "." + named.slice(0, 2).join(".")
    return s
  }

  const parseStyle = (text) => {
    const out = {}
    for (const decl of (text || "").split(";")) {
      const i = decl.indexOf(":")
      if (i > 0) out[decl.slice(0, i).trim()] = decl.slice(i + 1).trim()
    }
    return out
  }

  M.start = (opts = {}) => {
    const mode = opts.mode || "timing"
    const track = opts.track || []
    const rec = (M.rec = {
      mode,
      t0: performance.now(),
      frames: [],
      running: true,
      animations: {},
      styleWrites: {},
      tracks: Object.fromEntries(track.map((sel) => [sel, []])),
    })

    let observer = null
    if (mode === "trajectory") {
      observer = new MutationObserver((muts) => {
        for (const m of muts) {
          const before = parseStyle(m.oldValue)
          const after = parseStyle(m.target.getAttribute("style"))
          for (const prop of new Set([...Object.keys(before), ...Object.keys(after)])) {
            if (before[prop] === after[prop]) continue
            const key = prop + " @ " + describe(m.target)
            rec.styleWrites[key] = (rec.styleWrites[key] || 0) + 1
          }
        }
      })
      // Observe the Document node, not documentElement: load scenarios start
      // recording at document-start, before <html> exists, and observing null
      // throws before the first frame is ever scheduled.
      observer.observe(document, {
        attributes: true,
        attributeFilter: ["style"],
        attributeOldValue: true,
        subtree: true,
      })
      rec.stopObserver = () => observer.disconnect()
    }

    // scrollY is read in a task queued from rAF, which runs after the frame has
    // rendered. Reading it inside rAF forces a style+layout pass on a dirty
    // frame, moving the page's layout cost into the probe's callback (and into
    // its long-animation-frame attribution).
    const channel = new MessageChannel()
    channel.port1.onmessage = (ev) => {
      const f = rec.frames[ev.data]
      if (f) f.y = Math.round(window.scrollY)
    }

    let last = performance.now()
    const tick = (now) => {
      if (!rec.running) return
      const frame = { t: Math.round(now - rec.t0), dt: +(now - last).toFixed(2), y: null }
      last = now
      if (mode === "timing") channel.port2.postMessage(rec.frames.length)
      else frame.y = Math.round(window.scrollY)
      if (mode === "trajectory") {
        frame.dh = document.documentElement ? document.documentElement.scrollHeight : 0
        frame.vh = window.innerHeight
        for (const sel of track) {
          const el = document.querySelector(sel)
          if (!el) {
            rec.tracks[sel].push(null)
            continue
          }
          const r = el.getBoundingClientRect()
          const cs = getComputedStyle(el)
          rec.tracks[sel].push({
            t: frame.t,
            top: +r.top.toFixed(1),
            left: +r.left.toFixed(1),
            width: +r.width.toFixed(1),
            height: +r.height.toFixed(1),
            opacity: +(+cs.opacity).toFixed(3),
          })
        }
        for (const a of document.getAnimations()) {
          if (a.playState !== "running") continue
          let props = []
          if (typeof CSSTransition !== "undefined" && a instanceof CSSTransition) props = [a.transitionProperty]
          else {
            try {
              const kf = a.effect && a.effect.getKeyframes ? a.effect.getKeyframes() : []
              props = [...new Set(kf.flatMap((k) => Object.keys(k)))].filter(
                (p) => !["offset", "easing", "composite", "computedOffset"].includes(p),
              )
            } catch {
              props = ["?"]
            }
          }
          const kind =
            typeof CSSTransition !== "undefined" && a instanceof CSSTransition
              ? "css-transition"
              : typeof CSSAnimation !== "undefined" && a instanceof CSSAnimation
                ? "css-animation:" + a.animationName
                : "waapi"
          const target = describe(a.effect && a.effect.target)
          for (const p of props) {
            const key = p + " @ " + target + " (" + kind + ")"
            rec.animations[key] = (rec.animations[key] || 0) + 1
          }
        }
      }
      rec.frames.push(frame)
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
    return true
  }

  M.stop = () => {
    const rec = M.rec
    if (!rec) return null
    rec.running = false
    if (rec.stopObserver) rec.stopObserver()
    const tEnd = performance.now()
    return {
      mode: rec.mode,
      durationMs: Math.round(tEnd - rec.t0),
      frames: rec.frames,
      loaf: M.loaf.filter((e) => e.t >= rec.t0 && e.t <= tEnd),
      shifts: M.shifts.filter((e) => e.t >= rec.t0 && e.t <= tEnd),
      animations: rec.animations,
      styleWrites: rec.styleWrites,
      tracks: rec.tracks,
    }
  }
}

// The sourceURL names the probe in long-animation-frame attribution, so its own
// rAF callback is never mistaken for the page's (it would otherwise read "inline").
export const PROBE_SOURCE = `(${install.toString()})();\n//# sourceURL=motion-probe.js`
