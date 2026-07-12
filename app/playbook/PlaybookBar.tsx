"use client"

import { useEffect, useRef, useState } from "react"
import { GUMROAD_CORE, GUMROAD_LITE } from "./links"

// Fixed header bar that impersonates the in-flow section headers: same grid,
// same type scale, same rule, so when a section's header scrolls under it the
// takeover is invisible and the page reads as "the header anchored". Only the
// title text changes as sections pass; the Buy CTAs stay put on the right.
// Scrollspy: the section straddling the bar's own bottom edge is current; no
// section there (hero, final CTA, footer) hides the bar, revealing the normal
// document. No enter/exit animation on purpose: an instant toggle at the exact
// takeover moment is what makes it seamless.
export function PlaybookBar() {
  const [title, setTitle] = useState<string | null>(null)
  const barRef = useRef<HTMLDivElement>(null)
  // Keep the last real title so React never renders an empty heading mid-toggle.
  const lastTitleRef = useRef<string>("")
  if (title) lastTitleRef.current = title

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-pb-title]"))
    if (!sections.length || typeof IntersectionObserver === "undefined") return

    const compute = () => {
      // Takeover line = the bar's own bottom edge: the moment an in-flow header
      // slides under the bar, its section owns the title.
      const bandY = barRef.current?.offsetHeight ?? 56
      let current: HTMLElement | null = null
      for (const s of sections) {
        const r = s.getBoundingClientRect()
        if (r.top <= bandY && r.bottom > bandY) {
          current = s
          break
        }
      }
      setTitle(current ? (current.dataset.pbTitle ?? null) : null)
    }

    // IO fires at section-boundary crossings; geometry is read only then.
    const io = new IntersectionObserver(compute, {
      rootMargin: "0px 0px -85% 0px",
      threshold: 0,
    })
    sections.forEach((s) => io.observe(s))
    compute()

    // scrollend where it exists (Chrome/Firefox, once per gesture); an
    // rAF-coalesced scroll fallback where it doesn't (Safari), so the title
    // can never go stale between IO boundary events.
    let raf = 0
    const onScroll = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0
          compute()
        })
    }
    // Chrome/Firefox expose onscrollend (as null); Safari lacks the property.
    const supportsScrollEnd = typeof window.onscrollend !== "undefined"
    if (supportsScrollEnd) {
      window.addEventListener("scrollend", compute, { passive: true })
    } else {
      window.addEventListener("scroll", onScroll, { passive: true })
    }
    window.addEventListener("resize", compute, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener("scrollend", compute)
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener("resize", compute)
    }
  }, [])

  const shown = title !== null
  const text = title ?? lastTitleRef.current

  return (
    <div
      ref={barRef}
      className="pb-bar fixed top-0 left-0 right-0 z-40"
      data-shown={shown || undefined}
      inert={!shown}
    >
      <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
        {/* Pixel-identical footprint to the in-flow Head (same -mx bleed, py-3,
            rule, grid, type scale) so the takeover is invisible. */}
        <div
          className="-mx-6 lg:-mx-12 px-6 lg:px-12 py-3 border-b rule"
          style={{ backgroundColor: "#f4f1ec" }}
        >
          <div className="relative grid grid-cols-[auto_1fr] xs:grid-cols-[clamp(80px,14vw,140px)_1fr] lg:grid-cols-[140px_1fr] gap-3 xs:gap-6 lg:gap-12 items-baseline">
            <span
              aria-hidden
              className="display accent text-[22px] xs:text-[clamp(20px,4.5vw,26px)] lg:text-3xl font-light leading-none"
            >
              +
            </span>
            {/* Not a heading element: the real h2 lives in the document. */}
            <span
              key={text}
              className="pb-bar-title display ink text-[22px] xs:text-[clamp(20px,4.5vw,26px)] lg:text-3xl font-light tracking-tight leading-none truncate pr-40 sm:pr-72"
            >
              {text}
              <span className="accent">.</span>
            </span>
            <span className="pb-bar-cta">
              <a
                href={GUMROAD_CORE}
                data-gumroad-overlay
                aria-haspopup="dialog"
                className="sh-cta sh-cta-solid"
              >
                Get the playbook · $15
              </a>
              {/* Hidden below 640px via the .pb-bar rule in PlaybookStyle. */}
              <a
                href={GUMROAD_LITE}
                data-gumroad-overlay
                aria-haspopup="dialog"
                className="sh-cta sh-cta-ghost"
              >
                Read 3 free →
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
