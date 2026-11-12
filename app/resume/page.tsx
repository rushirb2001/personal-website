import type { Metadata } from "next"
import Link from "next/link"
import { JsonLd, breadcrumbList } from "../JsonLd"
import { GridRow, PageHeader, SiteFooter, SiteNav } from "../SiteChrome"
import { AUTHOR, RESUME_PDF, SITE_URL, absoluteUrl } from "../site"
import { Head } from "../writing/Prose"
import { WritingStyle } from "../writing/WritingStyle"
import { EDUCATION, EXPERIENCE, PROJECTS, PUBLICATIONS, SKILLS, SUMMARY, type ResumeLink } from "./resume-data"

// The resume as a page, not only as a PDF. A PDF is what a recruiter forwards;
// a page is what a search engine indexes, what a phone can read without
// pinch-zooming, and what can link each claim to the case study behind it.
// Both are served from this origin and built from the same facts
// (./resume-data.ts mirrors the PDF).
const TITLE = "Resume: founding engineer, AI systems and APIs"
const DESCRIPTION =
  "Resume of Rushir Bhavsar: founding software engineer at sushrutalgs.ai, previously OpenEye (Cadence) and Talin Labs. Production RAG, API gateways, ML pipelines. PDF included."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/resume" },
  openGraph: {
    type: "profile",
    url: absoluteUrl("/resume"),
    title: `Resume · ${AUTHOR.name}`,
    description: DESCRIPTION,
  },
}

const GRAPH = [
  breadcrumbList([
    { name: "Home", url: SITE_URL },
    { name: "Resume", url: absoluteUrl("/resume") },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${absoluteUrl("/resume")}#resume`,
    url: absoluteUrl("/resume"),
    name: `Resume of ${AUTHOR.name}`,
    description: DESCRIPTION,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    // Restates a minimal Person under the home page's @id so the reference
    // resolves in-document for a validator reading this page alone, while
    // still folding into the one entity everywhere else.
    mainEntity: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: AUTHOR.name,
      url: SITE_URL,
      jobTitle: EXPERIENCE[0].title,
      worksFor: { "@type": "Organization", name: AUTHOR.employer.name, url: AUTHOR.employer.url },
      alumniOf: EDUCATION.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
      sameAs: [...AUTHOR.sameAs],
    },
  },
]

function ResumeLinks({ links }: { links: ResumeLink[] }) {
  if (links.length === 0) return null
  return (
    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 mono text-[12px] xs:text-[13px]">
      {links.map((l) => {
        const external = l.href.startsWith("http")
        return (
          <li key={l.href}>
            {external ? (
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="accent-link accent"
                data-lead={l.href.includes("github.com") ? "github" : undefined}
              >
                {l.label} <span aria-hidden>↗</span>
              </a>
            ) : (
              <Link href={l.href} className="accent-link accent">
                {l.label} <span aria-hidden>&rarr;</span>
              </Link>
            )}
          </li>
        )
      })}
    </ul>
  )
}

const BULLETS = "plus-list mono text-[13px] xs:text-[14px] leading-relaxed max-w-[70ch]"
const ENTRY_TITLE = "display text-[19px] xs:text-[23px] font-light tracking-tight leading-tight"

export default function ResumePage() {
  return (
    <main className="paper grain min-h-[100svh]">
      <WritingStyle />
      <JsonLd data={GRAPH} />

      <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
        <div className="no-print">
          <SiteNav current="/resume" />
        </div>

        <PageHeader label="Resume" title={AUTHOR.name}>
          <p className="display font-light text-[16px] xs:text-[18px] leading-[1.55] muted max-w-[64ch] mt-5">
            {SUMMARY}
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5 mono no-print">
            <a href={RESUME_PDF} className="cta-solid" data-lead="resume_pdf" download>
              Download PDF <span aria-hidden>&darr;</span>
            </a>
            <a href={`mailto:${AUTHOR.email}`} className="footer-cta" data-lead="email">
              Email
            </a>
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
          </div>
        </PageHeader>

        <section>
          <Head title="Experience" />
          {EXPERIENCE.map((role, i) => (
            <GridRow
              key={role.org}
              divider={i !== EXPERIENCE.length - 1}
              label={
                <>
                  <span className="ink block">{role.period}</span>
                  <span className="block mt-1">{role.place}</span>
                </>
              }
            >
              <h3 className={ENTRY_TITLE}>{role.title}</h3>
              <p className="mono text-[13px] xs:text-[14px] mt-1.5">
                {role.orgHref ? (
                  <a
                    href={role.orgHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="accent-link accent"
                  >
                    {role.org}
                  </a>
                ) : (
                  <span className="accent">{role.org}</span>
                )}
                {role.orgNote && <span className="muted">, {role.orgNote}</span>}
              </p>
              <ul className={`${BULLETS} mt-4`}>
                {role.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              {role.related && (
                <div className="mt-5 no-print">
                  <p className="mono small-caps faint">Case studies</p>
                  <ResumeLinks links={role.related} />
                </div>
              )}
            </GridRow>
          ))}
          <div aria-hidden className="h-10 xs:h-14" />
        </section>

        <section>
          <Head title="Projects" />
          {PROJECTS.map((p, i) => (
            <GridRow
              key={p.name}
              divider={i !== PROJECTS.length - 1}
              label={
                <ul className="flex flex-wrap gap-1.5">
                  {p.stack.map((t) => (
                    <li key={t} className="pill">
                      {t}
                    </li>
                  ))}
                </ul>
              }
            >
              <h3 className={ENTRY_TITLE}>
                {p.name}
                <span className="muted">, {p.what.toLowerCase()}</span>
              </h3>
              <ul className={`${BULLETS} mt-4`}>
                {p.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <ResumeLinks links={p.links} />
            </GridRow>
          ))}
          <p className="mono text-[13px] xs:text-[14px] pt-2 no-print">
            <Link href="/projects" className="accent-link accent">
              All seven case studies <span aria-hidden>&rarr;</span>
            </Link>
          </p>
          <div aria-hidden className="h-10 xs:h-14" />
        </section>

        <section>
          <Head title="Education" />
          {EDUCATION.map((e, i) => (
            <GridRow
              key={e.school}
              divider={i !== EDUCATION.length - 1}
              label={
                <>
                  <span className="ink block">{e.period}</span>
                  <span className="block mt-1">{e.place}</span>
                </>
              }
            >
              <h3 className={ENTRY_TITLE}>{e.degree}</h3>
              <p className="mono text-[13px] xs:text-[14px] mt-1.5">
                <span className="accent">{e.school}</span>
                {e.note && <span className="muted">, {e.note}</span>}
              </p>
            </GridRow>
          ))}
          <div aria-hidden className="h-10 xs:h-14" />
        </section>

        <section>
          <Head title="Publications" />
          {PUBLICATIONS.map((p, i) => (
            <GridRow
              key={p.href}
              divider={i !== PUBLICATIONS.length - 1}
              label={<span className="ink">{p.venue}</span>}
            >
              <h3 className="display text-[17px] xs:text-[19px] font-light tracking-tight leading-snug max-w-[60ch]">
                <a href={p.href} target="_blank" rel="noopener noreferrer" className="accent-link">
                  {p.title}
                </a>
              </h3>
              {p.caseStudy && (
                <ResumeLinks links={[{ label: "Case study", href: p.caseStudy }]} />
              )}
            </GridRow>
          ))}
          <div aria-hidden className="h-10 xs:h-14" />
        </section>

        <section>
          <Head title="Skills" />
          {SKILLS.map((s, i) => (
            <GridRow
              key={s.group}
              divider={i !== SKILLS.length - 1}
              label={<span className="ink">{s.group}</span>}
            >
              <ul className="flex flex-wrap gap-1.5 mono">
                {s.items.map((t) => (
                  <li key={t} className="pill">
                    {t}
                  </li>
                ))}
              </ul>
            </GridRow>
          ))}
          <div aria-hidden className="h-10 xs:h-14" />
        </section>

        <div className="next-step no-print">
          <p className="display font-light text-[16px] xs:text-[18px] leading-[1.55] ink">
            Want the short version of how I can help, or to start a conversation?
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5 mono">
            <Link href="/hire" className="footer-cta">
              Work with me <span aria-hidden>&rarr;</span>
            </Link>
            <a href={`mailto:${AUTHOR.email}`} className="footer-cta" data-lead="email">
              Email me
            </a>
          </div>
        </div>

        <div className="no-print">
          <SiteFooter />
        </div>
      </div>
    </main>
  )
}
