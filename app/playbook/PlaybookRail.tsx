"use client"

import { useEffect, useRef, useState } from "react"

// Minimal page map: a fixed rail of tick lines in the left margin, one per
// section (long line) and one per subsection h3 (short line). Lines fill with
// the accent as the reader scrolls past them; hovering the rail (or focusing
// a line) reveals the names. Desktop + hover devices only, it is a secondary
// affordance. Entries are derived from the DOM ([data-pb-title] wrappers and
// their h3s), so new sections appear on the rail automatically.
type Entry = { label: string; depth: 0 | 1 }

// Same falloff profile as the project modal's EdgeBlur, applied to-right.
const VEIL_LAYERS = [
  { blur: 0.5, mid: 65, end: 100 },
  { blur: 1, mid: 50, end: 80 },
  { blur: 2, mid: 35, end: 60 },
  { blur: 4, mid: 20, end: 42 },
  { blur: 8, mid: 8, end: 28 },
]

export function PlaybookRail() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [pos, setPos] = useState<{ current: number; passed: number }>({ current: -1, passed: 0 })
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
      // An entry is "passed" once its top clears the pinned-header band.
      const bandY = 96
      let passed = 0
      list.forEach((e, i) => {
        if (e.el.getBoundingClientRect().top <= bandY) passed = i + 1
      })
      const current = passed - 1
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
      {/* Progressive blur veil behind the whole rail while hovered, the same
          stacked backdrop-filter technique as the project modal's edge blur
          (ProjectModal.tsx EdgeBlur), run horizontally: strong at the rail,
          dissolving toward the content. */}
      <span className="pb-rail-veil" aria-hidden>
        {VEIL_LAYERS.map(({ blur, mid, end }, k) => {
          const mask = `linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${mid}%, rgba(0,0,0,0) ${end}%)`
          return (
            <span
              key={k}
              style={{
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
                WebkitMaskImage: mask,
                maskImage: mask,
              }}
            />
          )
        })}
      </span>
      {entries.map((e, i) => (
        <button
          key={`${e.label}-${i}`}
          type="button"
          className={`pb-rail-item${e.depth === 1 ? " is-sub" : ""}${
            i < pos.passed ? " is-passed" : ""
          }${i === pos.current ? " is-current" : ""}`}
          // scroll-padding-top (set on html) keeps the target clear of the
          // pinned header; global scroll-behavior handles the smoothness.
          onClick={() => elsRef.current[i]?.scrollIntoView()}
        >
          <span className="pb-rail-line" aria-hidden />
          <span className="pb-rail-label display">{e.label}</span>
        </button>
      ))}
    </nav>
  )
}
