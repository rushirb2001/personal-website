import type { ReactNode } from "react"

// The article's structural vocabulary, deliberately identical to the playbook's
// Head + Row pair (see app/playbook/PlaybookPage.tsx). Same grid template, same
// sticky head, same "+" marker and trailing accent period, same left-margin
// label column. A post laid out with these reads as the same document family as
// every other page on the site.

// Sticky section head: anchors at the top of its own section while the content
// scrolls, and the next section's head pushes it out natively. Sections carry
// their spacing as padding-BOTTOM (the <Spacer/> below) so each head sits at
// its section's very top edge and the handoff has no gap.
export function Head({ title }: { title: string }) {
  return (
    <div
      className="sticky top-0 z-30 -mx-6 lg:-mx-12 px-6 lg:px-12 py-3 border-b rule"
      style={{ backgroundColor: "#f4f1ec" }}
    >
      <div className="grid grid-cols-[auto_1fr] xs:grid-cols-[clamp(80px,14vw,140px)_1fr] lg:grid-cols-[140px_1fr] gap-3 xs:gap-6 lg:gap-12 items-baseline">
        <span
          aria-hidden
          className="display accent text-[22px] xs:text-[clamp(20px,4.5vw,26px)] lg:text-3xl font-light leading-none"
        >
          +
        </span>
        <h2 className="display text-[22px] xs:text-[clamp(20px,4.5vw,26px)] lg:text-3xl font-light tracking-tight leading-none">
          {title}
          <span className="accent">.</span>
        </h2>
      </div>
    </div>
  )
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
  /** Left-margin keyword, the playbook's Row label. */
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
