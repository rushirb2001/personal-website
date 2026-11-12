"use client"

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import { motion, MotionConfig, type Variants } from "motion/react"
import { cssEase, rise, springs, stagger } from "./motion"

// The accordion every page on the site is built on: a hero, a list of section
// heads, and one section open at a time, with the scroll choreographed around
// each open, switch and close. It was written inside app/HomePage.tsx and
// lives here so the inner pages (/projects, /writing, /resume, /hire) run the
// SAME code as the landing page rather than an imitation of it.
//
// Three layers:
//   useAccordion()            the state and the scroll choreography
//   Section / SectionHead     one collapsible section
//   AccordionPage             the whole page frame, for inner pages
// plus the Motion variants and the small wrappers (RowList, RowItem,
// HeroStagger, HeroItem) that give server-rendered content the landing page's
// entrances. HomePage composes the first two itself, around its own hero.
//
// The choreography is deliberately asymmetric and sequenced. The invariants
// are documented in CLAUDE.md ("Routes & key files", app/HomePage.tsx); read
// them before changing anything in useAccordion, and measure with
// `pnpm motion` (home.* and page.* flows), never by eye.

// ---- Variants ---------------------------------------------------------------

// Hero: orchestrated via staggerChildren so the LCP element (the h1) gets
// delayChildren: 0 and therefore animation delay 0. Chrome holds an element
// out of LCP contention while its opacity is 0, so any delay on it is added
// straight to the LCP metric.
export const heroContainerVariants = stagger(0.09, 0)
export const heroItemVariants = rise(12)

// Section heads: a deterministic cascade that picks up where the hero leaves
// off. It used to be whileInView, but every head is inside the closed
// landing's first viewport by design, so the IntersectionObserver only added
// latency and an order that depended on when each observer fired.
export const sectionHeadVariants: Variants = {
  hidden: { opacity: 0, transform: "translateY(14px)" },
  visible: (i: number) => ({
    opacity: 1,
    transform: "translateY(0px)",
    transition: { ...springs.reveal, delay: 0.22 + i * 0.05 },
  }),
}

// Row lists: re-armed every time a section's `open` boolean flips back to true
// so reopening a section replays the cascade. The hidden state is applied
// instantly and only AFTER the collapse has finished: animating rows out while
// their container is already collapsing is two exits for one action, and the
// rows were clipped before they finished anyway.
export const rowListVariants = stagger(0.05, 0.12)
export const rowItemVariants: Variants = {
  hidden: { opacity: 0, transform: "translateY(10px)", transition: { duration: 0, delay: 0.55 } },
  visible: { opacity: 1, transform: "translateY(0px)", transition: springs.reveal },
}

// ---- Styles -----------------------------------------------------------------

// The rules the accordion needs, for whichever page mounts it. HomePage
// interpolates this into its own <style>; AccordionPage injects it directly.
export const ACCORDION_CSS = `
  /* All scrolling on these pages is choreographed manually (pre-computed
     targets, scroll-then-flip sequencing). Browser scroll anchoring fights
     that: when a section's min-height snaps open while the viewport is
     scrolled, Chrome/Firefox re-anchor and teleport the scroll position
     mid-choreography.
     scrollbar-gutter keeps the scrollbar's lane reserved while the accordion
     flips the page between fitting the viewport and overflowing it; without
     it the centered layout (footer most visibly) shifts ~5px on every
     open/close. Declared here, not in globals.css, because the
     Tailwind/Lightning pipeline strips it there. */
  html { overflow-anchor: none; scrollbar-gutter: stable; }

  /* A head's paper and its hover tint. In this stylesheet, not as an inline
     style plus a hover utility: the inline background outranked the utility,
     so the head never answered the pointer. Both colours are opaque (the tint
     is the paper with 5% of the accent mixed in), because the head is sticky
     and content scrolls underneath it. */
  main section > button { background-color: #f4f1ec; }
  @media (hover: hover) {
    main section > button:hover { background-color: #e9e8e5; }
  }

  /* The last section head's bottom rule would run parallel to the footer's
     top rule with only blank slack between them, reading as an empty
     duplicate footer row. Rules belong BETWEEN items; the footer's own rule
     closes the list. The border returns while the section is open, where it
     separates the sticky head from content scrolling beneath it. */
  main section:last-of-type > button[aria-expanded="false"] {
    border-bottom-color: transparent;
  }

  /* Section open/close: an animated grid row, so height-to-auto tweens in
     every engine (interpolate-size is still Chromium-only and the old height
     transition snapped open on Safari/Firefox). */
  .section-collapsible {
    display: grid;
    grid-template-rows: 0fr;
    overflow: hidden;
    transition: grid-template-rows 350ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .section-collapsible[data-open="true"] {
    grid-template-rows: 1fr;
  }

  /* Section content reveal: opacity only. The spatial motion belongs to the
     Motion row cascade; this wrapper used to slide up 8px as well, so every
     row travelled on two overlapping curves at once. Opacity stays here
     because non-row content has no cascade of its own. */
  .section-content {
    min-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: opacity 400ms ${cssEase.reveal};
  }
  .section-collapsible[data-open="true"] .section-content {
    opacity: 1;
    transition-delay: 120ms;
  }

  @media (max-width: 639px) {
    /* Section heads and open-section content ride one svh curve (all clamps
       hit their caps together near 850svh, today's tall-phone design), so
       short viewports fit more per screen with the hierarchy ratios intact.
       Each content selector pairs an override with the Tailwind size utility
       it compresses. */
    main section > button { padding-block: clamp(8px, 1.6svh, 12px); }
    main section > button .display { font-size: clamp(16px, 2.75svh, 22px); }
    main section > button .mono { font-size: clamp(10px, 1.5svh, 12px); }
    main footer { margin-top: clamp(12px, 4.5svh, 40px); }
    main .section-content .text-\\[21px\\] { font-size: clamp(17px, 2.6svh, 19px); }
    main .section-content .text-\\[16px\\] { font-size: clamp(13px, 2svh, 14px); }
    main .section-content .text-\\[14px\\] { font-size: clamp(12px, 1.8svh, 13px); }
    main .section-content .text-\\[12px\\] { font-size: clamp(10.5px, 1.5svh, 11px); }
  }

  /* Soft open (upward section switch): the freshly opened section grows in
     slowly instead of snapping its height open. */
  @media (prefers-reduced-motion: no-preference) {
    section[data-soft] { transition: min-height 500ms cubic-bezier(0.22, 1, 0.36, 1); }
    section[data-soft] .section-collapsible { transition-duration: 500ms; }
  }

  /* Soft close (returning to the closed page): the collapse eases over 500ms,
     the mirror of the soft open, instead of the brisk 350ms that section
     SWITCHES must keep (their 380ms scroll timing depends on it). */
  @media (prefers-reduced-motion: no-preference) {
    [data-home-close] section,
    [data-home-close] .section-collapsible,
    [data-home-close] .section-content { transition-duration: 500ms; }
  }

  @media (prefers-reduced-motion: reduce) {
    .section-collapsible,
    .section-content,
    .accent-link,
    .accent-link::after { transition: none; }
  }

  /* Paper keeps everything: every section open, nothing mid-entrance. */
  @media print {
    main section { min-height: 0 !important; }
    .section-collapsible { display: block !important; overflow: visible !important; }
    .section-content { opacity: 1 !important; overflow: visible !important; }
    .section-content > div { min-height: 0 !important; display: block !important; padding-bottom: 28px !important; }
    [data-reveal] { opacity: 1 !important; transform: none !important; }
  }
`

// ---- State and choreography -------------------------------------------------

const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

export function useAccordion() {
  const [openSection, setOpenSection] = useState<string | null>(null)
  // True when the open section should GROW in (upward section switch, where
  // the scroll has already landed) instead of snapping its height open (fresh
  // open, where the scroll still needs the room to exist).
  const [softOpen, setSoftOpen] = useState(false)
  // True while a close-to-home collapse plays: sections get the soft 500ms
  // close (mirror of softOpen) instead of the brisk 350ms that the section-
  // switch choreography's 380ms scroll timing depends on.
  const [homeClosing, setHomeClosing] = useState(false)
  const homeCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const programmaticScrollRef = useRef(false)
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const heroWrapRef = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let prevY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const goingUp = y < prevY
      prevY = y
      if (programmaticScrollRef.current) return
      // Direction-gated: only an upward glide past the section head closes
      // the accordion. Without the gate, parking at the top while a scroll
      // lock is active and then scrolling DOWN to read would collapse the
      // section underfoot on the first scroll event.
      if (goingUp && y < 40) {
        setOpenSection((prev) => (prev === null ? prev : null))
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const lockScroll = (ms = 1200) => {
    programmaticScrollRef.current = true
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current)
    lockTimerRef.current = setTimeout(() => {
      programmaticScrollRef.current = false
    }, ms)
  }

  const pendingCloseRef = useRef<(() => void) | null>(null)

  const softClose = () => {
    setHomeClosing(true)
    if (homeCloseTimerRef.current) clearTimeout(homeCloseTimerRef.current)
    homeCloseTimerRef.current = setTimeout(() => setHomeClosing(false), 700)
  }

  // Closing mirrors opening, sequenced: glide back to the top FIRST while the
  // page still has its expanded height (collapsing while scrolled lets the
  // document shrink faster than the smooth scroll, so the browser clamp-jumps
  // the position). Only on arrival collapse the section, below the fold, while
  // the hero glides back to center.
  const closeToTop = () => {
    pendingCloseRef.current?.()
    if (prefersReduced() || window.scrollY < 40) {
      lockScroll()
      softClose()
      setOpenSection(null)
      // "instant", not "auto": with html { scroll-behavior: smooth } an
      // "auto" scroll resolves to smooth, animating for the very users who
      // asked for no motion.
      window.scrollTo({ top: 0, behavior: "instant" })
      return
    }
    lockScroll(1600)
    window.scrollTo({ top: 0, behavior: "smooth" })
    let done = false
    const finish = () => {
      if (done) return
      done = true
      window.removeEventListener("scrollend", finish)
      pendingCloseRef.current = null
      softClose()
      setOpenSection(null)
    }
    pendingCloseRef.current = () => {
      done = true
      window.removeEventListener("scrollend", finish)
      pendingCloseRef.current = null
    }
    window.addEventListener("scrollend", finish, { once: true })
    // Safari has no scrollend: watch for arrival each frame so the collapse
    // fires the moment the glide lands. The timeout is a last resort only;
    // a short fixed timer would cut long glides early and clamp-jump.
    const settle = () => {
      if (done) return
      if (window.scrollY < 2) return finish()
      requestAnimationFrame(settle)
    }
    requestAnimationFrame(settle)
    setTimeout(finish, 2000)
  }

  const toggleSection = (id: string) => {
    if (openSection === id) {
      closeToTop()
      return
    }
    pendingCloseRef.current?.()
    // A lingering soft-close flag would slow the switch collapse past the
    // 380ms scroll timing; switches always use the standard durations.
    if (homeCloseTimerRef.current) clearTimeout(homeCloseTimerRef.current)
    setHomeClosing(false)
    const switching = openSection !== null
    const reduced = prefersReduced()

    // Switching to a section ABOVE the open one: expanding it right away
    // would grow the page above the viewport and shove the visible content
    // down a full frame. Reverse the order instead: glide up to the target's
    // header first (its position is stable while the old section stays open),
    // and swap the sections on arrival. The old one then collapses below the
    // viewport while the new one expands downward under its header, same as
    // the downward direction.
    const el = document.getElementById(id)
    const openEl = switching ? document.getElementById(openSection!) : null
    if (!reduced && el && openEl && el.offsetTop < openEl.offsetTop) {
      const targetTop = Math.max(0, el.offsetTop - 56)
      lockScroll(1800)
      let done = false
      const finish = () => {
        if (done) return
        done = true
        window.removeEventListener("scrollend", finish)
        pendingCloseRef.current = null
        setSoftOpen(true)
        setOpenSection(id)
      }
      pendingCloseRef.current = () => {
        done = true
        window.removeEventListener("scrollend", finish)
        pendingCloseRef.current = null
      }
      if (Math.abs(window.scrollY - targetTop) < 2) {
        finish()
        return
      }
      window.scrollTo({ top: targetTop, behavior: "smooth" })
      window.addEventListener("scrollend", finish, { once: true })
      // Arrival watcher for browsers without scrollend (Safari), so short
      // glides don't dead-stall on a fixed timer; long timeout as last resort.
      const settle = () => {
        if (done) return
        if (Math.abs(window.scrollY - targetTop) < 2) return finish()
        requestAnimationFrame(settle)
      }
      requestAnimationFrame(settle)
      setTimeout(finish, 2000)
      return
    }

    // A previous glide may still be in flight (rapid tab clicks); freeze it
    // so the choreography below starts from a stationary viewport instead of
    // letting the old scroll keep travelling the wrong way during the wait.
    if (programmaticScrollRef.current) {
      window.scrollTo({ top: window.scrollY, behavior: "instant" })
    }
    lockScroll(1400)

    // Opening from the closed landing: the hero gives up its centering space
    // over 350ms, so a live offsetTop read mid-transition would overshoot.
    // Measure the still-stable closed layout now and pre-compute where the
    // section head lands once the leftover space is gone, then scroll to that
    // fixed target concurrently with the collapse.
    let target: number | null = null
    if (!switching && !reduced) {
      const el = document.getElementById(id)
      const wrap = heroWrapRef.current
      const hero = heroSectionRef.current
      if (el && wrap && hero) {
        const leftover = Math.max(0, wrap.offsetHeight - hero.offsetHeight)
        target = Math.max(0, el.offsetTop - leftover - 56)
      }
    }

    // Switching below while scrolled deeper than the old section's collapse
    // will leave room for: the browser would clamp-yank the viewport frame by
    // frame during the 380ms wait, then glide: two disjoint motions. Project
    // the post-collapse layout (stable arithmetic, same idiom as the fresh-
    // open pre-compute) and, only when that clamp is inevitable, launch the
    // glide immediately so the descent reads as one intentional motion.
    let immediateTarget: number | null = null
    if (switching && !reduced && el && openEl) {
      const headH = openEl.querySelector("button")?.offsetHeight ?? 57
      const collapsing = Math.max(0, openEl.offsetHeight - headH)
      const opening = Math.max(0, window.innerHeight - 56 - headH)
      const projectedMax =
        document.documentElement.scrollHeight - collapsing + opening - window.innerHeight
      if (window.scrollY > projectedMax) {
        immediateTarget = Math.max(0, el.offsetTop - collapsing - 56)
      }
    }

    setSoftOpen(false)
    setOpenSection(id)
    const scrollToSection = () => {
      if (target !== null) {
        window.scrollTo({ top: target, behavior: "smooth" })
        return
      }
      const el = document.getElementById(id)
      if (el) {
        window.scrollTo({ top: el.offsetTop - 56, behavior: reduced ? "instant" : "smooth" })
      }
    }
    if (switching && !reduced) {
      if (immediateTarget !== null) {
        const top = immediateTarget
        requestAnimationFrame(() =>
          requestAnimationFrame(() => window.scrollTo({ top, behavior: "smooth" })),
        )
      } else {
        // Wait for the previous section's height transition (350ms) to finish
        // so the target's offsetTop is stable before we commit a smooth scroll.
        setTimeout(scrollToSection, 380)
      }
    } else {
      requestAnimationFrame(() => requestAnimationFrame(scrollToSection))
    }
  }

  const goHome = () => closeToTop()

  return { openSection, softOpen, homeClosing, toggleSection, goHome, heroWrapRef, heroSectionRef }
}

// ---- Section ----------------------------------------------------------------

// Whether the enclosing section is open. `null` means "not inside an
// accordion" (an article page), where rows render in place with no cascade.
const SectionOpenContext = createContext<boolean | null>(null)

export function Section({
  id,
  title,
  count,
  index,
  open,
  soft = false,
  onToggle,
  children,
}: {
  id: string
  title: string
  count?: number
  /** Position in the page's list of sections: the head's place in the cascade. */
  index: number
  open: boolean
  soft?: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <section
      id={id}
      data-soft={open && soft ? "" : undefined}
      // Asymmetric on purpose: min-height SNAPS on open (the smooth scroll to
      // the section head needs that scroll room to already exist, or the
      // browser clamps it and lands short) but ANIMATES on close so the page
      // glides back up instead of jumping when the height vanishes. The inline
      // transition-none applies only in the open state, i.e. to the opening
      // edge; the closing edge reads the class transition.
      className={`scroll-mt-14 max-w-[1100px] mx-auto px-6 lg:px-12 motion-safe:transition-[min-height] motion-safe:duration-[350ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] ${
        open ? "min-h-[calc(100vh-3.5rem)]" : "min-h-0"
      }`}
      style={open && !soft ? { transitionProperty: "none" } : undefined}
    >
      <SectionHead id={id} title={title} count={count} index={index} open={open} onToggle={onToggle} />
      <div
        id={`${id}-content`}
        data-open={open}
        // inert, not aria-hidden: a collapsed section still holds its links,
        // and aria-hidden leaves them in the tab order (a keyboard user tabs
        // into content they cannot see). inert takes the subtree out of both
        // the tab order and the accessibility tree.
        inert={!open}
        className="section-collapsible"
      >
        <div className="section-content">
          <div className="pt-4 xs:pt-6 pb-14 xs:pb-20 min-h-[calc(100vh-9rem)] flex flex-col justify-center">
            <SectionOpenContext.Provider value={open}>{children}</SectionOpenContext.Provider>
          </div>
        </div>
      </div>
    </section>
  )
}

function SectionHead({
  id,
  title,
  count,
  index,
  open,
  onToggle,
}: {
  id: string
  title: string
  count?: number
  index: number
  open: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={`${id}-content`}
      // Tailwind v4 scale utilities set the standalone `scale` property, so
      // the transition list must name `scale` (not `transform`) or the
      // active-press feedback snaps.
      className="sticky top-14 z-30 -mx-6 lg:-mx-12 px-6 lg:px-12 py-3 border-b rule w-[calc(100%+3rem)] lg:w-[calc(100%+6rem)] text-left transition-[background-color,scale] duration-200 ease-out active:scale-[0.997] active:duration-100 cursor-pointer"
    >
      <motion.div
        data-reveal
        className="grid grid-cols-[auto_1fr_auto] xs:grid-cols-[clamp(80px,14vw,140px)_1fr_clamp(140px,22vw,240px)] lg:grid-cols-[140px_1fr_240px] gap-3 xs:gap-6 lg:gap-12 items-baseline"
        variants={sectionHeadVariants}
        custom={Math.max(0, index)}
        initial="hidden"
        animate="visible"
      >
        <span className="display accent text-[22px] xs:text-[clamp(20px,4.5vw,26px)] lg:text-3xl font-light leading-none">+</span>
        <h2 className="display text-[22px] xs:text-[clamp(20px,4.5vw,26px)] lg:text-3xl font-light tracking-tight leading-none">
          {title}
          <span className="accent">.</span>
        </h2>
        {count != null ? (
          <span className="mono text-[12px] xs:text-[13px] faint text-right tracking-[0.18em]">
            {String(count).padStart(2, "0")}
          </span>
        ) : (
          <span aria-hidden />
        )}
      </motion.div>
    </button>
  )
}

// ---- Entrance wrappers for server-rendered content --------------------------

// A section's list of rows. Inside an accordion it re-arms the row cascade
// each time the section opens; outside one it is a plain list.
export function RowList({
  as = "ol",
  className = "mt-2 lg:mt-3",
  children,
}: {
  as?: "ol" | "ul" | "div"
  className?: string
  children: ReactNode
}) {
  const open = useContext(SectionOpenContext)
  if (open === null) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }
  const Tag = motion[as]
  return (
    <Tag className={className} variants={rowListVariants} initial="hidden" animate={open ? "visible" : "hidden"}>
      {children}
    </Tag>
  )
}

// One row. Takes its cue from the RowList above it; with no RowList (or none
// inside an accordion) it has nothing to inherit and simply renders.
export function RowItem({
  as = "li",
  className,
  children,
}: {
  as?: "li" | "div"
  className?: string
  children: ReactNode
}) {
  const Tag = motion[as]
  return (
    <Tag data-reveal className={className} variants={rowItemVariants}>
      {children}
    </Tag>
  )
}

// The hero cascade: the first HeroItem lands at delay 0, the rest follow.
export function HeroStagger({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <motion.header className={className} variants={heroContainerVariants} initial="hidden" animate="visible">
      {children}
    </motion.header>
  )
}

export function HeroItem({
  as = "div",
  className,
  children,
}: {
  as?: "div" | "h1" | "p"
  className?: string
  children: ReactNode
}) {
  const Tag = motion[as]
  return (
    <Tag data-reveal className={className} variants={heroItemVariants}>
      {children}
    </Tag>
  )
}

// The footer bar's mount fade-up, last in the page's entrance.
export function FooterRise({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ opacity: 0, transform: "translateY(12px)" }}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      transition={{ ...springs.reveal, delay: 0.42 }}
    >
      {children}
    </motion.div>
  )
}

// Honours the visitor's reduced-motion setting for every wrapper above. The
// accordion frames set this themselves; an article page wraps its content in
// it (see PageShell).
export function MotionRoot({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

// ---- The page frame, for inner pages ----------------------------------------

export type AccordionSection = {
  id: string
  title: string
  count?: number
  content: ReactNode
}

// The landing page's frame around server-rendered parts: the closed page is a
// full-height column with the hero centred in the space above the section
// heads; opening a section gives that space up and glides the head to the top
// bar. `nav`, `hero`, `footer` and each section's `content` arrive already
// rendered from the server route, so the only client code here is the
// accordion itself.
export function AccordionPage({
  nav,
  hero,
  sections,
  footer,
}: {
  nav: ReactNode
  hero: ReactNode
  sections: AccordionSection[]
  footer: ReactNode
}) {
  const { openSection, softOpen, homeClosing, toggleSection, heroWrapRef, heroSectionRef } = useAccordion()

  return (
    <MotionConfig reducedMotion="user">
      <main className="paper min-h-screen">
        <style>{ACCORDION_CSS}</style>
        <div
          // Asymmetric like the sections, in reverse: min-height ANIMATES away
          // on open (the centering glide) but SNAPS back to 100svh on close.
          // If it animated on close too, the collapsing content outruns the
          // growing min-height and the document dips below the viewport for a
          // few frames: the footer visibly rides up and drops back.
          className={`grain relative z-0 flex flex-col motion-safe:transition-[min-height] motion-safe:duration-[350ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] ${
            openSection === null ? "min-h-[100svh]" : "min-h-0"
          }`}
          style={openSection === null ? { transitionProperty: "none" } : undefined}
          data-home-close={homeClosing ? "" : undefined}
        >
          {nav}

          {/* Centred in the leftover space while closed (sm+). Phones flow
              from the top and collect the leftover under the section list,
              as the landing page does. */}
          <div ref={heroWrapRef} className="sm:flex-1 flex flex-col sm:justify-center">
            <section ref={heroSectionRef} className="w-full max-w-[1100px] mx-auto px-6 lg:px-12">
              {hero}
            </section>
          </div>

          <div className="mb-auto sm:mb-0">
            {sections.map((s, i) => (
              <Section
                key={s.id}
                id={s.id}
                title={s.title}
                count={s.count}
                index={i}
                open={openSection === s.id}
                soft={softOpen}
                onToggle={() => toggleSection(s.id)}
              >
                {s.content}
              </Section>
            ))}
          </div>

          {footer}
        </div>
      </main>
    </MotionConfig>
  )
}
