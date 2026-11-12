import type { Metadata } from "next"
import { JsonLd, breadcrumbList } from "../JsonLd"
import { AccordionShell } from "../PageShell"
import {
  ChipList,
  ENTRY_TITLE,
  EntryRow,
  HeroFacts,
  PageHero,
  Pills,
  RailLinks,
  type ChipLink,
} from "../SiteChrome"
import { RowList } from "../accordion"
import { AUTHOR, RESUME_PDF, SITE_URL, absoluteUrl } from "../site"
import { EDUCATION, EXPERIENCE, PROJECTS, PUBLICATIONS, SKILLS, SUMMARY, type ResumeLink } from "./resume-data"

// The resume as a page, not only as a PDF. A PDF is what a recruiter forwards;
// a page is what a search engine indexes, what a phone can read without
// pinch-zooming, and what can link each claim to the case study behind it.
// Both are served from this origin and built from the same facts
// (./resume-data.ts mirrors the PDF).
//
// The home page's accordion (AccordionShell) with its Experience and Education
// rows: dates in the margin, "Role @Company" as the h3, the stack and links in
// the rail. The one thing a resume needs that the home page does not is
// bullets, which use the site's "+" as their marker. Printing opens every
// section (the print rules are in ACCORDION_CSS and WritingStyle).
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

// A chip marks where it goes by its arrow; the lead name is for GA4.
const chips = (links: ResumeLink[]): ChipLink[] =>
  links.map((l) => ({ ...l, lead: l.href.includes("github.com") ? "github" : undefined }))

const BULLETS = "plus-list mono text-[14px] xs:text-[15px] leading-relaxed max-w-[58ch] mt-3 xs:mt-5"
// The accent line the home page sets under a degree (its focus area).
const SUBLINE = "display accent font-light tracking-tight text-[16px] lg:text-lg mt-1.5 xs:mt-2"

function Experience() {
  return (
    <RowList>
      {EXPERIENCE.map((role, i) => (
        <EntryRow
          key={role.org}
          meta={
            <>
              <span className={i === 0 ? "accent" : undefined}>{role.period}</span>
              <span className="muted">{role.place}</span>
            </>
          }
          rail={
            <>
              <Pills items={role.stack} />
              {role.related && (
                <div className="no-print">
                  <RailLinks links={chips(role.related)} />
                </div>
              )}
            </>
          }
        >
          <h3 className={ENTRY_TITLE}>
            {role.title}
            <span className="muted">
              {" "}
              @
              {role.orgHref ? (
                <a href={role.orgHref} target="_blank" rel="noopener noreferrer" className="accent-link">
                  {role.org}
                </a>
              ) : (
                role.org
              )}
            </span>
          </h3>
          {role.orgNote && <p className={SUBLINE}>{role.orgNote}</p>}
          <ul className={BULLETS}>
            {role.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </EntryRow>
      ))}
    </RowList>
  )
}

function Projects() {
  return (
    <RowList>
      {PROJECTS.map((p) => (
          <EntryRow
            key={p.name}
            meta={<span>{p.what}</span>}
            rail={
              <>
                <Pills items={p.stack} />
                <div className="no-print">
                  <RailLinks links={chips(p.links)} />
                </div>
              </>
            }
          >
            <h3 className={ENTRY_TITLE}>{p.name}</h3>
            <ul className={BULLETS}>
              {p.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </EntryRow>
        ))}
    </RowList>
  )
}

function Education() {
  return (
    <RowList>
      {EDUCATION.map((e) => (
        <EntryRow
          key={e.school}
          meta={
            <>
              <span>{e.period}</span>
              <span className="muted">{e.place}</span>
            </>
          }
        >
          <h3 className={ENTRY_TITLE}>
            {e.degree}
            <span className="muted"> @{e.school}</span>
          </h3>
          {e.note && <p className={SUBLINE}>{e.note}</p>}
        </EntryRow>
      ))}
    </RowList>
  )
}

function Publications() {
  return (
    <RowList>
      {PUBLICATIONS.map((p) => {
        const links: ChipLink[] = [{ label: "paper", href: p.href }]
        if (p.caseStudy) links.push({ label: "case study", href: p.caseStudy })
        return (
          <EntryRow
            key={p.href}
            spacing="dense"
            meta={<span>{p.venue}</span>}
            rail={
              <div className="no-print">
                <ChipList links={links} />
              </div>
            }
          >
            {/* A paper title runs three times the length of a role or a
                project name, so it sits one step down the same scale. */}
            <h3 className="display text-[18px] xs:text-[21px] lg:text-[23px] font-light tracking-tight leading-snug">
              <a href={p.href} target="_blank" rel="noopener noreferrer" className="accent-link">
                {p.title}
              </a>
            </h3>
          </EntryRow>
        )
      })}
    </RowList>
  )
}

function Skills() {
  return (
    <RowList as="ul">
      {SKILLS.map((s) => (
        <EntryRow key={s.group} spacing="compact" meta={<span>{s.group}</span>}>
          <Pills items={s.items} />
        </EntryRow>
      ))}
    </RowList>
  )
}

export default function ResumePage() {
  return (
    <AccordionShell
      current="/resume"
      hero={
        <PageHero
          title={AUTHOR.name}
          aside={
            <>
              <HeroFacts items={[EXPERIENCE[0].title, "Updated Sep 2026"]} />
              <ChipList
                layout="row"
                className="mt-4 no-print"
                links={[
                  { label: "download pdf", href: RESUME_PDF, lead: "resume_pdf", download: true },
                  { label: "email", href: `mailto:${AUTHOR.email}`, lead: "email" },
                  { label: "linkedin", href: AUTHOR.linkedin, lead: "linkedin" },
                  { label: "github", href: AUTHOR.github, lead: "github" },
                ]}
              />
            </>
          }
        >
          {SUMMARY}
        </PageHero>
      }
      sections={[
        { id: "experience", title: "Experience", count: EXPERIENCE.length, content: <Experience /> },
        { id: "projects", title: "Projects", count: PROJECTS.length, content: <Projects /> },
        { id: "education", title: "Education", count: EDUCATION.length, content: <Education /> },
        { id: "publications", title: "Publications", count: PUBLICATIONS.length, content: <Publications /> },
        { id: "skills", title: "Skills", count: SKILLS.length, content: <Skills /> },
      ]}
    >
      <JsonLd data={GRAPH} />
    </AccordionShell>
  )
}
