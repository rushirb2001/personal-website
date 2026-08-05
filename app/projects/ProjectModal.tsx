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
  // Plays the overlay's fade-out while the FLIP shrink runs, so dismissing the
  // zoom doesn't end in a hard cut back to the card.
  const [zoomClosing, setZoomClosing] = useState(false)
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
    setZoomClosing(true)
    stage.style.transformOrigin = "0 0"
    const anim = stage.animate(
      [{ transform: "none" }, { transform: from }],
      { duration: 240, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" },
    )
    anim.onfinish = () => {
      zoomBusyRef.current = false
      setZoomed(false)
      setZoomClosing(false)
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
      [{ transform: from }, { transform: "none" }],
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
    }, prefersReduced() ? 0 : EXIT_MS)
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
    // Lock page scroll. No scrollbar-width padding compensation here: the
    // global `scrollbar-gutter: stable` keeps the gutter reserved while the
    // scrollbar is hidden, so adding padding would double-compensate and
    // shift the page right.
    const body = document.body
    const prevOverflow = body.style.overflow
    body.style.overflow = "hidden"
    return () => {
      body.style.overflow = prevOverflow
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
      ? [{ label: "Request repo access", href: mail(verify.requestAccessEmail, `${detail.name}: repo access request`) }]
      : []),
    ...(verify.walkthrough?.url ? [{ label: "Book a walkthrough", href: verify.walkthrough.url }] : []),
    ...(verify.contactEmail ? [{ label: "Email", href: mail(verify.contactEmail, `${detail.name}: question`) }] : []),
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
          className="group relative w-full h-full grid place-items-center px-1 sm:px-2 py-1 cursor-zoom-in bg-transparent border-0"
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
        // Mirror the Esc hierarchy: a backdrop click steps back out of the
        // zoom first; only a second click dismisses the modal itself.
        if (e.target === e.currentTarget) {
          if (zoomed) closeZoom()
          else close()
        }
      }}
    >
      <style>{TOKENS}</style>
      <style>{`
        /* Hero reflow:
           - below 1024 (phone + compact): single-column mobile stack, so long
             titles and body copy get full width instead of being cramped beside
             the image.
           - widescreen (≥1024): original — text stacked left, image spanning right. */
        .proj-hero {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem 3rem;
          grid-template-areas: "head" "body" "meta" "media";
        }
        .ph-head { grid-area: head; }
        .ph-body { grid-area: body; }
        .ph-meta { grid-area: meta; }
        .ph-media { grid-area: media; }
        @media (min-width: 1024px) {
          .proj-hero {
            grid-template-columns: 1fr minmax(360px, 48%);
            align-items: center;
            grid-template-areas:
              "head  media"
              "body  media"
              "meta  media";
          }
        }
        /* md tier (iPad portrait): cap the stacked carousel so it doesn't
           span the full ~900px card width and then collapse to half that
           when crossing into the 1024 two-column layout. */
        @media (min-width: 768px) and (max-width: 1023px) {
          .ph-media { max-width: min(70%, 640px); margin-inline: auto; }
        }
        /* Phones: type rides svh (caps near 850svh = today's tall-phone
           design) so short viewports fit more of the case study per screen,
           mirroring the landing page's proportional system. Selectors pair
           each override with the Tailwind size utility it compresses. */
        @media (max-width: 639px) {
          .modal-card .text-\\[26px\\] { font-size: clamp(21px, 3.1svh, 26px); }
          .modal-card .text-\\[15px\\] { font-size: clamp(12.5px, 1.8svh, 15px); }
          .modal-card .text-\\[14px\\] { font-size: clamp(12px, 1.7svh, 14px); }
          .modal-card .text-\\[13px\\] { font-size: clamp(11px, 1.6svh, 13px); }
          .modal-card .text-\\[12px\\] { font-size: clamp(10.5px, 1.5svh, 12px); }
          .modal-card .text-\\[11px\\] { font-size: clamp(10px, 1.4svh, 11px); }
        }
      `}</style>

      <div
        ref={cardRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="proj-title"
        className={`modal-card relative w-[95vw] max-w-[1440px] max-h-[90svh] flex flex-col overflow-hidden rounded-xl bg-[#f4f1ec] text-[#1a1a1a] outline-none ring-1 ring-black/10 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.45)] ${
          closing ? "is-closing" : ""
        }`}
      >
        {/* Top header: a blur-and-fade gradient so scrolling content dissolves
            under it, with the nav control on the right. The header itself is
            click-through (pointer-events-none) except the control.
            Control: internal navigation → "Back to home"; a shared/direct
            link → "Visit my Portfolio!". */}
        <div className="pointer-events-none absolute left-0 right-[11px] top-0 z-20 h-20 sm:h-24">
          <EdgeBlur dir="to bottom" />
          <div className="pointer-events-auto absolute top-4 right-5 sm:top-6 sm:right-8">
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
        </div>

        {/* Mirror of the top header for the bottom edge — same progressive blur,
            flipped. Both edges stop short of the scrollbar so it stays sharp. */}
        <div className="pointer-events-none absolute left-0 right-[11px] bottom-0 z-20 h-20 sm:h-24">
          <EdgeBlur dir="to top" />
        </div>

        {/* Scrollable content — card stays fixed, content scrolls inside */}
        <div className="grow overflow-y-auto overscroll-contain px-4 sm:px-8 lg:px-10 xl:px-16 py-12 sm:py-16 lg:py-20">
          {/* Hero: heading + description + links + the artifact carousel.
              lg: carousel sits to the right of the whole header.
              md (iPad portrait): text and Links/Stack split 80:20 above a
              slightly reduced carousel. base (phone): everything stacks. */}
          <div className="cs pt-2 sm:pt-4 lg:pt-6 pl-1 sm:pl-3 lg:pl-6 pr-1 sm:pr-3 lg:pr-6">
            {/* Eyebrow: role, org, and what kind of thing this is. A case study
                establishes context before it says anything. */}
            <p className="cs-eyebrow mono modal-reveal" style={{ animationDelay: "0s" }}>
              {detail.type}
              {detail.place && <span className="faint"> / {detail.place}</span>}
            </p>

            <h1
              id="proj-title"
              className="cs-title display modal-reveal"
              style={{ animationDelay: "0s" }}
            >
              {detail.title ?? detail.name}
              <span className="accent">.</span>
            </h1>

            <p className="cs-lead display modal-reveal" style={{ animationDelay: "0.06s" }}>
              {detail.tagline}
            </p>

            {/* Metadata bar. Ruled columns, the way a case study states its
                facts up front, rather than two cramped lists in a side gutter. */}
            <div className="cs-meta modal-reveal" style={{ animationDelay: "0.12s" }}>
              {detail.stack.length > 0 && (
                <div className="cs-meta-col">
                  <p className="mono small-caps faint">Built with</p>
                  <p className="mono cs-meta-val">{detail.stack.join(" · ")}</p>
                </div>
              )}
              <div className="cs-meta-col">
                <p className="mono small-caps faint">Source</p>
                <p className="mono cs-meta-val">
                  {isPrivate ? "Private repo" : "Public repo"}
                </p>
              </div>
              {heroLinks.length > 0 && (
                <div className="cs-meta-col">
                  <p className="mono small-caps faint">Links</p>
                  <ul className="cs-meta-links mono">
                    {heroLinks.map((l) => {
                      const ext = l.href.startsWith("http")
                      return (
                        <li key={l.href}>
                          <a
                            href={l.href}
                            {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            className="accent-link accent"
                          >
                            {l.label}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* The artifact, at full card width. It is the evidence on a page
                about work that mostly cannot be opened, so it stops being a
                thumbnail in a 48% gutter. */}
            <div className="cs-media modal-reveal" style={{ animationDelay: "0s" }}>
              <Carousel slides={slides} frozen={zoomed || zoomClosing} />
            </div>

            {detail.repoNote && (
              <p className={`cs-note mono modal-reveal ${isPrivate ? "ink" : "muted"}`} style={{ animationDelay: "0.12s" }}>
                {linkifyPlatform(detail.repoNote)}
              </p>
            )}

            {/* Outcomes. The numbers, large, before any prose. */}
            {detail.metrics && detail.metrics.length > 0 && (
              <aside className="cs-callout modal-reveal" style={{ animationDelay: "0.12s" }}>
                <p className="mono small-caps accent cs-callout-label">What it came out at</p>
                <dl className="cs-metrics">
                  {detail.metrics.map((m) => (
                    <div key={m.label} className="cs-metric">
                      <dt className="display cs-metric-value">{m.value}</dt>
                      <dd className="mono cs-metric-label">{m.label}</dd>
                    </div>
                  ))}
                </dl>
              </aside>
            )}
          </div>


          {/* Case-study detail — faint divider, then the deeper content */}
          {detail.sections && detail.sections.length > 0 && (
            <div className="mt-12 lg:mt-14 border-t rule pt-10 lg:pt-12">
              <div className="cs-body pl-1 sm:pl-3 lg:pl-6 pr-1 sm:pr-3 lg:pr-6">
              {detail.sections.map((s) => (
                <section key={s.label} className="cs-section">
                  <h2 className="cs-section-head display">{s.label}</h2>
                  <div className="cs-section-body">
                    {s.body && (
                      <p className="display text-[15px] xs:text-[16px] lg:text-[17px] ink font-light leading-relaxed max-w-[72ch]">
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
                              <span className="ink font-light">{rest}</span>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                    {s.table && (
                      <div className={`overflow-x-auto ${s.body || s.bullets ? "mt-5" : ""}`}>
                        <table className="w-full border-collapse mono text-[12px] xs:text-[13px]">
                          <thead>
                            <tr style={{ borderBottom: "1px solid rgba(31,58,95,0.35)" }}>
                              {s.table.headers.map((h) => (
                                <th key={h} className="small-caps accent font-normal text-left py-3 pr-6">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {s.table.rows.map((r, ri) => (
                              <tr key={ri} className={ri < s.table!.rows.length - 1 ? "border-b rule" : ""}>
                                {r.map((cell, ci) => (
                                  <td key={ci} className={`py-3 pr-6 ${ci === 0 ? "ink" : "muted"}`}>
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {s.table.note && <p className="mono text-[12px] muted mt-3">{s.table.note}</p>}
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
            className={`modal-zoom absolute inset-0 z-30 bg-[#f4f1ec] flex flex-col cursor-zoom-out ${
              zoomClosing ? "is-closing" : ""
            }`}
            role="dialog"
            aria-modal="true"
            aria-label={`${detail.name}: architecture diagram, enlarged`}
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
            {/* flex + m-auto (not grid centering) so the phone-size min-width
                overflow stays reachable by panning on both sides. */}
            <div className="grow overflow-auto overscroll-contain flex p-3 sm:p-8 lg:p-10">
              <div
                ref={zoomStageRef}
                // Phone min-width is sized so the SMALLEST label in the densest
                // diagram stays readable, not so the diagram fits. At 640px a
                // 9px annotation inside a 1150-unit viewBox landed at ~5.0px,
                // which is unreadable, so zooming did not deliver the one thing
                // it exists for. 1100px puts every diagram's floor at 8.6-11.5px.
                // More panning, but the container already scrolls both axes, and
                // legible-while-panning beats fully visible and unreadable.
                className="w-full max-w-[1600px] min-w-[1100px] sm:min-w-0 m-auto"
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

// True progressive blur for a scroll edge: stacked layers of increasing blur
// radius, each masked to a band so the *amount* of blur ramps from strong at the
// edge to none inward (not just a fading opacity). `dir` points away from the
// edge ("to bottom" = strong at top, "to top" = strong at bottom).
const EDGE_FADE_LAYERS = [
  { blur: 0.5, mid: 65, end: 100 },
  { blur: 1, mid: 50, end: 80 },
  { blur: 2, mid: 35, end: 60 },
  { blur: 4, mid: 20, end: 42 },
  { blur: 8, mid: 8, end: 28 },
]

function EdgeBlur({ dir }: { dir: "to bottom" | "to top" }) {
  return (
    <>
      {EDGE_FADE_LAYERS.map(({ blur, mid, end }, k) => {
        const mask = `linear-gradient(${dir}, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${mid}%, rgba(0,0,0,0) ${end}%)`
        return (
          <div
            key={k}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              WebkitMaskImage: mask,
              maskImage: mask,
            }}
          />
        )
      })}
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
  /* Keep the page scrollbar's lane reserved while the modal locks scroll —
     pairs with the scroll-lock effect above, which deliberately adds no
     padding compensation. (Lives here because the CSS pipeline strips
     scrollbar-gutter from globals.css.) */
  html { scrollbar-gutter: stable; }

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
  @media (hover: hover) {
    .accent-link:hover { color: #1f3a5f; }
    .accent-link:hover::after { transform: scaleX(1); }
  }

  .modal-backdrop {
    background-color: rgba(20,18,14,0.34);
    animation: modal-fade 220ms ease both;
  }
  .modal-card { animation: modal-rise 300ms cubic-bezier(0.22, 1, 0.36, 1) both; }
  .modal-zoom { animation: modal-fade 180ms ease both; }

  /* Exit: backdrop fades and card sinks before the route changes. */
  .modal-backdrop.is-closing { animation: modal-fade-out 240ms ease both; }
  .modal-card.is-closing { animation: modal-sink 240ms cubic-bezier(0.4, 0, 1, 1) both; }
  /* Zoom dismiss: the overlay fades while the diagram shrinks back into its
     thumbnail, instead of cutting away when the shrink finishes. */
  .modal-zoom.is-closing { animation: modal-fade-out 240ms ease both; }

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
  /* Entrance stagger is ordered by LCP candidate, not by reading order.
     animation-fill-mode: both holds the from-state (opacity: 0) through the
     delay, and Chrome ignores a zero-opacity element for LCP, so a delay is
     added directly to LCP while the DURATION costs nothing. The h1 and the
     carousel are the two plausible candidates (largest text, largest media) and
     both start at 0s; the supporting copy cascades behind them, capped at 0.12s
     so nothing can add more than that even if the candidate is misjudged.
     Previously the carousel carried the LONGEST delay (0.3s) of anything on the
     page, which is the worst possible assignment. */
  .modal-reveal { animation: modal-content-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both; }
  @keyframes modal-content-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  /* While closing, freeze the reveal where it is so a mid-stagger close
     doesn't snap half-faded content to full opacity before the card sinks. */
  .modal-card.is-closing .modal-reveal { animation-play-state: paused; }

  /* ── Reading layout ───────────────────────────────────────────────────
     Shaped like an article, not a paper. One narrow measure carries every
     word; only media breaks out of it. No numbered chapters, no ruled bands,
     no gutter labels — those all read as a formal document, and this is meant
     to read as someone explaining how a thing was built. */

  .cs, .cs-body { display: flex; flex-direction: column; max-width: 44rem; margin-inline: auto; width: 100%; }

  .cs-eyebrow {
    font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
    color: #1f3a5f; margin: 0 0 16px;
  }

  .cs-title {
    margin: 0; font-weight: 300; letter-spacing: -0.022em; line-height: 1.12;
    font-size: clamp(28px, 3.6vw, 42px); color: #1a1a1a;
  }

  .cs-lead {
    margin: 20px 0 0; font-weight: 300; line-height: 1.62;
    font-size: clamp(17px, 1.5vw, 20px); color: rgba(26,26,26,0.66);
  }

  /* Byline-style facts row, the way an article states its particulars. */
  .cs-meta {
    margin-top: 26px; padding: 14px 0;
    border-top: 1px solid rgba(26,26,26,0.12);
    border-bottom: 1px solid rgba(26,26,26,0.12);
    display: flex; flex-wrap: wrap; gap: 6px 26px; align-items: baseline;
  }
  .cs-meta-col { display: flex; align-items: baseline; gap: 9px; min-width: 0; }
  .cs-meta-col .small-caps { flex: none; }
  .cs-meta-val { margin: 0; font-size: 12.5px; line-height: 1.6; color: rgba(26,26,26,0.7); }
  .cs-meta-links { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 12.5px; }

  /* The one element that breaks the measure. */
  /* The one break-out. Symmetric, and clamped so it can never exceed the card. */
  .cs-media { margin-top: 34px; width: min(132%, 100vw - 5rem); max-width: none; margin-inline: auto; align-self: center; }

  .cs-note { margin: 22px 0 0; font-size: 12.5px; line-height: 1.7; color: rgba(26,26,26,0.7); }

  /* Notion-style callout: the numbers, sitting inside the flow instead of
     standing up as a dashboard band. */
  .cs-callout {
    margin-top: 34px; padding: 20px 22px; border-radius: 10px;
    background: rgba(31,58,95,0.05);
    border-left: 2px solid #1f3a5f;
  }
  .cs-callout-label { margin: 0 0 14px; }
  .cs-metrics { margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 16px 22px; }
  @media (min-width: 700px) { .cs-metrics { grid-template-columns: repeat(4, 1fr); } }
  .cs-metric { display: flex; flex-direction: column; gap: 4px; }
  .cs-metric-value {
    margin: 0; font-weight: 300; letter-spacing: -0.02em; line-height: 1.05;
    font-size: 23px; color: #1f3a5f;
  }
  .cs-metric-label { margin: 0; font-size: 11px; line-height: 1.4; color: rgba(26,26,26,0.6); }

  /* Chapters: space and weight do the work, no rules and no numerals. */
  .cs-section { padding: 0; border: 0; }
  .cs-section-head {
    margin: 52px 0 14px; font-weight: 400; letter-spacing: -0.015em;
    line-height: 1.25; font-size: clamp(20px, 2vw, 25px); color: #1a1a1a;
  }
  .cs-section-body { max-width: 100%; }
  .cs-section:first-child .cs-section-head { margin-top: 0; }
  .cs-section-body p { line-height: 1.72; }


  /* Evidence strip: the measurements, pulled out of the prose and given the
     first screenful. Drawn as ruled columns rather than boxed cards so it stays
     in the site's editorial register instead of turning into a dashboard. */
  .ev-strip {
    list-style: none; margin: 0; padding: 18px 0 0;
    border-top: 1px solid rgba(31,58,95,0.35);
    display: grid; grid-template-columns: 1fr; gap: 18px 32px;
  }
  @media (min-width: 640px) { .ev-strip { grid-template-columns: 1fr 1fr; } }
  @media (min-width: 1024px) { .ev-strip { grid-template-columns: repeat(4, 1fr); gap: 0 28px; } }
  .ev-item { display: flex; flex-direction: column; gap: 6px; position: relative; }
  @media (min-width: 1024px) {
    .ev-item { padding-left: 20px; }
    /* Hairline between columns, not around them: a rule reads as a table of
       facts, a border reads as a card. */
    .ev-item + .ev-item::before {
      content: ""; position: absolute; left: 0; top: 2px; bottom: 2px;
      width: 1px; background: rgba(26,26,26,0.12);
    }
    .ev-item:first-child { padding-left: 0; }
  }
  .ev-key {
    font-size: 17px; font-weight: 300; letter-spacing: -0.01em;
    line-height: 1.25; color: #1f3a5f;
  }
  @media (min-width: 1024px) { .ev-key { font-size: 18px; } }
  .ev-note { font-size: 12.5px; line-height: 1.6; color: #1a1a1a; }
  /* Accent tick above each fact, so a column without a heading still reads as
     its own item rather than as a runover of the one before it. */
  .ev-item::after {
    content: ""; position: absolute; top: -19px; left: 0; width: 22px; height: 2px;
    background: #1f3a5f;
  }
  @media (min-width: 1024px) { .ev-item { padding-left: 0; margin-right: 28px; } .ev-item + .ev-item::before { display: none; } }

  .grain::before {
    content: ""; position: fixed; inset: 0; pointer-events: none;
    background-image: radial-gradient(rgba(26,26,26,0.05) 1px, transparent 1px);
    background-size: 3px 3px; mix-blend-mode: multiply; z-index: 1;
  }
  @media (prefers-reduced-motion: reduce) {
    .modal-backdrop, .modal-card, .modal-reveal, .modal-zoom,
    .modal-backdrop.is-closing, .modal-card.is-closing,
    .modal-zoom.is-closing { animation: none; }
    .accent-link, .accent-link::after { transition: none; }
  }
`
