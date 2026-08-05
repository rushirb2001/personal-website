import type { Metadata } from "next"
import HomePage from "./HomePage"
import { JsonLd } from "./JsonLd"
import { AUTHOR, ORCID_URL, SITE_URL, absoluteUrl } from "./site"

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
  // Current employer, which is now the company rather than the university.
  // alumniOf below keeps ASU, since the MS is a fact that does not expire.
  worksFor: { "@type": "Organization", name: "sushrutalgs.ai", url: "https://sushrutalgs.ai" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Arizona State University" },
    { "@type": "CollegeOrUniversity", name: "Nirma University" },
  ],
  homeLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ahmedabad",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
  },
  // ORCID as a formal identifier, not just another sameAs link. This is the
  // property that lets an indexer match this Person to the same researcher on
  // IEEE, Wiley and ASU without relying on name matching, which is exactly the
  // problem ORCID exists to solve.
  identifier: {
    "@type": "PropertyValue",
    propertyID: "ORCID",
    value: ORCID_URL,
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

// Peer-reviewed work and the thesis, declared as authored by the Person above.
// Every one of these is already visible on this page (titles and links, under
// Education), so this describes the page rather than asserting anything a
// reader cannot check, which is the line Google's structured-data policy draws.
//
// This is the strongest entity signal available for a researcher: `knowsAbout`
// is a claim about expertise, whereas an authored ScholarlyArticle with a
// resolvable publisher URL is corroborable. It also gives Google something to
// match against the same papers on IEEE, Wiley and the ASU repository, which is
// how one person gets reconciled across sources rather than split into several.
const WORKS = [
  {
    "@type": "ScholarlyArticle",
    "@id": "https://ieeexplore.ieee.org/document/10188662",
    headline:
      "Classification of potentially hazardous asteroids using supervised quantum machine learning",
    url: "https://ieeexplore.ieee.org/iel7/6287639/6514899/10188662.pdf",
    datePublished: "2023",
    author: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@type": "Periodical", name: "IEEE Access" },
  },
  {
    "@type": "ScholarlyArticle",
    "@id": "https://doi.org/10.1002/spy2.343",
    headline:
      "MetaHate: AI-based hate speech detection for secured online gaming in metaverse using blockchain",
    url: "https://onlinelibrary.wiley.com/doi/abs/10.1002/spy2.343",
    datePublished: "2024",
    author: { "@id": `${SITE_URL}/#person` },
    isPartOf: { "@type": "Periodical", name: "Security and Privacy" },
  },
  {
    "@type": "Thesis",
    "@id": "https://keep.lib.asu.edu/items/201211",
    headline: "Multi-Architecture Coupled Ensemble Physics-Informed Neural Networks",
    url: "https://keep.lib.asu.edu/items/201211",
    datePublished: "2025",
    inSupportOf: "Master of Science",
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@type": "CollegeOrUniversity", name: "Arizona State University" },
  },
]

const GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    PERSON,
    ...WORKS,
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
