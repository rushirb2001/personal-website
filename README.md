# Rushir Bhavsar — Personal Portfolio

A quiet, editorial portfolio site: machine-learning work, research, and project case studies.

**Live:** [rushirbhavsar.vercel.app](https://rushirbhavsar.vercel.app/)

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (`@tailwindcss/postcss`) for layout utilities
- Editorial design tokens are **hand-rolled** in CSS — no component library, no animation library. Per-component `<style>` blocks plus a small `app/globals.css`.
- Fonts: Google Sans + Google Sans Code (loaded via `<link>` in the root layout)
- Deployed on **Vercel**

## Structure

```
app/
  layout.tsx              root layout — metadata, viewport, fonts
  page.tsx                landing page — collapsible-accordion sections
  TocNav.tsx              sticky scroll nav
  globals.css             Tailwind import + theme tokens
  projects/
    [slug]/page.tsx       routable project case-study modal (SSG)
    projects-data.ts      project detail content, keyed by slug
    ProjectModal.tsx      the modal card UI
    ArchitectureDiagram.tsx   inline SVG diagrams, per slug
  error.tsx / not-found.tsx / global-error.tsx
public/                   images + web manifest
```

The landing page is a single client component driving a section accordion (Experience / Selected Projects / Education / Contact). Each project can have a deep-linkable case study at `/projects/<slug>` — designed so a project with a private repo can still be shown to be real (problem → approach → result, metrics, architecture diagram, demo/screenshot slots, and a "request access / walkthrough" CTA).

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build (type-checks; fails on TS errors)
pnpm start      # serve the production build
```

No test runner or linter is configured. TypeScript is checked at build time, so `pnpm exec tsc --noEmit` is a good pre-push gate.

## Adding a project case study

1. Add an entry to `PROJECT_DETAILS` in `app/projects/projects-data.ts` (copy the `TEMPLATE` comment; set `repoStatus` to `"public"` or `"private"`).
2. Add a matching `slug` to that project's entry in the `PROJECTS` array in `app/page.tsx` — a "View case study →" link appears automatically.
3. Only fill the artifact fields you actually have; unset ones don't render.

## License

MIT.
