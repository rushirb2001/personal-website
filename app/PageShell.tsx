import type { ReactNode } from "react"
import { MotionRoot } from "./accordion"
import { SiteFooter, SiteNav } from "./SiteChrome"
import type { HomeSectionId } from "./site"
import { WritingStyle } from "./writing/WritingStyle"

// The frame an article sits in, which is the home page's: paper, the fine
// grain overlay, the sticky top bar, one 1100px column, and the sticky footer
// held at the viewport bottom on short pages by the flex column. `current` is
// the home section the page belongs to; its tab is marked in the bar.
//
// Lives apart from SiteChrome so that HomePage, which imports the footer from
// there, does not pull the article stylesheet into its client bundle.
export function PageShell({ current, children }: { current?: HomeSectionId; children: ReactNode }) {
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
