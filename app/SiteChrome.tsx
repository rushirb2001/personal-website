import Link from "next/link"
import type { ReactNode } from "react"
import { AUTHOR, RESUME_PDF, SITE_NAV } from "./site"
import { DOCUMENT_ICON, GITHUB_ICON, LINKEDIN_ICON, STACK_ICONS, StackIcon } from "./stack-icons"

// The landing page's vocabulary, as components, for every other page
// (/projects, /writing, /resume, /hire). Each piece here is a copy of the
// markup in app/HomePage.tsx or app/TocNav.tsx, class for class: the same top
// bar, the same section head, the same three-column row, the same pills and
// link chips, the same sticky footer. An inner page built from these reads as
// an open section of the home page, which is the point. When the home page's
// row or head changes, change it here too.
//
// No state and no client JS: these render on the server. The one client
// consumer is HomePage, which imports SiteFooterBar so the two footers are
// the same code. Tokens (.mono, .muted, .accent-link, .footer-cta, ...) come
// from WritingStyle on inner pages and from HomePage's own <style> at home.

type NavHref = (typeof SITE_NAV)[number]["href"]
type IconLike = { path: string; viewBox?: string }

// The home page's three-column grid: meta, content, rail.
const GRID =
  "grid grid-cols-1 xs:grid-cols-[clamp(80px,14vw,140px)_1fr_clamp(140px,22vw,240px)] lg:grid-cols-[140px_1fr_240px] gap-3 xs:gap-6 lg:gap-12"

/** A row's h3, at the size every home page row uses. */
export const ENTRY_TITLE = "display text-[21px] xs:text-[26px] lg:text-3xl font-light tracking-tight leading-tight"
/** The paragraph under a row's h3: mono, as on the home page. */
export const ENTRY_BODY = "leading-relaxed text-[14px] xs:text-[15px] max-w-[58ch] mono"

// ---- Top bar ---------------------------------------------------------------

// TocNav's bar (app/TocNav.tsx) with the site's routes in place of the home
// page's sections: same height, rule, type and tab shape, and the current
// page carries the tinted pill and the "+" that the open section carries at
// home. Always visible, because there is no hero here for it to hide behind.
export function SiteNav({ current }: { current?: NavHref }) {
  return (
    <nav
      aria-label="Site"
      className="no-print sticky top-0 z-50"
      style={{ backgroundColor: "#f4f1ec", borderBottom: "1px solid rgba(26,26,26,0.16)" }}
    >
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-12 h-14 flex items-center justify-between gap-2 sm:gap-4">
        <Link
          href="/"
          className="mono uppercase tracking-[0.15em] muted hover:text-[#1a1a1a] transition-colors flex items-center gap-2 sm:gap-2.5 shrink-0 text-[13px] sm:text-[16px]"
        >
          <span aria-hidden className="inline-block text-lg leading-none">
            &larr;
          </span>
          <span className="hidden sm:inline">{AUTHOR.name}</span>
          <span className="sm:hidden">{AUTHOR.name.split(" ")[0]}</span>
        </Link>
        <ul className="flex items-center gap-0.5 sm:gap-2 mono text-[12px] sm:text-[14px]">
          {SITE_NAV.map((item) => {
            const here = item.href === current
            return (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  aria-current={here ? "page" : undefined}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-sm transition-colors duration-200 ${
                    here ? "ink" : "muted hover:text-[#1a1a1a]"
                  }`}
                  style={here ? { backgroundColor: "rgba(31,58,95,0.10)" } : undefined}
                >
                  {/* Always in the layout, as on the home page, so the tabs sit
                      at the same spacing whichever one is current. */}
                  <span aria-hidden className={`accent font-medium leading-none ${here ? "" : "opacity-0"}`}>
                    +
                  </span>
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">{item.short}</span>
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

// The three things in the footer bar. Shared with HomePage, which wraps them
// in its own animated container. "Hire me" is the chip because it is the
// action; the rest are plain links. Phones keep just the last two: the others
// are in the top bar (or, at home, in the sections above).
export function SiteFooterBar() {
  return (
    <>
      <p className="muted whitespace-nowrap">
        <span className="faint">&copy; 2026 </span>
        {AUTHOR.name}
      </p>
      <nav aria-label="Footer">
        <ul className="flex items-center gap-x-4 small-caps">
          {SITE_NAV.map((item) =>
            item.href === "/hire" ? (
              <li key={item.href}>
                <Link href={item.href} className="footer-cta mono">
                  {item.label}
                </Link>
              </li>
            ) : (
              <li key={item.href} className={item.href === "/resume" ? undefined : "hidden xs:block"}>
                <Link href={item.href} className="accent-link muted">
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>
      <p className="small-caps faint whitespace-nowrap hidden md:block">
        <span className="accent">+</span> {AUTHOR.location}
      </p>
    </>
  )
}

// Sticky at the viewport bottom, full-bleed rule, exactly as on the home page.
export function SiteFooter() {
  return (
    <footer className="no-print sticky bottom-0 z-50 mt-10 xs:mt-14">
      <div className="border-t rule" style={{ backgroundColor: "#f4f1ec" }}>
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12 py-5 xs:py-6 mono text-[11px] flex items-center justify-between gap-4">
          <SiteFooterBar />
        </div>
      </div>
    </footer>
  )
}

// ---- Hero ------------------------------------------------------------------

// The home hero's shape without the photo: a large light headline with the
// accent period at the container's left edge, the deck under it in the
// display face, and a right column that lines up with the rows' rail, holding
// what the home page puts under the photo ("+" facts) and the page's actions.
export function PageHero({
  title,
  children,
  aside,
}: {
  title: string
  children: ReactNode
  aside?: ReactNode
}) {
  return (
    <header className="pt-8 xs:pt-10 lg:pt-14 pb-8 xs:pb-10 lg:pb-14">
      <h1 className="display font-light tracking-tight text-balance leading-[1.02] sm:leading-[0.98] text-[clamp(30px,9.4vw,40px)] sm:text-[clamp(40px,6vw,64px)] max-w-[22ch]">
        {title}
        <span className="accent">.</span>
      </h1>
      <div className="mt-5 sm:mt-7 lg:mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px] gap-6 lg:gap-12 items-start">
        <div className="display font-light text-[16px] sm:text-[clamp(16px,1.7vw,20px)] leading-[1.5] max-w-[52ch]">
          {children}
        </div>
        {aside && <div>{aside}</div>}
      </div>
    </header>
  )
}

// The mono "+ fact" lines the home page sets under the photo.
export function HeroFacts({ items }: { items: ReactNode[] }) {
  return (
    // Negative word-spacing: mono spaces are full character cells, so the
    // gaps between words read double-wide (same fix as the home hero).
    <div className="mono text-[13px] muted leading-[1.7] [word-spacing:-0.5ch]">
      {items.map((item, i) => (
        <p key={i}>
          <span className="accent">+</span> {item}
        </p>
      ))}
    </div>
  )
}

// ---- Sections and rows -----------------------------------------------------

// The home page's section head: full-bleed rule, "+" in the meta column, the
// title with its accent period, an optional count in the rail column. Sticks
// under the top bar, and the next section's head pushes it out.
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
  // Selected Projects rows on the home page.
  dense: "py-4 xs:py-6 lg:py-8 first:pt-2 xs:first:pt-3 lg:first:pt-4",
  // Label and value rows (facts, skill groups), which have no h3 to space.
  compact: "py-3.5 xs:py-5 first:pt-2 xs:first:pt-3",
} as const

// One row of the home page's lists: meta in the left margin, the h3 and copy
// in the middle, pills and link chips in the right rail. Without a rail the
// content takes both columns. Rows rule themselves off from the next one.
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

// Stack pills: outlined, fully rounded, with the technology's mark where the
// icon set has one (see stack-icons.tsx).
export function Pills({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5 mono text-[12px] xs:text-[13px]">
      {items.map((s) => (
        <li key={s} className="muted inline-flex items-center gap-1.5 rounded-full border rule px-2.5 py-1">
          {STACK_ICONS[s] && <StackIcon icon={STACK_ICONS[s]} className="w-3 h-3 shrink-0" />}
          {s}
        </li>
      ))}
    </ul>
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

const CHIP_STACK = {
  // In a row's rail: a wrapping line on phones, a column from 475px up.
  xs: "flex flex-row flex-wrap xs:flex-col xs:items-start gap-2",
  // In the hero's right column, which only exists from 1024px up.
  lg: "flex flex-row flex-wrap lg:flex-col lg:items-start gap-2",
} as const

export function ChipList({
  links,
  stackFrom = "xs",
  className = "",
}: {
  links: ChipLink[]
  stackFrom?: keyof typeof CHIP_STACK
  className?: string
}) {
  if (links.length === 0) return null
  return (
    <ul className={`${CHIP_STACK[stackFrom]} ${className}`}>
      {links.map((l) => (
        <li key={l.href + l.label}>
          <Chip link={l} />
        </li>
      ))}
    </ul>
  )
}

// A rail's links: the hairline the home page draws between a row's pills and
// its chips, then the chips.
export function RailLinks({ links }: { links: ChipLink[] }) {
  if (links.length === 0) return null
  return (
    <div>
      <div className="hidden xs:block border-t rule mb-3 xs:mb-4" />
      <ChipList links={links} />
    </div>
  )
}

// ---- Contact ---------------------------------------------------------------

export const PROFILE_CHIPS: ChipLink[] = [
  { label: "linkedin", href: AUTHOR.linkedin, lead: "linkedin", icon: LINKEDIN_ICON },
  { label: "github", href: AUTHOR.github, lead: "github", icon: GITHUB_ICON },
  { label: "resume", href: RESUME_PDF, lead: "resume_pdf", icon: DOCUMENT_ICON },
]

// The home page's Contact section, which is how that page ends, so it is how
// every inner page ends too: status in the margin, a line and the address in
// the middle, the profile chips in the rail.
export function ContactSection({
  heading,
  children,
  links = PROFILE_CHIPS,
}: {
  heading: string
  children: ReactNode
  links?: ChipLink[]
}) {
  return (
    <PageSection title="Contact">
      <EntryRow
        as="div"
        meta={
          <>
            <span className="accent">Open to work</span>
            <span className="muted">{AUTHOR.location}</span>
          </>
        }
        rail={<ChipList links={links} />}
      >
        <h3 className={ENTRY_TITLE}>
          {heading}
          <span className="accent">.</span>
        </h3>
        <p className={`${ENTRY_BODY} mt-2 xs:mt-5`}>{children}</p>
        <p className={`${ENTRY_BODY} mt-3 xs:mt-4`}>
          Please reach out to{" "}
          <a href={`mailto:${AUTHOR.email}`} className="accent-link accent" data-lead="email">
            {AUTHOR.email}
          </a>
        </p>
      </EntryRow>
    </PageSection>
  )
}
