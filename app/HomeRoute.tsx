import type { Metadata } from "next"
import HomePage, { type HomePost } from "./HomePage"
import { JsonLd, breadcrumbList } from "./JsonLd"
import { PROJECT_DETAIL_SLUGS } from "./projects/projects-data"
import { AUTHOR, HOME_SECTIONS, ORCID_URL, SITE_URL, absoluteUrl, type HomeSectionId } from "./site"
import { POSTS } from "./writing/posts-data"

// The home page's server half, shared by every path that serves it: / and one
// route per section (/experience, /projects, /writing, /education, /contact).
// The page itself is a client component (the accordion owns scroll and layout
// state), and a client component cannot export metadata or render a JSON-LD
// script into the server HTML. So the route files are that boundary: each
// exports `sectionMetadata(...)` and renders <HomeRoute/>, and the client
// component reads which section to open from the path.

// What each section's path is called in a search result. A section path is
// the same document as the home page with a different section open, so the
// title and description say which part of it the visitor asked for.
const SECTION_META: Record<HomeSectionId, { title: string; description: string }> = {
  experience: {
    title: "Experience: founding engineer, AI and ML systems",
    description:
      "Rushir Bhavsar's experience: founding engineer at sushrutalgs.ai, ML engineering at OpenEye (Cadence Design Systems), and GenAI engineering at Talin Labs.",
  },
  projects: {
    title: "Projects: RAG, ML systems and AI products",
    description:
      "Projects by Rushir Bhavsar, each with a case study: a production RAG backend, an edge API gateway, web and iOS clients, a data pipeline, a thesis on physics-informed neural networks, and an ML platform.",
  },
  writing: {
    // Not just "Writing": the <title> is the strongest on-page relevance
    // signal there is, so it names the subject.
    title: "Writing on AI engineering portfolios",
    description:
      "Building an AI engineering portfolio that survives an interview: project selection, evaluation, free-tier infrastructure, and private-repo credibility.",
  },
  education: {
    title: "Education and publications",
    description:
      "Rushir Bhavsar's education and research: M.S. in Data Science from Arizona State University, B.Tech. from Nirma University, a thesis on physics-informed neural networks and two peer-reviewed papers.",
  },
  contact: {
    title: "Contact: open to AI engineer, forward-deployed and product roles",
    description:
      "Contact Rushir Bhavsar. Open to Product Manager, AI Engineer and Forward-Deployed Engineer roles. Email, LinkedIn, GitHub and resume.",
  },
}

// RSS discovery (<link rel="alternate" type="application/rss+xml">) rides on
// every path, since the Writing section is on every path.
const FEED = { "application/rss+xml": [{ url: "/writing/rss.xml", title: "Writing · Rushir Bhavsar" }] }

export const homeMetadata: Metadata = {
  alternates: { canonical: "/", types: FEED },
}

export function sectionMetadata(id: HomeSectionId): Metadata {
  const { title, description } = SECTION_META[id]
  return {
    title,
    description,
    alternates: { canonical: `/${id}`, types: FEED },
    openGraph: { type: "website", url: absoluteUrl(`/${id}`), title: `${title} · ${AUTHOR.name}`, description },
  }
}

// The Writing section's rows. Only the fields it shows cross into the client
// component; the registry itself imports every article body.
const HOME_POSTS: HomePost[] = POSTS.map((p) => ({
  slug: p.slug,
  title: p.title,
  standfirst: p.standfirst,
  published: p.published,
  date: new Date(p.published).toLocaleDateString("en-US", { year: "numeric", month: "short", timeZone: "UTC" }),
  readingTime: p.readingTime,
  topics: p.topics,
}))

// The identity graph for this domain. `sameAs` is the part that matters: it is
// how Google confirms the person behind rushirbhavsar.dev is the same one
// behind the LinkedIn and GitHub profiles instead of guessing from a name that
// other people also have. Everything asserted here is visible on the page.
const PERSON = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: AUTHOR.name,
  url: SITE_URL,
  image: absoluteUrl("/images/rushir-bhavsar.jpg"),
  // One sentence an indexer can quote. Everything in it is visible on the page.
  description:
    "Founding engineer at sushrutalgs.ai building production RAG and LLM systems, API gateways and ML pipelines. Previously at OpenEye (Cadence Design Systems) and Talin Labs; M.S. in Data Science from Arizona State University.",
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

export function HomeRoute({ section }: { section?: HomeSectionId }) {
  const label = HOME_SECTIONS.find((s) => s.id === section)?.label
  return (
    <>
      <JsonLd data={GRAPH} />
      {section && label && (
        <JsonLd
          data={breadcrumbList([
            { name: "Home", url: SITE_URL },
            { name: label, url: absoluteUrl(`/${section}`) },
          ])}
        />
      )}
      <HomePage caseStudySlugs={PROJECT_DETAIL_SLUGS} posts={HOME_POSTS} />
    </>
  )
}
