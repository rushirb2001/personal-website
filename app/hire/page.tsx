import type { Metadata } from "next"
import Link from "next/link"
import { JsonLd, breadcrumbList } from "../JsonLd"
import { GridRow, PageHeader, SiteFooter, SiteNav } from "../SiteChrome"
import { AUTHOR, RESUME_PDF, SITE_URL, absoluteUrl } from "../site"
import { Head } from "../writing/Prose"
import { WritingStyle } from "../writing/WritingStyle"

// The page a recruiter or a prospective client is actually looking for: what
// this person does, for whom, the proof, and one obvious way to start a
// conversation. The landing page tells the story; this one answers "can you
// help me, and how do I reach you" in under a minute, and every claim on it
// links to the case study or the resume line that backs it.
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

type Proof = { label: string; href: string }

// Roles: the three the landing page says he is open to, each with the piece of
// shipped work that argues for it. Every figure is on the resume.
const ROLES: { role: string; pitch: string; proof: Proof[] }[] = [
  {
    role: "AI Engineer",
    pitch:
      "I build retrieval and LLM systems that hold up under load and under review. At sushrutalgs.ai that is a streaming FastAPI retrieval API with 15 tool functions over Neo4j and Qdrant, steady at 30 concurrent queries with zero errors, and an 8-gate regression suite in CI that checks citation integrity and hallucination on every change.",
    proof: [
      { label: "HybridFlow, the retrieval backend", href: "/projects/hybridflow" },
      { label: "Samhita, the ingestion pipeline", href: "/projects/samhita" },
    ],
  },
  {
    role: "Forward-Deployed Engineer",
    pitch:
      "I am the engineering side of a live product, so I work across the whole stack and next to the people using it: an edge gateway on Cloudflare Workers for auth, quotas and streaming, the backend behind it, and web, iOS and Android clients on one streaming contract, shipped to the App Store and Google Play.",
    proof: [
      { label: "The edge API gateway", href: "/projects/sushrutalgs-bff" },
      { label: "The iOS app", href: "/projects/sushrutalgs-ios" },
    ],
  },
  {
    role: "Product Manager, technical",
    pitch:
      "As a founding engineer I own the product surface as well as the code: what ships, in what order, and what a plan includes. Three clients, three sign-in flows, plan-aware limits and cited answers all had to be decided before they were built, and I can still read the diff.",
    proof: [{ label: "The web app", href: "/projects/sushrutalgs-web" }],
  },
]

// Contract work: three shapes of project, each matched to something already
// built and measured.
const BUILDS: { what: string; detail: string; proof: Proof[] }[] = [
  {
    what: "RAG and retrieval systems, with evaluation",
    detail:
      "Hybrid graph and vector retrieval, grounded answers with citations, and a regression harness in CI so quality is a number you can watch instead of a feeling. I have run a 10K-query RAG evaluation harness and an 8-gate quality suite in production.",
    proof: [
      { label: "HybridFlow case study", href: "/projects/hybridflow" },
      { label: "What interviewers ask about RAG evaluation", href: "/writing/rag-eval-harness-interview" },
    ],
  },
  {
    what: "API gateways and backends for AI products",
    detail:
      "The layer between your apps and your models: JWT verification over JWKS, per-user plan-aware quotas that fail closed, service-to-service auth, and SSE streaming to web and mobile clients. Mine verifies tokens at p95 0.13 ms on Cloudflare Workers.",
    proof: [{ label: "Edge gateway case study", href: "/projects/sushrutalgs-bff" }],
  },
  {
    what: "ML pipelines and model serving",
    detail:
      "Data pipelines in PySpark, GPU training with PyTorch Lightning and RAPIDS, fine-tuning with QLoRA, and serving paths tuned for latency. Past results include inference at 7.2 ms per sequence across 1M+ protein sequences and a sentiment model cut from 276 ms to 0.11 ms.",
    proof: [
      { label: "Yelp ML platform case study", href: "/projects/yelp-ml-platform" },
      { label: "MACE-PINN thesis case study", href: "/projects/mace-pinn" },
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

function ProofLinks({ proof }: { proof: Proof[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 mono text-[12px] xs:text-[13px]">
      {proof.map((p) => (
        <li key={p.href}>
          <Link href={p.href} className="accent-link accent">
            {p.label} <span aria-hidden>&rarr;</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

const ENTRY_TITLE = "display text-[19px] xs:text-[23px] font-light tracking-tight leading-tight"
const BODY = "display font-light text-[16px] xs:text-[17px] leading-[1.6] max-w-[66ch] mt-3"

export default function HirePage() {
  return (
    <main className="paper grain min-h-[100svh]">
      <WritingStyle />
      <JsonLd data={GRAPH} />

      <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
        <SiteNav current="/hire" />

        <PageHeader label="Hire me" title="Work with me">
          <p className="display font-light text-[16px] xs:text-[18px] leading-[1.55] muted max-w-[64ch] mt-5">
            I build AI products end to end: the retrieval and model layer, the API in front of it, and
            the apps people use. I am open to full-time roles and to contract work, and the fastest way
            to reach me is email.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5 mono">
            <a href={MAIL_ROLE} className="cta-solid" data-lead="email_role">
              Email me about a role
            </a>
            <a href={MAIL_PROJECT} className="footer-cta" data-lead="email_project">
              Email me about a project
            </a>
            <Link href="/resume" className="footer-cta">
              Resume
            </Link>
          </div>
        </PageHeader>

        <section>
          <Head title="For a role" />
          {ROLES.map((r, i) => (
            <GridRow
              key={r.role}
              divider={i !== ROLES.length - 1}
              label={<span className="ink">{String(i + 1).padStart(2, "0")}</span>}
            >
              <h3 className={ENTRY_TITLE}>{r.role}</h3>
              <p className={BODY}>{r.pitch}</p>
              <ProofLinks proof={r.proof} />
            </GridRow>
          ))}
          <div aria-hidden className="h-10 xs:h-14" />
        </section>

        <section>
          <Head title="For a project" />
          {BUILDS.map((b, i) => (
            <GridRow
              key={b.what}
              divider={i !== BUILDS.length - 1}
              label={<span className="ink">{String(i + 1).padStart(2, "0")}</span>}
            >
              <h3 className={ENTRY_TITLE}>{b.what}</h3>
              <p className={BODY}>{b.detail}</p>
              <ProofLinks proof={b.proof} />
            </GridRow>
          ))}
          <div aria-hidden className="h-10 xs:h-14" />
        </section>

        <section>
          <Head title="The short version" />
          {FACTS.map((f, i) => (
            <GridRow
              key={f.label}
              divider={i !== FACTS.length - 1}
              label={<span className="small-caps faint">{f.label}</span>}
            >
              <p className="mono text-[13px] xs:text-[14px] leading-relaxed max-w-[66ch]">{f.value}</p>
            </GridRow>
          ))}
          <div aria-hidden className="h-10 xs:h-14" />
        </section>

        <section>
          <Head title="Contact" />
          <GridRow label={<span className="small-caps faint">Email</span>}>
            <p className="display text-[21px] xs:text-[26px] font-light tracking-tight leading-tight">
              <a href={`mailto:${AUTHOR.email}`} className="accent-link accent" data-lead="email">
                {AUTHOR.email}
              </a>
            </p>
            <p className="mono text-[13px] xs:text-[14px] leading-relaxed muted max-w-[60ch] mt-3">
              Tell me what the role or the project is and where it stands. A link to the job description
              or a few lines on the problem is enough to start.
            </p>
          </GridRow>
          <GridRow label={<span className="small-caps faint">Elsewhere</span>}>
            <div className="flex flex-wrap gap-2.5 mono">
              <a
                href={AUTHOR.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-cta"
                data-lead="linkedin"
              >
                LinkedIn <span aria-hidden>↗</span>
              </a>
              <a
                href={AUTHOR.github}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-cta"
                data-lead="github"
              >
                GitHub <span aria-hidden>↗</span>
              </a>
              <a
                href={AUTHOR.scholar}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-cta"
                data-lead="scholar"
              >
                Google Scholar <span aria-hidden>↗</span>
              </a>
              <a href={RESUME_PDF} className="footer-cta" data-lead="resume_pdf">
                Resume PDF <span aria-hidden>&darr;</span>
              </a>
            </div>
          </GridRow>
        </section>

        <SiteFooter />
      </div>
    </main>
  )
}
