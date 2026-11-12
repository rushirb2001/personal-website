import Link from "next/link"
import type { ReactNode } from "react"
import { FooterRise } from "./accordion"
import { AUTHOR, HOME_SECTIONS, type HomeSectionId } from "./site"
import { StackIcon } from "./stack-icons"

// The home page's chrome and row vocabulary, as components, for the pages
// that are not the home page: the articles under /writing. Each piece is a
// copy of markup in app/HomePage.tsx or app/TocNav.tsx, class for class, so
// an article reads as part of the same sheet. HomePage itself imports
// SiteFooterBar and CHROME_CSS, so the footer and the hover rules are one
// code path. When the home page's bar, head or row changes, change it here.
//
// Server components. Tokens (.mono, .muted, .accent-link, .footer-cta, ...)
// come from WritingStyle on articles and from HomePage's own <style> at home.

type IconLike = { path: string; viewBox?: string }

// The home page's three-column grid: meta, content, rail.
const GRID =
  "grid grid-cols-1 xs:grid-cols-[clamp(80px,14vw,140px)_1fr_clamp(140px,22vw,240px)] lg:grid-cols-[140px_1fr_240px] gap-3 xs:gap-6 lg:gap-12"

// Rules the chrome needs on every page, interpolated into HomePage's <style>
// and into WritingStyle. They are here, unlayered, for a reason that already
// bit twice: Tailwind v4 emits its utilities inside `@layer utilities`, and
// any unlayered rule beats any layered one. So `muted hover:text-[#1a1a1a]`
// never changed colour (the unlayered .muted won), and an inline
// `backgroundColor` on a section head silenced its `hover:bg-*`. A hover
// state on something a token class colours has to be written here.
export const CHROME_CSS = `
  /* Top bar tabs and footer links: quiet until pointed at or current. */
  .nav-link { color: rgba(26,26,26,0.62); transition: color 200ms ease; }
  .nav-link[aria-current] { color: #1a1a1a; }
  /* A hairline that warms to the accent under the pointer. */
  .rule-hover { transition: background-color 200ms ease, border-color 200ms ease; }
  @media (hover: hover) {
    .nav-link:hover { color: #1a1a1a; }
    .rule-hover:hover { border-color: rgba(31,58,95,0.3); background-color: rgba(31,58,95,0.05); }
  }
  @media (prefers-reduced-motion: reduce) {
    .nav-link, .rule-hover { transition: none; }
  }
`

/** A row's h3, at the size every home page row uses. */
export const ENTRY_TITLE = "display text-[21px] xs:text-[26px] lg:text-3xl font-light tracking-tight leading-tight"
/** The paragraph under a row's h3: mono, as on the home page. */
export const ENTRY_BODY = "leading-relaxed text-[14px] xs:text-[15px] max-w-[58ch] mono"

// ---- Top bar ---------------------------------------------------------------

// The home page's top bar (app/TocNav.tsx) on an article: same height, rule,
// type and tabs, and the tabs are the same five sections, each a link to that
// section's path (/projects). The section the article belongs to carries the
// pill and the "+". Always visible, because there is no hero for it to hide
// behind.
export function SiteNav({ current }: { current?: HomeSectionId }) {
  return (
    <nav
      aria-label="Site"
      className="no-print sticky top-0 z-50"
      style={{ backgroundColor: "#f4f1ec", borderBottom: "1px solid rgba(26,26,26,0.16)" }}
    >
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-12 h-14 flex items-center justify-between gap-2 sm:gap-4">
        <Link
          href="/"
          className="nav-link mono uppercase tracking-[0.15em] flex items-center gap-2 sm:gap-2.5 shrink-0 text-[13px] sm:text-[16px]"
        >
          <span aria-hidden className="inline-block text-lg leading-none">
            &larr;
          </span>
          <span className="hidden sm:inline">{AUTHOR.name}</span>
          <span className="sm:hidden">{AUTHOR.name.split(" ")[0]}</span>
        </Link>
        <ul className="flex items-center gap-0.5 sm:gap-2 mono text-[12px] sm:text-[14px]">
          {HOME_SECTIONS.map((s) => {
            const here = s.id === current
            return (
              <li key={s.id} className="shrink-0">
                <Link
                  href={`/${s.id}`}
                  aria-current={here ? "true" : undefined}
                  className="nav-link flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-sm"
                  style={here ? { backgroundColor: "rgba(31,58,95,0.10)" } : undefined}
                >
                  {/* sm+ only, and always in the layout there, so the tabs sit
                      at the same spacing whichever one is current. Phones have
                      no room for five slots; the pill marks the tab. */}
                  <span
                    aria-hidden
                    className={`hidden sm:inline accent font-medium leading-none ${here ? "" : "opacity-0"}`}
                  >
                    +
                  </span>
                  {/* Phones show the short label, but the tab is still NAMED by
                      the full one: the short text is hidden from assistive
                      tech and the full label rides along visually hidden. An
                      aria-label would do the same job and fail the rule that
                      a control's name must contain its visible text ("Hi" is
                      not in "Contact"). */}
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden" aria-hidden>
                    {s.short}
                  </span>
                  <span className="sr-only sm:hidden">{s.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

// ---- Footer ----------------------------------------------------------------

// The footer bar: the name on the left, the city on the right. It carries no
// links: the top bar is the site's navigation, and a second copy of it at the
// other edge of the screen was only noise.
export function SiteFooterBar() {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="muted whitespace-nowrap">
        <span className="faint">&copy; 2026 </span>
        {AUTHOR.name}
      </p>
      <p className="small-caps faint whitespace-nowrap">
        <span className="accent">+</span> {AUTHOR.location}
      </p>
    </div>
  )
}

// Sticky at the viewport bottom, full-bleed rule, exactly as on the home page.
export function SiteFooter() {
  return (
    <footer className="no-print sticky bottom-0 z-50 mt-10 xs:mt-14">
      <div className="border-t rule" style={{ backgroundColor: "#f4f1ec" }}>
        <FooterRise className="max-w-[1100px] mx-auto px-6 lg:px-12 py-5 xs:py-6 mono text-[11px]">
          <SiteFooterBar />
        </FooterRise>
      </div>
    </footer>
  )
}

// ---- Sections and rows -----------------------------------------------------

// The home page's section head as a static bar, for article pages: full-bleed
// rule, "+" in the meta column, the title with its accent period, an optional
// count in the rail column. Sticks under the top bar, and the next section's
// head pushes it out. On the home page the head is the accordion's button
// (Section in ./accordion), which is this same markup.
export function SectionHead({ title, count }: { title: string; count?: number }) {
  return (
    <div
      className="sticky top-14 z-30 -mx-6 lg:-mx-12 px-6 lg:px-12 py-3 border-b rule"
      style={{ backgroundColor: "#f4f1ec" }}
    >
      <div className="grid grid-cols-[auto_1fr_auto] xs:grid-cols-[clamp(80px,14vw,140px)_1fr_clamp(140px,22vw,240px)] lg:grid-cols-[140px_1fr_240px] gap-3 xs:gap-6 lg:gap-12 items-baseline">
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
        {count != null ? (
          <span className="mono text-[12px] xs:text-[13px] faint text-right tracking-[0.18em]">
            {String(count).padStart(2, "0")}
          </span>
        ) : (
          <span aria-hidden />
        )}
      </div>
    </div>
  )
}

// A head and its content. The spacing is padding on an inner wrapper, not on
// the <section>: a sticky head is constrained to its section's box, so the
// box has to end where the content ends for the next head to take over
// without a gap.
export function PageSection({
  title,
  count,
  children,
}: {
  title: string
  count?: number
  children: ReactNode
}) {
  return (
    <section>
      <SectionHead title={title} count={count} />
      <div className="pt-4 xs:pt-6 pb-14 xs:pb-20">{children}</div>
    </section>
  )
}

const ROW_SPACING = {
  // Experience, Education and Contact rows on the home page.
  roomy: "py-5 xs:py-8 lg:py-10 first:pt-2 xs:first:pt-4 lg:first:pt-6",
  // Projects and Writing rows on the home page.
  dense: "py-4 xs:py-6 lg:py-8 first:pt-2 xs:first:pt-3 lg:first:pt-4",
} as const

// One row of the home page's lists: meta in the left margin, the h3 and copy
// in the middle, link chips in the right rail. Without a rail the content
// takes both columns. Rows rule themselves off from the next one.
export function EntryRow({
  meta,
  children,
  rail,
  spacing = "roomy",
  as: Tag = "li",
}: {
  meta: ReactNode
  children: ReactNode
  rail?: ReactNode
  spacing?: keyof typeof ROW_SPACING
  as?: "li" | "div"
}) {
  return (
    <Tag className={`${GRID} ${ROW_SPACING[spacing]} border-b rule last:border-b-0`}>
      <div className="mono text-[12px] xs:text-[13px] leading-snug ink flex xs:flex-col items-baseline xs:items-start gap-x-3 gap-y-1.5 xs:pt-[6px] lg:pt-[8px]">
        {meta}
      </div>
      <div className={rail ? "min-w-0" : "min-w-0 xs:col-span-2"}>{children}</div>
      {rail && <div className="space-y-3 xs:space-y-6 xs:pt-2 lg:pt-[10px]">{rail}</div>}
    </Tag>
  )
}

export type ChipLink = {
  /** Short: a chip never wraps, and the rail is 140px wide on a small tablet. */
  label: string
  href: string
  /** GA4 lead_click name (see GoogleAnalytics.tsx). */
  lead?: string
  icon?: IconLike
  download?: boolean
}

// The tinted outline chip every link off a row uses on the home page.
function Chip({ link }: { link: ChipLink }) {
  const icon = link.icon && <StackIcon icon={link.icon} className="w-3 h-3 shrink-0" />
  if (link.href.startsWith("/") && !/\.[a-z0-9]+$/i.test(link.href)) {
    return (
      <Link href={link.href} className="footer-cta mono" data-lead={link.lead}>
        {icon}
        {link.label} <span aria-hidden>&rarr;</span>
      </Link>
    )
  }
  const external = link.href.startsWith("http")
  const mail = link.href.startsWith("mailto:")
  return (
    <a
      href={link.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      download={link.download}
      className="footer-cta mono"
      data-lead={link.lead}
    >
      {icon}
      {link.label}
      {!mail && <span aria-hidden>{link.download ? "↓" : "↗"}</span>}
    </a>
  )
}

// A row's chips: a wrapping line on phones, a column from 475px up.
export function ChipList({ links }: { links: ChipLink[] }) {
  if (links.length === 0) return null
  return (
    <ul className="flex flex-row flex-wrap xs:flex-col xs:items-start gap-2">
      {links.map((l) => (
        <li key={l.href + l.label}>
          <Chip link={l} />
        </li>
      ))}
    </ul>
  )
}
