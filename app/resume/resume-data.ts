// The resume as data, transcribed from the PDF this site serves at RESUME_PDF
// (app/site.ts). /resume renders it as HTML so the same facts are readable on a
// phone, linkable per section, and indexable; /hire reads the same records for
// its proof points. When the PDF changes, change this file with it: two
// documents that disagree about a date or a number are worse than one.

export type ResumeLink = { label: string; href: string }

export type ResumeRole = {
  title: string
  org: string
  /** What the org is, for a reader who has not heard of it. */
  orgNote?: string
  orgHref?: string
  place: string
  /** Plain words on purpose ("Nov 2025 to Present"): the site's font subset
      does not cover every dash, and a missing glyph swaps to a system font. */
  period: string
  bullets: string[]
  /** Case studies on this site that expand on the role. */
  related?: ResumeLink[]
}

export const SUMMARY =
  "Founding software engineer who builds AI products end to end: the retrieval and model layer, the API in front of it, and the web, iOS and Android apps people use. Three shipped clients, a production RAG backend, and peer-reviewed ML research."

export const EXPERIENCE: ResumeRole[] = [
  {
    title: "Founding Software Engineer",
    org: "sushrutalgs.ai",
    orgNote: "AI surgical exam prep",
    orgHref: "https://sushrutalgs.ai/welcome",
    place: "Remote",
    period: "Nov 2025 to Present",
    bullets: [
      "Built the edge API gateway in TypeScript with Hono on Cloudflare Workers, fronting web, iOS and Android clients and verifying JWTs over JWKS at p95 0.13 ms with a 99.9%+ key-cache hit rate.",
      "Enforced per-user, plan-aware quotas through an atomic Postgres function, mapping failures to fail-closed 401, 429 and 503 responses, verified across 5K fault-injected requests with zero leakage.",
      "Secured service-to-service calls with two-factor upstream auth (an API key and Cloudflare Access), promoted through three CI-gated GitHub Actions workflows for test, staging and production.",
      "Designed a streaming FastAPI retrieval API exposing 15 tool functions over Neo4j and Qdrant, sustaining 30 concurrent queries at zero errors (14.7x a sequential baseline) at p50 178 ms.",
      "Shipped three client apps on one SSE contract in Next.js, SwiftUI and Jetpack Compose, live on the App Store and Google Play, with three sign-in flows (email OTP, Google, Apple) and row-level security on Postgres.",
      "Automated quality checks in CI with an 8-gate regression suite (citation integrity, hallucination, format), catching quality regressions on every change.",
    ],
    related: [
      { label: "HybridFlow, the retrieval backend", href: "/projects/hybridflow" },
      { label: "The edge gateway", href: "/projects/sushrutalgs-bff" },
      { label: "The web app", href: "/projects/sushrutalgs-web" },
      { label: "The iOS app", href: "/projects/sushrutalgs-ios" },
      { label: "Samhita, the ingestion pipeline", href: "/projects/samhita" },
    ],
  },
  {
    title: "Software Engineer Intern, Scientific Computing",
    org: "OpenEye, Cadence Design Systems",
    place: "Santa Fe, USA",
    period: "Jul 2025 to Oct 2025",
    bullets: [
      "Built a protein thermostability prediction pipeline from scratch on ESM2, a 650M-parameter protein language model, with PyTorch Lightning and cuDF, serving inference at 7.2 ms per sequence across 1M+ sequences.",
      "Scaled contrastive training batches 333x, from 150 to 50K+, for antibody thermostability across five protein language models by swapping in GPU-accelerated cuML/RAFT components.",
      "Created a type-safe config framework with OmegaConf and Pydantic, catching configuration errors before runtime and making GPU hyperparameter sweeps reproducible.",
    ],
  },
  {
    title: "Software Engineer Intern, GenAI",
    org: "Talin Labs",
    place: "Los Angeles, USA",
    period: "Jun 2024 to Sep 2024",
    bullets: [
      "Built a PySpark ingestion pipeline on Kubernetes normalizing 150K+ vendor records for 12+ clients into Parquet and pgvector-indexed Postgres for procurement matching.",
      "Automated compliant supplier matching with a multi-agent LangChain pipeline pairing FAISS semantic retrieval with NAICS, SIC and ISO compliance filters.",
      "Fine-tuned Mistral-7B with QLoRA on a 4-GPU A100 cluster for procurement-aware query generation, reaching 88% accuracy on a 10K-query RAG evaluation harness.",
    ],
  },
]

export type ResumeProject = {
  name: string
  what: string
  stack: string[]
  bullets: string[]
  links: ResumeLink[]
}

export const PROJECTS: ResumeProject[] = [
  {
    name: "cohors",
    what: "Git fleet control plane",
    stack: ["Rust", "MCP", "TUI", "Web"],
    bullets: [
      "Architected a Rust control plane for git repositories as a 9-crate workspace, with one core serving a CLI, terminal UI, web UI and MCP server over a fleet-wide search index, released through v0.6.0 with CI.",
      "Designed a governed MCP API for coding agents with read-only defaults, dry-run previews for every bulk action, confirm gates on destructive operations and fast-forward-only pulls.",
    ],
    links: [{ label: "github.com/rushirb2001/cohors", href: "https://github.com/rushirb2001/cohors" }],
  },
  {
    name: "principia",
    what: "VS Code agent launchpad",
    stack: ["TypeScript", "VS Code Extension API", "JSON Schema"],
    bullets: [
      "Developed a VS Code launchpad extension that auto-detects runnable tasks across six toolchains (npm, Cargo, Make, Gradle, uv, pytest) in recently opened repos, with live git state and one-click session resume.",
      "Defined a versioned JSON contract with a spec, JSON Schemas and a zero-dependency validator, letting four agent runners write each repo's entry automatically.",
    ],
    links: [],
  },
  {
    name: "Yelp ML Platform",
    what: "Recommender and sentiment",
    stack: ["PySpark", "FastAPI", "MLflow"],
    bullets: [
      "Processed the full Yelp dataset with PySpark at 460K rows/s across 6.99M reviews, training a bias-based recommender that beat ALS matrix factorization (RMSE 1.17, recall@10 6.2x over popularity).",
      "Cut sentiment inference latency from 276 ms to 0.11 ms by exporting the model to a NumPy-only serving path with 100% prediction parity.",
    ],
    links: [
      { label: "Case study", href: "/projects/yelp-ml-platform" },
      { label: "github.com/rushirb2001/yelp-ml-platform", href: "https://github.com/rushirb2001/yelp-ml-platform" },
    ],
  },
]

export const EDUCATION = [
  {
    degree: "M.S. Data Science (High-Performance Computing)",
    school: "Arizona State University",
    place: "Tempe, USA",
    period: "May 2025",
    note: "GPA 3.72 / 4.0",
  },
  {
    degree: "B.Tech. Computer Science and Engineering",
    school: "Nirma University",
    place: "Ahmedabad, India",
    period: "Jun 2023",
  },
]

export const PUBLICATIONS = [
  {
    title: "Multi-Architecture Coupled Ensemble Physics-Informed Neural Networks",
    venue: "M.S. thesis, Arizona State University, 2025",
    href: "https://keep.lib.asu.edu/items/201211",
    caseStudy: "/projects/mace-pinn",
  },
  {
    title: "Classification of potentially hazardous asteroids using supervised quantum machine learning",
    venue: "IEEE Access, vol. 11, 2023",
    href: "https://ieeexplore.ieee.org/document/10188662",
  },
  {
    title: "MetaHate: AI-based hate speech detection for secured online gaming in metaverse using blockchain",
    venue: "Security and Privacy, Wiley, 2024",
    href: "https://onlinelibrary.wiley.com/doi/abs/10.1002/spy2.343",
  },
]

export const SKILLS = [
  {
    group: "Languages",
    items: ["Python", "TypeScript", "Rust", "Kotlin", "Swift", "SQL", "C/C++", "Bash"],
  },
  {
    group: "AI and ML",
    items: [
      "RAG systems",
      "LLM orchestration",
      "Tool calling",
      "MCP",
      "Fine-tuning (QLoRA)",
      "PyTorch",
      "PyTorch Lightning",
      "JAX",
      "Hugging Face",
      "RAPIDS (cuDF, cuML)",
      "LangChain",
    ],
  },
  {
    group: "APIs and security",
    items: [
      "REST",
      "FastAPI",
      "Hono",
      "SSE streaming",
      "JSON Schema",
      "JWT / JWKS",
      "OAuth 2.0 / OpenID Connect",
      "Quotas and rate limiting",
      "Row-level security",
    ],
  },
  {
    group: "Data",
    items: ["PostgreSQL", "Supabase", "Redis", "SQLite", "Neo4j", "Qdrant", "FAISS", "pgvector", "Spark / PySpark"],
  },
  {
    group: "Infra and delivery",
    items: [
      "Docker",
      "Kubernetes",
      "AWS",
      "Azure",
      "Cloudflare Workers",
      "Cloudflare R2",
      "GitHub Actions",
      "Linux",
    ],
  },
]
