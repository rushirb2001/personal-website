import type { Metadata } from "next"
import Link from "next/link"
import { JsonLd, breadcrumbList } from "../JsonLd"
import { PageShell } from "../PageShell"
import {
  ChipList,
  ContactSection,
  ENTRY_BODY,
  ENTRY_TITLE,
  EntryRow,
  HeroFacts,
  PageHero,
  PageSection,
  Pills,
  RailLinks,
  type ChipLink,
} from "../SiteChrome"
import { AUTHOR, SITE_URL, absoluteUrl } from "../site"
import { PROJECT_LIST, projectLabel } from "./projects-data"

// The index the case studies never had. Until this route existed the only
// links to /projects/[slug] were rows inside a collapsed accordion on the
// landing page, labelled with repo names ("backend-for-frontend"). Google had
// indexed the home page and the writing cluster but none of the seven case
// studies. This page gives each one a second inbound link with descriptive
// anchor text, and gives the breadcrumb trail a real middle step.
//
// It is laid out as the home page's Selected Projects section, opened: the
// same rows (type in the margin, title and blurb, stack pills and link chips
// in the rail) under the same section head.
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

export default function ProjectsIndex() {
  return (
    <PageShell current="/projects">
      <JsonLd data={GRAPH} />

      <PageHero
        title="Systems I designed, built and shipped"
        aside={
          <>
            <HeroFacts
              items={[`${PROJECT_LIST.length} case studies`, `${OPEN_SOURCE.length} open source repositories`]}
            />
            <ChipList
              stackFrom="lg"
              className="mt-4"
              links={[
                { label: "work with me", href: "/hire" },
                { label: "resume", href: "/resume" },
              ]}
            />
          </>
        }
      >
        Each case study covers the problem, why it is hard, the design, what it cost and where it
        stands.
        <span className="block mt-4 muted">
          Five of them are parts of one product,{" "}
          <a
            href="https://sushrutalgs.ai/welcome"
            target="_blank"
            rel="noopener noreferrer"
            className="accent-link accent whitespace-nowrap"
          >
            sushrutalgs.ai <span aria-hidden className="mono text-[0.85em] align-middle">↗</span>
          </a>
          , which is live in production.
        </span>
      </PageHero>

      <PageSection title="Case studies" count={PROJECT_LIST.length}>
        <ol className="mt-2 lg:mt-3">
          {PROJECT_LIST.map((d) => {
            const repo = d.repoStatus === "public" ? d.links.find((l) => l.href.includes("github.com")) : undefined
            const links: ChipLink[] = [{ label: "case study", href: `/projects/${d.slug}` }]
            if (repo) links.push({ label: "github", href: repo.href, lead: "github" })
            return (
              <EntryRow
                key={d.slug}
                spacing="dense"
                meta={
                  <>
                    <span>{d.type}</span>
                    {d.place && <span className="muted">{d.place}</span>}
                  </>
                }
                rail={
                  <>
                    <Pills items={d.stack.slice(0, 5)} />
                    <RailLinks links={links} />
                    {!repo && <p className="mono text-[12px] muted">Private repo, walkthrough on request</p>}
                  </>
                }
              >
                <h3 className={ENTRY_TITLE}>
                  <Link href={`/projects/${d.slug}`} className="accent-link">
                    {projectLabel(d)}
                  </Link>
                </h3>
                <p className={`${ENTRY_BODY} mt-2 xs:mt-5`}>{d.seoDescription ?? d.tagline}</p>
              </EntryRow>
            )
          })}
        </ol>
      </PageSection>

      <PageSection title="Open source" count={OPEN_SOURCE.length}>
        <ol className="mt-2 lg:mt-3">
          {OPEN_SOURCE.map((p) => (
            <EntryRow
              key={p.name}
              spacing="dense"
              meta={<span>{p.meta}</span>}
              rail={
                <>
                  <Pills items={p.stack} />
                  <RailLinks links={[{ label: "github", href: p.href, lead: "github" }]} />
                </>
              }
            >
              <h3 className={ENTRY_TITLE}>
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
              <p className={`${ENTRY_BODY} mt-2 xs:mt-5`}>{p.blurb}</p>
            </EntryRow>
          ))}
        </ol>
      </PageSection>

      <ContactSection heading="Have a system like one of these to build">
        I am open to AI Engineer, Forward-Deployed Engineer and Product Manager roles, and to contract
        builds. Here is{" "}
        <Link href="/hire" className="accent-link accent">
          how I can help
        </Link>{" "}
        and my{" "}
        <Link href="/resume" className="accent-link accent">
          full resume
        </Link>
        .
      </ContactSection>
    </PageShell>
  )
}
