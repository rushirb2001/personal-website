"use client"

import Image from "next/image"
import { useRef, useState } from "react"

const TABS = ["Work", "Projects", "Education"] as const

// 3 work entries share the 70vh content area with individual heights
const WORK = [
  {
    company: "ASU",
    role: "ML Researcher",
    year: "2026",
    desc: "Building a modular PyTorch Lightning + JAX framework so Applied Materials can stress-test whether neural networks can replace traditional plasma solvers in their etch chambers.",
    stack: "PyTorch Lightning · JAX · Hydra · WandB",
    vh: 24,
  },
  {
    company: "Cadence",
    role: "ML Engineer",
    year: "2025",
    desc: "ESM2 + contrastive-learning pipeline batched through cuDF and PyTorch Lightning. Replaced GP bottleneck with cuML/RAFT — batch sizes jumped 150 → 50K+ at 7.2 ms / sequence.",
    stack: "ESM2 · cuDF · cuML · RAFT · OmegaConf",
    vh: 23,
  },
  {
    company: "Talin Labs",
    role: "GenAI Engineer",
    year: "2024",
    desc: "Deployed a fine-tuned Mistral-7B-Q8 on Kubernetes behind FastAPI with a six-agent LangChain orchestration. Sub-200 ms p95 for 10K users; 88% on 10K human-evaluated queries.",
    stack: "Mistral-7B · Kubernetes · FastAPI · LangChain · LangGraph",
    vh: 23,
  },
]

// Right-column content area = 70vh (100 - 20 intro - 10 nav)
// Pager footer = 5vh, leaving 65vh for cards.
// 4 projects share the 65vh with individual heights.
const PROJECTS = [
  {
    name: "MACE-PINN",
    type: "Master's thesis · 2025",
    desc: "Parallel-subnetwork PINN with random Fourier feature embeddings for coupled PDE systems. 40–60% lower L2 error than single-network baselines on Gray-Scott and Ginzburg-Landau.",
    stack: "JAX · Flax · NumPy",
    links: [
      { label: "github", href: "https://github.com/rushirb2001/thesis-mace-pinn" },
      { label: "paper", href: "https://keep.lib.asu.edu/items/201211" },
    ],
    vh: 18,
  },
  {
    name: "MedQuery",
    type: "LLM benchmark · 2025",
    desc: "10K-query classification benchmark across four difficulty levels and nine categories — comparing local quantised models (MLX, llama.cpp) against frontier APIs honestly.",
    stack: "LangGraph · LangChain · FAISS · OpenAI",
    links: [{ label: "github", href: "https://github.com/rushirb2001" }],
    vh: 18,
  },
  {
    name: "HybridFlow",
    type: "Retrieval system · 2025",
    desc: "Hybrid Qdrant + Neo4j + SQLite retrieval across surgical textbooks with sub-12 ms P50 multi-hop reasoning through ten tool functions.",
    stack: "Qdrant · Neo4j · SQLite · FastAPI",
    links: [{ label: "github", href: "https://github.com/rushirb2001" }],
    vh: 17,
  },
  {
    name: "Yelp recs & sentiment",
    type: "Coursework, prod-quality · 2024",
    desc: "Spark ALS recommender plus a sentiment classifier behind FastAPI microservices serving 5M+ interactions at sub-100 ms p95, with Redis caching and MLflow tracking.",
    stack: "PySpark · FastAPI · MLflow · Docker · Redis",
    links: [
      { label: "github", href: "https://github.com/rushirb2001/yelp-ml-platform" },
    ],
    vh: 17,
  },
]

const EDUCATION = [
  {
    degree: "MS in Data Science",
    school: "Arizona State University",
    detail: "HPC concentration · 2025",
    coursework:
      "Statistical ML · Distributed Systems · GPU Computing · Deep Learning Theory · Numerical Methods · Optimization",
    highlights:
      "Master's thesis on physics-informed neural networks for coupled PDE systems · GPA 4.0",
    vh: 35,
  },
  {
    degree: "BTech in Computer Science & Engineering",
    school: "Nirma University, Ahmedabad",
    detail: "2023",
    coursework:
      "Algorithms · Operating Systems · Computer Networks · Databases · Compilers · Linear Algebra",
    highlights:
      "Graduated with distinction · ACM student chapter · Undergraduate research on graph algorithms",
    vh: 35,
  },
]

function Pager({
  page,
  pageCount,
  onChange,
}: {
  page: number
  pageCount: number
  onChange: (p: number) => void
}) {
  if (pageCount <= 1) return null
  const atFirst = page === 0
  const atLast = page === pageCount - 1
  return (
    <div className="h-[5vh] flex items-stretch">
      <button
        onClick={() => onChange(Math.max(0, page - 1))}
        disabled={atFirst}
        aria-label="Previous"
        className={`flex-1 text-xs font-bold uppercase tracking-[0.25em] text-white transition-colors ${
          atFirst
            ? "bg-[hsl(0_0%_25%)] cursor-not-allowed"
            : "bg-black hover:bg-[hsl(0_0%_15%)]"
        }`}
        style={{ fontFamily: "var(--font-jetbrains)" }}
      >
        ← Prev
      </button>
      <div
        className="flex-1 bg-[hsl(0_0%_89.9%)] text-foreground tabular-nums flex items-center justify-center gap-3 text-xs"
        style={{ fontFamily: "var(--font-jetbrains)" }}
      >
        <span className="font-bold">{String(page + 1).padStart(2, "0")}</span>
        <span className="text-foreground/40">/</span>
        <span>{String(pageCount).padStart(2, "0")}</span>
      </div>
      <button
        onClick={() => onChange(Math.min(pageCount - 1, page + 1))}
        disabled={atLast}
        aria-label="Next"
        className={`flex-1 text-xs font-bold uppercase tracking-[0.25em] text-white transition-colors ${
          atLast
            ? "bg-[hsl(0_0%_25%)] cursor-not-allowed"
            : "bg-black hover:bg-[hsl(0_0%_15%)]"
        }`}
        style={{ fontFamily: "var(--font-jetbrains)" }}
      >
        Next →
      </button>
    </div>
  )
}

function WorkContent() {
  const [page, setPage] = useState(0)
  const pageCount = 1
  const visible = WORK

  return (
    <div className="h-full w-full flex flex-col">
      <div
        className="flex-1 min-h-0 px-12"
        style={{
          background:
            "linear-gradient(180deg, hsl(0 0% 93%) 0%, hsl(0 0% 86%) 100%)",
        }}
      >
        {visible.map((w) => (
          <article
            key={w.company}
            className="grid grid-cols-[1fr_3fr] gap-8 px-1 items-center"
            style={{ height: `${w.vh}vh` }}
          >
            <div>
              <p
                className="uppercase tracking-[0.15em] text-lg font-black text-foreground"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                {w.company}
              </p>
              <p className="mt-2 text-[11px] text-foreground/65">{w.role}</p>
              <p className="text-[10px] text-foreground/45">{w.year}</p>
            </div>
            <div>
              <p className="text-xs leading-relaxed text-foreground">{w.desc}</p>
              <p className="mt-3 text-[9px] uppercase tracking-[0.15em] text-foreground/55">
                {w.stack}
              </p>
            </div>
          </article>
        ))}
      </div>
      <Pager page={page} pageCount={pageCount} onChange={setPage} />
    </div>
  )
}

function ProjectsContent() {
  const [page, setPage] = useState(0)
  const pageCount = 1 // all 4 fit; pager kept for future content
  const visible = PROJECTS

  return (
    <div className="h-full w-full flex flex-col">
      <div
        className="flex-1 min-h-0 px-12"
        style={{
          background:
            "linear-gradient(180deg, hsl(0 0% 93%) 0%, hsl(0 0% 86%) 100%)",
        }}
      >
        {visible.map((p) => (
          <article
            key={p.name}
            className="grid grid-cols-[1fr_3fr] gap-8 px-1 items-center"
            style={{ height: `${p.vh}vh` }}
          >
              <div>
                <p
                  className="uppercase tracking-[0.05em] text-base font-black text-foreground leading-tight"
                  style={{ fontFamily: "var(--font-jetbrains)" }}
                >
                  {p.name}
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.1em] text-foreground/55">
                  {p.type}
                </p>
              </div>
              <div>
                <p className="text-xs leading-relaxed text-foreground">{p.desc}</p>
                <p className="mt-3 text-[9px] uppercase tracking-[0.15em] text-foreground/55">
                  {p.stack}
                </p>
                <div className="mt-2 flex items-center gap-4 text-[11px]">
                  {p.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 decoration-foreground/40 hover:decoration-foreground transition-colors"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
          </article>
        ))}
      </div>
      <Pager page={page} pageCount={pageCount} onChange={setPage} />
    </div>
  )
}

function EducationContent() {
  return (
    <div className="h-full w-full flex flex-col">
      <div
        className="flex-1 min-h-0 px-12"
        style={{
          background:
            "linear-gradient(180deg, hsl(0 0% 93%) 0%, hsl(0 0% 86%) 100%)",
        }}
      >
        {EDUCATION.map((e) => (
          <article
            key={e.degree}
            className="grid grid-cols-[1fr_3fr] gap-8 px-1 items-center"
            style={{ height: `${e.vh}vh` }}
          >
            <div>
              <p
                className="uppercase tracking-[0.05em] text-lg font-black text-foreground leading-tight"
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                {e.degree}
              </p>
              <p className="mt-2 text-[11px] text-foreground/65">{e.school}</p>
              <p className="text-[10px] text-foreground/45">{e.detail}</p>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-[9px] uppercase tracking-[0.15em] text-foreground/55 mb-1">
                  Coursework
                </p>
                <p className="text-xs leading-relaxed text-foreground">
                  {e.coursework}
                </p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.15em] text-foreground/55 mb-1">
                  Highlights
                </p>
                <p className="text-xs leading-relaxed text-foreground">
                  {e.highlights}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  const [active, setActive] = useState(0)
  const prev = useRef(0)
  const direction = active >= prev.current ? 1 : -1

  const handleClick = (i: number) => {
    if (i === active) return
    prev.current = active
    setActive(i)
  }

  return (
    <div className="flex h-screen w-full">
      <div className="w-[20%] h-screen bg-[hsl(0_0%_88%)] flex flex-col">
        <div className="relative w-full h-[35vh]">
          <Image
            src="/images/design-mode/new_personal_photo(1).png"
            alt="Rushir Bhavsar"
            fill
            sizes="30vw"
            className="object-cover object-[60%_30%]"
            priority
          />
        </div>
        <div className="w-full h-[5vh] bg-black flex items-center justify-center">
          <p className="uppercase tracking-[0.5em] text-white text-sm font-black w-full text-center pl-[0.5em]" style={{ fontFamily: "var(--font-jetbrains)" }}>
            ML Engineer
          </p>
        </div>
        <div className="w-full h-[4vh] bg-[hsl(0_0%_25%)] flex items-center justify-center">
          <p className="uppercase tracking-[0.4em] text-white/85 text-[10px] font-bold w-full text-center pl-[0.4em]" style={{ fontFamily: "var(--font-jetbrains)" }}>
            Tempe, AZ
          </p>
        </div>
        <div className="w-full h-[28vh] p-4 flex flex-col bg-[hsl(0_0%_73%)]" style={{ fontFamily: "var(--font-source-code)" }}>
          <nav className="flex-1 flex items-center justify-center">
            <ul className="flex flex-col gap-3 text-base tracking-[0.1em] text-foreground">
              <li>
                <a href="mailto:bhavsarrushir@gmail.com" className="underline underline-offset-4 decoration-foreground/40 hover:decoration-foreground transition-colors">
                  email
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/in/rushir-bhavsar/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-foreground/40 hover:decoration-foreground transition-colors">
                  linkedin
                </a>
              </li>
              <li>
                <a href="https://github.com/rushirb2001" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-foreground/40 hover:decoration-foreground transition-colors">
                  github
                </a>
              </li>
              <li>
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-foreground/40 hover:decoration-foreground transition-colors">
                  resume (pdf)
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="w-full h-[28vh] bg-black p-4 flex items-center justify-center" style={{ fontFamily: "var(--font-source-code)" }}>
          <p className="text-base leading-relaxed text-white max-w-[18ch] text-left">
            Open to full-time{" "}
            <span className="underline underline-offset-4 decoration-white/50">
              ML systems / ML infra
            </span>{" "}
            roles. Currently researching at{" "}
            <span className="underline underline-offset-4 decoration-white/50">
              ASU
            </span>
            .
          </p>
        </div>
      </div>
      <div className="w-[80%] h-screen bg-[hsl(0_0%_89.9%)] flex flex-col">
        <div className="w-full h-[20vh] bg-[hsl(0_0%_89.9%)] flex items-center px-12">
          <p className="text-xs leading-relaxed text-foreground w-full">
            ML engineer drawn to the parts most people skip: orchestration,
            the CUDA kernel that&apos;s actually the bottleneck, the eval
            framework nobody wanted to build but everyone needed. Currently
            at ASU teaching neural networks to simulate plasma inside
            semiconductor etch chambers, after a stretch at Cadence on
            protein property prediction at million-sequence scale. Looking
            for roles where the inference path is as interesting as the
            training path, and where shipping the system matters as much as
            the model that lives inside it.
          </p>
        </div>
        <div className="w-full h-[10vh] bg-black flex items-stretch">
          {TABS.map((label, i) => {
            const isActive = i === active
            return (
              <button
                key={label}
                onClick={() => handleClick(i)}
                className={`group flex-1 flex items-center justify-center gap-3 uppercase tracking-[0.3em] text-sm font-bold cursor-pointer transition-colors duration-200 ${
                  isActive
                    ? "bg-[hsl(0_0%_89.9%)] text-black"
                    : "text-white hover:bg-[hsl(0_0%_89.9%)] hover:text-black"
                }`}
                style={{ fontFamily: "var(--font-jetbrains)" }}
              >
                <span
                  className={`text-xs transition-opacity duration-200 ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  ▼
                </span>
                <span>{label}</span>
              </button>
            )
          })}
        </div>
        <div className="flex-1 min-h-0 overflow-hidden relative">
          <div
            key={active}
            className="slide-pane absolute inset-0"
            style={{ ["--slide-dir" as string]: direction === 1 ? "1" : "-1" }}
          >
            {active === 0 && <WorkContent />}
            {active === 1 && <ProjectsContent />}
            {active === 2 && <EducationContent />}
          </div>
        </div>
      </div>
    </div>
  )
}
