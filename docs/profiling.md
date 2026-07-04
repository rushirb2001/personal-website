# Page Profiling Cookbook

Commands-first recipes for measuring this site (Next.js 16 App Router, deployed on Vercel at
`https://rushirbhavsar.vercel.app`). Every recipe was used for real; the baselines at the bottom
came from them. The golden rule: **measure before you change, measure after, compare against the
baselines — never diagnose from vibes.**

---

## 0. Triage: read a web-vitals panel before touching anything

The three loading metrics are a pipeline. Attribute the time to the right layer by looking at the
**gaps**, not the absolute numbers:

| Gap                | Owner                                            | If it dominates, investigate…                       |
| ------------------ | ------------------------------------------------ | --------------------------------------------------- |
| `TTFB`             | server + visitor network (DNS, TLS, redirects)   | route staticness, edge cache, redirects, cold starts |
| `FCP − TTFB`       | render pipeline (render-blocking CSS/JS/fonts)   | blocking stylesheets, font loading, JS before paint  |
| `LCP − FCP`        | the LCP asset itself (hero image/video)          | image weight, `priority`/preload, lazy-mount misses  |

Worked example (this repo, 2026-07-04): TTFB 5.01s, FCP 5.34s, LCP 5.35s → gaps are 5.01 / 0.33 /
0.01, so ~94% of LCP was document response time. No image, font, or bundle change could have fixed
it — and live `curl` showed the server answering in ~120ms, which reclassified the whole thing as
a field-data artifact (see §6).

Field-data caveats that regularly mislead:
- **p75 over sparse traffic**: a personal site gets few visits; two slow-network visitors set the p75.
- **Aggregation window vs deploy dates**: check `git log --date=format:"%Y-%m-%d"` against the
  panel's window — a perf fix shipped mid-window means the panel still shows the old era.
- **Field TTFB belongs partly to the visitor**: it includes their DNS, TLS, radio latency, redirect
  chains, and in-app webview proxying (LinkedIn/WhatsApp). `curl` from a good connection is the
  server's honest number; the delta is the visitor's network.
- Interaction metrics (INP/CLS/FID) green while loading metrics are red = runtime is healthy,
  problem is delivery (or history).

## 1. Server response (TTFB)

Timing breakdown, three runs (first run pays DNS+TLS; compare the later ones):

```bash
for i in 1 2 3; do curl -so /dev/null -w "run$i dns:%{time_namelookup}s connect:%{time_connect}s tls:%{time_appconnect}s ttfb:%{time_starttransfer}s total:%{time_total}s size:%{size_download}b http:%{http_code}\n" https://rushirbhavsar.vercel.app/; done
```

Cache + routing headers (want `x-vercel-cache: HIT` on static routes):

```bash
curl -sI https://rushirbhavsar.vercel.app/ | grep -i "x-vercel-cache\|age\|cache-control\|x-matched-path\|server"
```

Redirect chain (every hop adds a round trip to field TTFB; want `redirects:0`):

```bash
curl -sIL -o /dev/null -w "final:%{url_effective} redirects:%{num_redirects}\n" https://rushirbhavsar.vercel.app/
```

Route staticness — the build table is the source of truth:

```bash
pnpm build 2>&1 | tail -25
# ○ Static = prerendered, edge-served (TTFB should be <300ms)
# ● SSG    = prerendered per generateStaticParams path (same expectation)
# ƒ Dynamic = server-rendered per request — cold starts possible; justify or fix
```

Also confirm nothing snuck in that forces dynamic rendering: no `middleware.ts`, no `headers()`/
`cookies()` in server components, no `dynamic = "force-dynamic"`.

## 2. Lab paint metrics (FCP/LCP) — Lighthouse

Mobile, throttled (the honest default):

```bash
npx lighthouse https://rushirbhavsar.vercel.app/ --only-categories=performance --form-factor=mobile --screenEmulation.mobile --quiet --chrome-flags="--headless=new" --output=json --output-path=/tmp/lh.json
python3 -c "
import json; a = json.load(open('/tmp/lh.json'))['audits']
for k in ['server-response-time','first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','render-blocking-resources']:
    print(k, '→', a[k].get('displayValue', a[k].get('score')))
print('LCP element →', (a['largest-contentful-paint-element']['details']['items'][0]['items'][0]['node']['snippet'] if a['largest-contentful-paint-element'].get('details') else 'n/a'))
"
```

Desktop pass: swap in `--preset=desktop`. Run against **production**, not `pnpm dev` — dev mode
compiles on demand and its numbers are meaningless.

## 3. In-page inspection (DevTools console or browser eval)

Navigation + paint timings as the browser saw them:

```js
const [nav] = performance.getEntriesByType("navigation");
({ ttfb: nav.responseStart, fcp: performance.getEntriesByType("paint").find(p => p.name === "first-contentful-paint")?.startTime, domInteractive: nav.domInteractive, load: nav.loadEventEnd });
```

Which element is the LCP, and when it painted:

```js
new PerformanceObserver(l => { const e = l.getEntries().at(-1); console.log(Math.round(e.startTime) + "ms", e.element); }).observe({ type: "largest-contentful-paint", buffered: true });
```

Top resource offenders by transfer size and duration:

```js
performance.getEntriesByType("resource").map(r => ({ name: r.name.split("/").pop().slice(0, 40), kb: Math.round(r.transferSize / 1024), ms: Math.round(r.duration) })).sort((a, b) => b.kb - a.kb).slice(0, 10);
```

## 4. Animation & scroll jank

**Frame-by-frame scroll sampler** — records scroll position and document height every frame;
teleports, clamp-yanks, and mid-flight document reshuffles show up as numeric discontinuities you
can't dismiss as taste:

```js
window.__samples = [];
window.__run = (ms) => { window.__samples = []; const t0 = performance.now();
  const tick = () => { const t = performance.now() - t0;
    window.__samples.push({ t: Math.round(t), y: Math.round(scrollY), dh: document.documentElement.scrollHeight });
    if (t < ms) requestAnimationFrame(tick); };
  requestAnimationFrame(tick); };
// __run(1600); then trigger the animation; afterwards:
// __samples.filter((s,i)=>i%3===0).map(s=>[s.t,s.y,s.dh])
```

How to read it: a jump of hundreds of px between adjacent frames = snap/teleport (scroll anchoring,
clamp); `y` tracking `dh − innerHeight` exactly frame-by-frame = the browser clamping against a
collapsing document; two separate easing curves = two disjoint motions that should be one.

**Transition verification** — Tailwind v4's `translate-*` / `rotate-*` / `scale-*` set standalone
CSS properties, so an arbitrary `transition-[transform,…]` list silently never animates them (this
shipped broken twice — nav slide and section-head press). After adding any transition:

```js
getComputedStyle(document.querySelector(SELECTOR)).transitionProperty // must name the property actually being animated
```

**Frame pacing during an interaction** (scroll a modal, run an animation):

```js
window.__deltas = []; let last = performance.now();
const tick = () => { const now = performance.now(); window.__deltas.push(Math.round(now - last)); last = now; if (window.__deltas.length < 300) requestAnimationFrame(tick); };
requestAnimationFrame(tick);
// afterwards: const d = [...window.__deltas].sort((a,b)=>a-b); ({ median: d[d.length>>1], p90: d[Math.floor(d.length*.9)], worst: d.at(-1), over25ms: d.filter(x=>x>25).length })
```

**Long tasks** (main-thread stalls > 50ms):

```js
new PerformanceObserver(l => l.getEntries().forEach(e => console.log("longtask", Math.round(e.startTime), Math.round(e.duration) + "ms"))).observe({ type: "longtask", buffered: true });
```

**Environment traps** (learned the hard way): `requestAnimationFrame`, `setInterval`, and
main-thread CSS transitions (layout properties like `grid-template-rows`, `min-height`) all starve
in occluded/background tabs and in emulated viewports larger than the real window — a starved test
tab makes correct code look broken. Verify page state (URL, `scrollY`, `data-open` flags) inside
the same eval that acts on it, and distrust any surprising measurement until reproduced on a
clean, focused, correctly-sized tab.

## 5. Payload weight

Document and route JS (from the build):

```bash
curl -so /dev/null -w "doc:%{size_download}b\n" https://rushirbhavsar.vercel.app/   # home ≈ 54KB
pnpm build 2>&1 | grep -A30 "Route (app)"                                          # First Load JS per route
du -sh .next/static/chunks 2>/dev/null
```

Local asset weights (source images are optimized by `next/image` at request time, but audit them
anyway — and remember project media lives in Vercel Blob, not the repo):

```bash
ls -lhS public/images/**/* public/fonts/* 2>/dev/null | head
```

Repo-specific invariants that keep payloads sane: fonts are self-hosted `woff2` with `preload`
(never reintroduce the render-blocking Google Fonts `<link>`); the project-page carousel
lazy-mounts slides — first slide is an inline SVG, heavy blob media (mp4/webp) mounts on visit +
one-slide lookahead. Mount-all previously caused ~10s FCP/LCP on `/projects/[slug]`.

## 6. Field data (Vercel Speed Insights)

Dashboard → project → Speed Insights. Before believing a red number: filter by **route**, set the
**time window** to post-deploy only, check **device/country** splits, and cross-check the deploy
timeline (`git log --format="%h %ad %s" --date=format:"%Y-%m-%d" -10`). Then run §1 against the
same route — if `curl` says ~120ms while the panel says seconds, the gap is history or visitor
networks, not the server (see the worked example in §0).

## 7. Post-deploy spot-check (2 minutes, run every deploy)

```bash
for u in "" "projects/mace-pinn"; do curl -so /dev/null -w "/$u ttfb:%{time_starttransfer}s size:%{size_download}b http:%{http_code}\n" "https://rushirbhavsar.vercel.app/$u"; done
curl -sI https://rushirbhavsar.vercel.app/ | grep -i x-vercel-cache   # want HIT
```

Plus §2 Lighthouse if the change touched layout, media, fonts, or anything render-blocking.

---

## Baselines (update when they legitimately shift)

Measured 2026-07-04, warm edge cache, home US connection:

| Metric                        | `/`            | `/projects/mace-pinn` |
| ----------------------------- | -------------- | --------------------- |
| TTFB (curl, runs 2–3)         | 107–115ms      | 121ms                 |
| Document size                 | 53.6KB         | 39.1KB                |
| `x-vercel-cache`              | HIT            | HIT                   |
| Route type                    | ○ Static       | ● SSG                 |
| Redirects                     | 0              | 0                     |

A regression is a change against **these** numbers measured the same way — not against a field
panel percentile.
