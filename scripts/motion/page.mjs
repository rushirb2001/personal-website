// Page driver: navigation, real input events, and state assertions.
//
// Every interaction goes through CDP Input events at the element's on-screen
// centre, not element.click(): hit-testing, :active, pointer capture and
// sticky overlays all behave the way a visitor's click does. And every helper
// that acts on state verifies it first, so a scenario fails loudly instead of
// silently measuring a page that never did the thing (the classic wasted
// retry: "the fix did nothing" when the click never landed).

import { PROBE_SOURCE } from "./page-probe.mjs"

export const VIEWPORTS = {
  phone: { width: 375, height: 812, deviceScaleFactor: 3, mobile: true },
  tablet: { width: 768, height: 1024, deviceScaleFactor: 2, mobile: false },
  desktop: { width: 1280, height: 800, deviceScaleFactor: 2, mobile: false },
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export async function openPage(browser, { baseUrl, viewport, cpu }) {
  const { targetId } = await browser.send("Target.createTarget", { url: "about:blank" })
  const { sessionId } = await browser.send("Target.attachToTarget", { targetId, flatten: true })
  const s = browser.session(sessionId)

  await s.send("Page.enable")
  await s.send("Runtime.enable")
  // Probe runs are not visitors. Without this every run reports fake pageviews
  // to the real GA4 property and Vercel Analytics, and gtag's ~90ms script
  // evaluation lands in the load scenarios' long-frame numbers besides.
  await s.send("Network.enable")
  await s.send("Network.setBlockedURLs", {
    urls: ["*googletagmanager.com*", "*google-analytics.com*", "*/_vercel/insights/*", "*/_vercel/speed-insights/*", "*va.vercel-scripts.com*"],
  })
  await s.send("Emulation.setDeviceMetricsOverride", viewport)
  if (viewport.mobile) await s.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 })
  await s.send("Emulation.setCPUThrottlingRate", { rate: cpu })
  await s.send("Page.addScriptToEvaluateOnNewDocument", { source: PROBE_SOURCE })

  const page = {
    session: s,
    viewport,

    // Runs a function authored in this repo's scenario files inside the probed
    // page via CDP Runtime.evaluate. Never fed external input.
    async evaluate(fn, ...args) {
      const expression = `(${fn.toString()})(...${JSON.stringify(args)})`
      const res = await s.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })
      if (res.exceptionDetails) {
        const d = res.exceptionDetails
        throw new Error(`In-page error: ${d.exception?.description || d.text}`)
      }
      return res.result.value
    },

    /** Navigate and wait for load, fonts, and the entrance animations to finish. */
    async goto(route, { settleMs = 1200 } = {}) {
      const loaded = s.once("Page.loadEventFired", 45000)
      await s.send("Page.navigate", { url: new URL(route, baseUrl).href })
      await loaded
      await page.evaluate(() => document.fonts.ready.then(() => true))
      if (settleMs) await sleep(settleMs)
    },

    async waitFor(fn, { timeout = 5000, label = fn.toString() } = {}, ...args) {
      const t0 = Date.now()
      while (Date.now() - t0 < timeout) {
        if (await page.evaluate(fn, ...args)) return
        await sleep(50)
      }
      throw new Error(`waitFor timed out after ${timeout}ms: ${label}`)
    },

    /** Resolve when scrollY (window, or a scroll container) has been still for ~250ms. */
    async settleScroll({ container = null, timeout = 4000 } = {}) {
      const read = () =>
        page.evaluate((sel) => {
          const el = sel ? document.querySelector(sel) : null
          return el ? el.scrollTop : window.scrollY
        }, container)
      let last = await read()
      let still = 0
      const t0 = Date.now()
      while (Date.now() - t0 < timeout) {
        await sleep(50)
        const y = await read()
        still = y === last ? still + 1 : 0
        last = y
        if (still >= 5) return y
      }
      return last
    },

    /** Centre of the first visible match, verified to be hit-testable there. */
    async locate(selector) {
      const hit = await page.evaluate((sel) => {
        const els = [...document.querySelectorAll(sel)]
        for (const el of els) {
          const r = el.getBoundingClientRect()
          if (r.width === 0 || r.height === 0) continue
          const cs = getComputedStyle(el)
          if (cs.visibility === "hidden" || cs.display === "none") continue
          const x = Math.min(Math.max(r.left + r.width / 2, 1), innerWidth - 2)
          const y = Math.min(Math.max(r.top + r.height / 2, 1), innerHeight - 2)
          if (r.bottom < 0 || r.top > innerHeight) return { error: "offscreen", top: Math.round(r.top) }
          const at = document.elementFromPoint(x, y)
          if (!at || !(el === at || el.contains(at))) {
            return { error: "covered", by: at ? at.outerHTML.slice(0, 120) : null }
          }
          return { x, y }
        }
        return { error: els.length ? "no visible match" : "no match" }
      }, selector)
      if (hit.error) throw new Error(`locate(${selector}): ${hit.error}${hit.by ? ` by ${hit.by}` : ""}${hit.top !== undefined ? ` (top ${hit.top})` : ""}`)
      return hit
    },

    async click(selector) {
      const { x, y } = await page.locate(selector)
      await s.send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y })
      await s.send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 })
      await s.send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 })
    },

    async key(key) {
      const codes = { Escape: 27, ArrowLeft: 37, ArrowRight: 39, Enter: 13 }
      const base = { key, code: key, windowsVirtualKeyCode: codes[key] }
      await s.send("Input.dispatchKeyEvent", { type: "keyDown", ...base })
      await s.send("Input.dispatchKeyEvent", { type: "keyUp", ...base })
    },

    /** Realistic wheel/touch scroll. Positive distance scrolls DOWN. Resolves when the gesture ends. */
    async scrollGesture({ distance, speed = 1200, x, y } = {}) {
      await s.send("Input.synthesizeScrollGesture", {
        x: x ?? Math.round(viewport.width / 2),
        y: y ?? Math.round(viewport.height / 2),
        yDistance: -distance,
        speed,
        gestureSourceType: viewport.mobile ? "touch" : "mouse",
        repeatCount: 1,
      })
    },

    /** Instant (never smooth) setup scroll of an element into the viewport centre. */
    async reveal(selector) {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel)
        if (!el) throw new Error(`reveal: no match for ${sel}`)
        el.scrollIntoView({ block: "center", behavior: "instant" })
        return true
      }, selector)
      await sleep(400)
    },

    startRecording: (opts) => page.evaluate((o) => window.__motion.start(o), opts),
    stopRecording: () => page.evaluate(() => window.__motion.stop()),

    async startScreencast() {
      const frames = []
      const off = s.on("Page.screencastFrame", async (p) => {
        frames.push({ data: p.data, ts: p.metadata.timestamp })
        await s.send("Page.screencastFrameAck", { sessionId: p.sessionId }).catch(() => {})
      })
      await s.send("Page.startScreencast", { format: "jpeg", quality: 55, everyNthFrame: 1 })
      return async () => {
        await s.send("Page.stopScreencast")
        off()
        return frames
      }
    },

    close: () => browser.send("Target.closeTarget", { targetId }),
  }

  return page
}
