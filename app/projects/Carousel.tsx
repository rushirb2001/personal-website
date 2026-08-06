"use client"

import { useEffect, useRef, useState } from "react"

export type Slide = {
  key: string
  node: React.ReactNode
  caption?: string
}

const AUTO_MS = 5500

// Fallback shape for a slide whose media hasn't reported its size yet (and for
// the dev-only placeholders, which have no intrinsic size at all).
const FALLBACK_AR = 16 / 9
// Ceiling on how tall an artifact may get. A portrait phone screenshot is
// roughly 0.46:1, which at full column width would run past 1500px; capping
// the HEIGHT and letting max-width fall out of it keeps the true ratio while
// stopping one screenshot from owning the whole screen.
const MAX_H = "68svh"

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

  // Intrinsic aspect ratio per slide, read off the media itself rather than
  // declared in the data: the slot used to be a fixed 16/9, so anything shot
  // at a different shape sat in its own letterbox. Measured on load because
  // intrinsic size isn't known until then.
  const [ratios, setRatios] = useState<Record<string, number>>({})
  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return

    const record = (key: string, w: number, h: number) => {
      if (!w || !h) return
      const ar = w / h
      setRatios((prev) => (Math.abs((prev[key] ?? 0) - ar) < 0.001 ? prev : { ...prev, [key]: ar }))
    }

    const measureAll = () => {
      strip.querySelectorAll<HTMLElement>("[data-slide-key]").forEach((pane) => {
        const key = pane.dataset.slideKey
        if (!key) return
        const v = pane.querySelector("video")
        if (v?.videoWidth) return record(key, v.videoWidth, v.videoHeight)
        const img = pane.querySelector("img")
        if (img?.naturalWidth) return record(key, img.naturalWidth, img.naturalHeight)
        // Inline SVG (a diagram) carries its shape in the viewBox.
        const vb = pane.querySelector("svg")?.getAttribute("viewBox")?.split(/[\s,]+/)
        if (vb?.length === 4) record(key, Number(vb[2]), Number(vb[3]))
      })
    }

    measureAll()
    const media = strip.querySelectorAll<HTMLElement>("video, img")
    media.forEach((m) => {
      m.addEventListener("loadedmetadata", measureAll)
      m.addEventListener("load", measureAll)
    })
    return () => {
      media.forEach((m) => {
        m.removeEventListener("loadedmetadata", measureAll)
        m.removeEventListener("load", measureAll)
      })
    }
  }, [seen, len])

  if (len === 0) return null

  const cur = slides[idx]
  const ar = ratios[cur.key] ?? FALLBACK_AR
  const go = (n: number) => {
    setPaused(true)
    setI(((n % len) + len) % len)
  }
  const jumpTo = (k: number) => {
    setPaused(true)
    setI(k)
  }

  // Tonal, not outlined: the case study's whole structure is carried by space
  // and tone rather than rules, so a ringed control would be the only drawn
  // line left on the page.
  const arrowCls =
    "shrink-0 w-7 h-7 grid place-items-center rounded-full bg-[rgba(26,26,26,0.05)] mono text-[15px] leading-none muted hover:text-[#1a1a1a] hover:bg-[rgba(31,58,95,0.09)] transition-colors"

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
      <figure className="m-0">
      {/* The slot takes the ACTIVE artifact's own aspect ratio. max-width is
          derived from the height cap so a tall asset narrows instead of
          being letterboxed or running off the screen; margin-inline keeps it
          centred once it does. */}
      <div
        ref={stripRef}
        className="relative w-full rounded-xl bg-[#eae6df] overflow-hidden mx-auto transition-[aspect-ratio,max-width] duration-500 ease-out"
        style={{
          aspectRatio: String(ar),
          maxWidth: `calc(${MAX_H} * ${ar})`,
        }}
      >
        {slides.map((s, k) => (
          <div
            key={s.key}
            data-slide-key={s.key}
            aria-hidden={k !== idx}
            data-active={k === idx}
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-out"
            style={{ opacity: k === idx ? 1 : 0, pointerEvents: k === idx ? "auto" : "none" }}
          >
            {k === idx || seen.has(k) ? s.node : null}
          </div>
        ))}
      </div>

      {/* Caption and controls are CENTRED under the frame, not pinned to its
          extremes. The media now breaks out past the reading column, so an
          edge-anchored row put the arrows a long way from both the text and
          each other, and read as detached furniture rather than as this
          figure's own controls. Two stacked, centred rows keep the whole
          assembly reading as one object. */}
      <figcaption className="mt-3.5 flex flex-col items-center gap-2.5 text-center">
        {/* Two lines reserved: a shorter caption must not reflow everything
            below mid-crossfade. Centred vertically as well as horizontally,
            which the old items-center row got wrong by pairing a top-aligned
            paragraph with vertically centred arrows. */}
        <p className="mono text-[11px] xs:text-[12px] muted leading-relaxed max-w-[68ch] min-h-[2.6em] flex items-center justify-center">
          {cur.caption}
        </p>
        {multi && (
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => go(idx - 1)} aria-label="Previous artifact" className={arrowCls}>
              ‹
            </button>
            <div className="flex items-center gap-0.5">
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
            <button type="button" onClick={() => go(idx + 1)} aria-label="Next artifact" className={arrowCls}>
              ›
            </button>
          </div>
        )}
      </figcaption>
      </figure>
    </div>
  )
}
