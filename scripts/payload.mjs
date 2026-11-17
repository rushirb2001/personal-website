#!/usr/bin/env node
// First-load JavaScript and document weight per prerendered route.
//
//   pnpm build && pnpm payload
//   pnpm payload --json > before.json      keep a baseline to diff against
//
// Why this exists: Next 16's build table no longer prints a "First Load JS"
// column, so the number that used to catch a client-bundle regression is gone.
// This reads the prerendered HTML in .next/server/app, collects the script
// chunks each page references, and sums their size on disk and gzipped.
//
// The `nomodule` polyfill chunk is reported separately and left out of the
// totals: modern browsers never download it, and counting it inflates every
// route by the same ~38KB.
import { readFile, readdir, stat } from "node:fs/promises"
import path from "node:path"
import { gzipSync } from "node:zlib"

const ROOT = ".next"
const APP = path.join(ROOT, "server", "app")

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(p)))
    else if (entry.name.endsWith(".html")) out.push(p)
  }
  return out
}

const sizeCache = new Map()
async function chunkSize(src) {
  if (!sizeCache.has(src)) {
    const buf = await readFile(path.join(ROOT, decodeURIComponent(src).replace(/^\/_next\//, "")))
    sizeCache.set(src, { raw: buf.length, gzip: gzipSync(buf).length })
  }
  return sizeCache.get(src)
}

const kb = (n) => (n / 1024).toFixed(1).padStart(7)

async function main() {
  try {
    await stat(APP)
  } catch {
    throw new Error("No build found at .next/server/app. Run `pnpm build` first.")
  }
  const rows = []
  for (const file of (await walk(APP)).sort()) {
    const html = await readFile(file, "utf8")
    const route = "/" + path.relative(APP, file).replace(/\.html$/, "").replace(/^index$/, "")
    if (route.startsWith("/_")) continue
    const tags = [...html.matchAll(/<script\b[^>]*\bsrc="(\/_next\/static\/chunks\/[^"]+\.js)"[^>]*>/g)]
    const modern = new Set()
    const legacy = new Set()
    for (const [tag, src] of tags) (/\bnoModule\b/i.test(tag) ? legacy : modern).add(src)
    let raw = 0
    let gzip = 0
    for (const src of modern) {
      const s = await chunkSize(src)
      raw += s.raw
      gzip += s.gzip
    }
    let legacyGzip = 0
    for (const src of legacy) legacyGzip += (await chunkSize(src)).gzip
    rows.push({ route, chunks: modern.size, jsRaw: raw, jsGzip: gzip, legacyGzip, html: html.length, htmlGzip: gzipSync(html).length })
  }

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(rows, null, 2))
    return
  }
  console.log("route".padEnd(46) + "chunks   JS raw  JS gzip   HTML raw HTML gzip  (KB)")
  for (const r of rows) {
    console.log(
      r.route.padEnd(46) + String(r.chunks).padStart(6) + kb(r.jsRaw) + "  " + kb(r.jsGzip) + "   " + kb(r.html) + "  " + kb(r.htmlGzip),
    )
  }
  const legacy = Math.max(...rows.map((r) => r.legacyGzip))
  if (legacy) console.log(`\nnomodule polyfills (not counted, legacy browsers only): ${kb(legacy).trim()} KB gzip`)
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
