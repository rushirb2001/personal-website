import Link from "next/link"
import { GridRow } from "../SiteChrome"
import { Head, Spacer } from "./Prose"

// How every post ends: one line tying the article to work that actually
// shipped, a link to the case study that proves it, and the way to get in
// touch. It closes the article as a real section on the same grid as
// everything above it.
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
    <section>
      <Head title="From the work" />
      <GridRow label={<span className="small-caps faint">Author</span>}>
        <div className="next-step">
          <p className="display font-light text-[16px] xs:text-[18px] leading-[1.55] ink">{line}</p>
          <p className="mt-4">
            <Link href={caseStudy.href} className="accent-link accent display text-[15px] xs:text-[16px]">
              {caseStudy.label} <span aria-hidden>&rarr;</span>
            </Link>
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5 mono">
            <Link href="/hire" className="footer-cta">
              Work with me
            </Link>
            <Link href="/resume" className="footer-cta">
              Resume
            </Link>
          </div>
        </div>
      </GridRow>
      <Spacer />
    </section>
  )
}
