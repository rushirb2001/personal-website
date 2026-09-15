"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { css, cssEase } from "./motion"

const SECTIONS = [
  { id: "experience", label: "Experience", short: "Exp" },
  { id: "projects", label: "Projects", short: "Proj" },
  { id: "education", label: "Education", short: "Edu" },
  { id: "contact", label: "Contact", short: "Hi" },
]

type Props = {
  active: string | null
  onSelect: (id: string) => void
  onHome: () => void
}

export function TocNav({ active, onSelect, onHome }: Props) {
  const [elevated, setElevated] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => {
      const y = window.scrollY
      setVisible(y > 80)
      setElevated(y > 240)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  // One shared highlight that MORPHS between tabs instead of each tab fading
  // its own background in and out (which read as a blink: two pills at half
  // strength mid-switch). The pill is positioned with translateX + scaleX off a
  // 100px base so the move runs entirely on the compositor; width and left
  // would re-layout the nav on every frame.
  const listRef = useRef<HTMLUListElement>(null)
  const [pill, setPill] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
  // The first activation has no previous tab to travel from: place the pill
  // without a transform transition and only fade it in.
  const [placeInstantly, setPlaceInstantly] = useState(true)
  const hadPillRef = useRef(false)

  useLayoutEffect(() => {
    const ul = listRef.current
    if (!ul) return
    const measure = () => {
      const a = active ? ul.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`) : null
      if (!a) {
        // Keep the last geometry so the fade-out happens in place.
        hadPillRef.current = false
        return
      }
      setPlaceInstantly(!hadPillRef.current)
      hadPillRef.current = true
      setPill({ x: a.offsetLeft, y: a.offsetTop, w: a.offsetWidth, h: a.offsetHeight })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(ul)
    return () => ro.disconnect()
  }, [active])

  useEffect(() => {
    if (!placeInstantly) return
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setPlaceInstantly(false)))
    return () => cancelAnimationFrame(id)
  }, [placeInstantly, pill])

  const handleSelect = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    onSelect(id)
  }

  const handleHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    onHome()
  }

  return (
    <nav
      aria-label="Page sections"
      aria-hidden={!visible}
      // Tailwind v4 translate utilities set the standalone `translate`
      // property (not `transform`), so it must be named in the transition
      // list or the show/hide snaps instead of sliding.
      className={`sticky top-0 z-50 transition-[translate] duration-300 motion-reduce:transition-none ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{
        backgroundColor: "#f4f1ec",
        borderBottom: "1px solid rgba(26,26,26,0.16)",
        transitionTimingFunction: cssEase.reveal,
      }}
    >
      {/* Elevation as a pre-painted shadow layer whose OPACITY fades: a
          box-shadow transition repaints the full-width nav every frame. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none"
        style={{
          boxShadow: "0 6px 24px -10px rgba(0,0,0,0.18)",
          opacity: elevated && visible ? 1 : 0,
        }}
      />
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-12 h-14 flex items-center justify-between gap-2 sm:gap-4">
        <a
          href="/"
          onClick={handleHome}
          className="mono uppercase tracking-[0.15em] muted hover:text-[#1a1a1a] transition-colors flex items-center gap-2 sm:gap-2.5 shrink-0 text-[13px] sm:text-[16px]"
        >
          <span
            aria-hidden
            className={`inline-block text-lg leading-none transition-transform duration-500 ease-out motion-reduce:transition-none ${
              elevated ? "rotate-180" : "rotate-0"
            }`}
          >
            ↓
          </span>
          <span className="hidden sm:inline">Rushir Bhavsar</span>
          <span className="sm:hidden">Rushir</span>
        </a>
        <ul ref={listRef} className="relative flex items-center gap-0.5 sm:gap-2 mono text-[12px] sm:text-[14px]">
          <li
            aria-hidden
            className="toc-pill pointer-events-none absolute left-0 top-0 rounded-sm motion-reduce:transition-none"
            style={{
              width: 100,
              height: pill?.h ?? 0,
              backgroundColor: "rgba(31,58,95,0.10)",
              transformOrigin: "0 0",
              transform: pill ? `translate(${pill.x}px, ${pill.y}px) scaleX(${pill.w / 100})` : "scaleX(0)",
              opacity: active && pill ? 1 : 0,
              transition: placeInstantly ? "opacity 150ms ease" : `transform ${css.ui}, opacity 150ms ease`,
            }}
          />
          {SECTIONS.map((s) => {
            const isActive = active === s.id
            return (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  onClick={(e) => handleSelect(e, s.id)}
                  aria-current={isActive ? "true" : undefined}
                  aria-label={s.label}
                  className={`group relative flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-sm transition-colors duration-200 ${
                    isActive ? "ink" : "muted hover:text-[#1a1a1a]"
                  }`}
                >
                  {/* Always in the layout so activating a tab never shifts its
                      neighbors — only the opacity animates. */}
                  <span
                    aria-hidden
                    className={`accent font-medium leading-none transition-opacity duration-200 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    +
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.short}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
