import type { Metadata } from "next"
import { JsonLd, breadcrumbList } from "../JsonLd"
import { PageShell } from "../PageShell"
import {
  ChipList,
  ContactSection,
  ENTRY_BODY,
  ENTRY_TITLE,
  EntryRow,
  HeroFacts,
  PROFILE_CHIPS,
  PageHero,
  PageSection,
  Pills,
  RailLinks,
  type ChipLink,
} from "../SiteChrome"
import { AUTHOR, SITE_URL, absoluteUrl } from "../site"

// The page a recruiter or a prospective client is actually looking for: what
// this person does, for whom, the proof, and one obvious way to start a
// conversation. The landing page tells the story; this one answers "can you
// help me, and how do I reach you" in under a minute, and every claim on it
// links to the case study or the resume line that backs it.
//
// Built from the home page's rows (SiteChrome): each role and each kind of
// project is a row with its stack as pills and its proof as chips in the rail,
// and the page ends on the same Contact section the home page ends on.
const TITLE = "Hire me: AI engineer and forward-deployed engineer"
const DESCRIPTION =
  "Work with Rushir Bhavsar: open to AI engineer, forward-deployed engineer and product roles, and to contract builds. Production RAG, LLM systems, API gateways, ML pipelines."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/hire" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/hire"),
    title: `Work with ${AUTHOR.name}`,
    description: DESCRIPTION,
  },
}

const GRAPH = [
  breadcrumbList([
    { name: "Home", url: SITE_URL },
    { name: "Hire me", url: absoluteUrl("/hire") },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${absoluteUrl("/hire")}#contact`,
    url: absoluteUrl("/hire"),
    name: `Work with ${AUTHOR.name}`,
    description: DESCRIPTION,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: AUTHOR.name,
      url: SITE_URL,
      jobTitle: AUTHOR.jobTitle,
      email: `mailto:${AUTHOR.email}`,
      sameAs: [...AUTHOR.sameAs],
    },
  },
]

// A subject line per audience, so the two kinds of enquiry arrive already
// sorted and the click events tell them apart.
const mail = (subject: string) => `mailto:${AUTHOR.email}?subject=${encodeURIComponent(subject)}`
const MAIL_ROLE = mail("A role for Rushir")
const MAIL_PROJECT = mail("A project for Rushir")

// Roles: the three the landing page says he is open to, each with the piece of
// shipped work that argues for it. Every figure is on the resume, and every
// stack entry is named in the pitch beside it. Chip labels are short because a
// chip never wraps and the rail is narrow; the descriptive anchors for these
// case studies are on /projects.
type Offer = { title: string; pitch: string; stack: string[]; proof: ChipLink[] }

const ROLES: Offer[] = [
  {
    title: "AI Engineer",
    pitch:
      "I build retrieval and LLM systems that hold up under load and under review. At sushrutalgs.ai that is a streaming FastAPI retrieval API with 15 tool functions over Neo4j and Qdrant, steady at 30 concurrent queries with zero errors, and an 8-gate regression suite in CI that checks citation integrity and hallucination on every change.",
    stack: ["Python", "FastAPI", "Neo4j", "Qdrant"],
    proof: [
      { label: "hybridflow", href: "/projects/hybridflow" },
      { label: "samhita", href: "/projects/samhita" },
    ],
  },
  {
    title: "Forward-Deployed Engineer",
    pitch:
      "I am the engineering side of a live product, so I work across the whole stack and next to the people using it: an edge gateway on Cloudflare Workers for auth, quotas and streaming, the backend behind it, and web, iOS and Android clients on one streaming contract, shipped to the App Store and Google Play.",
    stack: ["Cloudflare Workers", "TypeScript", "SwiftUI", "Jetpack Compose"],
    proof: [
      { label: "edge gateway", href: "/projects/sushrutalgs-bff" },
      { label: "ios app", href: "/projects/sushrutalgs-ios" },
    ],
  },
  {
    title: "Product Manager, technical",
    pitch:
      "As a founding engineer I own the product surface as well as the code: what ships, in what order, and what a plan includes. Three clients, three sign-in flows, plan-aware limits and cited answers all had to be decided before they were built, and I can still read the diff.",
    stack: ["Web", "iOS", "Android"],
    proof: [{ label: "web app", href: "/projects/sushrutalgs-web" }],
  },
]

// Contract work: three shapes of project, each matched to something already
// built and measured.
const BUILDS: Offer[] = [
  {
    title: "RAG and retrieval systems, with evaluation",
    pitch:
      "Hybrid graph and vector retrieval, grounded answers with citations, and a regression harness in CI so quality is a number you can watch instead of a feeling. I have run a 10K-query RAG evaluation harness and an 8-gate quality suite in production.",
    stack: ["Neo4j", "Qdrant", "FastAPI", "CI gates"],
    proof: [
      { label: "hybridflow", href: "/projects/hybridflow" },
      { label: "eval post", href: "/writing/rag-eval-harness-interview" },
    ],
  },
  {
    title: "API gateways and backends for AI products",
    pitch:
      "The layer between your apps and your models: JWT verification over JWKS, per-user plan-aware quotas that fail closed, service-to-service auth, and SSE streaming to web and mobile clients. Mine verifies tokens at p95 0.13 ms on Cloudflare Workers.",
    stack: ["Cloudflare Workers", "JWT / JWKS", "SSE", "Postgres"],
    proof: [{ label: "edge gateway", href: "/projects/sushrutalgs-bff" }],
  },
  {
    title: "ML pipelines and model serving",
    pitch:
      "Data pipelines in PySpark, GPU training with PyTorch Lightning and RAPIDS, fine-tuning with QLoRA, and serving paths tuned for latency. Past results include inference at 7.2 ms per sequence across 1M+ protein sequences and a sentiment model cut from 276 ms to 0.11 ms.",
    stack: ["PySpark", "PyTorch Lightning", "RAPIDS", "QLoRA"],
    proof: [
      { label: "yelp platform", href: "/projects/yelp-ml-platform" },
      { label: "mace-pinn", href: "/projects/mace-pinn" },
    ],
  },
]

const FACTS: { label: string; value: string }[] = [
  { label: "Now", value: "Founding Software Engineer at sushrutalgs.ai, a medical AI product live on web, iOS and Android." },
  { label: "Before", value: "OpenEye (Cadence Design Systems) and Talin Labs, both in the United States." },
  { label: "Based in", value: "Gujarat, India. Open to remote roles and to relocation, in India or abroad." },
  { label: "Open to", value: "Full-time roles and contract projects." },
  { label: "Education", value: "M.S. Data Science, Arizona State University. B.Tech. Computer Science, Nirma University." },
  { label: "Research", value: "Two peer-reviewed papers (IEEE Access, Wiley Security and Privacy) and a thesis on physics-informed neural networks." },
]

function Offers({ items }: { items: Offer[] }) {
  return (
    <ol className="mt-2 lg:mt-3">
      {items.map((o, i) => (
        <EntryRow
          key={o.title}
          meta={<span>{String(i + 1).padStart(2, "0")}</span>}
          rail={
            <>
              <Pills items={o.stack} />
              <RailLinks links={o.proof} />
            </>
          }
        >
          <h3 className={ENTRY_TITLE}>{o.title}</h3>
          <p className={`${ENTRY_BODY} mt-2 xs:mt-5`}>{o.pitch}</p>
        </EntryRow>
      ))}
    </ol>
  )
}

export default function HirePage() {
  return (
    <PageShell current="/hire">
      <JsonLd data={GRAPH} />

      <PageHero
        title="Work with me"
        aside={
          <>
            <HeroFacts items={["Open to work", "Full-time or contract"]} />
            <ChipList
              stackFrom="lg"
              className="mt-4"
              links={[
                { label: "email about a role", href: MAIL_ROLE, lead: "email_role" },
                { label: "email about a project", href: MAIL_PROJECT, lead: "email_project" },
                { label: "resume", href: "/resume" },
              ]}
            />
          </>
        }
      >
        I build AI products end to end: the retrieval and model layer, the API in front of it, and the
        apps people use.
        <span className="block mt-4 muted">
          Open to full-time roles and to contract work. The fastest way to reach me is email.
        </span>
      </PageHero>

      <PageSection title="For a role" count={ROLES.length}>
        <Offers items={ROLES} />
      </PageSection>

      <PageSection title="For a project" count={BUILDS.length}>
        <Offers items={BUILDS} />
      </PageSection>

      <PageSection title="The short version" count={FACTS.length}>
        <ul className="mt-2 lg:mt-3">
          {FACTS.map((f) => (
            <EntryRow key={f.label} spacing="compact" meta={<span>{f.label}</span>}>
              <p className={ENTRY_BODY}>{f.value}</p>
            </EntryRow>
          ))}
        </ul>
      </PageSection>

      <ContactSection
        heading="Tell me what you are building"
        links={[...PROFILE_CHIPS, { label: "scholar", href: AUTHOR.scholar, lead: "scholar" }]}
      >
        Say what the role or the project is and where it stands. A link to the job description or a few
        lines on the problem is enough to start.
      </ContactSection>
    </PageShell>
  )
}
