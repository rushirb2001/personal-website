// Canonical origin for this site. Everything that has to emit an absolute URL
// (metadataBase, canonicals, sitemap, robots, JSON-LD) reads it from here, so
// there is exactly one place to change if the domain moves.
//
// The apex 308-redirects to www on Vercel, so www IS the canonical host — a
// canonical pointing at the apex would name a URL that immediately redirects.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rushirbhavsar.dev"

// The deploy also answers on its .vercel.app name. Left alone that is a second
// full copy of the site competing with this one; next.config.mjs redirects it.
export const VERCEL_ALIAS_HOST = "rushirbhavsar.vercel.app"

// GA4 measurement ID. Public by definition (it ships in the client HTML), so it
// lives here rather than in a secret; the env var only exists so a fork or a
// staging property can point somewhere else without editing code.
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-YEWFPENS23"

// Identity, in one place. `sameAs` is what lets Google tie this domain to the
// same person as the LinkedIn/GitHub profiles rather than guessing from a name.
export const AUTHOR = {
  name: "Rushir Bhavsar",
  email: "bhavsarrushir@gmail.com",
  location: "Tempe, Arizona",
  jobTitle: "Machine Learning Engineer",
  sameAs: [
    "https://www.linkedin.com/in/rushir-bhavsar/",
    "https://github.com/rushirb2001",
    "https://sushrutalgs.ai",
  ],
} as const

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString()
}
