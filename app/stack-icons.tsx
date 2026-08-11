import {
  siApachespark,
  siCloudflare,
  siDocker,
  siFastapi,
  siGithub,
  siHono,
  siKubernetes,
  siLangchain,
  siLanggraph,
  siMlflow,
  siNeo4j,
  siNextdotjs,
  siNumpy,
  siPython,
  siQdrant,
  siReact,
  siSupabase,
  siSwift,
  siTypescript,
  siVercel,
  siXcode,
  type SimpleIcon,
} from "simple-icons"

type IconLike = { path: string; viewBox?: string }

// Keyed by the exact string as it appears in a `stack` array (see WORK /
// PROJECTS in HomePage.tsx) — deliberately literal rather than fuzzy-matched
// on a normalized name, so a stack entry either has a verified icon or it
// doesn't; nothing here is guessed. Niche ML/research tooling (ESM2, cuDF,
// cuML, RAFT, OmegaConf, BioLORD, JAX, Flax, SwiftUI) has no Simple Icons
// entry and is intentionally omitted — those pills render text-only.
export const STACK_ICONS: Record<string, SimpleIcon> = {
  "Next.js 16": siNextdotjs,
  "React 19": siReact,
  TypeScript: siTypescript,
  Supabase: siSupabase,
  "supabase-swift": siSupabase,
  Vercel: siVercel,
  "Swift 6": siSwift,
  FastAPI: siFastapi,
  Qdrant: siQdrant,
  Neo4j: siNeo4j,
  "Cloudflare Workers": siCloudflare,
  "Cloudflare R2": siCloudflare,
  Kubernetes: siKubernetes,
  LangChain: siLangchain,
  LangGraph: siLanggraph,
  Python: siPython,
  Hono: siHono,
  "Xcode Cloud": siXcode,
  NumPy: siNumpy,
  PySpark: siApachespark,
  MLflow: siMlflow,
  Docker: siDocker,
}

export const GITHUB_ICON: IconLike = siGithub

// LinkedIn's mark was removed from simple-icons after a trademark dispute
// with LinkedIn, so it can't be sourced there. Extracted instead from
// @fortawesome/free-brands-svg-icons (installed, verified, then removed —
// this is the one glyph copied out rather than carrying that whole package
// as a dependency). Font Awesome Free icons are CC BY 4.0:
// https://fontawesome.com/license/free
export const LINKEDIN_ICON: IconLike = {
  viewBox: "0 0 448 512",
  path: "M416 32L31.9 32C14.3 32 0 46.5 0 64.3L0 447.7C0 465.5 14.3 480 31.9 480L416 480c17.6 0 32-14.5 32-32.3l0-383.4C448 46.5 433.6 32 416 32zM135.4 416l-66.4 0 0-213.8 66.5 0 0 213.8-.1 0zM102.2 96a38.5 38.5 0 1 1 0 77 38.5 38.5 0 1 1 0-77zM384.3 416l-66.4 0 0-104c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9l0 105.8-66.4 0 0-213.8 63.7 0 0 29.2 .9 0c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9l0 117.2z",
}

// Not a brand — a plain page-with-folded-corner pictogram for the resume
// PDF link, drawn by hand (no source icon set to verify against, since
// there's no "real" glyph a generic document icon needs to match).
export const DOCUMENT_ICON: IconLike = {
  path: "M6 2L14 2L20 8L20 22L6 22Z",
}

// Rendered in currentColor (never the brand's own hex) — the site's palette
// is cream/ink/one navy accent, and a row of brand colors would fight that.
// Monochrome keeps every pill reading as one quiet system.
export function StackIcon({ icon, className }: { icon: IconLike; className?: string }) {
  return (
    <svg role="img" viewBox={icon.viewBox ?? "0 0 24 24"} fill="currentColor" className={className} aria-hidden="true">
      <path d={icon.path} />
    </svg>
  )
}
