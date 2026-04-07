# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `pnpm dev`
- **Build:** `pnpm build`
- **Start prod:** `pnpm start`

No test runner or linter is configured. ESLint and TypeScript errors are ignored during builds (`next.config.mjs`).

## Architecture

Next.js 15 App Router personal portfolio with a Severance (TV show) inspired theme. Deployed on Vercel.

**Stack:** React 19, TypeScript, Tailwind CSS v4 (via `@tailwindcss/postcss`), Framer Motion, shadcn/ui components.

**Layout flow:** `app/layout.tsx` (server, metadata/viewport) → `app/ClientLayout.tsx` (client, wraps everything in ThemeProvider + NavigationProvider, handles mount animations, custom cursor, touch feedback, analytics).

**Key patterns:**
- Theme: Custom dark/light via `contexts/theme-context.tsx` with localStorage + inline `<script>` to prevent flash. Dark mode = "innie", light mode = "outie" (Severance terminology).
- Navigation: `contexts/navigation-context.tsx` manages route transitions with `TransitionOverlay` animation.
- Path aliases: `@/*` maps to project root.
- Images served from Vercel Blob Storage (remote patterns allow all HTTPS hosts).
- Contact form uses EmailJS (client-side) and has a Resend-based API route at `app/api/contact/route.tsx`.
- Blog/updates content lives in `lib/blog-data.ts` with dynamic routes at `app/updates/[id]/`.

**Component organization:**
- `components/ui/` — shadcn/ui primitives + custom UI (cursor, theme toggle, terminal footer)
- `components/features/` — domain-specific (blog, contact, education, resume, skills, updates)
- `components/layout/` — header, footer, page-layout wrapper
- `components/navigation/` — nav menu, mobile dropdown
- `components/transitions/` — page transition overlay
