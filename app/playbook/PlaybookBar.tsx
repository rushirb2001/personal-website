"use client"

import { useEffect, useRef, useState } from "react"
import { GUMROAD_CORE, GUMROAD_LITE } from "./links"

// Fixed Buy-CTA overlay. The section headers themselves anchor and hand off
// natively (sticky within contiguous sections, so the next header physically
// pushes the pinned one out, scroll-synchronized by the browser). This overlay
// only keeps the two Buy buttons floating at the top-right over whichever
// header is pinned; it appears when the reader is inside the sections and
// hides in the hero and at the final CTA (no section straddling the band).
export function PlaybookBar() {
  const [active, setActive] = useState(false)
  const stripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-pb-title]"))
    if (!sections.length || typeof IntersectionObserver === "undefined") return

    const compute = () => {
      // A section straddling the pinned header's row means a header is pinned.
      const bandY = stripRef.current?.offsetHeight ?? 56
      const current = sections.some((s) => {
        const r = s.getBoundingClientRect()
        return r.top <= bandY && r.bottom > bandY
      })
      setActive(current)
    }

    // IO fires at section-boundary crossings; geometry is read only then.
    const io = new IntersectionObserver(compute, {
      rootMargin: "0px 0px -85% 0px",
      threshold: 0,
    })
    sections.forEach((s) => io.observe(s))
    compute()

    // scrollend where it exists (Chrome/Firefox, once per gesture); an
    // rAF-coalesced scroll fallback where it doesn't (Safari), so the state
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

  return (
    <div
      ref={stripRef}
      className="pb-bar fixed top-0 left-0 right-0 z-40"
      data-shown={active || undefined}
      inert={!active}
    >
      {/* Same container as the page so the buttons align with the header grid;
          the wrapper is click-through, only the buttons take pointer events. */}
      <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-end gap-2.5 py-3">
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
        </div>
      </div>
    </div>
  )
}
