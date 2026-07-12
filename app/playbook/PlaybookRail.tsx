"use client"

import { useEffect, useRef, useState } from "react"

// Minimal page map: a fixed rail of tick lines in the left margin, one per
// section (long line) and one per subsection h3 (short line). Lines fill with
// the accent as the reader scrolls past them; the current one stretches. On
// load, before anything has been passed, the first line is highlighted so the
// rail always shows a position. No labels or hover chrome, just the ticks
// (each button still carries its section name for assistive tech, and clicking
// a tick scrolls to its section). Desktop + hover devices only.
type Entry = { label: string; depth: 0 | 1 }

export function PlaybookRail() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [pos, setPos] = useState<{ current: number; passed: number }>({ current: 0, passed: 0 })
  const elsRef = useRef<HTMLElement[]>([])

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-pb-title]"))
    if (!sections.length) return
    const list: { label: string; depth: 0 | 1; el: HTMLElement }[] = []
    for (const s of sections) {
      list.push({ label: s.dataset.pbTitle ?? "", depth: 0, el: s })
      for (const h of Array.from(s.querySelectorAll<HTMLElement>("h3"))) {
        const label = (h.textContent ?? "").replace("[Core]", "").trim()
        if (label) list.push({ label, depth: 1, el: h })
      }
    }
    elsRef.current = list.map((e) => e.el)
    setEntries(list.map(({ label, depth }) => ({ label, depth })))

    const compute = () => {
      // An entry is "passed" once its top clears the pinned-header band. When
      // nothing has been passed yet (page load, hero), the first entry is
      // highlighted as current so the rail always shows a position.
      const bandY = 96
      let passed = 0
      list.forEach((e, i) => {
        if (e.el.getBoundingClientRect().top <= bandY) passed = i + 1
      })
      const current = Math.max(passed - 1, 0)
      setPos((prev) => (prev.current === current && prev.passed === passed ? prev : { current, passed }))
    }

    // Same tracking recipe as PlaybookBar: IO at boundary crossings, scrollend
    // where supported, rAF-coalesced scroll fallback where not (Safari), resize.
    const io = new IntersectionObserver(compute, { rootMargin: "0px 0px -85% 0px", threshold: 0 })
    list.forEach((e) => io.observe(e.el))
    compute()
    let raf = 0
    const onScroll = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0
          compute()
        })
    }
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

  if (!entries.length) return null

  return (
    <nav className="pb-rail" aria-label="On this page">
      {entries.map((e, i) => (
        <button
          key={`${e.label}-${i}`}
          type="button"
          aria-label={e.label}
          className={`pb-rail-item${e.depth === 1 ? " is-sub" : ""}${
            i < pos.passed ? " is-passed" : ""
          }${i === pos.current ? " is-current" : ""}`}
          // scroll-padding-top (set on html) keeps the target clear of the
          // pinned header; global scroll-behavior handles the smoothness.
          onClick={() => elsRef.current[i]?.scrollIntoView()}
        >
          <span className="pb-rail-line" aria-hidden />
        </button>
      ))}
    </nav>
  )
}
