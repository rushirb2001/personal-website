# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Commands

- **Dev server:** `pnpm dev` (Next.js dev on http://localhost:3000)
- **Build:** `pnpm build`
- **Start prod:** `pnpm start`

Package manager is **pnpm** (`pnpm@10.31.0`, `pnpm-lock.yaml`).

No test runner or linter is configured. **TypeScript IS type-checked during `next build`** and `next.config.mjs` does **not** ignore errors — a type error fails the build (and the Vercel deploy). Keep types clean; `pnpm exec tsc --noEmit` is a fast local gate.

## Architecture

Next.js **16** App Router personal portfolio with a quiet, editorial design (cream paper, ink text, a single navy accent). Deployed on Vercel.

**Stack:** React 19, TypeScript 5.9, Tailwind CSS **v4** (via `@tailwindcss/postcss`, configured in `postcss.config.mjs`; theme tokens live in `app/globals.css` under `@theme`). No component library, no Framer Motion, no state libraries — everything is hand-rolled.

**Styling is hand-rolled, two layers:**
1. `app/globals.css` — Tailwind v4 import, CSS variables, the `xs` breakpoint (`475px`), and a few global utilities.
2. **Per-component `<style>` blocks** — each page/component that needs the editorial design tokens injects them inline (see the `<style>` at the top of `app/HomePage.tsx` and the `TOKENS` string in `app/projects/ProjectModal.tsx`). This is the established pattern; follow it rather than reaching for a CSS framework or modules.

**Shared design tokens** (defined in those `<style>` blocks): `.display` (Google Sans), `.mono` (Google Sans Code), `.ink` / `.muted` / `.faint` (text shades), `.rule` (hairline border), `.accent` / `.accent-bg` / `.accent-line` / `.accent-link` (navy `#1f3a5f`), `.small-caps`, `.grain` (dotted overlay). Palette: paper `#f4f1ec`, ink `#1a1a1a`, accent `#1f3a5f`. **Fonts are self-hosted**: `@font-face` blocks in `app/globals.css` pointing at `public/fonts/*.woff2`, preloaded with `ReactDOM.preload` in `app/layout.tsx`. Never reintroduce an external Google Fonts `<link>` — it re-adds a render-blocking request. Note the subset's `unicode-range` covers Latin-1 plus a little punctuation only; arrows, Greek letters and math symbols fall outside it and silently swap to a system font.

## Routes & key files

- `app/site.ts` — `SITE_URL` (canonical origin, **`https://www.rushirbhavsar.dev`**; the apex 308s to www), `AUTHOR`, `ORCID_URL`, `GA_MEASUREMENT_ID`. Everything emitting an absolute URL reads from here.
- `app/layout.tsx` — root layout: `metadataBase`, title template, robots directives, font preloads, analytics.
- `app/page.tsx` — thin **server** route: metadata + the `Person`/`WebSite`/`ProfilePage` JSON-LD graph. Renders `app/HomePage.tsx`, which is the `"use client"` accordion landing page. A client component cannot export metadata or emit JSON-LD, which is why the split exists.
- `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts` — generated; the sitemap reads `PROJECT_DETAIL_SLUGS` and the writing registry, so it can never list a route that does not exist.
- `app/JsonLd.tsx` — one code path for structured data (`JsonLd`, `breadcrumbList`).
- `app/og.tsx` + `opengraph-image.tsx` files — 1200x630 link cards via `next/og`. Satori cannot read WOFF2, so these use the bundled default face, not the site font.
- `app/GoogleAnalytics.tsx` — GA4, `strategy="lazyOnload"`, skipped when `NODE_ENV !== "production"`.
- `app/writing/` — long-form posts as plain server components (no MDX, no new deps). `posts-data.ts` is the registry; `Prose.tsx` holds the section primitives; `Figure.tsx` holds hand-drawn inline SVG figures; `rss.xml/route.ts` is the feed.
- `app/HomePage.tsx` — the landing page itself: a `"use client"` component with a **collapsible-accordion** of sections (Experience / Selected Projects / Education / Contact). Content lives in the `WORK` / `PROJECTS` / `EDUCATION` / `LINKS` consts at the top of the file. Opening a section sets `openSection` state, expands it to ~viewport height, and smooth-scrolls to it. The closed/landing state is a full-height flex column: the wrapper animates `min-h-[100svh]` (closed) → `min-h-0` (open) over 350ms while the hero keeps a permanent `flex-1 justify-center`, so the centering space glides away on open instead of snapping — but the reverse direction **snaps** (inline `transitionProperty: none` while closed): if min-height animated back on close, the collapsing content outruns it, the document dips below the viewport for a few frames, and the sticky footer visibly rides up and drops back. Because the layout is in motion when a section opens from the closed state, `toggleSection` **pre-computes** the scroll target from the measured leftover centering space before flipping state — don't switch scroll targeting to live `offsetTop` reads during that transition, and don't give the hero variable height while a section is open, or the scroll-to-section math breaks. The accordion choreography is deliberately asymmetric and sequenced; preserve these invariants: a section's `min-height` **snaps** on fresh open (the smooth scroll needs that scroll room to already exist or the browser clamp-jumps) but **animates** on close; switching to a section *below* the open one flips state immediately and scrolls after 380ms — unless the viewport is scrolled past what the old section's collapse will leave room for, in which case the glide starts immediately toward a pre-computed target so the browser clamp never produces a second disjoint motion; switching *above* (and closing to home) scrolls **first** and flips state on `scrollend` (expanding above the viewport shoves visible content down a frame), backed by a per-frame arrival watcher because Safari has no `scrollend`; the upward path opens the target in `softOpen` mode (`data-soft`, 500ms grow) instead of the snap, and closing to home collapses in a soft 500ms (`data-home-close`) — switches must keep the 350ms collapse or their 380ms scroll timing breaks. `html` carries `overflow-anchor: none` (browser scroll anchoring otherwise teleports the viewport when a section's `min-height` snaps open), and intended-instant jumps must use `behavior: "instant"`, never `"auto"` — the global `scroll-behavior: smooth` hijacks `"auto"`.
- `app/TocNav.tsx` — sticky top nav that appears on scroll; drives the same `openSection` state.
- `app/projects/[slug]/page.tsx` — **routable project case-study modal**. Server component: `generateStaticParams` + `generateMetadata` (link-preview friendly), `notFound()` for unknown slugs. Renders `ProjectModal`. Built so a private-repo project can be made credible to a recruiter who can't see the code.
- `app/projects/projects-data.ts` — `ProjectDetail` type + `PROJECT_DETAILS` map keyed by slug. `repoStatus: "public" | "private"` toggles the access treatment; artifact fields are optional. A `{ todo: "..." }` value renders a labelled placeholder **in dev only** (hidden in production builds, so a half-filled live page never shows placeholders to visitors); a real value renders everywhere; omit the field to drop the block entirely. Includes a copy-paste `TEMPLATE` comment for new (esp. private) projects.
- `app/projects/ProjectModal.tsx` — the case study. Reads as an **article**, not a dialog: one centred reading column (`.cs`, 56rem) carries every word, and only `.cs-media` breaks out of it. Sections are narrative (`The problem` / `Why it is hard` / `The design` / `What it cost` / `Where it stands`), never a spec sheet, and **never** cite vanity metrics (lines of code, component/route/file counts) — they measure typing and cost credibility with the reader this page exists for. `ProjectDetail.metrics` feeds the outcomes callout. Also holds the diagram zoom (FLIP out of the clicked thumbnail) and the verify CTA.
- `app/projects/ArchitectureDiagram.tsx` — inline SVG diagrams keyed by slug, composed from `app/projects/diagram-kit.tsx`. **Never hand-type connector coordinates**: the kit derives edge geometry from node rectangles (`box`/`column`/`Link`), so a connector cannot drift off its target. Every floating label goes through `K.Tag`, which knocks a paper halo out behind the glyphs — a label sits on a connector by definition, and without the halo the line reads straight through it.
- `app/HomePage.tsx` links into the modal via a "View case study →" link, gated on `hasProjectDetail(slug)`.
- `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx` — error boundaries.

**Note:** `components.json` (shadcn config) is a vestigial leftover — there is no `components/` directory and shadcn/ui is not in use.

## Conventions

- Path alias `@/*` maps to the project root (`tsconfig.json`).
- Match the surrounding hand-rolled style: editorial spacing, `mono` small-caps labels, the `xs:` (475px) / `lg:` responsive rhythm already in `HomePage.tsx`. Most surfaces share one grid: `[clamp(80px,14vw,140px)_1fr]` / `lg:[140px_1fr]`.
- Add new project case studies by adding an entry to `PROJECT_DETAILS` (and a `slug` on the matching `PROJECTS` entry in `HomePage.tsx`); only set artifact fields you actually have so empty slots never render in production.
