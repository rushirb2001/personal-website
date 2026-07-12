"use client"

import { useEffect, useRef } from "react"
import { GUMROAD_CORE, GUMROAD_LITE } from "./links"

// Sticky section header: it anchors at the top of the viewport while its content
// scrolls beneath it (the landing page's anchoring, without the collapse). While
// the header is anchored, the two Buy CTAs slide in on the right so checkout is
// always one click away as the reader moves through the page. A zero-height
// sentinel just above the header (carrying the section's top margin) reports the
// anchored state via IntersectionObserver. The observer toggles the data-stuck
// attribute directly on the DOM rather than through React state, so crossing a
// section boundary mid-scroll doesn't trigger a re-render (that re-render was a
// per-boundary "speed bump"). Styling lives in PlaybookStyle.
export function StickyHead({ title, tight }: { title: string; tight?: boolean }) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    const header = headerRef.current
    if (!sentinel || !header || typeof IntersectionObserver === "undefined") return
    const io = new IntersectionObserver(
      ([entry]) => header.toggleAttribute("data-stuck", !entry.isIntersecting),
      { threshold: 0 },
    )
    io.observe(sentinel)
    return () => io.disconnect()
  }, [])

  return (
    <>
      <div
        ref={sentinelRef}
        aria-hidden
        className={`${tight ? "mt-4 xs:mt-6" : "mt-14 xs:mt-20"} h-0`}
      />
      <div
        ref={headerRef}
        className="stickhead sticky top-0 z-30 -mx-6 lg:-mx-12 px-6 lg:px-12 py-3 border-b rule"
        style={{ backgroundColor: "#f4f1ec" }}
      >
        <div className="stickhead-grid relative grid grid-cols-[auto_1fr] xs:grid-cols-[clamp(80px,14vw,140px)_1fr] lg:grid-cols-[140px_1fr] gap-3 xs:gap-6 lg:gap-12 items-baseline">
          <span className="display accent text-[22px] xs:text-[clamp(20px,4.5vw,26px)] lg:text-3xl font-light leading-none">
            +
          </span>
          <h2 className="display text-[22px] xs:text-[clamp(20px,4.5vw,26px)] lg:text-3xl font-light tracking-tight leading-none">
            {title}
            <span className="accent">.</span>
          </h2>
          {/* Buy CTAs, revealed on the right while the header is anchored.
              Desktop only — phones/tablets keep the CTAs in the hero and pricing. */}
          <div className="stickhead-cta hidden lg:flex">
            <a href={GUMROAD_CORE} data-gumroad-overlay className="sh-cta sh-cta-solid">
              Get the playbook · $15
            </a>
            <a href={GUMROAD_LITE} data-gumroad-overlay className="sh-cta sh-cta-ghost">
              Read 3 projects free →
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
