# Case-study artifacts tracker

Proof-of-work assets for each project case study (`/projects/<slug>`). Edit the
data in `app/projects/projects-data.ts` (the `artifacts` and `links` fields);
architecture diagrams live in `app/projects/ArchitectureDiagram.tsx`.

**Status key:** `[x]` live · `[ ]` recommended / to add · `[~]` dev-only placeholder

**Conventions** (see `projects-data.ts`):

- `diagram: "builtin"` renders the hand-drawn SVG for that slug; `{ todo }` shows a dev-only placeholder.
- `clips: [{ src, caption }]` are local muted-autoplay mp4s (strongest cheap proof for ML/result work).
- `screenshots: { items: [{ src, caption }] }` for real images; `{ todo }` is a dev-only placeholder.
- `demoVideo: { embedUrl }` for a Loom/YouTube embed; `liveUrl: { url }` for a hosted demo.
- A `{ todo }` placeholder shows **only in dev**, never in production.

**Carousel order:** architecture diagram → recorded walkthrough → clips → screenshots → "coming soon" slate.

**Assets I can generate with no recording:** architecture diagrams (done), benchmark charts
(from committed result JSON), code-snippet slides. **You capture:** terminal/CLI output, API/`/docs`,
Neo4j graph, Cloudflare/Vercel/MLflow dashboards, CI green, screen recordings. **Loom:** narrated walkthrough.

---

## MACE-PINN — `/mace-pinn` · public · Master's thesis
Live carousel: 3 result clips + architecture.

- [x] Architecture diagram (`builtin`)
- [x] Result clips — `solution-v1/v2/v4.mp4` (Gray-Scott spots / stripes / chaos)
- [x] Links — GitHub repo + thesis (ASU Library)
- [ ] Training-curve plot (loss / relative-L2 over epochs)
- [ ] Loom — JAX/Flax code tour + a benchmark run

## Samhita — `/samhita` · private · data pipeline
Live carousel: architecture only.

- [x] Architecture diagram (`builtin`)
- [x] Link — live product (sushrutalgs.ai) + Request repo access
- [ ] CLI run capture — `rich`-formatted chapter run (node/edge counts, 100% validation)
- [ ] Neo4j graph-browser screenshot — the 71,621-node knowledge graph
- [ ] Before/after — textbook page next to extracted structured JSON (figure + AI description)
- [ ] CI green — Actions passing the mocked tests / release gate
- [ ] Benchmark chart — parse throughput (~2,565 pages/s) *(I can generate)*
- [~] `demoVideo` placeholder — Loom walkthrough of a chapter run

## HybridFlow — `/hybridflow` · private · retrieval backend
Live carousel: architecture only.

- [x] Architecture diagram (`builtin`)
- [x] Link — live product + Request repo access
- [ ] Streaming-query recording (killer) — a question streaming a cited answer (thinking → text → citations → figures)
- [ ] FastAPI `/docs` screenshot (4 SSE endpoints) + a retrieval result with top-k scores
- [ ] Eval capture — 8-gate suite 20/20, success@5 0.90, MRR 0.79
- [ ] Cost/throughput chart — ~$0.05–0.06/query, 14.7× throughput *(I can generate)*
- [~] `demoVideo` placeholder — Loom of a streaming query

## SushrutaLGS BFF — `/sushrutalgs-bff` · private · backend-for-frontend
Live carousel: architecture only.

- [x] Architecture diagram (`builtin`)
- [x] Link — live product + Request repo access
- [ ] Load-test report (strongest) — 9.2K ops/s quota, JWT p95 0.13 ms, 0 errors @ 200 concurrent, fail-closed 429/503
- [ ] Cloudflare dashboard — deployed Worker (staging + prod), analytics, 33 KB bundle
- [ ] curl capture — a request through the BFF (SSE pass-through) + a 429 when over quota
- [~] `demoVideo` placeholder — Loom of a request lifecycle

## SushrutaLGS Web — `/sushrutalgs-web` · private · Next.js app
Live carousel: architecture only.

- [x] Architecture diagram (`builtin`)
- [x] Link — live product + Request repo access
- [ ] Live-app screen recording (killer) — streaming chat, branching (retry/edit forking), inline citations
- [ ] Screenshots — chat with a figure citation, the branch tree, onboarding *(can screen-capture sushrutalgs.ai)*
- [ ] Code-snippet slide — chat-tree reducer or an RLS migration *(I can generate)*
- [~] `screenshots` placeholder + `demoVideo` placeholder

## SushrutaLGS iOS — `/sushrutalgs-ios` · private · SwiftUI app
Live carousel: architecture + 4 real iPad screenshots.

- [x] Architecture diagram (`builtin`)
- [x] Screenshots — 4 real iPad shots (`/public/projects/sushrutalgs-ios/ios-*.webp`): chat, figures, by-textbook, new-chat
- [x] Link — live product + Request repo access
- [ ] More screenshots / iPhone set if wanted (sources in `sushrutalgs-ios/marketing/screenshots/`)
- [ ] App-preview / device screen recording; App Store listing (build 148)
- [~] `demoVideo` placeholder — screen recording of the app

## Yelp ML Platform — `/yelp-ml-platform` · public · ML platform
Live carousel: architecture only.

- [x] Architecture diagram (`builtin`)
- [x] Link — public GitHub repo (itself proof; committed `eval/` + `bench/` results)
- [ ] Benchmark charts — Recall@10, RMSE, 86.3% acc, p99 0.11 ms *(I can generate from committed JSON)*
- [ ] FastAPI `/docs` + a live `curl` to `/predict/sentiment`
- [ ] MLflow UI screenshot; CI green
- [~] `demoVideo` placeholder — Loom of the API and benchmarks
