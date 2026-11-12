import type { Metadata } from "next"
import Link from "next/link"
import { JsonLd, breadcrumbList } from "../JsonLd"
import { SiteFooter, SiteNav, PageHeader } from "../SiteChrome"
import { AUTHOR, SITE_URL, absoluteUrl } from "../site"
import { Head } from "../writing/Prose"
import { WritingStyle } from "../writing/WritingStyle"
import { PROJECT_LIST, projectLabel } from "./projects-data"

// The index the case studies never had. Until this route existed the only
// links to /projects/[slug] were rows inside a collapsed accordion on the
// landing page, labelled with repo names ("backend-for-frontend"). Google had
// indexed the home page and the writing cluster but none of the seven case
// studies. This page gives each one a second inbound link with descriptive
// anchor text, and gives the breadcrumb trail a real middle step.
const TITLE = "Case studies: RAG, ML systems and AI products"
const DESCRIPTION =
  "Seven case studies by Rushir Bhavsar: a production RAG backend, an edge API gateway, web and iOS clients, a data pipeline, a thesis on physics-informed neural networks, and an ML platform."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/projects" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/projects"),
    title: `${TITLE} · ${AUTHOR.name}`,
    description: DESCRIPTION,
  },
}

// Public work that has a repository but no long-form case study yet. Linked
// straight to the source, which is the strongest proof there is.
const OPEN_SOURCE = [
  {
    name: "cohors",
    title: "cohors: a control plane for a fleet of git repositories",
    href: "https://github.com/rushirb2001/cohors",
    blurb:
      "One Rust core behind a CLI, a terminal UI, a web UI and an MCP server, over a fleet-wide search index. Bulk actions preview as dry runs, destructive ones ask first, and pulls are fast-forward only, so a coding agent can drive it without unbounded writes.",
    stack: ["Rust", "MCP", "TUI", "Web"],
    meta: "Open source, MIT",
  },
  {
    name: "thesis-mace-pinn",
    title: "MACE-PINN source: coupled-ensemble physics-informed neural networks",
    href: "https://github.com/rushirb2001/thesis-mace-pinn",
    blurb:
      "The code behind the master's thesis: parallel subnetworks with Fourier embeddings and adaptive loss weighting for Gray-Scott and Ginzburg-Landau reaction-diffusion systems.",
    stack: ["JAX", "Flax", "NumPy"],
    meta: "Thesis code",
  },
]

const GRAPH = [
  breadcrumbList([
    { name: "Home", url: SITE_URL },
    { name: "Projects", url: absoluteUrl("/projects") },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/projects")}#collection`,
    url: absoluteUrl("/projects"),
    name: TITLE,
    description: DESCRIPTION,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    author: { "@id": `${SITE_URL}/#person` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: PROJECT_LIST.map((d, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: projectLabel(d),
        url: absoluteUrl(`/projects/${d.slug}`),
      })),
    },
  },
]

const ROW =
  "grid grid-cols-1 xs:grid-cols-[clamp(80px,14vw,140px)_1fr_clamp(140px,22vw,240px)] lg:grid-cols-[140px_1fr_240px] gap-3 xs:gap-6 lg:gap-12 py-4 xs:py-6 lg:py-8 first:pt-2 xs:first:pt-3 lg:first:pt-4"

export default function ProjectsIndex() {
  return (
    <main className="paper grain min-h-[100svh]">
      <WritingStyle />
      <JsonLd data={GRAPH} />

      <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
        <SiteNav current="/projects" />

        <PageHeader label="Work" title="Systems I designed, built and shipped">
          <p className="mt-5 leading-relaxed text-[14px] xs:text-[15px] max-w-[62ch] mono">
            Each case study covers the problem, why it is hard, the design, what it cost and where it
            stands. Five of them are parts of one product,{" "}
            <a
              href="https://sushrutalgs.ai/welcome"
              target="_blank"
              rel="noopener noreferrer"
              className="accent-link accent"
            >
              sushrutalgs.ai
            </a>
            , which is live in production.
          </p>
        </PageHeader>

        <section>
          <Head title="Case studies" />
          <ol className="mt-2 lg:mt-3">
            {PROJECT_LIST.map((d, i) => (
              <li
                key={d.slug}
                className={`${ROW} ${i !== PROJECT_LIST.length - 1 ? "border-b rule" : ""}`}
              >
                <div className="mono text-[12px] xs:text-[13px] leading-snug ink xs:pt-2 lg:pt-[10px] flex xs:flex-col items-baseline gap-3 xs:gap-1.5">
                  <span>{d.type}</span>
                  {d.place && <span className="muted">{d.place}</span>}
                </div>

                <div>
                  <h3 className="display text-[21px] xs:text-[26px] lg:text-3xl font-light tracking-tight leading-tight">
                    <Link href={`/projects/${d.slug}`} className="accent-link">
                      {projectLabel(d)}
                    </Link>
                  </h3>
                  <p className="mt-2 xs:mt-4 leading-relaxed text-[14px] xs:text-[15px] max-w-[58ch] mono">
                    {d.seoDescription ?? d.tagline}
                  </p>
                  <p className="xs:hidden mt-3">
                    <Link
                      href={`/projects/${d.slug}`}
                      className="accent-link accent mono text-[12px] font-light whitespace-nowrap"
                    >
                      read the case study <span aria-hidden>&rarr;</span>
                    </Link>
                  </p>
                </div>

                <div className="hidden xs:block xs:pt-2 lg:pt-[10px] xs:space-y-5">
                  <div>
                    <p className="mono small-caps faint mb-1.5">Built with</p>
                    <ul className="flex flex-wrap gap-1.5 mono">
                      {d.stack.slice(0, 5).map((t) => (
                        <li key={t} className="pill">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mono small-caps faint mb-1.5">Code</p>
                    <p className="mono text-[13px] muted">
                      {d.repoStatus === "public" ? "Public repository" : "Private, walkthrough on request"}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <div aria-hidden className="h-14 xs:h-20" />
        </section>

        <section>
          <Head title="Open source" />
          <ol className="mt-2 lg:mt-3">
            {OPEN_SOURCE.map((p, i) => (
              <li
                key={p.name}
                className={`${ROW} ${i !== OPEN_SOURCE.length - 1 ? "border-b rule" : ""}`}
              >
                <div className="mono text-[12px] xs:text-[13px] leading-snug ink xs:pt-2 lg:pt-[10px]">
                  {p.meta}
                </div>
                <div>
                  <h3 className="display text-[21px] xs:text-[26px] lg:text-3xl font-light tracking-tight leading-tight">
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="accent-link"
                      data-lead="github"
                    >
                      {p.title}
                    </a>
                  </h3>
                  <p className="mt-2 xs:mt-4 leading-relaxed text-[14px] xs:text-[15px] max-w-[58ch] mono">
                    {p.blurb}
                  </p>
                </div>
                <div className="hidden xs:block xs:pt-2 lg:pt-[10px]">
                  <p className="mono small-caps faint mb-1.5">Built with</p>
                  <ul className="flex flex-wrap gap-1.5 mono">
                    {p.stack.map((t) => (
                      <li key={t} className="pill">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
          <div aria-hidden className="h-10 xs:h-14" />
        </section>

        <div className="next-step">
          <p className="display font-light text-[16px] xs:text-[18px] leading-[1.55] ink">
            Hiring for an AI engineering role, or have a system like one of these to build?
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5 mono">
            <Link href="/hire" className="cta-solid">
              Work with me <span aria-hidden>&rarr;</span>
            </Link>
            <Link href="/resume" className="footer-cta">
              Resume
            </Link>
          </div>
        </div>

        <SiteFooter />
      </div>
    </main>
  )
}
