import type { ReactNode } from "react"
import { AccordionPage, MotionRoot, type AccordionSection } from "./accordion"
import { SiteFooter, SiteNav } from "./SiteChrome"
import { SITE_NAV } from "./site"
import { WritingStyle } from "./writing/WritingStyle"

type NavHref = (typeof SITE_NAV)[number]["href"]

// The two frames an inner page can sit in. Both are the home page's: paper,
// the fine grain overlay, the sticky top bar, one 1100px column, the sticky
// footer. Lives apart from SiteChrome so that HomePage, which imports the
// footer from there, does not pull the inner pages' stylesheet into its
// client bundle.

// An index page (/projects, /writing, /resume, /hire): the landing page's
// accordion. The closed page is the hero over a list of section heads; a head
// opens its section and glides it to the top bar. `children` is for the
// page's JSON-LD.
export function AccordionShell({
  current,
  hero,
  sections,
  children,
}: {
  current?: NavHref
  hero: ReactNode
  sections: AccordionSection[]
  children?: ReactNode
}) {
  return (
    <>
      <WritingStyle />
      {children}
      <AccordionPage
        nav={<SiteNav current={current} />}
        hero={hero}
        sections={sections}
        footer={<SiteFooter />}
      />
    </>
  )
}

// An article (/writing/[slug]): the same frame around a column of reading,
// with nothing collapsed. The footer is held at the viewport bottom on short
// pages by the flex column.
export function PageShell({ current, children }: { current?: NavHref; children: ReactNode }) {
  return (
    <main className="paper min-h-[100svh]">
      <WritingStyle />
      <MotionRoot>
        <div className="grain relative z-0 flex flex-col min-h-[100svh]">
          <SiteNav current={current} />
          <div className="flex-1 w-full max-w-[1100px] mx-auto px-6 lg:px-12">{children}</div>
          <SiteFooter />
        </div>
      </MotionRoot>
    </main>
  )
}
