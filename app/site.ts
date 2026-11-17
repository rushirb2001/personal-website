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

// ORCID is the one globally unique, permanent identifier for a researcher, so
// it is declared separately as well as in sameAs: schema.org models it as an
// `identifier` (a PropertyValue), which is a stronger statement than "this is
// another page about the same person".
//
// Must be the PUBLIC form, https://orcid.org/<id>. The my-orcid?orcid=<id> URL
// the dashboard shows only resolves for the logged-in owner, so it would be a
// dead link to every crawler.
export const ORCID_ID = "0000-0001-8936-9194"
export const ORCID_URL = `https://orcid.org/${ORCID_ID}`

// Identity, in one place. `sameAs` is what lets Google tie this domain to the
// same person as the LinkedIn/GitHub profiles rather than guessing from a name.
// Scholar and ORCID matter most here: they are the two that independently
// corroborate the authored works declared in app/page.tsx, which is what turns
// "claims to have written these papers" into a verifiable fact.
export const AUTHOR = {
  name: "Rushir Bhavsar",
  email: "bhavsarrushir@gmail.com",
  location: "Ahmedabad, India",
  // The title actually held at the current employer (worksFor in app/page.tsx),
  // not a generic discipline label: a jobTitle that matches LinkedIn and the
  // resume is one more thing an indexer can corroborate.
  jobTitle: "Founding Engineer",
  employer: { name: "sushrutalgs.ai", url: "https://sushrutalgs.ai" },
  linkedin: "https://www.linkedin.com/in/rushir-bhavsar/",
  github: "https://github.com/rushirb2001",
  scholar: "https://scholar.google.com/citations?user=bAlVSk8AAAAJ",
  sameAs: [
    "https://www.linkedin.com/in/rushir-bhavsar/",
    "https://github.com/rushirb2001",
    ORCID_URL,
    // hl=en dropped: it is a UI locale parameter, and the canonical profile
    // URL is the one without it.
    "https://scholar.google.com/citations?user=bAlVSk8AAAAJ",
    "https://sushrutalgs.ai",
  ],
} as const

// The resume PDF, served from this origin (public/). It used to live on a
// Vercel Blob hostname, which sent the one document a recruiter is most likely
// to forward to a domain with no name on it, and gave the link equity away.
// Replace the file in place to update it; the URL is the stable part.
export const RESUME_PDF = "/rushir-bhavsar-resume.pdf"

// The home page's sections, in order. This is the whole of the site's
// navigation, and each section has a real path: /projects is the home page
// with Projects open, served as its own static route (app/projects/page.tsx)
// with its own title. The top bar's tabs are links to those paths, on the
// home page and on an article alike.
//
// There is one page of content and five ways into it, on purpose. /resume and
// /hire existed briefly as separate pages and each restated a section, so the
// same roles, projects and contact details lived in two or three places. A
// new kind of information gets a section here, or a row in one, not a page.
// `short` is the tab's label on phones.
export const HOME_SECTIONS = [
  { id: "experience", label: "Experience", short: "Exp" },
  { id: "projects", label: "Projects", short: "Proj" },
  { id: "writing", label: "Writing", short: "Notes" },
  { id: "education", label: "Education", short: "Edu" },
  { id: "contact", label: "Contact", short: "Hi" },
] as const

export type HomeSectionId = (typeof HOME_SECTIONS)[number]["id"]

/** The section a path addresses: "/projects" is "projects", "/" is null. */
export function sectionFromPath(pathname: string | null): HomeSectionId | null {
  return HOME_SECTIONS.find((s) => `/${s.id}` === pathname)?.id ?? null
}

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString()
}
