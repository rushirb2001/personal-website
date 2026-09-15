// Minimal Chrome DevTools Protocol client. Zero dependencies: Node 22 ships a
// global WebSocket, and the system Chrome is the browser. Puppeteer/Playwright
// would pin a second Chromium build and a large install for what is, here,
// forty lines of JSON-RPC.

import { spawn } from "node:child_process"
import { existsSync } from "node:fs"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
]

export async function launchChrome({ headed = false } = {}) {
  const exe = CHROME_CANDIDATES.find((p) => p && existsSync(p))
  if (!exe) throw new Error("Chrome not found. Set CHROME_PATH to a Chrome/Chromium binary.")

  const userDataDir = await mkdtemp(path.join(tmpdir(), "motion-probe-"))
  const args = [
    `--user-data-dir=${userDataDir}`,
    "--remote-debugging-port=0",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    // A backgrounded or occluded renderer throttles rAF and main-thread
    // transitions, which makes correct code measure as broken (see
    // docs/profiling.md §4 environment traps). Keep every target foreground.
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
    // The window must be larger than every emulated viewport: an emulated
    // viewport bigger than the real window starves rAF.
    "--window-size=1920,1440",
    ...(headed ? [] : ["--headless=new"]),
    "about:blank",
  ]

  const proc = spawn(exe, args, { stdio: ["ignore", "ignore", "pipe"] })
  const wsUrl = await new Promise((resolve, reject) => {
    let buf = ""
    const timer = setTimeout(() => reject(new Error("Chrome did not expose a DevTools endpoint within 15s")), 15000)
    proc.stderr.on("data", (d) => {
      buf += d
      const m = buf.match(/DevTools listening on (ws:\/\/\S+)/)
      if (m) {
        clearTimeout(timer)
        resolve(m[1])
      }
    })
    proc.on("exit", (code) => {
      clearTimeout(timer)
      reject(new Error(`Chrome exited early with code ${code}`))
    })
  })

  const browser = await connect(wsUrl)
  const { product } = await browser.send("Browser.getVersion")
  return {
    browser,
    version: product,
    close: async () => {
      try {
        await browser.send("Browser.close")
      } catch {
        /* already gone */
      }
      browser.close()
      proc.kill()
      await rm(userDataDir, { recursive: true, force: true }).catch(() => {})
    },
  }
}

export async function connect(wsUrl) {
  const ws = new WebSocket(wsUrl)
  await new Promise((resolve, reject) => {
    ws.onopen = resolve
    ws.onerror = () => reject(new Error(`Could not connect to ${wsUrl}`))
  })

  let nextId = 0
  const pending = new Map()
  const listeners = new Set()

  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data)
    if (msg.id !== undefined) {
      const p = pending.get(msg.id)
      if (!p) return
      pending.delete(msg.id)
      if (msg.error) p.reject(new Error(`${p.method}: ${msg.error.message}`))
      else p.resolve(msg.result)
      return
    }
    for (const fn of listeners) fn(msg)
  }

  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const id = ++nextId
      pending.set(id, { resolve, reject, method })
      ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }))
    })

  const session = (sessionId) => {
    const on = (method, fn) => {
      const l = (msg) => {
        if (msg.sessionId === sessionId && msg.method === method) fn(msg.params)
      }
      listeners.add(l)
      return () => listeners.delete(l)
    }
    const once = (method, timeout = 30000) =>
      new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          off()
          reject(new Error(`Timed out after ${timeout}ms waiting for ${method}`))
        }, timeout)
        const off = on(method, (params) => {
          clearTimeout(timer)
          off()
          resolve(params)
        })
      })
    return { send: (method, params) => send(method, params, sessionId), on, once }
  }

  return { send, session, close: () => ws.close() }
}
