"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import type { ProjectDetail, ProjectLink } from "./projects-data"
import { ArchitectureDiagram } from "./ArchitectureDiagram"
import { Carousel, type Slide } from "./Carousel"

// Exit-animation duration; navigation is deferred this long so the card can
// animate out before the route changes. Keep in sync with the CSS below.
const EXIT_MS = 240

// Distance the header blur covers. Section jumps land below it, and the
// scrollspy band starts there, so a section is never "current" while it sits
// under the blurred band.
const HEADER_H = 88

const sectionId = (label: string) =>
  "cs-" + label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")

export function ProjectModal({
  detail,
  mode = "standalone",
}: {
  detail: ProjectDetail
  mode?: "overlay" | "standalone"
}) {
  const router = useRouter()
  const cardRef = useRef<HTMLDivElement>(null)
  // The scroll container is the modal's inner pane, not the window, so the
  // rail's scrollspy observes against it.
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeId, setActiveId] = useState("")
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

  const sections = detail.sections ?? []
  const sectionIds = useMemo(() => sections.map((s) => sectionId(s.label)), [sections])

  // Scrollspy for the rail index. Sections are tracked in a set rather than
  // reacting to whichever entry fired last: when two sections cross the band
  // in the same frame, last-entry-wins picks an arbitrary one and the rail
  // flickers. Taking the first still-visible section in document order is
  // stable in both scroll directions.
  const visibleRef = useRef<Set<string>>(new Set())
  useEffect(() => {
    const root = scrollRef.current
    if (!root || sectionIds.length === 0) return
    const els = sectionIds
      .map((id) => root.querySelector<HTMLElement>(`#${id}`))
      .filter((el): el is HTMLElement => el !== null)
    if (els.length === 0) return

    const seen = visibleRef.current
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) seen.add(e.target.id)
          else seen.delete(e.target.id)
        }
        const first = sectionIds.find((id) => seen.has(id))
        if (first) setActiveId(first)
      },
      // Reading band: from just under the header down to 30% of the card.
      { root, rootMargin: `-${HEADER_H}px 0px -70% 0px`, threshold: 0 },
    )
    els.forEach((el) => io.observe(el))
    return () => {
      io.disconnect()
      seen.clear()
    }
  }, [sectionIds])

  const goToSection = useCallback((id: string) => {
    const root = scrollRef.current
    const el = root?.querySelector<HTMLElement>(`#${id}`)
    if (!root || !el) return
    const top =
      el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - HEADER_H
    // "instant", never "auto" — the global scroll-behavior: smooth hijacks it.
    root.scrollTo({ top, behavior: prefersReduced() ? "instant" : "smooth" })
    setActiveId(id)
  }, [])

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

  // The diagram and the result clips/screenshots are two different kinds of
  // evidence — one explains the system, the other shows it working — so each
  // renders inline at whichever section's prose actually talks about it (via
  // CaseSection.figure), instead of being pooled into one hero carousel that
  // sat above every section regardless of what it held.
  const videoSlide = (key: string, src: string, caption?: string): Slide => ({
    key,
    caption,
    node: (
      <video className="w-full h-full object-contain" autoPlay loop muted playsInline preload="metadata">
        <source src={src} type="video/mp4" />
      </video>
    ),
  })

  const resultSlides: Slide[] = []
  artifacts.clips?.forEach((c, k) => resultSlides.push(videoSlide(`clip-${k}`, c.src, c.caption)))
  if (artifacts.screenshots?.items?.length) {
    artifacts.screenshots.items.forEach((s, k) =>
      resultSlides.push({
        key: `shot-${k}`,
        caption: s.caption,
        node: (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.src} alt={s.caption ?? `${detail.name} screenshot`} className="w-full h-full object-contain" loading="lazy" />
        ),
      }),
    )
  } else if (showTodos && artifacts.screenshots?.todo) {
    resultSlides.push({ key: "shot-todo", caption: "Screenshots (dev placeholder).", node: <PlaceholderSlide todo={artifacts.screenshots.todo} /> })
  }

  // The diagram is a single image, not a multi-slide gallery, so it gets its
  // own plain figure rather than Carousel's arrows-and-dots chrome. Frame
  // (the drawing kit's svg root) is already `w-full h-auto`, so it renders at
  // its own natural aspect ratio instead of being boxed into 16:9.
  const diagramFigure =
    diagram === "builtin" ? (
      <figure className="cs-figure">
        <button
          type="button"
          onClick={openZoom}
          aria-label="Enlarge architecture diagram"
          className="group relative w-full block cursor-zoom-in bg-transparent border-0 p-0"
        >
          <ArchitectureDiagram slug={detail.slug} />
          <span
            aria-hidden
            className="absolute bottom-1 right-1 mono small-caps faint opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ⤢ zoom
          </span>
        </button>
        <figcaption className="cs-figure-caption mono">System architecture. Tap to enlarge.</figcaption>
      </figure>
    ) : showTodos && diagram ? (
      <figure className="cs-figure">
        <div className="cs-figure-todo">
          <PlaceholderSlide todo={diagram.todo} />
        </div>
      </figure>
    ) : null

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
            under it, with the project title on the left and the nav control
            on the right. The title lives here rather than in the rail
            because the rail only goes sticky at 1024px — below that it
            scrolls away with the rest of the article, so the one thing that
            should stay on screen the whole visit (what page this even is)
            disappeared on every phone. The header itself is click-through
            (pointer-events-none) except this row.
            Control: internal navigation → "Back to home"; a shared/direct
            link → "Visit my Portfolio!". */}
        <div className="pointer-events-none absolute left-0 right-[11px] top-0 z-20 h-20 sm:h-24">
          <EdgeBlur dir="to bottom" />
          <div className="pointer-events-auto absolute inset-x-5 sm:inset-x-8 top-4 sm:top-6 flex items-center justify-between gap-4">
            {/* Same shape as the Selected Projects listing on the home page
                (`name @platform`), so the modal reads as that row opened up
                rather than as a differently-named page. */}
            <h1 id="proj-title" className="cs-header-title display truncate min-w-0">
              {detail.name}
              {detail.place && <span className="muted"> @{detail.place}</span>}
            </h1>
            {mode === "overlay" ? (
              <button
                type="button"
                onClick={close}
                className="accent-link mono text-[13px] inline-flex items-center gap-1.5 bg-transparent border-0 p-0 cursor-pointer flex-none whitespace-nowrap"
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
                className="accent-link mono text-[13px] inline-flex items-center gap-1.5 flex-none whitespace-nowrap"
              >
                See the full portfolio <span aria-hidden>→</span>
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
        <div
          ref={scrollRef}
          className="grow overflow-y-auto overscroll-contain px-4 sm:px-8 lg:px-10 xl:px-16 py-12 sm:py-16 lg:py-20"
        >
          <div className="cs pt-2 sm:pt-4 lg:pt-6">
            {/* ── Rail (20). Identity and wayfinding only: what this is, what
                it is called, how to move through it, and where to verify it.
                Nothing in here is part of the argument. ── */}
            <aside className="cs-rail modal-reveal" style={{ animationDelay: "0s" }}>
              {/* Just the kind of thing this is — the org now rides the
                  title in the header, so repeating it here was duplication. */}
              <p className="cs-eyebrow mono">{detail.type}</p>

              {sections.length > 0 && (
                <nav aria-label="Sections">
                  <ul className="cs-index">
                    {sections.map((s, k) => (
                      <li key={s.label} className="cs-index-item">
                        <button
                          type="button"
                          className="cs-index-link"
                          aria-current={activeId === sectionIds[k] ? "true" : undefined}
                          onClick={() => goToSection(sectionIds[k])}
                        >
                          {s.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {detail.stack.length > 0 && (
                <div className="cs-railblock">
                  <p className="cs-key">Built with</p>
                  <ul className="cs-stack">
                    {detail.stack.map((t) => (
                      <li key={t} className="cs-stack-pill mono">
                        <StackIcon tech={t} />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {heroLinks.length > 0 && (
                <div className="cs-railblock">
                  <p className="cs-key">Links</p>
                  <ul className="cs-fact-links">
                    {heroLinks.map((l) => {
                      const ext = l.href.startsWith("http")
                      return (
                        <li key={l.href}>
                          <a
                            href={l.href}
                            {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            className="cs-link-btn mono"
                          >
                            {l.label}
                            <span aria-hidden>{ext ? "↗" : "→"}</span>
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              {/* Access note as an advisory card. It answers "why can't I see
                  the code?", which is a caveat rather than a fact about the
                  project, so it reads as an inline notice instead of one more
                  labelled rail row. */}
              {detail.repoNote && (
                <aside className="cs-note-card">
                  <span className="cs-note-badge" aria-hidden>
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
                      <path d="M8 7.1v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <circle cx="8" cy="4.7" r="0.95" fill="currentColor" />
                    </svg>
                  </span>
                  <p className="cs-note-text">{linkifyPlatform(detail.repoNote)}</p>
                </aside>
              )}
            </aside>

            {/* ── Article (80). Every word of the argument, and every image. ── */}
            <div className="cs-main">
              <p className="cs-lead display modal-reveal" style={{ animationDelay: "0.06s" }}>
                {detail.tagline}
              </p>

              {sections.map((s, k) => (
                <section key={s.label} id={sectionIds[k]} className="cs-section">
                  <h2 className="cs-section-head display">{s.label}</h2>
                  <div className="cs-prose display">
                    {s.body && <p>{s.body}</p>}
                    {s.bullets && s.bullets.length > 0 && (
                      <ul className="cs-points">
                        {s.bullets.map((b) => {
                          const m = b.match(/^([^.]+\.)\s*(.*)$/)
                          const lead = m ? m[1] : null
                          const rest = m ? m[2] : b
                          return (
                            <li key={b}>
                              {lead && <span className="cs-point-lead">{lead} </span>}
                              {rest}
                            </li>
                          )
                        })}
                      </ul>
                    )}
                    {s.table && (
                      <div className="overflow-x-auto">
                        <table className="cs-table mono">
                          <thead>
                            <tr>
                              {s.table.headers.map((h) => (
                                <th key={h}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {s.table.rows.map((r, ri) => (
                              <tr key={ri}>
                                {r.map((cell, ci) => (
                                  <td key={ci}>{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {s.table.note && <p className="cs-table-note">{s.table.note}</p>}
                      </div>
                    )}
                  </div>

                  {/* Evidence, exactly where the prose above just talked
                      about it — not pooled above the whole article. */}
                  {s.figure === "diagram" && diagramFigure}
                  {s.figure === "results" && resultSlides.length > 0 && (
                    <div className="cs-media">
                      <Carousel slides={resultSlides} frozen={zoomed || zoomClosing} />
                    </div>
                  )}
                  {s.showMetrics && detail.metrics && detail.metrics.length > 0 && (
                    <div className="cs-metrics-inline">
                      <p className="cs-key">In numbers</p>
                      <dl className="cs-metrics">
                        {detail.metrics.map((m) => (
                          <div key={m.label}>
                            <dt className="display cs-metric-value">{m.value}</dt>
                            <dd className="mono cs-metric-label">{m.label}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </section>
              ))}

              {/* The article's last beat: what the numbers and decisions
                  above actually prove, not another status update. */}
              {detail.closing && <p className="cs-closing display">{detail.closing}</p>}
            </div>
          </div>
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

// Stack pill icons. Deliberately monochrome and drawn by CATEGORY rather than
// per-brand: the stacks span ~30 technologies, so per-brand marks would mean a
// logo set that is impossible to keep visually even (and half of them, like
// "Random Fourier Features" or "jose (JWT)", have no mark at all). A category
// glyph is honest, always available, and stays in the site's ink-on-paper
// register instead of importing thirty brand palettes.
type StackKind = "lang" | "ui" | "data" | "cloud" | "ml" | "auth" | "test" | "box"

const STACK_KINDS: [RegExp, StackKind][] = [
  [/jose|jwt|sign.?in|auth|oauth/i, "auth"],
  [/vitest|pytest|jest|testing/i, "test"],
  [/docker|container/i, "box"],
  [/cloudflare|vercel|workers|r2|cloud|aws|s3/i, "cloud"],
  [/qdrant|neo4j|supabase|postgres|sqlite|redis|database|\bdb\b/i, "data"],
  [/jax|flax|numpy|biolord|mlflow|nltk|spark|fourier|pydantic|torch|pandas/i, "ml"],
  [/next\.js|react|swiftui|tailwind|fastapi|hono|django|vue|svelte/i, "ui"],
  [/typescript|javascript|python|swift|rust|\bgo\b|java|kotlin|ruby|\bc\+\+/i, "lang"],
]

const stackKind = (tech: string): StackKind =>
  STACK_KINDS.find(([re]) => re.test(tech))?.[1] ?? "box"

const STACK_PATHS: Record<StackKind, React.ReactNode> = {
  // { } — source code
  lang: <path d="M6 2.5C4.3 2.5 4.6 6 3 7c1.6 1 1.3 4.5 3 4.5M8 2.5c1.7 0 1.4 3.5 3 4.5-1.6 1-1.3 4.5-3 4.5" />,
  // stacked panes — a rendered interface
  ui: <path d="M2 4.2h10M2 7h10M2 9.8h10M4.6 4.2v5.6" />,
  // cylinder — a store
  data: (
    <>
      <ellipse cx="7" cy="3.6" rx="4.6" ry="1.8" />
      <path d="M2.4 3.6v6.8c0 1 2 1.8 4.6 1.8s4.6-.8 4.6-1.8V3.6" />
    </>
  ),
  // cloud
  cloud: <path d="M4.3 10.6a2.6 2.6 0 0 1-.2-5.2 3.5 3.5 0 0 1 6.7.7 2.3 2.3 0 0 1-.5 4.5H4.3Z" />,
  // connected nodes — a model / pipeline
  ml: (
    <>
      <circle cx="3.2" cy="3.4" r="1.5" />
      <circle cx="3.2" cy="10.6" r="1.5" />
      <circle cx="10.8" cy="7" r="1.5" />
      <path d="M4.6 4.2 9.4 6.3M4.6 9.8 9.4 7.7" />
    </>
  ),
  // key — identity
  auth: (
    <>
      <circle cx="4.6" cy="7" r="2.4" />
      <path d="M7 7h5M10.2 7v2.1M12 7v1.6" />
    </>
  ),
  // check — verification
  test: <path d="M2.6 7.4 5.6 10.4 11.4 4" />,
  // box — the generic fallback
  box: (
    <>
      <path d="M7 1.8 12.4 4.6v5.4L7 12.8 1.6 10V4.6L7 1.8Z" />
      <path d="M1.6 4.6 7 7.4l5.4-2.8M7 7.4v5.4" />
    </>
  ),
}

function StackIcon({ tech }: { tech: string }) {
  return (
    <svg
      className="cs-stack-icon"
      viewBox="0 0 14 14"
      width="11"
      height="11"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {STACK_PATHS[stackKind(tech)]}
    </svg>
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

  /* ── Reading layout: the margin does the dividing ─────────────────────
     Every structural label — the facts, the outcome, the section names —
     lives in a left gutter, and the prose column never contains one. The
     gutter reads as a continuous spine down the whole document, which is
     what makes rules unnecessary: a hairline only separates at the points
     you draw it, the spine separates everywhere at once. Deliberately no
     dividers, no boxes and no numerals anywhere below.

     The measure stays 56rem and the gutter hangs OUTSIDE it, so adding the
     spine costs the prose no width. */

  /* 20 / 80. The rail is the fixed thing you navigate by; the article is the
     thing that moves. Everything in the rail is identity or wayfinding, and
     everything in the right column is the case study itself. */
  .cs {
    display: grid; grid-template-columns: minmax(0, 1fr);
    width: 100%; max-width: 62rem; margin-inline: auto; row-gap: 40px;
  }
  @media (min-width: 1024px) {
    .cs {
      max-width: 84rem;
      grid-template-columns: minmax(200px, 20%) minmax(0, 1fr);
      column-gap: clamp(40px, 4.5vw, 76px);
      align-items: start;
    }
  }

  /* The rail rides the scroll. Sticks below the header blur so it never sits
     under a blurred band. max-height keeps a long index scrollable rather
     than clipped on short viewports. */
  .cs-rail { min-width: 0; }
  @media (min-width: 1024px) {
    .cs-rail {
      position: sticky; top: 24px;
      max-height: calc(90svh - 190px); overflow-y: auto;
      scrollbar-width: none;
    }
    .cs-rail::-webkit-scrollbar { display: none; }
  }

  .cs-eyebrow {
    font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
    color: #1f3a5f; margin: 0 0 14px;
  }

  /* The title, in the persistent header chrome rather than the rail — see
     the comment at its markup. Single line, ellipsis rather than wrap: the
     header has a fixed height and the nav control on the right needs to
     never get squeezed, so the title is what gives way on a narrow phone. */
  .cs-header-title {
    font-weight: 300; letter-spacing: -0.018em; line-height: 1.2;
    font-size: clamp(19px, 2vw, 27px); color: #1a1a1a;
  }

  /* Section index. Colour and weight mark the current section; a tick or a
     rule would be the only drawn line on the page. */
  .cs-index { list-style: none; margin: 26px 0 0; padding: 0; }
  @media (max-width: 1023px) { .cs-index { display: none; } }
  .cs-index-item + .cs-index-item { margin-top: 3px; }
  .cs-index-link {
    display: block; width: 100%; text-align: left; padding: 6px 0;
    background: none; border: 0; cursor: pointer;
    font-family: "Google Sans", ui-sans-serif, system-ui, sans-serif;
    font-size: 15.5px; line-height: 1.4; font-weight: 400;
    color: rgba(26,26,26,0.42);
    transition: color 200ms ease;
  }
  .cs-index-link:hover { color: rgba(26,26,26,0.72); }
  .cs-index-link[aria-current="true"] { color: #1f3a5f; font-weight: 500; }

  /* Rail facts and links: little texts, kept quiet. */
  .cs-railblock { margin-top: 26px; }
  .cs-key {
    margin: 0 0 6px;
    font-family: "Google Sans Code", ui-monospace, monospace;
    font-variation-settings: "MONO" 1;
    text-transform: uppercase; letter-spacing: 0.15em; font-weight: 400;
    font-size: 9.5px; line-height: 1.5; color: rgba(26,26,26,0.4);
  }
  .cs-fact {
    margin: 0;
    font-family: "Google Sans Code", ui-monospace, monospace;
    font-variation-settings: "MONO" 1;
    font-size: 12px; line-height: 1.7; color: rgba(26,26,26,0.7);
  }

  /* Stack pills. Neutral ink, not accent: the stack is a fact, and the navy
     is reserved for the things worth clicking. */
  .cs-stack { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
  .cs-stack-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 8px; border-radius: 6px;
    font-size: 11px; line-height: 1.5; white-space: nowrap;
    color: rgba(26,26,26,0.72);
    background-color: rgba(26,26,26,0.045);
    border: 1px solid rgba(26,26,26,0.1);
  }
  .cs-stack-icon { flex: none; color: rgba(26,26,26,0.5); }

  /* Links as controls, matching the home page's footer CTA recipe: a tinted
     outline, never a filled pill (the site keeps exactly one filled control,
     .cta-buy on /playbook). */
  .cs-fact-links { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 7px; }
  .cs-link-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 11px; border-radius: 6px;
    color: #1f3a5f;
    background-color: rgba(31,58,95,0.07);
    border: 1px solid rgba(31,58,95,0.28);
    text-transform: uppercase; letter-spacing: 0.1em; font-size: 10.5px;
    white-space: nowrap;
    transition: background-color 200ms ease, border-color 200ms ease;
  }
  @media (hover: hover) {
    .cs-link-btn:hover {
      background-color: rgba(31,58,95,0.13);
      border-color: rgba(31,58,95,0.5);
    }
  }

  /* Advisory card for the access note. */
  .cs-note-card {
    margin-top: 26px; display: flex; gap: 9px; align-items: flex-start;
    padding: 11px 12px; border-radius: 8px;
    background-color: rgba(31,58,95,0.055);
    border: 1px solid rgba(31,58,95,0.16);
  }
  .cs-note-badge { flex: none; color: #1f3a5f; line-height: 0; margin-top: 1px; }
  .cs-note-text {
    margin: 0;
    font-family: "Google Sans Code", ui-monospace, monospace;
    font-variation-settings: "MONO" 1;
    font-size: 11px; line-height: 1.65; color: rgba(26,26,26,0.72);
  }

  @media (max-width: 1023px) {
    .cs-railblock { margin-top: 22px; }
  }

  /* ── The article column ─────────────────────────────────────────────── */
  .cs-main { min-width: 0; display: flex; flex-direction: column; }
  /* The standfirst. Bigger and blacker than body copy so it still reads as
     the article's opening line, but this is a full descriptive sentence, not
     a headline — 32px at a 34ch measure turned it into six lines of
     near-headline text, the exact oversized-hero look the redesign was
     supposed to get away from. It now sits close to the prose measure and
     scales like a lede, not a display heading. */
  .cs-lead {
    margin: 0; font-weight: 300; line-height: 1.58; max-width: 58ch;
    font-size: clamp(18px, 1.65vw, 22px); color: #1a1a1a;
    letter-spacing: -0.012em;
  }
  .cs-section { margin-top: 56px; scroll-margin-top: 96px; }
  .cs-section-head {
    margin: 0 0 16px; font-weight: 400; letter-spacing: -0.016em;
    line-height: 1.25; font-size: clamp(19px, 1.7vw, 23px); color: #1a1a1a;
  }

  /* Evidence, placed at the section whose prose it backs up rather than
     pooled above the whole article. Same rhythm for a Carousel (results) and
     a single figure (the diagram) so the two read as one design language. */
  .cs-media, .cs-figure { margin-top: 28px; }
  .cs-figure-caption {
    margin: 12px 0 0; font-size: 11.5px; line-height: 1.6;
    color: rgba(26,26,26,0.5);
  }
  .cs-figure-todo {
    min-height: 200px; display: flex; align-items: center; justify-content: center;
    padding: 28px; border-radius: 12px; background: rgba(31,58,95,0.04);
  }

  /* In-flow metrics: numbers as evidence for the paragraph just above them,
     not a dashboard slab preceding the whole story. */
  .cs-metrics-inline { margin-top: 30px; }
  .cs-metrics {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(146px, 1fr));
    gap: 22px 34px; margin-top: 12px;
  }
  .cs-metric-value {
    margin: 0; font-weight: 300; letter-spacing: -0.022em; line-height: 1.1;
    font-size: clamp(22px, 1.9vw, 27px); color: #1f3a5f;
  }
  .cs-metric-label {
    margin: 5px 0 0; font-size: 11.5px; line-height: 1.5;
    color: rgba(26,26,26,0.55);
  }

  /* The article's last beat. No rule, no border — just more air and full ink
     (versus the 0.86-opacity prose) to mark it as the close rather than one
     more paragraph of "Where it stands". */
  .cs-closing {
    margin-top: 64px; max-width: 60ch;
    font-weight: 300; line-height: 1.65; letter-spacing: -0.006em;
    font-size: clamp(17px, 1.5vw, 19.5px); color: #1a1a1a;
  }

  /* Prose. One measure, one weight, one colour: the gutter carries all the
     structure, so the body has nothing to do but read well. */
  .cs-prose {
    font-weight: 300; line-height: 1.78; color: rgba(26,26,26,0.86);
    font-size: clamp(15.5px, 1.35vw, 17.5px);
  }
  .cs-prose p { margin: 0; }
  /* Bullets without bullets: the bolded opening clause is the marker, and the
     space between items is the separator. A glyph or a dash here would be one
     more line on a page that is trying not to have any. */
  .cs-points { list-style: none; margin: 22px 0 0; padding: 0; }
  .cs-points li + li { margin-top: 15px; }
  .cs-point-lead { color: #1a1a1a; font-weight: 500; }

  /* Table: zebra tone instead of row rules. */
  .cs-table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 12.5px; }
  .cs-table th {
    text-align: left; font-weight: 400; padding: 0 20px 10px 0;
    text-transform: uppercase; letter-spacing: 0.14em; font-size: 10px;
    color: rgba(26,26,26,0.42);
  }
  .cs-table td { padding: 9px 20px 9px 0; color: rgba(26,26,26,0.72); }
  .cs-table td:first-child { color: #1a1a1a; }
  .cs-table tbody tr:nth-child(odd) { background: rgba(26,26,26,0.028); }
  .cs-table th:first-child, .cs-table td:first-child { padding-left: 12px; border-radius: 5px 0 0 5px; }
  .cs-table td:last-child { border-radius: 0 5px 5px 0; }
  .cs-table-note { margin: 12px 0 0; font-size: 11.5px; color: rgba(26,26,26,0.5); }

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
