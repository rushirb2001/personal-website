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
2. **Per-component `<style>` blocks** — each page/component that needs the editorial design tokens injects them inline (see the `<style>` at the top of `app/page.tsx` and the `TOKENS` string in `app/projects/ProjectModal.tsx`). This is the established pattern; follow it rather than reaching for a CSS framework or modules.

**Shared design tokens** (defined in those `<style>` blocks): `.display` (Google Sans), `.mono` (Google Sans Code), `.ink` / `.muted` / `.faint` (text shades), `.rule` (hairline border), `.accent` / `.accent-bg` / `.accent-line` / `.accent-link` (navy `#1f3a5f`), `.small-caps`, `.grain` (dotted overlay). Palette: paper `#f4f1ec`, ink `#1a1a1a`, accent `#1f3a5f`. Fonts load via a Google Fonts `<link>` in `app/layout.tsx`.

## Routes & key files

- `app/layout.tsx` — root layout: metadata, viewport, font `<link>`s.
- `app/page.tsx` — the entire landing page: a single client component with a **collapsible-accordion** of sections (Experience / Selected Projects / Education / Contact). Content lives in the `WORK` / `PROJECTS` / `EDUCATION` / `LINKS` consts at the top of the file. Opening a section sets `openSection` state, expands it to ~viewport height, and smooth-scrolls to it. The closed/landing state is a full-height flex column: the wrapper animates `min-h-[100svh]` (closed) → `min-h-0` (open) over 350ms while the hero keeps a permanent `flex-1 justify-center`, so the centering space glides away on open instead of snapping — but the reverse direction **snaps** (inline `transitionProperty: none` while closed): if min-height animated back on close, the collapsing content outruns it, the document dips below the viewport for a few frames, and the sticky footer visibly rides up and drops back. Because the layout is in motion when a section opens from the closed state, `toggleSection` **pre-computes** the scroll target from the measured leftover centering space before flipping state — don't switch scroll targeting to live `offsetTop` reads during that transition, and don't give the hero variable height while a section is open, or the scroll-to-section math breaks. The accordion choreography is deliberately asymmetric and sequenced; preserve these invariants: a section's `min-height` **snaps** on fresh open (the smooth scroll needs that scroll room to already exist or the browser clamp-jumps) but **animates** on close; switching to a section *below* the open one flips state immediately and scrolls after 380ms — unless the viewport is scrolled past what the old section's collapse will leave room for, in which case the glide starts immediately toward a pre-computed target so the browser clamp never produces a second disjoint motion; switching *above* (and closing to home) scrolls **first** and flips state on `scrollend` (expanding above the viewport shoves visible content down a frame), backed by a per-frame arrival watcher because Safari has no `scrollend`; the upward path opens the target in `softOpen` mode (`data-soft`, 500ms grow) instead of the snap. `html` carries `overflow-anchor: none` (browser scroll anchoring otherwise teleports the viewport when a section's `min-height` snaps open), and intended-instant jumps must use `behavior: "instant"`, never `"auto"` — the global `scroll-behavior: smooth` hijacks `"auto"`.
- `app/TocNav.tsx` — sticky top nav that appears on scroll; drives the same `openSection` state.
- `app/projects/[slug]/page.tsx` — **routable project case-study modal**. Server component: `generateStaticParams` + `generateMetadata` (link-preview friendly), `notFound()` for unknown slugs. Renders `ProjectModal`. Built so a private-repo project can be made credible to a recruiter who can't see the code.
- `app/projects/projects-data.ts` — `ProjectDetail` type + `PROJECT_DETAILS` map keyed by slug. `repoStatus: "public" | "private"` toggles the access treatment; artifact fields are optional. A `{ todo: "..." }` value renders a labelled placeholder **in dev only** (hidden in production builds, so a half-filled live page never shows placeholders to visitors); a real value renders everywhere; omit the field to drop the block entirely. Includes a copy-paste `TEMPLATE` comment for new (esp. private) projects.
- `app/projects/ProjectModal.tsx` — client modal card: dimmed backdrop, Esc / `×` / backdrop-click → `/`, `role="dialog"`, conditional artifact blocks (architecture diagram, demo video, screenshots, stack), and a "request access / walkthrough / email" verify CTA.
- `app/projects/ArchitectureDiagram.tsx` — inline SVG diagrams keyed by slug, drawn in the site palette.
- `app/page.tsx` links into the modal via a "View case study →" link, gated on `hasProjectDetail(slug)`.
- `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx` — error boundaries.

**Note:** `components.json` (shadcn config) is a vestigial leftover — there is no `components/` directory and shadcn/ui is not in use. `app/page.tsx.bak` is a stale backup and can be deleted.

## Conventions

- Path alias `@/*` maps to the project root (`tsconfig.json`).
- Match the surrounding hand-rolled style: editorial spacing, `mono` small-caps labels, the `xs:` (475px) / `lg:` responsive rhythm already in `page.tsx`.
- Add new project case studies by adding an entry to `PROJECT_DETAILS` (and a `slug` on the matching `PROJECTS` entry in `page.tsx`); only set artifact fields you actually have so empty slots never render in production.
