"use client"

import { useEffect, useRef, useState } from "react"

export type Slide = {
  key: string
  node: React.ReactNode
  caption?: string
}

const AUTO_MS = 5500

/** Restrained, hand-rolled carousel. Prev/next live in the caption row at the
    extremes; dots sit beside them.

    Auto-advances slowly on open so artifacts cycle while the viewer reads. It
    pauses on hover and stops for good once the viewer navigates manually, and
    respects prefers-reduced-motion.

    Slides mount lazily: only the ones that have been shown render their media,
    so a direct visit paints the first slide (an inline-SVG diagram) without
    pulling every video/screenshot into the critical path. Heavy artifacts load
    when the viewer (or auto-advance) first reaches them, then stay mounted so
    revisits are an instant opacity crossfade — no reload, no flash. */
export function Carousel({ slides, frozen = false }: { slides: Slide[]; frozen?: boolean }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false) // viewer took manual control
  const [hover, setHover] = useState(false)
  const stripRef = useRef<HTMLDivElement>(null)
  // Slides whose media has been mounted. Starts with the first slide only, so
  // the initial render (and SSR HTML) carries just one artifact.
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]))

  const len = slides.length
  const multi = len > 1

  // Slow auto-advance while idle. `frozen` holds the current slide in place
  // while something outside (the diagram zoom) is visually anchored to it.
  useEffect(() => {
    if (!multi || paused || hover || frozen) return
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return
    const t = setInterval(() => setI((j) => (j + 1) % len), AUTO_MS)
    return () => clearInterval(t)
  }, [multi, paused, hover, frozen, len])

  const idx = Math.min(i, len - 1)

  // Remember each slide once it becomes active so its media stays mounted,
  // and warm the next slide during the dwell so the upcoming crossfade lands
  // on loaded pixels instead of an empty pane. Still lazy: only visited
  // slides plus one lookahead ever mount.
  useEffect(() => {
    setSeen((prev) => {
      const ahead = (idx + 1) % len
      if (prev.has(idx) && prev.has(ahead)) return prev
      const next = new Set(prev)
      next.add(idx)
      next.add(ahead)
      return next
    })
  }, [idx, len])

  // Only the active slide's video plays; hidden ones would otherwise keep
  // decoding and looping at opacity 0 forever (autoplay also starts videos
  // that mount as the hidden lookahead).
  useEffect(() => {
    stripRef.current?.querySelectorAll("video").forEach((v) => {
      const slide = v.closest<HTMLElement>("[data-active]")
      if (slide?.dataset.active === "true") v.play().catch(() => {})
      else v.pause()
    })
  }, [idx, seen])

  if (len === 0) return null

  const cur = slides[idx]
  const go = (n: number) => {
    setPaused(true)
    setI(((n % len) + len) % len)
  }
  const jumpTo = (k: number) => {
    setPaused(true)
    setI(k)
  }

  const arrowCls =
    "shrink-0 w-7 h-7 grid place-items-center rounded-full ring-1 ring-black/10 mono text-[15px] leading-none muted hover:text-[#1a1a1a] hover:bg-[rgba(31,58,95,0.06)] transition-colors"

  return (
    <div
      tabIndex={multi ? 0 : -1}
      onKeyDown={(e) => {
        if (!multi) return
        if (e.key === "ArrowLeft") go(idx - 1)
        if (e.key === "ArrowRight") go(idx + 1)
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="outline-none"
      aria-roledescription="carousel"
    >
      <div ref={stripRef} className="relative w-full aspect-[4/3] rounded-lg ring-1 ring-black/10 bg-[#faf8f4] overflow-hidden">
        {slides.map((s, k) => (
          <div
            key={s.key}
            aria-hidden={k !== idx}
            data-active={k === idx}
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-out"
            style={{ opacity: k === idx ? 1 : 0, pointerEvents: k === idx ? "auto" : "none" }}
          >
            {k === idx || seen.has(k) ? s.node : null}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-3">
        {multi && (
          <button type="button" onClick={() => go(idx - 1)} aria-label="Previous artifact" className={arrowCls}>
            ‹
          </button>
        )}
        {/* min-height reserves two caption lines so slides with shorter
            captions don't reflow everything below the carousel mid-crossfade. */}
        <p className="mono text-[11px] xs:text-[12px] muted leading-relaxed flex-1 min-w-0 min-h-[3.25em]">{cur.caption}</p>
        {multi && (
          <div className="flex items-center gap-0.5 shrink-0">
            {slides.map((s, k) => (
              // 16px hit area around a 6px visual dot — bare 6px buttons are
              // untappable on touch screens.
              <button
                key={s.key}
                type="button"
                onClick={() => jumpTo(k)}
                aria-label={`Show artifact ${k + 1} of ${len}`}
                aria-current={k === idx ? "true" : undefined}
                className="w-4 h-4 grid place-items-center"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full transition-colors"
                  style={{ backgroundColor: k === idx ? "#1f3a5f" : "rgba(26,26,26,0.22)" }}
                />
              </button>
            ))}
          </div>
        )}
        {multi && (
          <button type="button" onClick={() => go(idx + 1)} aria-label="Next artifact" className={arrowCls}>
            ›
          </button>
        )}
      </div>
    </div>
  )
}
