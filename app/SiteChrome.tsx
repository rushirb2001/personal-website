import Link from "next/link"
import type { ReactNode } from "react"
import { AUTHOR, SITE_NAV } from "./site"

// The top bar and footer every inner page shares (/projects, /writing,
// /resume, /hire). Before this existed each route had one link, back to the
// home page, so the site was a hub with spokes: nothing but the landing page
// linked to a case study, and no inner page linked to another section. That is
// thin for a visitor and thinner for a crawler, which reads internal links as
// the site's own statement of what matters.
//
// Server components on purpose: no state, no client JS. The tokens they use
// (.mono, .small-caps, .accent-link, ...) come from WritingStyle.

type NavHref = (typeof SITE_NAV)[number]["href"]

export function SiteNav({ current }: { current?: NavHref }) {
  return (
    <nav
      aria-label="Site"
      className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-5 xs:py-6"
    >
      <Link href="/" className="accent-link mono text-[13px] inline-flex items-center gap-1.5">
        <span aria-hidden>&larr;</span> {AUTHOR.name}
      </Link>
      <ul className="flex items-center gap-x-4 xs:gap-x-6 mono small-caps">
        {SITE_NAV.map((item) => {
          const here = item.href === current
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={here ? "page" : undefined}
                className={`accent-link ${here ? "accent" : "muted"}`}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t rule mt-12 xs:mt-16 py-6 xs:py-8 mono text-[11px] flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <Link href="/" className="accent-link muted">
        <span className="faint">&copy; 2026 </span>
        {AUTHOR.name}
      </Link>
      <ul className="flex items-center gap-x-4 small-caps">
        {SITE_NAV.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="accent-link muted">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      {/* Dropped on the narrowest phones: the links matter more than the city. */}
      <span className="small-caps faint hidden sm:inline">{AUTHOR.location}</span>
    </footer>
  )
}

// Page header on the site grid: a small-caps label in the left margin, the h1
// and its deck in the content column, so the headline's left edge is the one
// every row below it uses. Same shape as the writing index's hero.
export function PageHeader({
  label,
  title,
  children,
}: {
  label: string
  title: string
  children?: ReactNode
}) {
  return (
    <header className="grid grid-cols-1 xs:grid-cols-[clamp(80px,14vw,140px)_1fr] lg:grid-cols-[140px_1fr] gap-2 xs:gap-6 lg:gap-12 pt-4 xs:pt-8 lg:pt-10 pb-10 xs:pb-14">
      <p className="mono small-caps faint xs:pt-3">{label}</p>
      <div>
        <h1 className="display font-light tracking-tight leading-[1.08] text-[30px] xs:text-[clamp(34px,5vw,52px)] lg:text-[clamp(30px,3.6vw,44px)] max-w-[30ch]">
          {title}
          <span className="accent">.</span>
        </h1>
        {children}
      </div>
    </header>
  )
}

// A row on the site grid without the article prose scale: keyword (or dates)
// in the left margin, free-form content on the right. Prose.tsx's Row wraps
// its children in .prose, which is right for paragraphs and wrong for a
// resume entry or a list of links.
export function GridRow({
  label,
  children,
  divider = false,
}: {
  label: ReactNode
  children: ReactNode
  divider?: boolean
}) {
  return (
    <div
      className={`grid grid-cols-1 xs:grid-cols-[clamp(80px,14vw,140px)_1fr] lg:grid-cols-[140px_1fr] gap-2 xs:gap-6 lg:gap-12 py-5 xs:py-7 ${
        divider ? "border-b rule" : ""
      }`}
    >
      <div className="mono text-[12px] xs:text-[13px] leading-snug muted xs:pt-[5px]">{label}</div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
