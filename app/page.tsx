import type { Metadata } from "next"
import HomePage from "./HomePage"
import { JsonLd } from "./JsonLd"
import { AUTHOR, SITE_URL, absoluteUrl } from "./site"

// The landing page itself is a client component (the accordion owns scroll and
// layout state), and a client component cannot export metadata or render a
// JSON-LD script into the server HTML. This thin server route is that boundary:
// metadata and structured data here, interaction in ./HomePage.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
}

// The identity graph for this domain. `sameAs` is the part that matters: it is
// how Google confirms the person behind rushirbhavsar.dev is the same one
// behind the LinkedIn and GitHub profiles instead of guessing from a name that
// other people also have. Everything asserted here is visible on the page.
const PERSON = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: AUTHOR.name,
  url: SITE_URL,
  image: absoluteUrl("/images/design-mode/new_personal_photo(1).png"),
  jobTitle: AUTHOR.jobTitle,
  email: `mailto:${AUTHOR.email}`,
  sameAs: [...AUTHOR.sameAs],
  worksFor: { "@type": "Organization", name: "Arizona State University" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Arizona State University" },
    { "@type": "CollegeOrUniversity", name: "Nirma University" },
  ],
  homeLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tempe",
      addressRegion: "AZ",
      addressCountry: "US",
    },
  },
  knowsAbout: [
    "Machine learning engineering",
    "Retrieval-augmented generation",
    "Physics-informed neural networks",
    "PyTorch Lightning",
    "JAX",
    "LLM evaluation",
    "MLOps",
    "Distributed data pipelines",
  ],
}

const GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    PERSON,
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Rushir Bhavsar",
      publisher: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en-US",
    },
    {
      // ProfilePage is the type Google documents for a page about one person,
      // which is exactly what the landing page is.
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profilepage`,
      url: SITE_URL,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: { "@id": `${SITE_URL}/#person` },
    },
  ],
}

export default function Page() {
  return (
    <>
      <JsonLd data={GRAPH} />
      <HomePage />
    </>
  )
}
