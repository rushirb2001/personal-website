"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import type { ProjectDetail, ProjectLink } from "./projects-data"
import { ArchitectureDiagram } from "./ArchitectureDiagram"
import { Carousel, type Slide } from "./Carousel"

// Exit-animation duration; navigation is deferred this long so the card can
// animate out before the route changes. Keep in sync with the CSS below.
const EXIT_MS = 240

export function ProjectModal({
  detail,
  mode = "standalone",
}: {
  detail: ProjectDetail
  mode?: "overlay" | "standalone"
}) {
  const router = useRouter()
  const cardRef = useRef<HTMLDivElement>(null)
  const [closing, setClosing] = useState(false)
  const closingRef = useRef(false)
  // Enlarged view of the architecture diagram, shown over the card. Only the
  // diagram is zoomable — result clips and screenshots are not.
  const [zoomed, setZoomed] = useState(false)
  // Geometry-tracking zoom: capture the clicked thumbnail's on-screen rect, then
  // a FLIP transition grows the full-size diagram out of that exact box (and
  // shrinks it back into it on close).
  const sourceRectRef = useRef<DOMRect | null>(null)
  const zoomStageRef = useRef<HTMLDivElement>(null)
  const zoomBusyRef = useRef(false)

  const prefersReduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

  // Translate+scale that maps the full-size stage back onto the source rect,
  // anchored at the stage's top-left (transform-origin: 0 0).
  const flipFromSource = (stage: HTMLElement): string | null => {
    const src = sourceRectRef.current
    if (!src) return null
    const svg = stage.querySelector("svg") ?? stage
    const tgt = svg.getBoundingClientRect()
    if (!tgt.width || !tgt.height) return null
    const sx = src.width / tgt.width
    const sy = src.height / tgt.height
    const dx = src.left - tgt.left
    const dy = src.top - tgt.top
    return `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`
  }

  const openZoom = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const svg = e.currentTarget.querySelector("svg")
    sourceRectRef.current = (svg ?? e.currentTarget).getBoundingClientRect()
    setZoomed(true)
  }, [])

  const closeZoom = useCallback(() => {
    const stage = zoomStageRef.current
    if (!stage || zoomBusyRef.current || prefersReduced()) {
      setZoomed(false)
      return
    }
    const from = flipFromSource(stage)
    if (!from) {
      setZoomed(false)
      return
    }
    zoomBusyRef.current = true
    stage.style.transformOrigin = "0 0"
    const anim = stage.animate(
      [
        { transform: "none", opacity: 1 },
        { transform: from, opacity: 0.5 },
      ],
      { duration: 240, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" },
    )
    anim.onfinish = () => {
      zoomBusyRef.current = false
      setZoomed(false)
    }
  }, [])

  // Grow the stage out of the captured thumbnail rect when the zoom opens.
  useLayoutEffect(() => {
    if (!zoomed) return
    const stage = zoomStageRef.current
    if (!stage || prefersReduced()) return
    const from = flipFromSource(stage)
    if (!from) return
    stage.style.transformOrigin = "0 0"
    const anim = stage.animate(
      [
        { transform: from, opacity: 0.5 },
        { transform: "none", opacity: 1 },
      ],
      { duration: 320, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    )
    return () => anim.cancel()
  }, [zoomed])

  // "overlay": opened over the still-mounted home page via an intercepting
  // route — closing pops the overlay and reveals home exactly as it was.
  // "standalone": a direct or shared-link visit — closing goes to the home page.
  // Flip into the "closing" state to play the exit animation, then navigate
  // once it has finished. Guarded so it only fires once.
  const close = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    setClosing(true)
    window.setTimeout(() => {
      if (mode === "overlay") router.back()
      else router.push("/")
    }, EXIT_MS)
  }, [mode, router])

  // Esc backs out of the zoom first (with its shrink animation), then the modal.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      if (zoomed) closeZoom()
      else close()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [zoomed, close, closeZoom])

  useEffect(() => {
    cardRef.current?.focus()
    // Lock page scroll. Reserve the now-hidden scrollbar's width as padding so
    // the page behind the modal doesn't shift when the scrollbar unmounts
    // (and shift back on close).
    const body = document.body
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth
    const prevOverflow = body.style.overflow
    const prevPaddingRight = body.style.paddingRight
    body.style.overflow = "hidden"
    if (scrollbarW > 0) body.style.paddingRight = `${scrollbarW}px`
    return () => {
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPaddingRight
    }
  }, [])

  const isPrivate = detail.repoStatus === "private"
  const { artifacts, verify } = detail
  const showTodos = process.env.NODE_ENV !== "production"

  const diagram = artifacts.diagram

  const mail = (to: string, subject: string) =>
    `mailto:${to}?subject=${encodeURIComponent(subject)}`

  // Links shown just below the description, styled like the site's section links.
  const heroLinks: ProjectLink[] = [
    ...detail.links,
    ...(artifacts.liveUrl?.url ? [{ label: "Live demo", href: artifacts.liveUrl.url }] : []),
    ...(isPrivate && verify.requestAccessEmail
      ? [{ label: "Request repo access", href: mail(verify.requestAccessEmail, `${detail.name} — repo access request`) }]
      : []),
    ...(verify.walkthrough?.url ? [{ label: "Book a walkthrough", href: verify.walkthrough.url }] : []),
    ...(verify.contactEmail ? [{ label: "Email", href: mail(verify.contactEmail, `${detail.name} — question`) }] : []),
  ]

  // Build the artifact carousel: architecture diagram first, then result clips
  // and screenshots. Dev-only placeholders fill empty slots.
  const videoSlide = (key: string, src: string, caption?: string): Slide => ({
    key,
    caption,
    node: (
      <video className="w-full h-full object-contain" autoPlay loop muted playsInline preload="metadata">
        <source src={src} type="video/mp4" />
      </video>
    ),
  })

  const slides: Slide[] = []
  // 1. Architecture diagram first
  if (diagram === "builtin") {
    slides.push({
      key: "arch",
      caption: "System architecture. Tap to enlarge.",
      node: (
        <button
          type="button"
          onClick={openZoom}
          aria-label="Enlarge architecture diagram"
          className="group relative w-full h-full grid place-items-center px-2 sm:px-4 py-2 cursor-zoom-in bg-transparent border-0"
        >
          <ArchitectureDiagram slug={detail.slug} />
          <span
            aria-hidden
            className="absolute bottom-2 right-2 mono small-caps faint opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ⤢ zoom
          </span>
        </button>
      ),
    })
  } else if (showTodos && diagram) {
    slides.push({ key: "arch-todo", caption: "Architecture diagram (dev placeholder).", node: <PlaceholderSlide todo={diagram.todo} /> })
  }
  // 2. Result clips
  artifacts.clips?.forEach((c, k) => slides.push(videoSlide(`clip-${k}`, c.src, c.caption)))
  // 3. Screenshots
  if (artifacts.screenshots?.items?.length) {
    artifacts.screenshots.items.forEach((s, k) =>
      slides.push({
        key: `shot-${k}`,
        caption: s.caption,
        node: (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.src} alt={s.caption ?? `${detail.name} screenshot`} className="w-full h-full object-contain" loading="lazy" />
        ),
      }),
    )
  } else if (showTodos && artifacts.screenshots?.todo) {
    slides.push({ key: "shot-todo", caption: "Screenshots (dev placeholder).", node: <PlaceholderSlide todo={artifacts.screenshots.todo} /> })
  }

  return (
    <div
      className={`modal-backdrop grain fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-3 sm:p-6 ${
        closing ? "is-closing" : ""
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <style>{TOKENS}</style>

      <div
        ref={cardRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="proj-title"
        className={`modal-card relative w-[95vw] max-w-[1440px] max-h-[90vh] flex flex-col overflow-hidden rounded-xl bg-[#f4f1ec] text-[#1a1a1a] outline-none ring-1 ring-black/10 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.45)] ${
          closing ? "is-closing" : ""
        }`}
      >
        {/* Top-right control — always a text link (no cross):
            internal navigation → "Back to home"; a shared/direct link → "Visit my Portfolio!". */}
        <div className="absolute top-5 right-5 sm:top-7 sm:right-8 z-20">
          {mode === "overlay" ? (
            <button
              type="button"
              onClick={close}
              className="accent-link mono text-[13px] inline-flex items-center gap-1.5 bg-transparent border-0 p-0 cursor-pointer"
            >
              <span aria-hidden>←</span> Back to home
            </button>
          ) : (
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault()
                close()
              }}
              className="accent-link mono text-[13px] inline-flex items-center gap-1.5"
            >
              Visit my Portfolio! <span aria-hidden>→</span>
            </Link>
          )}
        </div>

        {/* Scrollable content — card stays fixed, content scrolls inside */}
        <div className="grow overflow-y-auto px-6 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-20">
          {/* Hero: heading + description + links + the artifact carousel.
              lg: carousel sits to the right of the whole header.
              md (iPad portrait): text and Links/Stack split 80:20 above a
              slightly reduced carousel. base (phone): everything stacks. */}
          <div className="lg:grid lg:gap-12 lg:items-center lg:grid-cols-[1fr_minmax(360px,48%)]">
            <header className="pt-2 sm:pt-4 lg:pt-8 pl-2 sm:pl-4 lg:pl-8 pr-6 lg:pr-10 md:grid md:grid-cols-[4fr_1fr] md:gap-x-8 md:items-start lg:block">
              <div className="md:min-w-0">
              <h1
                id="proj-title"
                className="modal-reveal display font-light tracking-tight leading-[1.1] text-[26px] xs:text-[clamp(28px,3.2vw,40px)] lg:text-[clamp(30px,2.5vw,40px)]"
                style={{ animationDelay: "0.04s" }}
              >
                {detail.title ?? detail.name}
                <span className="accent">.</span>
              </h1>
              <p
                className="modal-reveal display accent text-[clamp(16px,1.7vw,21px)] leading-snug mt-2.5"
                style={{ animationDelay: "0.1s" }}
              >
                {detail.type}
                {detail.place && ` @${detail.place}`}
              </p>
              <p
                className="modal-reveal display font-light text-[15px] xs:text-[17px] lg:text-[18px] mt-5 leading-relaxed muted max-w-[54ch]"
                style={{ animationDelay: "0.16s" }}
              >
                {detail.tagline}
              </p>

              {detail.repoNote && (
                <p
                  className={`modal-reveal mono text-[12px] leading-relaxed mt-4 max-w-[60ch] ${isPrivate ? "ink" : "muted"}`}
                  style={{ animationDelay: "0.2s" }}
                >
                  {linkifyPlatform(detail.repoNote)}
                </p>
              )}
              </div>

              {/* Links + Stack — two columns on the site's rhythm; stacked into
                  the narrow 20% column at iPad-portrait (md) widths. */}
              <div
                className="modal-reveal mt-7 md:mt-0 lg:mt-7 grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6 xs:gap-8 md:gap-5 max-w-[460px] md:max-w-none"
                style={{ animationDelay: "0.24s" }}
              >
                {heroLinks.length > 0 && (
                  <div>
                    <p className="mono small-caps faint mb-2 xs:mb-3">Links</p>
                    <ul className="flex flex-col gap-2 mono text-[11px] xs:text-[13px]">
                      {heroLinks.map((l) => {
                        const external = l.href.startsWith("http")
                        return (
                          <li key={l.href}>
                            <a
                              href={l.href}
                              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                              className="accent-link inline-flex items-center gap-1.5"
                            >
                              {l.label}
                              <span aria-hidden className="faint">{external ? "↗" : "→"}</span>
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
                {detail.stack.length > 0 && (
                  <div>
                    <p className="mono small-caps faint mb-2 xs:mb-3">Stack</p>
                    <ul className="flex flex-wrap gap-x-3 gap-y-1.5 mono text-[11px] xs:text-[13px]">
                      {detail.stack.map((s) => (
                        <li key={s} className="muted">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </header>

            <div
              className="modal-reveal mt-10 lg:mt-0 lg:pt-1 md:max-w-[600px] md:mx-auto lg:max-w-none lg:mx-0"
              style={{ animationDelay: "0.3s" }}
            >
              <Carousel slides={slides} />
            </div>
          </div>

          {/* Case-study detail — faint divider, then the deeper content */}
          {detail.sections && detail.sections.length > 0 && (
            <div className="mt-12 lg:mt-14 border-t rule pt-10 lg:pt-12">
              <div className="pl-2 sm:pl-4 lg:pl-8 pr-6 lg:pr-10 space-y-10 lg:space-y-12">
              {detail.sections.map((s) => (
                <section
                  key={s.label}
                  className="grid grid-cols-1 lg:grid-cols-[160px_1fr] gap-2 lg:gap-12"
                >
                  <p className="mono uppercase tracking-[0.15em] text-[13px] xs:text-[14px] faint lg:pt-1">
                    {s.label}
                  </p>
                  <div>
                    {s.body && (
                      <p className="display text-[14px] xs:text-[15px] lg:text-[16px] muted leading-relaxed">
                        {s.body}
                      </p>
                    )}
                    {s.bullets && s.bullets.length > 0 && (
                      <ul className={`space-y-3 display text-[14px] xs:text-[15px] lg:text-[16px] ${s.body ? "mt-4" : ""}`}>
                        {s.bullets.map((b) => {
                          const m = b.match(/^([^.]+\.)\s*(.*)$/)
                          const lead = m ? m[1] : null
                          const rest = m ? m[2] : b
                          return (
                            <li key={b} className="pl-4 relative leading-relaxed">
                              <span className="absolute left-0 top-[0.5em] w-2 h-px accent-line" aria-hidden />
                              {lead && <span className="ink">{lead} </span>}
                              <span className="muted">{rest}</span>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                    {s.table && (
                      <div className={`overflow-x-auto ${s.body || s.bullets ? "mt-5" : ""}`}>
                        <table className="w-full border-collapse mono text-[12px] xs:text-[13px]">
                          <thead>
                            <tr className="border-b rule">
                              {s.table.headers.map((h) => (
                                <th key={h} className="small-caps faint font-normal text-left py-2.5 pr-6">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {s.table.rows.map((r, ri) => (
                              <tr key={ri} className={ri < s.table!.rows.length - 1 ? "border-b rule" : ""}>
                                {r.map((cell, ci) => (
                                  <td key={ci} className={`py-2.5 pr-6 ${ci === 0 ? "ink" : "muted"}`}>
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {s.table.note && <p className="mono text-[11px] faint mt-3">{s.table.note}</p>}
                      </div>
                    )}
                  </div>
                </section>
              ))}
              </div>
            </div>
          )}
        </div>

        {/* Enlarged architecture diagram — the full-size diagram grows out of the
            clicked thumbnail's exact rect (FLIP) and shrinks back into it on
            close. Click anywhere / × / Esc to close. */}
        {zoomed && diagram === "builtin" && (
          <div
            className="modal-zoom absolute inset-0 z-30 bg-[#f4f1ec] flex flex-col cursor-zoom-out"
            role="dialog"
            aria-modal="true"
            aria-label={`${detail.name} — architecture diagram, enlarged`}
            onClick={closeZoom}
          >
            <div className="absolute top-5 right-5 sm:top-7 sm:right-8 z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  closeZoom()
                }}
                className="accent-link mono text-[13px] inline-flex items-center gap-1.5 bg-transparent border-0 p-0 cursor-pointer"
              >
                Close <span aria-hidden>×</span>
              </button>
            </div>
            <div className="grow overflow-auto grid place-items-center p-6 sm:p-12 lg:p-16">
              <div
                ref={zoomStageRef}
                className="w-full max-w-[1200px]"
                onClick={(e) => e.stopPropagation()}
              >
                <ArchitectureDiagram slug={detail.slug} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Linkify a bare "sushrutalgs.ai" mention in prose to the platform welcome page.
// Only the repo note carries the link; titles and other prose stay plain text.
function linkifyPlatform(text: string): React.ReactNode {
  const token = "sushrutalgs.ai"
  const idx = text.indexOf(token)
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <a
        href="https://sushrutalgs.ai/welcome"
        target="_blank"
        rel="noopener noreferrer"
        className="accent-link"
      >
        {token}
      </a>
      {text.slice(idx + token.length)}
    </>
  )
}

function PlaceholderSlide({ todo, icon = "+" }: { todo?: string; icon?: string }) {
  return (
    <div className="text-center px-8">
      <div className="accent text-2xl leading-none mb-3" aria-hidden>
        {icon}
      </div>
      <p className="mono small-caps accent mb-1">Drop asset here</p>
      {todo && <p className="mono text-[11px] faint max-w-[34ch] leading-relaxed mx-auto">{todo}</p>}
    </div>
  )
}

const TOKENS = `
  .ink { color: #1a1a1a; }
  .muted { color: rgba(26,26,26,0.62); }
  .faint { color: rgba(26,26,26,0.42); }
  .rule { border-color: rgba(26,26,26,0.12); }
  .accent { color: #1f3a5f; }
  .accent-bg { background-color: #1f3a5f; }
  .accent-line { background-color: #1f3a5f; }
  .display { font-family: "Google Sans", ui-sans-serif, system-ui, sans-serif; font-optical-sizing: auto; }
  .mono { font-family: "Google Sans Code", ui-monospace, "SFMono-Regular", "Menlo", monospace; font-variation-settings: "MONO" 1; }
  .small-caps { text-transform: uppercase; letter-spacing: 0.18em; font-size: 10px; }
  .accent-link { position: relative; transition: color 200ms ease; }
  .accent-link::after {
    content: ""; position: absolute; left: 0; right: 0; bottom: -2px; height: 1px;
    background-color: #1f3a5f; transform-origin: left; transform: scaleX(0.35);
    transition: transform 250ms ease;
  }
  .accent-link:hover { color: #1f3a5f; }
  .accent-link:hover::after { transform: scaleX(1); }

  .modal-backdrop {
    background-color: rgba(20,18,14,0.34);
    animation: modal-fade 220ms ease both;
  }
  .modal-card { animation: modal-rise 300ms cubic-bezier(0.22, 1, 0.36, 1) both; }
  .modal-zoom { animation: modal-fade 180ms ease both; }

  /* Exit: backdrop fades and card sinks before the route changes. */
  .modal-backdrop.is-closing { animation: modal-fade-out 240ms ease both; }
  .modal-card.is-closing { animation: modal-sink 240ms cubic-bezier(0.4, 0, 1, 1) both; }

  @keyframes modal-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes modal-fade-out { from { opacity: 1; } to { opacity: 0; } }
  @keyframes modal-rise {
    from { opacity: 0; transform: translateY(12px) scale(0.985); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes modal-sink {
    from { opacity: 1; transform: translateY(0) scale(1); }
    to   { opacity: 0; transform: translateY(10px) scale(0.99); }
  }

  /* Staggered reveal of the hero content on open (per-element delay set inline). */
  .modal-reveal { animation: modal-content-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both; }
  @keyframes modal-content-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  /* While closing, let the content fade out with the card rather than re-animate. */
  .modal-card.is-closing .modal-reveal { animation: none; }

  .grain::before {
    content: ""; position: fixed; inset: 0; pointer-events: none;
    background-image: radial-gradient(rgba(26,26,26,0.05) 1px, transparent 1px);
    background-size: 3px 3px; mix-blend-mode: multiply; z-index: 1;
  }
  @media (prefers-reduced-motion: reduce) {
    .modal-backdrop, .modal-card, .modal-reveal, .modal-zoom,
    .modal-backdrop.is-closing, .modal-card.is-closing { animation: none; }
  }
`
