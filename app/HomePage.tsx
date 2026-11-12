"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, MotionConfig } from "motion/react"
import {
  ACCORDION_CSS,
  Section,
  heroContainerVariants,
  heroItemVariants,
  rowItemVariants,
  rowListVariants,
  useAccordion,
} from "./accordion"
import { TocNav } from "./TocNav"
import { springs } from "./motion"
import { CHROME_CSS, SiteFooterBar } from "./SiteChrome"
import { RESUME_PDF } from "./site"
import { DOCUMENT_ICON, GITHUB_ICON, LINKEDIN_ICON, STACK_ICONS, StackIcon } from "./stack-icons"

// Every Motion entrance on this page animates a transform STRING and opacity
// (app/motion.ts), which Motion hands to WAAPI and the compositor. The previous
// `y` shorthand was written from JS on every frame: the probe counted ~40
// style writes per hero element during load, stalling exactly while hydration
// held the main thread.

// The hero, section-head and row variants, the accordion's state and scroll
// choreography, and the Section component all live in ./accordion, which the
// inner pages share. This file is the landing page's content and its hero.
const SECTION_ORDER = ["experience", "projects", "education", "contact"]

const WORK = [
  {
    company: "sushrutalgs.ai",
    companyShort: "sushrutalgs.ai",
    role: "Founding Engineer",
    period: "2025 – Present",
    desc: "Medical AI for India's surgical trainees: a RAG backend over surgical textbooks, an edge gateway for auth and quota, and web and iOS clients that stream cited answers. Live in production.",
    descShort: "Medical AI for India's surgical trainees: RAG backend, edge gateway, web and iOS clients.",
    stack: ["Next.js 16", "Swift 6", "FastAPI", "Qdrant", "Neo4j", "Cloudflare Workers"],
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
    descShort: "Deployed a fine-tuned Mistral-7B on Kubernetes with six-agent LangChain orchestration, 200ms@P95.",
    stack: ["Kubernetes", "FastAPI", "LangChain", "LangGraph"],
    current: false,
  },
]

// Ranked as a repeating product → AI → forward-deployment cycle so each
// targeted role (PM, AI Engineer, FDE) sees its signal in the first three
// rows: shipped client, the AI engine behind it, the production spine —
// then the cycle repeats, closing on research depth.
const PROJECTS = [
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
    descShort: "Gateway connecting the apps to the AI backend: sign-in, plan limits, streaming.",
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
    name: "MACE-PINN",
    platform: "",
    slug: "mace-pinn",
    descShort: "Thesis oscillating neural network solver for stiff coupled physics equations.",
    type: "Master's thesis",
    year: "2025",
    desc: "Master's thesis neural network that accurately solves the stiff, tightly coupled physics equations that standard single-network models struggle to capture.",
    stack: ["JAX", "Flax", "NumPy"],
    links: [
      { label: "paper", href: "https://keep.lib.asu.edu/items/201211" },
    ],
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
    gpa: "3.72",
    focus: "High Performance Computing and Decision Analytics",
    year: "2025",
    coursework: ["Statistical ML", "Distributed Systems", "GPU Computing", "Deep Learning Theory", "Numerical Methods", "Optimization"],
    highlights: [
      {
        text: "Thesis: Multi-Architecture Coupled Ensemble Physics-Informed Neural Networks",
        textShort: "Thesis: Coupled Ensemble Physics-Informed Neural Networks",
        href: "https://keep.lib.asu.edu/items/201211",
      },
      { text: "GPA 3.72" },
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

// EDUCATION highlight text embeds its publication venue/year after a " · "
// separator (e.g. "... machine learning · IEEE Access, 2023"). Split it out
// so the venue/year can render as its own pill instead of trailing prose.
function splitHighlight(text: string): [string, string | null] {
  const i = text.indexOf(" · ")
  return i === -1 ? [text, null] : [text.slice(0, i), text.slice(i + 3)]
}

const LINKS = [
  { label: "Email", value: "bhavsarrushir@gmail.com", href: "mailto:bhavsarrushir@gmail.com" },
  { label: "LinkedIn", value: "rushir-bhavsar", href: "https://linkedin.com/in/rushir-bhavsar/" },
  { label: "GitHub", value: "rushirb2001", href: "https://github.com/rushirb2001" },
  { label: "Resume", value: "PDF", href: RESUME_PDF },
]

const LINK_ICONS: Record<string, { path: string; viewBox?: string }> = {
  LinkedIn: LINKEDIN_ICON,
  GitHub: GITHUB_ICON,
  Resume: DOCUMENT_ICON,
}

// `caseStudySlugs` comes from the server route (app/page.tsx). This component
// used to import hasProjectDetail from projects-data to gate the case-study
// links, which pulled every case study's full text (about 50KB of source) into
// the landing page's client bundle to answer a yes/no question.
export default function HomePage({ caseStudySlugs }: { caseStudySlugs: string[] }) {
  const hasProjectDetail = (slug: string) => caseStudySlugs.includes(slug)
  const { openSection, softOpen, homeClosing, toggleSection, goHome, heroWrapRef, heroSectionRef } =
    useAccordion()

  return (
    <MotionConfig reducedMotion="user">
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
        /* Hover-gated so touch devices don't latch the hover state on tap. */
        @media (hover: hover) {
          .accent-link:hover { color: #1f3a5f; }
          .accent-link:hover::after { transform: scaleX(1); }
        }
        .small-caps {
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-size: 10px;
        }

        /* Outbound and case-study links. Deliberately a tinted outline and NOT
           a filled pill: a solid navy button here would be the loudest object
           on an otherwise quiet landing page. */
        .footer-cta {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 10px; border-radius: 6px;
          color: #1f3a5f;
          background-color: rgba(31,58,95,0.07);
          border: 1px solid rgba(31,58,95,0.28);
          text-transform: uppercase; letter-spacing: 0.12em; font-size: 11px;
          white-space: nowrap;
          transition: background-color 200ms ease, border-color 200ms ease;
        }
        @media (hover: hover) {
          .footer-cta:hover {
            background-color: rgba(31,58,95,0.13);
            border-color: rgba(31,58,95,0.5);
          }
        }

        ${CHROME_CSS}
        ${ACCORDION_CSS}

        /* Hero entrance, section-head scroll reveal, accordion row stagger,
           and the footer's mount fade-up are all driven by Motion
           (motion/react) now — see the variants near the top of this file. */

        /* Hero layout — one set of elements recomposed by grid areas. Phones:
           Notion-page read — the photo runs full-bleed as a cover banner, an
           icon tile overlaps its bottom edge, then the title, tagline, and
           roles flow beneath like page content.
           sm+: name + description own the left column, photo sits right, with
           photo column / gap / display size riding the same viewport scale so
           squeezed widths render as a scaled-down desktop. */
        .hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          grid-template-rows: auto auto auto auto;
          grid-template-areas:
            "photo"
            "name"
            "desc"
            "open";
          row-gap: 1rem;
        }
        @media (max-width: 639px) {
          /* Cover banner: escape the section's px-6 gutters, square the
             corners; the crop keeps the face clear of the edges.

             Fit-the-viewport system: every vertical below rides svh with
             TODAY'S design as the clamp cap, so tall phones render unchanged
             while short viewports compress proportionally until the closed
             landing needs no scroll at all. Tuned against real sizes
             (360x640 .. 430x932) — re-measure overflow if touching any
             coefficient. */
          .hero-section { padding-top: 0; padding-bottom: clamp(12px, 3.4svh, 32px); }
          .hero-grid { row-gap: clamp(8px, 2.2svh, 16px); }
          .hero-photo-block { margin-inline: -1.5rem; padding-top: 0; }
          .hero-photo { max-width: none; height: clamp(110px, 23.5svh, 200px); border-radius: 0; }
          .hero-photo > div { border-radius: 0; }
          .hero-photo img { object-position: 60% 45%; }
          .hero-name { padding-top: clamp(4px, 1svh, 8px); font-size: clamp(26px, min(11vw, 5.5svh), 48px); }
          .hero-desc, .hero-open { font-size: clamp(12.5px, 2.1svh, 16px); }
          .hero-open > span:first-child {
            width: clamp(28px, 5.2svh, 36px);
            height: clamp(28px, 5.2svh, 36px);
            font-size: clamp(15px, 2.9svh, 20px);
          }
          /* The section heads and open-section content ride the same svh
             curve; those rules are in ACCORDION_CSS. */
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
          .hero-section { padding-top: 0.5rem; padding-bottom: 0.5rem; }
          .hero-section h1 { font-size: clamp(52px, 10vw, 92px); }
          /* Wider photo column (same 24vw slope as the base layout, higher
             cap, so the 768px boundary stays continuous); the 1fr text column
             gives up the difference. Top padding zeroed so the photo's top
             edge sits flush with the top of its column. The 34vh term bounds
             the 3/4-aspect photo on short windows. Below ~236px the LEFT
             column pins the hero height, so the tighter paddings here (hero,
             caption, footer) are what let the closed landing fit short-wide
             viewports — don't reclaim them without re-measuring the overflow. */
          .hero-grid { grid-template-columns: 1fr clamp(150px, min(24vw, 34vh), 240px); }
          .hero-section .hero-photo { max-width: min(240px, 34vh); }
          .hero-section .hero-photo-block { padding-top: 0; }
          .hero-section .hero-photo-block .mono { margin-top: 1rem; }
          main footer { margin-top: 1.5rem; }
        }
      `}</style>

      <div
        // Asymmetric like the sections, in reverse: min-height ANIMATES away
        // on open (the centering glide) but SNAPS back to 100svh on close.
        // If it animated on close too, the collapsing content outruns the
        // growing min-height and the document dips below the viewport for a
        // few frames — the footer visibly rides up and drops back. Snapping
        // keeps the page >= viewport for the whole collapse, so the footer
        // never leaves the bottom edge.
        className={`grain relative z-0 flex flex-col motion-safe:transition-[min-height] motion-safe:duration-[350ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] ${
          openSection === null ? "min-h-[100svh]" : "min-h-0"
        }`}
        style={openSection === null ? { transitionProperty: "none" } : undefined}
        data-home-close={homeClosing ? "" : undefined}
      >
        <TocNav active={openSection} onSelect={toggleSection} onHome={goHome} />

        {/* Hero — centered in the leftover space above the section list while
            closed. The centering stays mounted; opening a section animates the
            wrapper's min-height away, so the leftover space (and with it the
            centering) glides to zero instead of snapping. toggleSection
            pre-computes scroll targets from the measured leftover. */}
        {/* Phones flow the Notion-style hero from the very top (the -mt swallows
            the hidden sticky nav's flow slot); sm+ keeps the centered hero. */}
        <div ref={heroWrapRef} className="sm:flex-1 flex flex-col sm:justify-center -mt-14 sm:mt-0">
        <section ref={heroSectionRef} className="hero-section max-w-[1100px] mx-auto px-6 lg:px-12 pt-6 xs:pt-8 lg:pt-12 pb-8 xs:pb-10 lg:pb-14">
          {/* One proportional system from sm up: photo column (24vw, cap 280),
              gap (5.4vw, cap 64) and display size (10vw, cap 120) all ride the
              same viewport scale and hit their caps together near the 1100px
              container max, so any squeezed width renders as a scaled-down
              desktop instead of a different composition. */}
          {/* One photo, one name, one copy block — recomposed per breakpoint by
              the .hero-grid grid-template-areas in the style block above.
              Orchestrated with staggerChildren: the h1 (the measured LCP
              element) lands at delayChildren: 0, everything else cascades
              after it. */}
          <motion.div
            className="hero-grid"
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={heroItemVariants}
              className="hero-name display font-light leading-[0.95] sm:leading-[0.92] tracking-tight text-[clamp(34px,11vw,48px)] sm:text-[clamp(52px,10vw,120px)]"
            >
              Hi! I&rsquo;m Rushir{" "}
              <br />
              Bhavsar<span className="accent">.</span>
            </motion.h1>

            <motion.div variants={heroItemVariants} className="hero-photo-block pt-1 sm:pt-3 lg:pt-4">
              <div className="hero-photo relative w-full max-w-[280px] aspect-[3/4] overflow-hidden grayscale rounded-2xl">
                <Image
                  src="/images/rushir-bhavsar.jpg"
                  alt="Rushir Bhavsar"
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1167px) 24vw, 280px"
                  className="object-cover object-[60%_30%]"
                  // The phone layout's LCP element. `preload` (Next 16's name
                  // for the old `priority`) emits the <link rel="preload">, but
                  // no longer raises the fetch priority, and an image preload
                  // defaults to Low: it queued behind every script on a slow
                  // connection. fetchPriority="high" puts it back in front.
                  preload
                  fetchPriority="high"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10" />
              </div>
              {/* Notion-style icon tile overlapping the cover's bottom edge
                  (phone composition only). */}
              <div className="sm:hidden relative" aria-hidden>
                {/* Mostly on the cover (12px protrusion) so the title can sit
                    snug below without colliding with the tile. */}
                <div className="absolute left-6 -top-11 w-14 h-14 rounded-2xl bg-[#f4f1ec] ring-1 ring-black/10 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.2)] grid place-items-center">
                  {/* The site icon (app/icon.svg), rendered inline so it uses
                      the real display font. */}
                  <span className="display ink text-[26px] font-light tracking-tight leading-none">
                    rb<span className="accent">.</span>
                  </span>
                </div>
              </div>
              {/* Negative word-spacing: mono spaces are full character cells,
                  so the comma gaps between keywords read double-wide. */}
              <div className="hidden sm:block mt-5 mono text-[13px] muted leading-[1.7] [word-spacing:-0.5ch]">
                <p>
                  <span className="accent">+</span> Product, AI, DevOps
                </p>
                <p>
                  <span className="accent">+</span> Ahmedabad, India
                </p>
              </div>
            </motion.div>

            {/* Two-column hanging layout: the + keeps its own column so
                wrapped lines align with the text, not under the marker. The
                marker is a small square tile matching the rb. cover tile. */}
            <motion.p
              variants={heroItemVariants}
              className="hero-open sm:hidden display font-light text-[16px] leading-[1.5] muted mt-1 flex items-center gap-3"
            >
              {/* pb-[2px]: the + glyph's ink sits ~1px below its line box's
                  center (measured), so bias the box to optically center it. */}
              <span className="accent shrink-0 w-9 h-9 pb-[2px] rounded-xl bg-[#f4f1ec] ring-1 ring-black/10 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.2)] grid place-items-center text-[20px] leading-none">+</span>
              <span>Open to Product Manager, AI Engineer &amp; Forward-Deployed Engineer roles.</span>
            </motion.p>

            {/* Full description on every breakpoint (the phone's Notion-style
                page body); the roles sentence is sm+ only — phones carry it
                in the hero-open line instead. */}
            <motion.div
              variants={heroItemVariants}
              className="hero-desc display font-light text-[16px] sm:text-[clamp(16px,1.7vw,20px)] mt-0 sm:mt-7 lg:mt-8 leading-[1.5] max-w-[44ch]"
            >
              Currently building{" "}
              <a
                href="https://sushrutalgs.ai/welcome"
                target="_blank"
                rel="noopener noreferrer"
                className="accent-link accent whitespace-nowrap"
              >
                sushrutalgs.ai <span aria-hidden className="mono text-[0.85em] align-middle">↗</span>
              </a>
              , a medical AI platform for India&rsquo;s students, residents,
              and surgeons. Previously at ASU and Cadence.
              <span className="hidden sm:block mt-4 muted">
                Looking for Product Manager, AI Engineer, and
                Forward-Deployed Engineer roles.
              </span>
            </motion.div>
          </motion.div>
        </section>
        </div>

        {/* mb-auto: on phones the hero isn't stretch-centered, so the leftover
            space collects here, pushing the footer to the viewport bottom. */}
        <div className="mb-auto sm:mb-0">
        <Section
          id="experience"
          index={SECTION_ORDER.indexOf("experience")}
          title="Experience"
          count={WORK.length}
          open={openSection === "experience"}
          soft={softOpen}
          onToggle={() => toggleSection("experience")}
        >
          <motion.ol
            className="mt-2 lg:mt-3"
            variants={rowListVariants}
            initial="hidden"
            animate={openSection === "experience" ? "visible" : "hidden"}
          >
            {WORK.map((w, i) => (
              <motion.li
                key={w.company}
                variants={rowItemVariants}
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
                  <ul className="flex flex-wrap gap-1.5 mono text-[12px] xs:text-[13px]">
                    {w.stack.map((s) => (
                      <li
                        key={s}
                        className="muted inline-flex items-center gap-1.5 rounded-full border rule px-2.5 py-1"
                      >
                        {STACK_ICONS[s] && <StackIcon icon={STACK_ICONS[s]} className="w-3 h-3 shrink-0" />}
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </Section>

        <Section
          id="projects"
          index={SECTION_ORDER.indexOf("projects")}
          title="Selected Projects"
          count={PROJECTS.length}
          open={openSection === "projects"}
          soft={softOpen}
          onToggle={() => toggleSection("projects")}
        >
          <motion.ol
            className="mt-2 lg:mt-3"
            variants={rowListVariants}
            initial="hidden"
            animate={openSection === "projects" ? "visible" : "hidden"}
          >
            {PROJECTS.map((p, i) => (
              <motion.li
                key={p.name}
                variants={rowItemVariants}
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
                  <p className="xs:hidden mt-2 leading-relaxed text-[14px] max-w-[58ch] mono">
                    {p.descShort}
                    {/* Phones: the case-study link closes the blurb. */}
                    {hasProjectDetail(p.slug) && (
                      <>
                        {" "}
                        <Link
                          href={`/projects/${p.slug}`}
                          // Match the title links exactly: they inherit font-light
                          // plus tracking-tight COMPUTED AT THE H3'S 21px (-0.525px),
                          // so an em-based tracking here would come out looser.
                          className="accent-link accent mono text-[12px] font-light tracking-[-0.525px] whitespace-nowrap"
                        >
                          §case study <span aria-hidden>↗</span>
                        </Link>
                      </>
                    )}
                  </p>
                  <p className="hidden xs:block xs:mt-5 leading-relaxed xs:text-[15px] max-w-[58ch] mono">{p.desc}</p>
                </div>
                <div className="xs:space-y-6 xs:pt-2 lg:pt-[10px]">
                  <div>
                    <ul className="flex flex-wrap gap-1.5 mono text-[12px] xs:text-[13px]">
                      {p.stack.map((s) => (
                        <li
                          key={s}
                          className="muted inline-flex items-center gap-1.5 rounded-full border rule px-2.5 py-1"
                        >
                          {STACK_ICONS[s] && <StackIcon icon={STACK_ICONS[s]} className="w-3 h-3 shrink-0" />}
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Links live inline next to the title on phones. */}
                  <div className="hidden xs:block">
                    <div className="border-t rule mb-3 xs:mb-4" />
                    <ul className="flex flex-col gap-2">
                      {hasProjectDetail(p.slug) && (
                        <li>
                          <Link href={`/projects/${p.slug}`} className="footer-cta mono">
                            case study <span aria-hidden>→</span>
                          </Link>
                        </li>
                      )}
                      {p.links.map((l) => (
                        <li key={l.label} className={l.label === "paper" || l.label === "github" ? "hidden xs:block" : undefined}>
                          <a href={l.href} target="_blank" rel="noopener noreferrer" className="footer-cta mono">
                            {l.label} <span aria-hidden>↗</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </Section>

        <Section
          id="education"
          index={SECTION_ORDER.indexOf("education")}
          title="Education"
          count={EDUCATION.length}
          open={openSection === "education"}
          soft={softOpen}
          onToggle={() => toggleSection("education")}
        >
          <motion.ol
            className="mt-2 lg:mt-3"
            variants={rowListVariants}
            initial="hidden"
            animate={openSection === "education" ? "visible" : "hidden"}
          >
            {EDUCATION.map((e, i) => (
              <motion.li
                key={e.degree}
                variants={rowItemVariants}
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
                  <div className="mt-3 xs:mt-6 max-w-[58ch]">
                    <ul className="flex flex-wrap gap-1.5 mono text-[12px] xs:text-[13px]">
                      {e.coursework.map((c) => (
                        <li key={c} className="muted inline-flex items-center rounded-full border rule px-2.5 py-1">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="xs:pt-2 lg:pt-[10px]">
                  <ul className="flex flex-col gap-3 mono text-[12px] xs:text-[13px]">
                    {e.highlights.map((h) => {
                      if (!("href" in h)) {
                        return (
                          <li key={h.text} className={h.text.startsWith("GPA") ? "hidden xs:block" : undefined}>
                            <span className="inline-flex items-center rounded-full border rule px-2.5 py-1 muted">
                              {h.text}
                            </span>
                          </li>
                        )
                      }
                      const [title, venue] = splitHighlight(h.text)
                      const [titleShort] = splitHighlight("textShort" in h && h.textShort ? h.textShort : h.text)
                      return (
                        <li key={h.text}>
                          <a
                            href={h.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block rounded-lg border rule rule-hover px-3 py-2.5"
                          >
                            <span className="ink leading-relaxed block">
                              <span className="xs:hidden">{titleShort}</span>
                              <span className="hidden xs:inline">{title}</span>
                              <span
                                aria-hidden
                                className="accent inline-block ml-1 transition-transform duration-200 group-hover:translate-x-0.5"
                              >
                                ↗
                              </span>
                            </span>
                            {venue && (
                              <span className="mt-2 block">
                                <span className="inline-flex items-center rounded-full border rule px-2 py-0.5 text-[11px] faint">
                                  {venue}
                                </span>
                              </span>
                            )}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </Section>

        <Section
          id="contact"
          index={SECTION_ORDER.indexOf("contact")}
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
              <span className="muted">Ahmedabad, India</span>
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
                <a href="mailto:bhavsarrushir@gmail.com" className="accent-link accent" data-lead="email">
                  bhavsarrushir@gmail.com
                </a>
              </p>
            </div>
            <div className="xs:pt-2 lg:pt-[10px]">
              <motion.ul
                className="flex flex-col gap-2"
                variants={rowListVariants}
                initial="hidden"
                animate={openSection === "contact" ? "visible" : "hidden"}
              >
                {LINKS.filter((l) => l.label !== "Email").map((l) => (
                  <motion.li key={l.label} variants={rowItemVariants}>
                    <a
                      href={l.href}
                      target={l.href.startsWith("http") || l.href.endsWith(".pdf") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="footer-cta mono"
                      data-lead={l.label === "Resume" ? "resume_pdf" : l.label.toLowerCase()}
                    >
                      <StackIcon icon={LINK_ICONS[l.label]} className="w-3 h-3 shrink-0" />
                      {l.label.toLowerCase()} <span aria-hidden>↗</span>
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
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
            <motion.div
              className="max-w-[1100px] mx-auto px-6 lg:px-12 py-5 xs:py-6 mono text-[11px]"
              initial={{ opacity: 0, transform: "translateY(12px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{ ...springs.reveal, delay: 0.42 }}
            >
              {/* The site's other routes, shared with every inner page's
                  footer (SiteChrome). This bar is sticky, so they are on
                  screen for the whole visit, and they are the landing page's
                  only persistent links to /projects, /resume and /hire. */}
              <SiteFooterBar nav />
            </motion.div>
          </div>
        </footer>
      </div>
    </main>
    </MotionConfig>
  )
}
