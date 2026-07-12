# Page Profiling Cookbook

Commands-first recipes for measuring this site (Next.js 16 App Router, deployed on Vercel at
`https://rushirbhavsar.vercel.app`) — written as a teaching cookbook: every recipe explains **what
the number actually measures, the browser/network mechanism that produces it, and why you'd care**,
so the commands transfer to any site, not just this one. Every recipe was used for real; the
baselines at the bottom came from them.

The golden rule: **measure before you change, measure after, compare against the baselines — never
diagnose from vibes.**

## The mental model: the life of a page load

Everything in this document hangs off one pipeline. When a visitor navigates:

```
click ─► redirects ─► DNS ─► TCP ─► TLS ─► request ─► server thinks ─► first byte   (= TTFB)
      ─► HTML streams in ─► parser finds CSS/fonts/JS ─► render-blocking fetches
      ─► style + layout ─► first pixels painted                                      (= FCP)
      ─► largest element (hero image / big heading) finishes painting                (= LCP)
      ─► user interacts ─► main thread must be free to respond                       (= INP)
      ─► late-loading things must not shove content around                           (= CLS)
```

Two consequences drive all the recipes below:

1. **Each metric contains all the ones before it.** LCP includes FCP includes TTFB. So absolute
   numbers mislead — a "slow LCP" with a slow TTFB is a *server* problem wearing an LCP costume.
   You always diagnose the **gaps** (§0).
2. **Different layers have different owners.** TTFB belongs to the server + the visitor's network;
   FCP−TTFB belongs to the render-blocking critical path; LCP−FCP belongs to one specific asset;
   INP/CLS belong to your JavaScript and layout stability. Fixing the wrong layer does nothing —
   no image optimization on earth fixes a 5s TTFB.

---

## 0. Triage: read a web-vitals panel before touching anything

**Why this is step zero:** a vitals panel (Vercel Speed Insights, CrUX, Lighthouse) hands you 5–6
numbers. The untrained move is to react to whichever is reddest. The trained move is to subtract
adjacent pipeline stages and let the *gaps* name the guilty layer:

| Gap                | Owner                                            | If it dominates, investigate…                       |
| ------------------ | ------------------------------------------------ | --------------------------------------------------- |
| `TTFB`             | server + visitor network (DNS, TLS, redirects)   | route staticness, edge cache, redirects, cold starts |
| `FCP − TTFB`       | render pipeline (render-blocking CSS/JS/fonts)   | blocking stylesheets, font loading, JS before paint  |
| `LCP − FCP`        | the LCP asset itself (hero image/video)          | image weight, `priority`/preload, lazy-mount misses  |

Worked example (this repo, 2026-07-04): TTFB 5.01s, FCP 5.34s, LCP 5.35s → gaps are 5.01 / 0.33 /
0.01. ~94% of LCP was document response time; render and assets were already fast. No image, font,
or bundle change could have helped — and a live `curl` (§1) showed the server answering in ~120ms,
which reclassified the whole thing as a field-data artifact (§6). Fifteen seconds of subtraction
prevented an afternoon of optimizing the wrong thing.

**Why field data lies to you (and how):**

- **Percentiles over sparse traffic.** Panels report p75: the value 75% of visits beat. That
  convention exists so you optimize for slow-ish real users, not your dev machine. But a portfolio
  gets a handful of visits — two people opening the site from a train set your p75.
- **Aggregation windows contain history.** The panel averages a trailing window (7–28 days). Check
  `git log --format="%h %ad %s" --date=format:"%Y-%m-%d" -10` against the window: a perf fix
  shipped mid-window means the panel is still mostly showing the era you already fixed.
- **Field TTFB belongs partly to the visitor.** The web-vitals definition of TTFB starts at
  navigation start, so it swallows their DNS, TLS handshake, radio wake-up latency, redirect
  chains, and in-app-webview proxying (LinkedIn/WhatsApp browsers are notorious). `curl` from a
  good connection isolates the server's share; the difference is the visitor's network.
- **Green interaction metrics are a clue.** If INP/CLS/FID are green while loading metrics are
  red, the *runtime* is healthy and the problem is delivery (or history). A genuinely broken page
  is usually bad at both.

## 1. Server response (TTFB)

**What you're measuring:** everything that happens before the first byte of HTML arrives. curl's
`-w` variables map one-to-one onto the connection phases, which is exactly why we use it — each
number isolates one suspect:

- `time_namelookup` — DNS resolution
- `time_connect` — TCP handshake (≈ one round trip to the server)
- `time_appconnect` — TLS handshake (1–2 more round trips)
- `time_starttransfer` — TTFB proper: all of the above + request + **server think time**
- `time_starttransfer − time_appconnect` ≈ the server's own contribution

Run it three times because the first run pays DNS + TCP + TLS cold; runs 2–3 reuse the connection
and show you steady-state server time:

```bash
for i in 1 2 3; do curl -so /dev/null -w "run$i dns:%{time_namelookup}s connect:%{time_connect}s tls:%{time_appconnect}s ttfb:%{time_starttransfer}s total:%{time_total}s size:%{size_download}b http:%{http_code}\n" https://rushirbhavsar.vercel.app/; done
```

**Why cache headers matter:** a static page served from the CDN edge near the visitor costs
~10–100ms; a page that has to be rendered by a serverless function costs a function invocation —
plus a *cold start* (hundreds of ms to seconds) if no warm instance exists. Low-traffic sites are
disproportionately hurt by cold starts because almost every visit is "first in a while."

```bash
curl -sI https://rushirbhavsar.vercel.app/ | grep -i "x-vercel-cache\|age\|cache-control\|x-matched-path\|server"
# x-vercel-cache: HIT  = served from edge cache (want this on static routes)
# MISS/STALE           = origin work happened — fine occasionally, suspicious as a pattern
```

**Why redirects are expensive:** each hop is a full sequential round trip (DNS+TLS again if the
host changes) *before* the real request even starts, and field TTFB counts all of it. Classic
offenders: `http→https`, `apex→www`, trailing-slash normalization — invisible on your machine,
seconds on a phone.

```bash
curl -sIL -o /dev/null -w "final:%{url_effective} redirects:%{num_redirects}\n" https://rushirbhavsar.vercel.app/
```

**Why route staticness is the root cause behind most TTFB stories:** the build table tells you
what the server has to *do* per request. Prerendered HTML (static/SSG) is a file copy; dynamic
rendering is code execution:

```bash
pnpm build 2>&1 | tail -25
# ○ Static = prerendered at build, edge-served      → TTFB should be <300ms
# ● SSG    = prerendered per generateStaticParams   → same expectation
# ƒ Dynamic = rendered per request                  → cold starts possible; justify or fix
```

Things that silently flip a route to dynamic: `middleware.ts` (runs before *every* response),
`headers()`/`cookies()` in server components, `export const dynamic = "force-dynamic"`.

## 2. Lab paint metrics (FCP/LCP) — Lighthouse

**What FCP measures and why it can be slow even when TTFB is fast:** the browser cannot paint
anything until it has built the CSSOM — so every stylesheet (and synchronous head script) is
*render-blocking* by definition. External font stylesheets are double trouble: a blocking CSS
fetch, then font files, then (without `font-display: swap`) invisible text. That's why this repo
self-hosts fonts with `preload` — it once shipped a render-blocking Google Fonts `<link>`.

**What LCP measures and why it's the headline metric:** the render time of the largest
image/text block in the viewport — a proxy for "the visitor can see the main content." It's
gated by three things in sequence: when the browser *discovers* the asset (late discovery =
JS-inserted images, missing `priority`/preload), how long the bytes take, and when it can paint.

**Why mobile + throttling is the honest default:** most real traffic is phones on variable
networks, and Lighthouse's throttling (slow 4G, 4× CPU) approximates the p75 device — your dev
machine on fiber approximates nobody.

```bash
npx lighthouse https://rushirbhavsar.vercel.app/ --only-categories=performance --form-factor=mobile --screenEmulation.mobile --quiet --chrome-flags="--headless=new" --output=json --output-path=/tmp/lh.json
python3 -c "
import json; a = json.load(open('/tmp/lh.json'))['audits']
for k in ['server-response-time','first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','render-blocking-resources']:
    print(k, '→', a[k].get('displayValue', a[k].get('score')))
print('LCP element →', (a['largest-contentful-paint-element']['details']['items'][0]['items'][0]['node']['snippet'] if a['largest-contentful-paint-element'].get('details') else 'n/a'))
"
```

Desktop pass: swap in `--preset=desktop`. Always measure **production** (or `pnpm build && pnpm
start`), never `pnpm dev` — dev compiles routes on demand and injects HMR machinery, so its
timings are fiction.

**Always identify the LCP element** (the script above prints it). If the LCP element isn't what
you think it is — a background texture instead of the hero, a cookie banner, a font-swapped
headline — you'll optimize the wrong asset. On this site it should be the hero heading (desktop)
or hero photo (mobile).

## 3. In-page inspection (DevTools console or browser eval)

**Why:** Lighthouse is a simulation; the Performance API is the browser's *own accounting* of the
page you actually loaded, with zero setup. Use it to confirm lab findings in a real session and to
catch things simulations miss (session-specific cache states, extensions, real geography).

Navigation + paint timings as the browser saw them:

```js
const [nav] = performance.getEntriesByType("navigation");
({ ttfb: nav.responseStart, fcp: performance.getEntriesByType("paint").find(p => p.name === "first-contentful-paint")?.startTime, domInteractive: nav.domInteractive, load: nav.loadEventEnd });
```

Which element is the LCP, and when it painted (`buffered: true` replays entries recorded before
you attached — you can run this after load):

```js
new PerformanceObserver(l => { const e = l.getEntries().at(-1); console.log(Math.round(e.startTime) + "ms", e.element); }).observe({ type: "largest-contentful-paint", buffered: true });
```

Top resource offenders. Read the two columns against each other: high `kb` + high `ms` = big
download (shrink it); low `kb` + high `ms` = latency or server delay (move/cache it); and check
*when* it loaded — a huge file fetched lazily after paint costs nothing on FCP/LCP:

```js
performance.getEntriesByType("resource").map(r => ({ name: r.name.split("/").pop().slice(0, 40), kb: Math.round(r.transferSize / 1024), ms: Math.round(r.duration) })).sort((a, b) => b.kb - a.kb).slice(0, 10);
```

## 4. Animation & scroll jank

**The frame budget, and why some CSS is 100× cheaper:** a 60Hz screen gives you 16.7ms per frame.
`transform`, `translate`, `scale`, `rotate`, and `opacity` animate on the **compositor thread** —
the GPU slides already-painted layers around, so they stay smooth even when the main thread is
busy. Layout properties (`height`, `min-height`, `grid-template-rows`, `top`, `width`) force the
**main thread** to re-layout and re-paint every frame — affordable for one deliberate choreography
(this site's accordion), fatal when stacked or run during scroll. This is also why a starved main
thread freezes layout animations but not compositor ones — a fact that matters for the traps below.

**Why we sample instead of eyeballing:** human judgment of motion is unreliable and unfalsifiable
("feels janky?"). Recording scroll position and document height every frame turns motion into
numbers you can diff, keep as evidence, and re-run after the fix:

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

Reading the trajectory — each signature has a distinct mechanism:

- **Hundreds of px between adjacent frames** = a snap/teleport. Usual suspect: browser *scroll
  anchoring* compensating for a layout mutation (the browser tries to keep visible content pinned
  when the document reshuffles — helpful on news sites, hostile to choreographed scrolling; this
  site disables it with `overflow-anchor: none`).
- **`y` equal to `dh − innerHeight` frame after frame** = the browser *clamping* scroll position
  against a shrinking document — you're watching content collapse out from under the viewport.
- **Two separate easing curves** = two motions that should have been one (e.g. a clamp rush
  followed by a polite glide).

**Why transitions must be verified, not reviewed:** CSS fails silently. A transition whose
property list doesn't match the property being animated simply snaps — no warning anywhere.
Tailwind v4 made this a live trap: `translate-*` / `rotate-*` / `scale-*` utilities set the
standalone CSS properties `translate`/`rotate`/`scale`, **not** `transform`, so an arbitrary list
like `transition-[transform,box-shadow]` looks right and animates nothing (this shipped broken
twice here — the nav slide and the section-head press). Thirty seconds of verification beats a
shipped regression:

```js
getComputedStyle(document.querySelector(SELECTOR)).transitionProperty // must name the property actually being animated
```

**Frame pacing** — deltas between rAF callbacks tell you whether work during an interaction blows
the 16.7ms budget; the p90/worst matter more than the median, because jank is felt at the tail:

```js
window.__deltas = []; let last = performance.now();
const tick = () => { const now = performance.now(); window.__deltas.push(Math.round(now - last)); last = now; if (window.__deltas.length < 300) requestAnimationFrame(tick); };
requestAnimationFrame(tick);
// afterwards: const d = [...window.__deltas].sort((a,b)=>a-b); ({ median: d[d.length>>1], p90: d[Math.floor(d.length*.9)], worst: d.at(-1), over25ms: d.filter(x=>x>25).length })
```

**Long tasks** — any main-thread task over 50ms blocks input for its duration; these are what turn
into bad INP in field data:

```js
new PerformanceObserver(l => l.getEntries().forEach(e => console.log("longtask", Math.round(e.startTime), Math.round(e.duration) + "ms"))).observe({ type: "longtask", buffered: true });
```

**Environment traps** (learned the hard way): browsers throttle `requestAnimationFrame`, timers,
and main-thread CSS transitions in occluded/background tabs and in emulated viewports larger than
the real window — compositor animations keep running, main-thread ones freeze, so a starved test
tab makes *correct* code look broken (a timer can fire before a 350ms layout transition has even
started). Verify page state (URL, `scrollY`, `data-open` flags) inside the same eval that acts on
it, and distrust any surprising measurement until it reproduces on a clean, focused,
correctly-sized tab.

## 5. Payload weight

**Why bytes aren't all equal:** 100KB of image decodes off-thread and costs bandwidth; 100KB of
JavaScript must be downloaded, parsed, compiled, *and executed* on the main thread — on a mid-range
phone that's often 5–10× the cost. That's why "First Load JS" gets its own column in the build
table and why the worst payload regressions are JS regressions:

```bash
curl -so /dev/null -w "doc:%{size_download}b\n" https://rushirbhavsar.vercel.app/   # home ≈ 54KB
pnpm build 2>&1 | grep -A30 "Route (app)"                                          # First Load JS per route
du -sh .next/static/chunks 2>/dev/null
```

Local asset weights — source images can be huge in the repo because `next/image` resizes,
re-encodes (AVIF/WebP), and caches per-device variants at request time; what matters is the
*served* variant, which the `sizes` attribute controls. Audit sources anyway (and remember project
media lives in Vercel Blob, not the repo):

```bash
ls -lhS public/images/**/* public/fonts/* 2>/dev/null | head
```

Repo-specific invariants that keep payloads sane, and the reasons they exist:

- **Fonts are self-hosted `woff2`, subsetted, `preload`ed, `font-display: swap`** — kills the
  render-blocking third-party CSS fetch, and swap means text paints immediately in a fallback
  instead of staying invisible while fonts load.
- **The project-page carousel lazy-mounts slides** — first slide is an inline SVG (zero network
  cost at paint); heavy blob media (mp4/webp) mounts on visit plus a one-slide lookahead. The
  mount-everything version of this page cost ~10s FCP/LCP. The lookahead exists so crossfades land
  on loaded pixels instead of a blank pane — perf fixes shouldn't create UX regressions.

## 6. Field data (Vercel Speed Insights)

**Why field data exists at all:** lab tools measure *your* conditions; field data measures reality
— real devices, real networks, real geography. It's the only data that reflects what visitors
experience. The price is noise, which is why interpretation discipline matters more here than
anywhere else.

Dashboard → project → Speed Insights. Before believing a red number: filter by **route**, set the
**time window** to post-deploy only, check **device/country** splits, and cross-check the deploy
timeline (`git log --format="%h %ad %s" --date=format:"%Y-%m-%d" -10`). Then run §1 against the
same route — if `curl` says ~120ms while the panel says seconds, the gap is history or visitor
networks, not the server (see the worked example in §0).

## 7. Post-deploy spot-check (2 minutes, run every deploy)

**Why every deploy:** regressions are cheapest to catch immediately — the diff is one deploy wide
and the culprit is obvious. Wait a month and the field panel blends the regression into an average
you'll spend an afternoon un-blending (§0/§6).

```bash
for u in "" "projects/mace-pinn"; do curl -so /dev/null -w "/$u ttfb:%{time_starttransfer}s size:%{size_download}b http:%{http_code}\n" "https://rushirbhavsar.vercel.app/$u"; done
curl -sI https://rushirbhavsar.vercel.app/ | grep -i x-vercel-cache   # want HIT
```

Plus §2 Lighthouse if the change touched layout, media, fonts, or anything render-blocking.

---

## Baselines (update when they legitimately shift)

**Why keep baselines in the repo:** a measurement without a reference point is trivia. "TTFB is
180ms" means nothing until you know it was 110ms last month, measured the same way. Stale baselines
make the next regression invisible, so updating this table is part of shipping a perf-relevant
change.

Measured 2026-07-04 (post Notion-mobile-hero deploy), warm edge cache, home US connection;
`/playbook` column added 2026-07-12 (first production deploy of the route):

| Metric                        | `/`            | `/projects/mace-pinn` | `/playbook`    |
| ----------------------------- | -------------- | --------------------- | -------------- |
| TTFB (curl, runs 2–3)         | 107–216ms      | 121ms                 | 125–129ms      |
| Document size (raw / brotli)  | 55.8KB / 12.3KB | 39.1KB               | 99.5KB / 15.4KB |
| `x-vercel-cache`              | HIT            | HIT                   | HIT            |
| Route type                    | ○ Static       | ● SSG                 | ○ Static       |
| Redirects                     | 0              | 0                     | 0              |
| Lighthouse mobile (perf/FCP/LCP) | 98 / 0.9s / 2.3s | —                | 98 / 1.0s / 2.4s |

`/playbook` notes: ~58% of the raw document is the Next.js flight/RSC hydration payload
(framework tax on a text-heavy page; brotli absorbs most of it). The page is the only route
with italic display text above the fold, so it preloads `google-sans-italic-latin.woff2`
itself (page-scoped `ReactDOM.preload`) — without it the italic face started ~90ms after the
preloaded fonts and delayed the LCP repaint of the hero sub-paragraph, which is the LCP
element (pre-preload the route measured 95 / 1.4s / 2.8s). Gumroad's overlay stylesheets
load post-paint via `lazyOnload` and are not in the critical path. Measurement trap seen
here: on a loaded host (dev server + several headless Chromes), Lighthouse produced bimodal
scores (98 vs 75-76) with observed FCP landing seconds *after* observed load — a starved
renderer, not the page. Quiet the machine before believing a bad run.

A regression is a change against **these** numbers measured the same way — not against a field
panel percentile.
