#!/usr/bin/env node
// Full-page screenshots at a real emulated viewport.
//
//   pnpm shot /hire /resume                  phone + desktop, against :3000
//   pnpm shot -v phone /projects             one viewport
//   pnpm shot -o http://localhost:3111 /     another origin
//   pnpm shot --out /tmp/shots /             where the PNGs go (default .shots/)
//
// Why this exists: `chrome --headless --window-size=390,...` cannot produce a
// phone layout. Chrome clamps a window to about 500px wide, so the page lays
// out at 500 and the PNG is a 390px crop of it, with the right edge cut off.
// That looks exactly like a horizontal-overflow bug and is not one. This goes
// through the DevTools protocol's device-metrics override instead (the same
// one the motion probe uses), so 390 means 390.
//
// It also reports horizontal overflow per page, which is the thing a phone
// screenshot is usually being taken to check.
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { launchChrome } from "./motion/cdp.mjs"

const VIEWPORTS = {
  phone: { width: 390, height: 844, deviceScaleFactor: 2, mobile: true },
  tablet: { width: 820, height: 1180, deviceScaleFactor: 2, mobile: true },
  desktop: { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false },
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function parseArgs(argv) {
  const opts = { routes: [], viewports: ["phone", "desktop"], origin: "http://localhost:3000", out: ".shots" }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === "-v" || a === "--viewport") opts.viewports = argv[++i].split(",")
    else if (a === "-o" || a === "--origin") opts.origin = argv[++i].replace(/\/$/, "")
    else if (a === "--out") opts.out = argv[++i]
    else opts.routes.push(a)
  }
  if (opts.routes.length === 0) opts.routes.push("/")
  for (const v of opts.viewports) {
    if (!VIEWPORTS[v]) throw new Error(`Unknown viewport "${v}". Use: ${Object.keys(VIEWPORTS).join(", ")}`)
  }
  return opts
}

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  await mkdir(opts.out, { recursive: true })
  const chrome = await launchChrome()
  try {
    for (const route of opts.routes) {
      for (const name of opts.viewports) {
        const viewport = VIEWPORTS[name]
        const { targetId } = await chrome.browser.send("Target.createTarget", { url: "about:blank" })
        const { sessionId } = await chrome.browser.send("Target.attachToTarget", { targetId, flatten: true })
        const s = chrome.browser.session(sessionId)
        await s.send("Page.enable")
        await s.send("Runtime.enable")
        // Screenshots are not visitors: keep them out of the analytics.
        await s.send("Network.enable")
        await s.send("Network.setBlockedURLs", {
          urls: ["*googletagmanager.com*", "*google-analytics.com*", "*/_vercel/insights/*", "*/_vercel/speed-insights/*", "*va.vercel-scripts.com*"],
        })
        await s.send("Emulation.setDeviceMetricsOverride", viewport)
        const loaded = s.once("Page.loadEventFired", 30000)
        await s.send("Page.navigate", { url: opts.origin + route })
        await loaded
        // Let fonts land and entrance animations finish before the capture.
        await s.send("Runtime.evaluate", { expression: "document.fonts.ready.then(() => 1)", awaitPromise: true })
        await sleep(1500)
        const { result } = await s.send("Runtime.evaluate", {
          returnByValue: true,
          expression: `({
            w: document.documentElement.scrollWidth,
            h: document.documentElement.scrollHeight,
            vw: window.innerWidth,
          })`,
        })
        const { w, h, vw } = result.value
        const { data } = await s.send("Page.captureScreenshot", {
          format: "png",
          captureBeyondViewport: true,
          clip: { x: 0, y: 0, width: viewport.width, height: Math.min(h, 12000), scale: 1 },
        })
        const slug = route === "/" ? "home" : route.replace(/^\//, "").replace(/[^a-z0-9]+/gi, "-")
        const file = path.join(opts.out, `${slug}.${name}.png`)
        await writeFile(file, Buffer.from(data, "base64"))
        const overflow = w > vw ? `  OVERFLOWS by ${w - vw}px` : ""
        console.log(`${file}  ${vw}x${h}${overflow}`)
        await chrome.browser.send("Target.closeTarget", { targetId })
      }
    }
  } finally {
    await chrome.close()
  }
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
