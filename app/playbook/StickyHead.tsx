"use client"

import { useEffect, useRef, useState } from "react"

// Sticky section header: it anchors at the top of the viewport while its
// content scrolls beneath it (the landing page's anchoring behaviour, without
// the accordion collapse). While the header is anchored, its "+" marker glides
// from the left to the right edge of the header; it slides back when the header
// releases. A zero-height sentinel just above the header (carrying the section's
// top margin) reports the anchored state via IntersectionObserver — no scroll
// listeners. Styling for .stickhead / .stickhead-mark lives in the page's
// <style> block (PlaybookStyle).
export function StickyHead({
  title,
  count,
  tight,
}: {
  title: string
  count?: number
  tight?: boolean
}) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || typeof IntersectionObserver === "undefined") return
    const io = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting), {
      threshold: 0,
    })
    io.observe(el)
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
        data-stuck={stuck || undefined}
        className="stickhead sticky top-0 z-30 -mx-6 lg:-mx-12 px-6 lg:px-12 py-3 border-b rule"
        style={{ backgroundColor: "#f4f1ec" }}
      >
        <div className="stickhead-grid grid grid-cols-[auto_1fr_auto] xs:grid-cols-[clamp(80px,14vw,140px)_1fr_clamp(140px,22vw,240px)] lg:grid-cols-[140px_1fr_240px] gap-3 xs:gap-6 lg:gap-12 items-baseline">
          {/* placeholder keeps the title aligned to the content column; the real
              marker is an absolute overlay so it can travel across the header */}
          <span aria-hidden />
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
          <span
            aria-hidden
            className="stickhead-mark display accent text-[22px] xs:text-[clamp(20px,4.5vw,26px)] lg:text-3xl font-light leading-none"
          >
            +
          </span>
        </div>
      </div>
    </>
  )
}
