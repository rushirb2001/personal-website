"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { TocNav } from "./TocNav"
import { hasProjectDetail } from "./projects/projects-data"

const WORK = [
  {
    company: "Arizona State University",
    companyShort: "ASU",
    role: "ML Researcher",
    period: "Nov 2025 – Present",
    desc: "Developing a modular PyTorch Lightning + JAX framework to benchmark neural surrogate models against traditional plasma solvers for semiconductor etch-chamber simulations.",
    descShort: "Benchmarking neural surrogate models against traditional plasma solvers for etch-chamber simulations.",
    stack: ["PyTorch Lightning", "JAX", "Hydra", "WandB"],
    current: true,
  },
  {
    company: "OpenEye, Cadence Design Systems",
    companyShort: "Cadence",
    role: "ML Engineer Intern",
    period: "Jul 2025 – Oct 2025",
    desc: "Engineered an ESM2 + contrastive-learning pipeline batched through cuDF and PyTorch Lightning; replaced a GPR stall with cuML/RAFT (batch-scaling 150→50K+ @7.2ms/seq).",
    descShort: "Built an ESM2 + contrastive-learning pipeline; scaled protein property prediction from 150 to 50K+ sequences.",
    stack: ["ESM2", "cuDF", "cuML", "RAFT", "OmegaConf"],
    current: false,
  },
  {
    company: "Talin Labs",
    companyShort: "Talin Labs",
    role: "GenAI Engineering Intern",
    period: "Jun 2024 – Sep 2024",
    desc: "Deployed a fine-tuned Mistral-7B-Q8 on Kubernetes behind FastAPI with a six-agent LangChain orchestration. Sub-200 ms p95 for 10K users; 88% on 10K human-evaluated queries.",
    descShort: "Deployed a fine-tuned Mistral-7B on Kubernetes with six-agent LangChain orchestration, sub-200 ms p95 for 10K users.",
    stack: ["Mistral-7B", "Kubernetes", "FastAPI", "LangChain", "LangGraph"],
    current: false,
  },
]

const PROJECTS = [
  {
    name: "MACE-PINN",
    platform: "",
    slug: "mace-pinn",
    descShort: "Thesis neural network that solves stiff, coupled physics equations single-network models struggle with.",
    type: "Master's thesis",
    year: "2025",
    desc: "Master's thesis neural network that accurately solves the stiff, tightly coupled physics equations that standard single-network models struggle to capture.",
    stack: ["JAX", "Flax", "NumPy"],
    links: [
      { label: "paper", href: "https://keep.lib.asu.edu/items/201211" },
    ],
  },
  {
    name: "Samhita",
    platform: "sushrutalgs.ai",
    slug: "samhita",
    descShort: "Turns surgical-textbook PDFs into a structured, searchable knowledge base for the platform.",
    type: "Data pipeline",
    year: "2026",
    desc: "Data ingestion module for the sushrutalgs.ai platform that turns surgical-textbook PDFs into a structured, searchable knowledge base for the rest of the platform to draw on.",
    stack: ["Python", "BioLORD", "Cloudflare R2"],
    links: [],
  },
  {
    name: "HybridFlow",
    platform: "sushrutalgs.ai",
    slug: "hybridflow",
    descShort: "Retrieves the most relevant medical knowledge and streams grounded answers to each question.",
    type: "Retrieval backend",
    year: "2026",
    desc: "Retrieval module for the sushrutalgs.ai platform that pulls the most relevant medical knowledge and generates grounded, streaming answers to each question.",
    stack: ["Python", "FastAPI", "Qdrant", "Neo4j"],
    links: [],
  },
  {
    name: "backend-for-frontend",
    platform: "sushrutalgs.ai",
    slug: "sushrutalgs-bff",
    descShort: "Gateway connecting the apps to the AI backend: sign-in, plan limits, streaming. Live in production.",
    type: "API gateway",
    year: "2026",
    desc: "Gateway module for the sushrutalgs.ai platform that connects the apps to the AI backend, signing users in, enforcing their plan limits, and streaming answers back. Live in production.",
    stack: ["TypeScript", "Hono", "Cloudflare Workers", "Supabase"],
    links: [],
  },
  {
    name: "ios-app-client",
    platform: "sushrutalgs.ai",
    slug: "sushrutalgs-ios",
    descShort: "Native iPhone app for studying with the AI assistant, with live streaming answers across devices.",
    type: "iOS app",
    year: "2026",
    desc: "Native iPhone app for the sushrutalgs.ai platform where users study with the AI assistant, with answers that stream in live and sessions that carry across their devices.",
    stack: ["Swift 6", "SwiftUI", "supabase-swift", "Xcode Cloud"],
    links: [],
  },
  {
    name: "website-client",
    platform: "sushrutalgs.ai",
    slug: "sushrutalgs-web",
    descShort: "Web app for studying with the AI assistant, every answer backed by textbook citations.",
    type: "Web app",
    year: "2026",
    desc: "Web app for the sushrutalgs.ai platform where users study with the AI assistant, branching conversations into follow-ups with every answer backed by textbook citations, figures, and tables.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Supabase", "Vercel"],
    links: [],
  },
  {
    name: "Yelp ML Platform",
    platform: "",
    slug: "yelp-ml-platform",
    descShort: "End-to-end ML system on the Yelp dataset: recommendations and review sentiment from one API.",
    type: "ML platform",
    year: "2025",
    desc: "End-to-end ML system on the full Yelp dataset that recommends businesses to users and reads the sentiment of their reviews, served from one fast API.",
    stack: ["PySpark", "FastAPI", "MLflow", "Docker", "NumPy"],
    links: [{ label: "github", href: "https://github.com/rushirb2001/yelp-ml-platform" }],
  },
]

const EDUCATION = [
  {
    degree: "MS, Data Science",
    school: "Arizona State University",
    schoolShort: "ASU",
    gpa: "3.71",
    focus: "High Performance Computing and Decision Analytics",
    year: "2025",
    coursework: ["Statistical ML", "Distributed Systems", "GPU Computing", "Deep Learning Theory", "Numerical Methods", "Optimization"],
    highlights: [
      {
        text: "Thesis: Multi-Architecture Coupled Ensemble Physics-Informed Neural Networks",
        textShort: "Thesis: Coupled Ensemble Physics-Informed Neural Networks",
        href: "https://keep.lib.asu.edu/items/201211",
      },
      { text: "GPA 3.71" },
    ],
  },
  {
    degree: "B.Tech, Computer Science",
    school: "Nirma University",
    schoolShort: "Nirma",
    focus: "Robotics, Computer Vision and Automation",
    year: "2023",
    coursework: ["Algorithms", "Operating Systems", "Computer Networks", "Databases", "Compilers", "Linear Algebra"],
    highlights: [
      {
        text: "Classification of potentially hazardous asteroids using supervised quantum machine learning · IEEE Access, 2023",
        textShort: "Hazardous-asteroid classification with quantum ML · IEEE Access, 2023",
        href: "https://ieeexplore.ieee.org/iel7/6287639/6514899/10188662.pdf",
      },
      {
        text: "MetaHate: AI-based hate speech detection for secured online gaming in metaverse using blockchain · Security and Privacy, 2024",
        textShort: "MetaHate: hate-speech detection for metaverse gaming · Security and Privacy, 2024",
        href: "https://onlinelibrary.wiley.com/doi/abs/10.1002/spy2.343",
      },
    ],
  },
]

const LINKS = [
  { label: "Email", value: "bhavsarrushir@gmail.com", href: "mailto:bhavsarrushir@gmail.com" },
  { label: "LinkedIn", value: "rushir-bhavsar", href: "https://linkedin.com/in/rushir-bhavsar/" },
  { label: "GitHub", value: "rushirb2001", href: "https://github.com/rushirb2001" },
  { label: "Resume", value: "PDF", href: "https://v9fl0vq2qbxv8yrh.public.blob.vercel-storage.com/RUSHIR_BHAVSAR_RESUME.pdf" },
]

export default function BetaPage() {
  const [openSection, setOpenSection] = useState<string | null>(null)
  // True when the open section should GROW in (upward section switch, where
  // the scroll has already landed) instead of snapping its height open (fresh
  // open, where the scroll still needs the room to exist).
  const [softOpen, setSoftOpen] = useState(false)
  const programmaticScrollRef = useRef(false)
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const heroWrapRef = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (programmaticScrollRef.current) return
      if (window.scrollY < 40) {
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

  const prefersReduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

  const pendingCloseRef = useRef<(() => void) | null>(null)

  // Closing mirrors opening, sequenced: glide back to the top FIRST while the
  // page still has its expanded height (collapsing while scrolled lets the
  // document shrink faster than the smooth scroll, so the browser clamp-jumps
  // the position). Only on arrival collapse the section, below the fold, while
  // the hero glides back to center.
  const closeToTop = () => {
    pendingCloseRef.current?.()
    if (prefersReduced() || window.scrollY < 40) {
      lockScroll()
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
      setOpenSection(null)
    }
    pendingCloseRef.current = () => {
      done = true
      window.removeEventListener("scrollend", finish)
      pendingCloseRef.current = null
    }
    window.addEventListener("scrollend", finish, { once: true })
    setTimeout(finish, 900) // fallback where scrollend is unsupported
  }

  const toggleSection = (id: string) => {
    if (openSection === id) {
      closeToTop()
      return
    }
    pendingCloseRef.current?.()
    const switching = openSection !== null
    const reduced = prefersReduced()

    // Switching to a section ABOVE the open one: expanding it right away
    // would grow the page above the viewport and shove the visible content
    // down a full frame. Reverse the order instead: glide up to the target's
    // header first (its position is stable while the old section stays open),
    // and swap the sections on arrival — the old one then collapses below the
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
      setTimeout(finish, 1000) // fallback where scrollend is unsupported
      return
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
      // Wait for the previous section's height transition (350ms) to finish
      // so the target's offsetTop is stable before we commit a smooth scroll.
      setTimeout(scrollToSection, 380)
    } else {
      requestAnimationFrame(() => requestAnimationFrame(scrollToSection))
    }
  }

  const goHome = () => closeToTop()

  return (
    <main className="min-h-screen bg-[#f4f1ec] text-[#1a1a1a]">
      <style>{`
        .ink { color: #1a1a1a; }
        .muted { color: rgba(26,26,26,0.55); }
        .faint { color: rgba(26,26,26,0.38); }
        .rule { border-color: rgba(26,26,26,0.12); }
        .accent { color: #1f3a5f; }
        .accent-bg { background-color: #1f3a5f; }
        .accent-line { background-color: #1f3a5f; }
        .display { font-family: "Google Sans", ui-sans-serif, system-ui, sans-serif; font-optical-sizing: auto; }
        .mono { font-family: "Google Sans Code", ui-monospace, "SFMono-Regular", "Menlo", monospace; font-variation-settings: "MONO" 1; }
        .accent-link { position: relative; transition: color 200ms ease; }
        .accent-link::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -2px;
          height: 1px;
          background-color: #1f3a5f;
          transform-origin: left;
          transform: scaleX(0.35);
          transition: transform 250ms ease;
        }
        .accent-link:hover { color: #1f3a5f; }
        .accent-link:hover::after { transform: scaleX(1); }
        .small-caps {
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-size: 10px;
        }

        /* All scrolling on this page is choreographed manually (pre-computed
           targets, scroll-then-flip sequencing). Browser scroll anchoring
           fights that: when a section's min-height snaps open while the
           viewport is scrolled, Chrome/Firefox re-anchor and teleport the
           scroll position mid-choreography. */
        html { overflow-anchor: none; }

        /* Section open/close — animated grid row, so height-to-auto tweens in
           every engine (interpolate-size is still Chromium-only and the old
           height transition snapped open on Safari/Firefox). */
        .section-collapsible {
          display: grid;
          grid-template-rows: 0fr;
          overflow: hidden;
          transition: grid-template-rows 350ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .section-collapsible[data-open="true"] {
          grid-template-rows: 1fr;
        }

        /* Section content reveal — fade-up after expansion */
        .section-content {
          min-height: 0;
          overflow: hidden;
          opacity: 0;
          transform: translateY(8px);
          transition:
            opacity 400ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 400ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .section-collapsible[data-open="true"] .section-content {
          opacity: 1;
          transform: translateY(0);
          transition-delay: 120ms;
        }

        /* Hero entrance — runs once on initial mount */
        @keyframes hero-fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-anim > div > * {
          animation: hero-fade-up 700ms cubic-bezier(0.22, 1, 0.36, 1) backwards;
        }
        .hero-anim > div > *:nth-child(1) { animation-delay: 100ms; }
        .hero-anim > div > *:nth-child(2) { animation-delay: 280ms; }
        .hero-anim > div > *:nth-child(3),
        .hero-anim > div > *:nth-child(4),
        .hero-anim > div > *:nth-child(5) { animation-delay: 200ms; }

        /* Hero layout — one set of elements recomposed by grid areas. Phones:
           photo anchors the left column, name + short copy stack beside it.
           sm+: name + description own the left column, photo sits right, with
           photo column / gap / display size riding the same viewport scale so
           squeezed widths render as a scaled-down desktop. */
        .hero-grid {
          display: grid;
          grid-template-columns: clamp(150px, 48%, 220px) minmax(0, 1fr);
          grid-template-rows: auto 1fr auto;
          grid-template-areas:
            "photo name"
            "photo copy"
            "open  open";
          column-gap: 1.25rem;
          row-gap: 0.875rem;
        }
        .hero-name { grid-area: name; }
        .hero-photo-block { grid-area: photo; }
        .hero-copy { grid-area: copy; }
        .hero-open { grid-area: open; }
        .hero-desc { grid-area: desc; }
        @media (min-width: 640px) {
          .hero-grid {
            grid-template-columns: minmax(0, 1fr) clamp(150px, 24vw, 280px);
            grid-template-rows: auto auto;
            grid-template-areas:
              "name photo"
              "desc photo";
            column-gap: clamp(24px, 5.4vw, 64px);
            row-gap: 0;
          }
        }

        .grain::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          background-image: radial-gradient(rgba(26,26,26,0.035) 1px, transparent 1px);
          background-size: 3px 3px;
          mix-blend-mode: multiply;
          z-index: 1;
        }

        /* Short, wide viewports (iPad landscape, short laptop windows) can't fit
           the full-size hero + section list in one screen, so it overflows under
           the browser toolbar. Compact the hero so the closed landing fits.
           The media query keys off the layout viewport height (≈820 on iPad
           landscape), while the layout itself fits within 100svh. */
        /* Short, wide viewports: compact the hero proportionally so the closed
           landing still fits. Photo column and display shrink on the same
           curve as the default scale, just lower caps. */
        @media (min-width: 768px) and (max-height: 960px) {
          .hero-section { padding-top: 0.75rem; padding-bottom: 0.75rem; }
          .hero-section h1 { font-size: clamp(52px, 8.5vw, 92px); }
          .hero-grid { grid-template-columns: 1fr clamp(150px, 20vw, 220px); }
          .hero-section .hero-photo { max-width: 220px; }
        }

        /* Soft open (upward section switch): the freshly opened section grows
           in slowly instead of snapping its height open. */
        @media (prefers-reduced-motion: no-preference) {
          section[data-soft] { transition: min-height 500ms cubic-bezier(0.22, 1, 0.36, 1); }
          section[data-soft] .section-collapsible { transition-duration: 500ms; }
        }

        /* Short phone viewports: shrink the photo column so the hero doesn't
           crowd the section list. */
        @media (max-width: 639px) and (max-height: 720px) {
          .hero-grid { grid-template-columns: clamp(120px, 40%, 170px) minmax(0, 1fr); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-anim > div > * { animation: none; }
          .section-collapsible,
          .section-content,
          .accent-link,
          .accent-link::after { transition: none; }
        }
      `}</style>

      <div
        className={`grain relative z-0 flex flex-col motion-safe:transition-[min-height] motion-safe:duration-[350ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] ${
          openSection === null ? "min-h-[100svh]" : "min-h-0"
        }`}
      >
        <TocNav active={openSection} onSelect={toggleSection} onHome={goHome} />

        {/* Hero — centered in the leftover space above the section list while
            closed. The centering stays mounted; opening a section animates the
            wrapper's min-height away, so the leftover space (and with it the
            centering) glides to zero instead of snapping. toggleSection
            pre-computes scroll targets from the measured leftover. */}
        <div ref={heroWrapRef} className="flex-1 flex flex-col justify-center">
        <section ref={heroSectionRef} className="hero-anim hero-section max-w-[1100px] mx-auto px-6 lg:px-12 pt-6 xs:pt-8 lg:pt-12 pb-8 xs:pb-10 lg:pb-14">
          {/* One proportional system from sm up: photo column (24vw, cap 280),
              gap (5.4vw, cap 64) and display size (10vw, cap 120) all ride the
              same viewport scale and hit their caps together near the 1100px
              container max, so any squeezed width renders as a scaled-down
              desktop instead of a different composition. */}
          {/* One photo, one name, one copy block — recomposed per breakpoint by
              the .hero-grid grid-template-areas in the style block above. */}
          <div className="hero-grid">
            <h1 className="hero-name display font-light leading-[0.95] sm:leading-[0.92] tracking-tight text-[clamp(30px,9.6vw,46px)] sm:text-[clamp(52px,10vw,120px)]">
              Hi! I&rsquo;m Rushir
              <br />
              Bhavsar<span className="accent">.</span>
            </h1>

            <div className="hero-photo-block pt-1 sm:pt-3 lg:pt-4">
              <div className="hero-photo relative w-full max-w-[280px] aspect-[3/4] overflow-hidden grayscale rounded-2xl">
                <Image
                  src="/images/design-mode/new_personal_photo(1).png"
                  alt="Rushir Bhavsar"
                  fill
                  sizes="(max-width: 639px) 48vw, (max-width: 1167px) 24vw, 280px"
                  className="object-cover object-[60%_30%]"
                  priority
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10" />
              </div>
              <div className="hidden sm:block mt-5 mono text-[13px] muted leading-[1.7]">
                <p>
                  <span className="accent">+</span> Product, AI, RAG, DevOps
                </p>
                <p>
                  <span className="accent">+</span> Tempe, Arizona
                </p>
              </div>
            </div>

            <div className="hero-copy sm:hidden flex flex-col">
              <div className="my-auto">
                <p className="display font-light text-[16px] leading-[1.5]">
                  Building{" "}
                  <a
                    href="https://sushrutalgs.ai/welcome"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="accent-link accent"
                  >
                    sushrutalgs.ai
                  </a>
                  , medical AI for India.
                </p>
              </div>
            </div>

            <p className="hero-open sm:hidden display font-light text-[16px] leading-[1.5] muted mt-1">
              <span className="accent">+</span> Open to Product Manager, AI Engineer &amp; Forward-Deployed Engineer roles.
            </p>

            <div className="hero-desc hidden sm:block display font-light text-[16px] sm:text-[clamp(16px,1.7vw,20px)] mt-7 lg:mt-8 leading-[1.5] max-w-[44ch]">
              Currently building{" "}
              <a
                href="https://sushrutalgs.ai/welcome"
                target="_blank"
                rel="noopener noreferrer"
                className="accent-link accent"
              >
                sushrutalgs.ai
              </a>{" "}
              for India, pushing the frontier on the next big medical AI for
              students, residents, and surgical practitioners. Previously at
              ASU and Cadence.
              <span className="block mt-3 xs:mt-4 muted">
                Looking for Product Manager, AI Engineer, and
                Forward-Deployed Engineer roles.
              </span>
            </div>
          </div>
        </section>
        </div>

        <div>
        <Section
          id="experience"
          title="Experience"
          count={WORK.length}
          open={openSection === "experience"}
          soft={softOpen}
          onToggle={() => toggleSection("experience")}
        >
          <ol className="mt-2 lg:mt-3">
            {WORK.map((w, i) => (
              <li
                key={w.company}
                className={`grid grid-cols-1 xs:grid-cols-[clamp(80px,14vw,140px)_1fr_clamp(140px,22vw,240px)] lg:grid-cols-[140px_1fr_240px] gap-3 xs:gap-6 lg:gap-12 py-5 xs:py-8 lg:py-10 first:pt-2 xs:first:pt-4 lg:first:pt-6 ${
                  i !== WORK.length - 1 ? "border-b rule" : ""
                }`}
              >
                <div className="mono text-[12px] xs:text-[13px] leading-none flex xs:flex-col items-start gap-3 xs:gap-2 xs:pt-2 lg:pt-[10px]">
                  <span className={w.current ? "accent" : "ink"}>{w.period}</span>
                </div>
                <div>
                  <h3 className="display text-[21px] xs:text-[26px] lg:text-3xl font-light tracking-tight leading-tight">
                    {w.role}
                    <span className="muted xs:hidden"> @{w.companyShort}</span>
                    <span className="muted hidden xs:inline"> @{w.company}</span>
                  </h3>
                  <p className="xs:hidden mt-2 leading-relaxed text-[14px] max-w-[58ch] mono">{w.descShort}</p>
                  <p className="hidden xs:block xs:mt-5 leading-relaxed xs:text-[15px] max-w-[58ch] mono">{w.desc}</p>
                </div>
                <div className="xs:pt-2 lg:pt-[10px]">
                  <p className="mono small-caps faint mb-2 xs:mb-3">Stack</p>
                  <ul className="flex flex-wrap gap-x-3 gap-y-1.5 mono text-[12px] xs:text-[13px]">
                    {w.stack.map((s) => (
                      <li key={s} className="muted">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section
          id="projects"
          title="Selected Projects"
          count={PROJECTS.length}
          open={openSection === "projects"}
          soft={softOpen}
          onToggle={() => toggleSection("projects")}
        >
          <ol className="mt-2 lg:mt-3">
            {PROJECTS.map((p, i) => (
              <li
                key={p.name}
                id={`project-${p.slug}`}
                className={`scroll-mt-20 grid grid-cols-1 xs:grid-cols-[clamp(80px,14vw,140px)_1fr_clamp(140px,22vw,240px)] lg:grid-cols-[140px_1fr_240px] gap-3 xs:gap-6 lg:gap-12 py-4 xs:py-6 lg:py-8 first:pt-2 xs:first:pt-3 lg:first:pt-4 ${
                  i !== PROJECTS.length - 1 ? "border-b rule" : ""
                }`}
              >
                <div className="mono text-[12px] xs:text-[13px] leading-none ink xs:pt-2 lg:pt-[10px]">
                  {p.type}
                </div>
                <div>
                  <h3 className="display text-[21px] xs:text-[26px] lg:text-3xl font-light tracking-tight leading-tight">
                    {p.name}
                    {p.platform === "sushrutalgs.ai" ? (
                      <>
                        <a
                          href="https://sushrutalgs.ai/welcome"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="xs:hidden accent-link mono text-[12px] accent align-middle ml-2 whitespace-nowrap"
                        >
                          @{p.platform} <span aria-hidden>↗</span>
                        </a>
                        <span className="muted hidden xs:inline"> @{p.platform}</span>
                      </>
                    ) : (
                      p.platform && <span className="muted"> @{p.platform}</span>
                    )}
                    {p.links
                      .filter((l) => l.label === "paper" || l.label === "github")
                      .map((l) => (
                        <a
                          key={l.label}
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="xs:hidden accent-link mono text-[12px] accent align-middle ml-2 whitespace-nowrap"
                        >
                          {l.label} <span aria-hidden>↗</span>
                        </a>
                      ))}
                  </h3>
                  <p className="xs:hidden mt-2 leading-relaxed text-[14px] max-w-[58ch] mono">{p.descShort}</p>
                  <p className="hidden xs:block xs:mt-5 leading-relaxed xs:text-[15px] max-w-[58ch] mono">{p.desc}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 xs:block xs:space-y-6 xs:pt-2 lg:pt-[10px]">
                  <div>
                    <p className="mono small-caps faint mb-1 xs:mb-1.5">Stack</p>
                    <p className="xs:hidden mono text-[12px] muted leading-relaxed">{p.stack.join(", ")}</p>
                    <ul className="hidden xs:flex xs:flex-wrap xs:gap-x-3 xs:gap-y-1.5 mono xs:text-[13px]">
                      {p.stack.map((s) => (
                        <li key={s} className="muted">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mono small-caps faint mb-1 xs:mb-1.5">Links</p>
                    <ul className="flex flex-col gap-2 mono text-[12px] xs:text-[13px]">
                      {hasProjectDetail(p.slug) && (
                        <li>
                          <Link
                            href={`/projects/${p.slug}`}
                            className="accent-link inline-flex items-center gap-1.5"
                          >
                            case study
                            <span aria-hidden>→</span>
                          </Link>
                        </li>
                      )}
                      {p.links.map((l) => (
                        <li key={l.label} className={l.label === "paper" || l.label === "github" ? "hidden xs:block" : undefined}>
                          <a
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="accent-link inline-flex items-center gap-1.5"
                          >
                            {l.label}
                            <span aria-hidden>↗</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section
          id="education"
          title="Education"
          count={EDUCATION.length}
          open={openSection === "education"}
          soft={softOpen}
          onToggle={() => toggleSection("education")}
        >
          <ol className="mt-2 lg:mt-3">
            {EDUCATION.map((e, i) => (
              <li
                key={e.degree}
                className={`grid grid-cols-1 xs:grid-cols-[clamp(80px,14vw,140px)_1fr_clamp(160px,26vw,280px)] lg:grid-cols-[140px_1fr_280px] gap-3 xs:gap-6 lg:gap-12 py-5 xs:py-8 lg:py-10 first:pt-2 xs:first:pt-4 lg:first:pt-6 ${
                  i !== EDUCATION.length - 1 ? "border-b rule" : ""
                }`}
              >
                <div className="mono text-[12px] xs:text-[13px] leading-none ink xs:pt-2 lg:pt-[10px]">{e.year}</div>
                <div>
                  <h3 className="display text-[21px] xs:text-[26px] lg:text-3xl font-light tracking-tight leading-tight">
                    {e.degree}
                    <span className="muted xs:hidden"> @{e.schoolShort}</span>
                    <span className="muted hidden xs:inline"> @{e.school}</span>
                  </h3>
                  <p className="display accent font-light tracking-tight text-[16px] lg:text-lg mt-1.5 xs:mt-2">
                    {e.focus}
                    {"gpa" in e && <span className="xs:hidden"> · GPA {e.gpa}</span>}
                  </p>
                  <div className="mt-3 xs:mt-6 space-y-4 max-w-[58ch]">
                    <div>
                      <p className="mono small-caps faint mb-2">Coursework</p>
                      <p className="xs:hidden mono text-[12px] muted leading-relaxed">
                        {e.coursework.slice(0, 3).join(", ")}
                      </p>
                      <p className="hidden xs:block mono xs:text-[13px] muted leading-relaxed">
                        {e.coursework.join("  ·  ")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="xs:pt-2 lg:pt-[10px]">
                  <p className="mono small-caps faint mb-2 xs:mb-3">Highlights</p>
                  <ul className="space-y-2 mono text-[12px] xs:text-[13px]">
                    {e.highlights.map((h) => (
                      <li
                        key={h.text}
                        className={`muted leading-relaxed pl-4 relative ${h.text.startsWith("GPA") ? "hidden xs:block" : ""}`}
                      >
                        <span className="absolute left-0 top-[0.55em] w-2 h-px accent-line" aria-hidden />
                        {"href" in h ? (
                          <a
                            href={h.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="accent-link inline"
                          >
                            <span className="xs:hidden">{"textShort" in h ? h.textShort : h.text}</span>
                            <span className="hidden xs:inline">{h.text}</span>
                            <span aria-hidden className="faint"> ↗</span>
                          </a>
                        ) : (
                          h.text
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section
          id="contact"
          title="Contact"
          open={openSection === "contact"}
          soft={softOpen}
          onToggle={() => toggleSection("contact")}
        >
          {/* Three-column row matching the Experience / Projects / Education
              rhythm: status meta · heading + copy · Links. */}
          <div className="grid grid-cols-1 xs:grid-cols-[clamp(80px,14vw,140px)_1fr_clamp(140px,22vw,240px)] lg:grid-cols-[140px_1fr_240px] gap-3 xs:gap-6 lg:gap-12 py-5 xs:py-8 lg:py-10 pt-3 xs:pt-4 lg:pt-6">
            <div className="mono text-[12px] xs:text-[13px] leading-none flex xs:flex-col items-start gap-3 xs:gap-2 xs:pt-2 lg:pt-[10px]">
              <span className="accent">Open to work</span>
              <span className="muted">Tempe, AZ</span>
            </div>
            <div>
              <h3 className="display text-[21px] xs:text-[26px] lg:text-3xl font-light tracking-tight leading-tight">
                Hey! I'm looking for a role<span className="accent">.</span>
              </h3>
              <p className="mt-2 xs:mt-5 leading-relaxed text-[14px] xs:text-[15px] max-w-[58ch] mono">
                Open to Product Manager, AI Engineer, and Forward-Deployed Engineer roles.
              </p>
              <p className="mt-3 xs:mt-4 leading-relaxed text-[14px] xs:text-[15px] mono">
                Please reach out to{" "}
                <a href="mailto:bhavsarrushir@gmail.com" className="accent-link accent">
                  @bhavsarrushir@gmail.com
                </a>
              </p>
            </div>
            <div className="xs:pt-2 lg:pt-[10px]">
              <p className="mono small-caps faint mb-2 xs:mb-3">Links</p>
              <ul className="flex flex-col gap-2 mono text-[12px] xs:text-[13px]">
                {LINKS.filter((l) => l.label !== "Email").map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.href.startsWith("http") || l.href.endsWith(".pdf") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="accent-link inline-flex items-center gap-1.5"
                    >
                      {l.label.toLowerCase()}
                      <span aria-hidden className="faint">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
        </div>

        {/* In-flow footer: sits at the bottom of the closed landing (the hero's
            flex-1 absorbs the leftover) and after the open section's content,
            instead of permanently overlaying the viewport bottom. */}
        {/* Sticky at the viewport bottom: always visible like the old fixed
            bar, but it still occupies flow space at the document end so it
            never hides content. z-50 lifts it above the .grain dot overlay
            (z-1) and the sticky section heads (z-30) so everything scrolls
            below it. */}
        <footer className="sticky bottom-0 z-50 mt-10 xs:mt-14">
          <div className="border-t rule" style={{ backgroundColor: "#f4f1ec" }}>
            <div className="max-w-[1100px] mx-auto px-6 lg:px-12 py-5 xs:py-6 mono text-[11px] flex items-center justify-between gap-4">
              <p className="muted whitespace-nowrap">
                <span className="faint">© 2026 </span>Rushir Bhavsar
              </p>
              <p className="small-caps faint whitespace-nowrap">
                <span className="accent">+</span> <span className="xs:hidden">Tempe, AZ</span>
                <span className="hidden xs:inline">Tempe, Arizona</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}

function Section({
  id,
  title,
  count,
  open,
  soft = false,
  onToggle,
  children,
}: {
  id: string
  title: string
  count?: number
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
      <SectionHead id={id} title={title} count={count} open={open} onToggle={onToggle} />
      <div
        id={`${id}-content`}
        data-open={open}
        aria-hidden={!open}
        className="section-collapsible"
      >
        <div className="section-content">
          <div className="pt-4 xs:pt-6 pb-14 xs:pb-20 min-h-[calc(100vh-9rem)] flex flex-col justify-center">
            {children}
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
  open,
  onToggle,
}: {
  id: string
  title: string
  count?: number
  open: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={`${id}-content`}
      className="sticky top-14 z-30 -mx-6 lg:-mx-12 px-6 lg:px-12 py-3 border-b rule w-[calc(100%+3rem)] lg:w-[calc(100%+6rem)] text-left transition-[background-color,transform] duration-200 ease-out hover:bg-[rgba(31,58,95,0.05)] active:scale-[0.997] active:duration-100 cursor-pointer"
      style={{ backgroundColor: "#f4f1ec" }}
    >
      <div className="grid grid-cols-[auto_1fr_auto] xs:grid-cols-[clamp(80px,14vw,140px)_1fr_clamp(140px,22vw,240px)] lg:grid-cols-[140px_1fr_240px] gap-3 xs:gap-6 lg:gap-12 items-baseline">
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
      </div>
    </button>
  )
}
