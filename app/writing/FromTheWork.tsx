import Link from "next/link"
import { ChipList, ENTRY_BODY, ENTRY_TITLE, EntryRow, PageSection } from "../SiteChrome"

// How every post ends: one line tying the article to work that actually
// shipped, a link to the case study that proves it, and the way to get in
// touch. It closes the article as a row on the same grid as everything above
// it, in the shape of the home page's Contact row.
//
// The `line` and the case study are per-post on purpose. A generic block at the
// foot of four different articles is the thing readers learn to skip, and a
// specific link is what connects the writing cluster to the case studies,
// which nothing outside the landing page linked to before.
export function FromTheWork({
  line,
  caseStudy,
}: {
  line: string
  caseStudy: { label: string; href: string }
}) {
  return (
    <PageSection title="From the work">
      <EntryRow
        as="div"
        meta={<span className="accent">Open to work</span>}
        rail={
          <ChipList
            links={[
              { label: "work with me", href: "/hire" },
              { label: "resume", href: "/resume" },
            ]}
          />
        }
      >
        <h3 className={ENTRY_TITLE}>
          I build the systems these posts are about<span className="accent">.</span>
        </h3>
        <p className={`${ENTRY_BODY} mt-2 xs:mt-5`}>{line}</p>
        <p className={`${ENTRY_BODY} mt-3 xs:mt-4`}>
          <Link href={caseStudy.href} className="accent-link accent">
            {caseStudy.label} <span aria-hidden>&rarr;</span>
          </Link>
        </p>
      </EntryRow>
    </PageSection>
  )
}
