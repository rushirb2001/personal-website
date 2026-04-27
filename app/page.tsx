"use client"

import Image from "next/image"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { TocNav } from "./TocNav"

const WORK = [
  {
    company: "Arizona State University",
    role: "ML Researcher",
    period: "Nov 2025 – Present",
    desc: "Building a modular PyTorch Lightning + JAX framework so Applied Materials can stress-test whether neural networks can replace traditional plasma solvers in their etch chambers.",
    stack: ["PyTorch Lightning", "JAX", "Hydra", "WandB"],
    current: true,
  },
  {
    company: "OpenEye, Cadence Design Systems",
    role: "ML Engineer Intern",
    period: "Jul 2025 – Oct 2025",
    desc: "ESM2 + contrastive-learning pipeline batched through cuDF and PyTorch Lightning. Replaced GP bottleneck with cuML/RAFT — batch sizes jumped 150 → 50K+ at 7.2 ms / sequence.",
    stack: ["ESM2", "cuDF", "cuML", "RAFT", "OmegaConf"],
    current: false,
  },
  {
    company: "Talin Labs",
    role: "GenAI Engineering Intern",
    period: "Jun 2024 – Sep 2024",
    desc: "Deployed a fine-tuned Mistral-7B-Q8 on Kubernetes behind FastAPI with a six-agent LangChain orchestration. Sub-200 ms p95 for 10K users; 88% on 10K human-evaluated queries.",
    stack: ["Mistral-7B", "Kubernetes", "FastAPI", "LangChain", "LangGraph"],
    current: false,
  },
]

const PROJECTS = [
  {
    name: "MACE-PINN",
    type: "Master's thesis",
    year: "2025",
    desc: "Parallel-subnetwork PINN with random Fourier feature embeddings for coupled PDE systems. 40–60% lower L2 error than single-network baselines on Gray-Scott and Ginzburg-Landau.",
    stack: ["JAX", "Flax", "NumPy"],
    links: [
      { label: "github", href: "https://github.com/rushirb2001/thesis-mace-pinn" },
      { label: "paper", href: "https://keep.lib.asu.edu/items/201211" },
    ],
  },
  {
    name: "MedQuery",
    type: "LLM benchmark",
    year: "2025",
    desc: "10K-query classification benchmark across four difficulty levels and nine categories — comparing local quantised models (MLX, llama.cpp) against frontier APIs honestly.",
    stack: ["LangGraph", "LangChain", "FAISS", "OpenAI"],
    links: [{ label: "github", href: "https://github.com/rushirb2001" }],
  },
  {
    name: "HybridFlow",
    type: "Retrieval system",
    year: "2025",
    desc: "Hybrid Qdrant + Neo4j + SQLite retrieval across surgical textbooks with sub-12 ms P50 multi-hop reasoning through ten tool functions.",
    stack: ["Qdrant", "Neo4j", "SQLite", "FastAPI"],
    links: [{ label: "github", href: "https://github.com/rushirb2001" }],
  },
  {
    name: "Yelp recs & sentiment",
    type: "Coursework, prod-quality",
    year: "2024",
    desc: "Spark ALS recommender plus a sentiment classifier behind FastAPI microservices serving 5M+ interactions at sub-100 ms p95, with Redis caching and MLflow tracking.",
    stack: ["PySpark", "FastAPI", "MLflow", "Docker", "Redis"],
    links: [{ label: "github", href: "https://github.com/rushirb2001/yelp-ml-platform" }],
  },
]

const EDUCATION = [
  {
    degree: "MS, Data Science",
    school: "Arizona State University",
    detail: "HPC concentration",
    year: "2025",
    coursework: ["Statistical ML", "Distributed Systems", "GPU Computing", "Deep Learning Theory", "Numerical Methods", "Optimization"],
    highlights: [
      { text: "Thesis on physics-informed neural networks for coupled PDE systems" },
      { text: "GPA 3.71" },
    ],
  },
  {
    degree: "BTech, Computer Science & Engineering",
    school: "Nirma University, Ahmedabad",
    detail: "",
    year: "2023",
    coursework: ["Algorithms", "Operating Systems", "Computer Networks", "Databases", "Compilers", "Linear Algebra"],
    highlights: [
      { text: "Graduated with distinction" },
      {
        text: "Classification of potentially hazardous asteroids using supervised quantum machine learning — IEEE Access, 2023",
        href: "https://ieeexplore.ieee.org/iel7/6287639/6514899/10188662.pdf",
      },
      {
        text: "MetaHate: AI-based hate speech detection for secured online gaming in metaverse using blockchain — Security and Privacy, 2024",
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
  const programmaticScrollRef = useRef(false)
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  const toggleSection = (id: string) => {
    const isOpening = openSection !== id
    const switching = openSection !== null && openSection !== id
    lockScroll(switching ? 1400 : 1000)
    setOpenSection(isOpening ? id : null)
    if (isOpening) {
      const scrollToSection = () => {
        const el = document.getElementById(id)
        if (el) {
          window.scrollTo({ top: el.offsetTop - 56, behavior: "smooth" })
        }
      }
      if (switching) {
        // Wait for the previous section's height transition (350ms) to finish
        // so the target's offsetTop is stable before we commit a smooth scroll.
        setTimeout(scrollToSection, 380)
      } else {
        requestAnimationFrame(() => requestAnimationFrame(scrollToSection))
      }
    }
  }

  const goHome = () => {
    lockScroll()
    setOpenSection(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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

        /* Section open/close — height auto via interpolate-size */
        .section-collapsible {
          interpolate-size: allow-keywords;
          height: 0;
          overflow: hidden;
          transition: height 350ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .section-collapsible[data-open="true"] {
          height: auto;
        }

        /* Section content reveal — fade-up after expansion */
        .section-content {
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
      `}</style>

      <div className="grain relative z-0 pb-16">
        <TocNav active={openSection} onSelect={toggleSection} onHome={goHome} />

        {/* Hero */}
        <section className="hero-anim max-w-[1100px] mx-auto px-6 lg:px-12 pt-6 xs:pt-8 lg:pt-12 pb-8 xs:pb-10 lg:pb-14">
          <div className="grid grid-cols-1 xs:grid-cols-[1fr_clamp(140px,28vw,280px)] lg:grid-cols-[1fr_280px] gap-8 xs:gap-6 lg:gap-16 items-start">
            <div>
              <h1 className="display font-light leading-[0.92] tracking-tight text-[52px] xs:text-[clamp(56px,11vw,120px)] lg:text-[120px]">
                Hi! I&rsquo;m Rushir
                <br />
                Bhavsar<span className="accent">.</span>
              </h1>
              <div className="display font-light text-base xs:text-[clamp(15px,1.8vw,20px)] lg:text-xl mt-6 xs:mt-7 lg:mt-8 leading-[1.5] max-w-[40ch]">
                <span className="xs:hidden">
                  Physics-informed neural nets at ASU. Previously Cadence.
                </span>
                <span className="hidden xs:inline">
                  Currently at ASU, researching physics-informed neural networks
                  for plasma simulation. Previously at Cadence on protein property
                  prediction at million-sequence scale.
                </span>
                <span className="block mt-3 xs:mt-4 muted">
                  <span className="xs:hidden">
                    Open to ML systems / infrastructure roles.
                  </span>
                  <span className="hidden xs:inline">
                    Looking for roles in ML systems and ML infrastructure —
                    orchestration, GPU pipelines, and evaluation harnesses.
                  </span>
                </span>
              </div>
            </div>

            <div className="xs:pt-3 lg:pt-4">
              <div className="relative hidden xs:block xs:w-full mx-auto xs:mx-0 max-w-[280px] aspect-[3/4] overflow-hidden grayscale">
                <Image
                  src="/images/design-mode/new_personal_photo(1).png"
                  alt="Rushir Bhavsar"
                  fill
                  sizes="(max-width: 1024px) 28vw, 280px"
                  className="object-cover object-[60%_30%]"
                  priority
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
              </div>
              <div className="mt-6 xs:mt-5 mono text-[12px] xs:text-[13px] muted leading-[1.7]">
                <p>
                  <span className="accent">+</span> ML systems / infra
                </p>
                <p>
                  <span className="accent">+</span> Tempe, Arizona
                </p>
              </div>
            </div>
          </div>
        </section>

        <Section
          id="experience"
          title="Experience"
          count={WORK.length}
          open={openSection === "experience"}
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
                <div className="mono text-[11px] xs:text-[13px] leading-none flex xs:flex-col items-start gap-3 xs:gap-2 xs:pt-2 lg:pt-[10px]">
                  <span className={w.current ? "accent" : "ink"}>{w.period}</span>
                </div>
                <div>
                  <h3 className="display text-base xs:text-[26px] lg:text-3xl font-light tracking-tight leading-tight">
                    {w.role}
                    <span className="muted"> @{w.company}</span>
                  </h3>
                  <p className="mt-2 xs:mt-5 leading-relaxed text-[12px] xs:text-[15px] max-w-[58ch] mono">{w.desc}</p>
                </div>
                <div className="xs:pt-2 lg:pt-[10px]">
                  <p className="mono small-caps faint mb-2 xs:mb-3">Stack</p>
                  <ul className="flex flex-wrap gap-x-3 gap-y-1.5 mono text-[11px] xs:text-[13px]">
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
          onToggle={() => toggleSection("projects")}
        >
          <ol className="mt-2 lg:mt-3">
            {PROJECTS.map((p, i) => (
              <li
                key={p.name}
                className={`grid grid-cols-1 xs:grid-cols-[clamp(80px,14vw,140px)_1fr_clamp(140px,22vw,240px)] lg:grid-cols-[140px_1fr_240px] gap-3 xs:gap-6 lg:gap-12 py-5 xs:py-8 lg:py-10 first:pt-2 xs:first:pt-4 lg:first:pt-6 ${
                  i !== PROJECTS.length - 1 ? "border-b rule" : ""
                }`}
              >
                <div className="mono text-[11px] xs:text-[13px] leading-none ink xs:pt-2 lg:pt-[10px]">
                  {p.type}
                </div>
                <div>
                  <h3 className="display text-base xs:text-[26px] lg:text-3xl font-light tracking-tight leading-tight">
                    {p.name}
                  </h3>
                  <p className="mt-2 xs:mt-5 leading-relaxed text-[12px] xs:text-[15px] max-w-[58ch] mono">{p.desc}</p>
                </div>
                <div className="xs:pt-2 lg:pt-[10px] space-y-6">
                  <div>
                    <p className="mono small-caps faint mb-2 xs:mb-3">Stack</p>
                    <ul className="flex flex-wrap gap-x-3 gap-y-1.5 mono text-[11px] xs:text-[13px]">
                      {p.stack.map((s) => (
                        <li key={s} className="muted">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mono small-caps faint mb-2 xs:mb-3">Links</p>
                    <ul className="flex flex-col gap-2 mono text-[11px] xs:text-[13px]">
                      {p.links.map((l) => (
                        <li key={l.label}>
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
                <div className="mono text-[11px] xs:text-[13px] leading-none ink xs:pt-2 lg:pt-[10px]">{e.year}</div>
                <div>
                  <h3 className="display text-base xs:text-[26px] lg:text-3xl font-light tracking-tight leading-tight">
                    {e.degree}
                  </h3>
                  <p className="mono small-caps muted mt-2">
                    {e.school}
                    {e.detail && <span className="faint"> · {e.detail}</span>}
                  </p>
                  <div className="mt-3 xs:mt-6 space-y-4 max-w-[58ch]">
                    <div>
                      <p className="mono small-caps faint mb-2">Coursework</p>
                      <p className="mono text-[11px] xs:text-[13px] muted leading-relaxed">
                        {e.coursework.join("  ·  ")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="xs:pt-2 lg:pt-[10px]">
                  <p className="mono small-caps faint mb-2 xs:mb-3">Highlights</p>
                  <ul className="space-y-2 mono text-[11px] xs:text-[13px]">
                    {e.highlights.map((h) => (
                      <li key={h.text} className="muted leading-relaxed pl-4 relative">
                        <span className="absolute left-0 top-[0.55em] w-2 h-px accent-line" aria-hidden />
                        {"href" in h ? (
                          <a
                            href={h.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="accent-link inline"
                          >
                            {h.text}
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
          onToggle={() => toggleSection("contact")}
        >
          <div className="grid grid-cols-1 xs:grid-cols-[1fr_1fr] gap-6 xs:gap-8 lg:gap-20 items-start pt-3 xs:pt-4 lg:pt-6">
            <div>
              <h3 className="display text-[44px] xs:text-[clamp(40px,7vw,72px)] lg:text-7xl font-light leading-[0.95] tracking-tight">
                Looking for
                <br />
                a role<span className="accent">.</span>
              </h3>
              <p className="display font-light text-lg xs:text-[clamp(17px,1.6vw,24px)] lg:text-2xl mt-6 xs:mt-8 muted max-w-[36ch] leading-snug">
                Email&rsquo;s the fastest way to reach me. Especially open to
                ML systems and infrastructure roles.
              </p>
            </div>
            <div className="xs:pt-3 lg:pt-6">
              <ul className="border-t rule">
                {LINKS.map((l) => (
                  <li
                    key={l.label}
                    className="border-b rule py-4 xs:py-5 flex items-center justify-between gap-4 xs:gap-6"
                  >
                    <span className="mono small-caps faint shrink-0">{l.label}</span>
                    <a
                      href={l.href}
                      target={l.href.startsWith("http") || l.href.endsWith(".pdf") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="accent-link mono text-[13px] xs:text-[14px] inline-flex items-center gap-1.5 xs:gap-2 min-w-0 truncate"
                    >
                      <span className="truncate">{l.value}</span>
                      <span aria-hidden className="faint shrink-0">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

      </div>
      <footer
        className="fixed bottom-0 left-0 right-0 z-40 border-t rule"
        style={{ backgroundColor: "#f4f1ec" }}
      >
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12 py-3 mono text-[10px] muted">
          <span className="faint">© </span>Rushir Bhavsar, 2026
        </div>
      </footer>
    </main>
  )
}

function Section({
  id,
  title,
  count,
  open,
  onToggle,
  children,
}: {
  id: string
  title: string
  count?: number
  open: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-14 max-w-[1100px] mx-auto px-6 lg:px-12 transition-[min-height] duration-[350ms] ease-out ${
        open ? "min-h-[calc(100vh-3.5rem)]" : ""
      }`}
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
        <span className="display accent text-xl xs:text-[26px] lg:text-3xl font-light leading-none">+</span>
        <h2 className="display text-xl xs:text-[26px] lg:text-3xl font-light tracking-tight leading-none">
          {title}
          <span className="accent">.</span>
        </h2>
        {count != null ? (
          <span className="mono text-[11px] xs:text-[13px] faint text-right tracking-[0.18em]">
            {String(count).padStart(2, "0")}
          </span>
        ) : (
          <span aria-hidden />
        )}
      </div>
    </button>
  )
}
