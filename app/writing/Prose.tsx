import type { ReactNode } from "react"
import { SectionHead } from "../SiteChrome"

// The article's structural vocabulary: a Head + Row pair on the landing page's
// grid template, with the same sticky head, "+" marker and trailing accent
// period, and a left-margin label column. A post laid out with these reads as
// the same document family as every other page on the site.

// Sticky section head: the site's one head (SiteChrome's SectionHead), which
// anchors under the top bar while its section scrolls and is pushed out by the
// next section's head natively. Sections carry their spacing as in-content
// space (the <Spacer/> below) so each head sits at its section's very top edge
// and the handoff has no gap.
export function Head({ title }: { title: string }) {
  return <SectionHead title={title} />
}

// Keyword in the left margin, everything else in the right column.
export function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-[clamp(80px,14vw,140px)_1fr] lg:grid-cols-[140px_1fr] gap-2 xs:gap-6 lg:gap-12 pt-6 xs:pt-8">
      <p className="mono small-caps faint xs:pt-1">{label}</p>
      {/* min-w-0 zeroes the grid item's automatic minimum so a wide child (the
          snippet block) scrolls inside its own overflow wrapper instead of
          blowing the page out horizontally in the 475-615px band. */}
      <div className="prose min-w-0">{children}</div>
    </div>
  )
}

// In-content spacer, not padding: sticky heads are constrained to their
// section's box, so padding would end the pin early and open a gap.
export function Spacer() {
  return <div aria-hidden className="h-14 xs:h-20" />
}

// One h2 section of an article.
export function Section({
  title,
  label,
  children,
}: {
  /** Short, for the sticky head. Long phrasing belongs in the body. */
  title: string
  /** Left-margin keyword, the Row label. */
  label: string
  children: ReactNode
}) {
  return (
    <section>
      <Head title={title} />
      <Row label={label}>{children}</Row>
      <Spacer />
    </section>
  )
}

// The paragraphs before the first section head, which have no head of their own
// but still need to sit in the content column. Carries the same trailing spacer
// every Section does, or the first head crowds the last line of the lede.
export function Lede({ label = "Intro", children }: { label?: string; children: ReactNode }) {
  return (
    <section>
      <Row label={label}>{children}</Row>
      <Spacer />
    </section>
  )
}
