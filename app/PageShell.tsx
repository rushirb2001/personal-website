import type { ReactNode } from "react"
import { SiteFooter, SiteNav } from "./SiteChrome"
import { SITE_NAV } from "./site"
import { WritingStyle } from "./writing/WritingStyle"

// The frame every inner page sits in, laid out like the home page's: paper,
// the fine grain overlay, the sticky top bar, one 1100px column, and the
// sticky footer held at the viewport bottom on short pages by the flex
// column. Lives apart from SiteChrome so that HomePage, which imports the
// footer from there, does not pull the inner pages' stylesheet into its
// client bundle.
export function PageShell({
  current,
  children,
}: {
  current?: (typeof SITE_NAV)[number]["href"]
  children: ReactNode
}) {
  return (
    <main className="paper min-h-[100svh]">
      <WritingStyle />
      <div className="grain relative z-0 flex flex-col min-h-[100svh]">
        <SiteNav current={current} />
        <div className="flex-1 w-full max-w-[1100px] mx-auto px-6 lg:px-12">{children}</div>
        <SiteFooter />
      </div>
    </main>
  )
}
