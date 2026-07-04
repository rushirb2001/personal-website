---
name: page-profiling
description: Measured-development workflow for this portfolio site — capture performance baselines before changing a page, gate the change against the repo's perf invariants while building, and verify with real measurements (curl TTFB, Lighthouse, scroll/jank samplers) after. Use this whenever developing, modifying, restyling, or animating ANY page, component, layout, font, image, or media in this repo — new sections, new project case studies, hero/modal/carousel changes, CSS or transition work — even if the user never mentions performance. Also use it whenever FCP/LCP/TTFB/INP/CLS numbers are questioned (Vercel Speed Insights, Lighthouse, "why is the site slow"), and after any deploy that touched layout, media, fonts, or render-blocking resources.
---

# Page Profiling — measured page development

Every page change on this site ships through three phases: **baseline → build with gates →
verify**. The reason is history: this repo has shipped a render-blocking font stylesheet, a
mount-all carousel (~10s FCP/LCP), two transitions that silently never animated, and a diagnosis
that nearly blamed images for what was actually field-data history. Every one of those was invisible
in code review and obvious in a measurement. Numbers first, opinions second.

The full command recipes live in [docs/profiling.md](../../../docs/profiling.md) — referenced below
by section (§). Read the section you need; don't guess at commands from memory.

## Phase 1 — Baseline (before touching code)

Skip only for changes that cannot affect delivery or motion (copy edits, data-only tweaks).

1. Note the current numbers for the routes you'll touch: production TTFB + cache state (§1),
   document size (§5), and — if the change touches layout/media/fonts — a Lighthouse mobile pass
   (§2). The cookbook's baseline table is the reference point; if your fresh numbers disagree with
   it, resolve that before building on top.
2. If the work is motivated by a red field metric, do the §0 triage arithmetic FIRST: attribute
   the time to server/render/asset via the TTFB → FCP → LCP gaps, and cross-check the panel's
   window against deploy dates (§6). Do not start optimizing an asset when the gap analysis says
   the time is elsewhere — that's how the "is it the blob image?" wild-goose chase happens.

## Phase 2 — Build, holding the invariants

These are the repo's standing perf/motion invariants. A change that breaks one is a regression
even if it looks fine locally:

- **Routes stay static.** `/` is ○ Static, `/projects/[slug]` is ● SSG. Nothing may introduce
  `middleware.ts`, `headers()`/`cookies()` in server components, or `force-dynamic` without an
  explicit decision — dynamic rendering trades a ~120ms edge HIT for cold starts (§1).
- **Fonts stay self-hosted** (`@font-face` in `globals.css` + `ReactDOM.preload` in `layout.tsx`).
  Never reintroduce an external font `<link>` — it re-adds a render-blocking request.
- **Heavy media lazy-mounts.** The carousel mounts visited slides + one lookahead; first slide is
  an inline SVG. Project media (mp4/webp) lives in Vercel Blob and must never load on the home
  page or at project-page first paint.
- **Images go through `next/image`** with honest `sizes`; `priority` only for the above-the-fold
  hero.
- **Transitions name the property they animate.** Tailwind v4 `translate/rotate/scale` utilities
  set standalone CSS properties — an arbitrary `transition-[transform,…]` list silently never
  animates them. Verify every new/edited transition with `getComputedStyle(el).transitionProperty`
  (§4).
- **Scroll choreography invariants** (snap-on-open, scroll-then-flip, pre-computed targets,
  `overflow-anchor: none`, `behavior: "instant"` for intended jumps) are documented in CLAUDE.md —
  read them before touching `toggleSection`/`closeToTop` or section CSS.
- **Reduced motion is covered.** Any new animation/transition gets a
  `prefers-reduced-motion: reduce` story; any new hover effect is `(hover: hover)`-gated.

`pnpm exec tsc --noEmit` before every commit — type errors fail the Vercel build.

## Phase 3 — Verify (after the change)

Match the verification to what the change could break:

- **Any page change**: build-table check — route types unchanged, First Load JS didn't jump (§5).
- **Layout / media / fonts / render path**: Lighthouse mobile pass, compare FCP/LCP/TBT to
  baseline; confirm the LCP element is still the intended one (§2, §3).
- **Animation / transition / scroll work**: run the scroll sampler through every affected flow and
  read the trajectory for snaps, clamp-yanks, and disjoint motions; check frame pacing where work
  happens during scroll (§4). Test at 375px, 768px, and 1280px+ — jank is viewport-specific.
- **After deploy**: the §7 two-minute spot-check. If numbers legitimately improved or the page
  legitimately grew, update the cookbook's baseline table in the same PR — stale baselines make
  the next regression invisible.

## Measurement discipline

- Lab-measure **production** (or `pnpm build` + `pnpm start`), never `pnpm dev` — dev compiles on
  demand and its timings are fiction.
- In automated/preview browsers, rAF, timers, and layout transitions starve in occluded or
  oversized-emulation tabs; verify page state inside the same eval that acts on it, and reproduce
  any surprising number on a clean focused tab before believing it (§4 traps).
- Field panels aggregate history: always align the time window with deploy dates before treating
  a percentile as "current" (§0, §6).
- Report findings with the gap arithmetic, the commands run, and the numbers — so the next person
  (or session) can re-run the same measurement and compare.
