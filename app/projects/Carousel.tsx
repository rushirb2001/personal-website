"use client"

import { useEffect, useState } from "react"

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

    All slides stay mounted and stacked, so videos are already decoded and the
    switch is a true opacity crossfade — no remount, no reload, no flash. */
export function Carousel({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false) // viewer took manual control
  const [hover, setHover] = useState(false)

  const len = slides.length
  const multi = len > 1

  // Slow auto-advance while idle.
  useEffect(() => {
    if (!multi || paused || hover) return
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return
    const t = setInterval(() => setI((j) => (j + 1) % len), AUTO_MS)
    return () => clearInterval(t)
  }, [multi, paused, hover, len])

  if (len === 0) return null

  const idx = Math.min(i, len - 1)
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
      <div className="relative w-full aspect-[4/3] rounded-lg ring-1 ring-black/10 bg-[#faf8f4] overflow-hidden">
        {slides.map((s, k) => (
          <div
            key={s.key}
            aria-hidden={k !== idx}
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-out"
            style={{ opacity: k === idx ? 1 : 0, pointerEvents: k === idx ? "auto" : "none" }}
          >
            {s.node}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-3">
        {multi && (
          <button type="button" onClick={() => go(idx - 1)} aria-label="Previous artifact" className={arrowCls}>
            ‹
          </button>
        )}
        <p className="mono text-[11px] xs:text-[12px] muted leading-relaxed flex-1 min-w-0">{cur.caption}</p>
        {multi && (
          <div className="flex items-center gap-1.5 shrink-0">
            {slides.map((s, k) => (
              <button
                key={s.key}
                type="button"
                onClick={() => jumpTo(k)}
                aria-label={`Show artifact ${k + 1} of ${len}`}
                aria-current={k === idx ? "true" : undefined}
                className="w-1.5 h-1.5 rounded-full transition-colors"
                style={{ backgroundColor: k === idx ? "#1f3a5f" : "rgba(26,26,26,0.22)" }}
              />
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
