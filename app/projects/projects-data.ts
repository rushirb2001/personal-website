// Project detail data for the routable case-study modal at /projects/[slug].
//
// Goal: make a project credible to a recruiter / hiring manager / tech lead who
// CANNOT see the source (private repo). Credibility = specific, accurate detail
// + verifiable artifacts + an easy way to follow up.
//
// repoStatus: "public"  -> link the repo + paper directly (strongest proof)
// repoStatus: "private" -> show a "request access" link + optional "why private" note
//
// Artifact fields use a `{ todo: "..." }` convention: it renders a labelled
// placeholder IN DEV ONLY (hidden in production), so a half-filled live page
// never shows a placeholder to a visitor. A real value renders everywhere.

export type ProjectLink = { label: string; href: string }
export type Screenshot = { src: string; caption?: string }
export type Clip = { src: string; caption?: string }

/** A small quantitative results table (headers + rows of equal length). */
export type ResultsTable = { headers: string[]; rows: string[][]; note?: string }

/** A labelled case-study section rendered below the hero. Each can carry prose,
    accent-dash bullets (lead phrase up to the first period is emphasised), and/or
    a results table. */
export type CaseSection = {
  label: string
  body?: string
  bullets?: string[]
  table?: ResultsTable
}

export type DemoVideo = { embedUrl?: string; todo?: string }
export type LiveDemo = { url?: string; todo?: string }
export type Screenshots = { items?: Screenshot[]; todo?: string }
export type Diagram = "builtin" | { todo: string }
export type Walkthrough = { url?: string; todo?: string }

export type ProjectDetail = {
  slug: string
  /** Short identifier — used for the browser tab, link previews, mailto subjects. */
  name: string
  /** Full display title for the h1. Falls back to `name` when omitted. */
  title?: string
  /** One-line description under the title, also used for link previews. */
  tagline: string
  /** Rendered as "<type> @ <place>". For personal work: "Personal project", etc. */
  type: string
  /** Org / school / company. Omit for personal projects. */
  place?: string
  repoStatus: "public" | "private"
  /** Private: a short "why private" note. Public: usually omitted. */
  repoNote?: string
  /** Concise highlight bullets — optional, currently unused in render. */
  highlights?: string[]
  /** Deeper case-study sections rendered below the hero (Overview, Approach, …). */
  sections?: CaseSection[]
  stack: string[]
  /** Repo / paper / write-up links. Omit the repo when private. */
  links: ProjectLink[]
  artifacts: {
    diagram?: Diagram
    /** Local, muted, autoplay-loop result clips (mp4). Strong, real proof. */
    clips?: Clip[]
    demoVideo?: DemoVideo
    liveUrl?: LiveDemo
    screenshots?: Screenshots
  }
  verify: {
    requestAccessEmail?: string
    walkthrough?: Walkthrough
    contactEmail?: string
  }
}

export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  // Worked example, grounded in ../thesis-mace-pinn. Public repo + thesis, so no
  // "request access" treatment — the proof is one click away.
  "mace-pinn": {
    slug: "mace-pinn",
    name: "MACE-PINN",
    title: "Multi-Architecture Coupled Ensemble Physics-Informed Neural Networks",
    tagline:
      "Built a physics-informed neural network that solves coupled reaction-diffusion equations, using a dedicated subnetwork per variable, Fourier input features, and self-balancing loss weights. It matches reference solutions within a few percent and cuts error 40 to 60 percent against a standard PINN.",
    type: "Master's thesis",
    place: "Arizona State University",
    repoStatus: "public",
    highlights: [
      "Parallel U/V subnetworks — 40–60% lower relative L2 than single-network PINNs.",
      "64-dim random Fourier embeddings capture sharp spot, stripe, and self-replication patterns.",
      "Gradient-norm adaptive loss weighting for stable IC / residual / data convergence.",
      "2.3–3.5% relative L2 on Gray-Scott and Ginzburg-Landau, trained on one NVIDIA H100.",
    ],
    sections: [
      {
        label: "Overview",
        body: "Reaction-diffusion equations describe how patterns form and spread across physics, chemistry, and biology, from chemical fronts to biological morphogenesis. They are normally solved with slow numerical methods. This thesis trains a neural network to learn those solutions directly from the governing equations, and makes that approach work for the stiff, coupled systems where standard physics-informed neural networks break down.",
      },
      {
        label: "Approach",
        bullets: [
          "Parallel subnetworks. A dedicated network for each coupled field, trained jointly under one physics-informed loss, which removes the gradient interference that degrades single-network PINNs.",
          "Fourier feature embeddings. A 64-dimensional random-feature lift of the (x, y, t) inputs that overcomes spectral bias and lets the model resolve sharp, high-frequency pattern structure.",
          "Gradient-norm adaptive loss weighting. Per-term weights set from running gradient magnitudes, automatically balancing the initial-condition, residual, and data objectives for stable convergence.",
        ],
      },
      {
        label: "Results",
        body: "40 to 60 percent lower relative L2 error than single-network PINN baselines, consistently across both systems.",
        table: {
          headers: ["System", "Variation", "Rel. L2", "Train", "Pattern"],
          rows: [
            ["Gray-Scott", "Benchmark", "2.3%", "1.8 hr", "Spots"],
            ["Gray-Scott", "Self-replicating", "2.7%", "2.1 hr", "Replicating"],
            ["Ginzburg-Landau", "Forcing", "3.1%", "2.4 hr", "Waves"],
            ["Ginzburg-Landau", "Boundary", "3.5%", "2.3 hr", "Oscillations"],
          ],
          note: "Trained on a single NVIDIA H100 (80 GB).",
        },
      },
      {
        label: "Engineering",
        body: "Implemented from scratch in JAX and Flax. Evaluated across four benchmark variations spanning the Gray-Scott and Ginzburg-Landau systems, each measured as relative L2 error against a reference numerical solution.",
      },
    ],
    stack: ["JAX", "Flax", "NumPy", "Random Fourier Features"],
    links: [
      { label: "github", href: "https://github.com/rushirb2001/thesis-mace-pinn" },
      { label: "link to thesis paper", href: "https://keep.lib.asu.edu/items/201211" },
    ],
    artifacts: {
      diagram: "builtin",
      clips: [
        {
          src: "https://v9fl0vq2qbxv8yrh.public.blob.vercel-storage.com/projects/mace-pinn/solution-v1-VCtzRJ3zEYAzn9uEwwIqnYk0ekrGH8.mp4",
          caption: "Gray-Scott spot splitting (mitosis): predicted solution vs. reference.",
        },
        {
          src: "https://v9fl0vq2qbxv8yrh.public.blob.vercel-storage.com/projects/mace-pinn/solution-v2-g08Pl8NhxJuMj8RJTyx8skyVmn8FWh.mp4",
          caption: "Gray-Scott stripe formation: predicted solution vs. reference.",
        },
        {
          src: "https://v9fl0vq2qbxv8yrh.public.blob.vercel-storage.com/projects/mace-pinn/solution-v4-ncEfw48vdloUzhaABVl0gVxGhKbfqQ.mp4",
          caption: "Gray-Scott chaotic dynamics: predicted solution vs. reference.",
        },
      ],
      // Dev-only placeholders; swap in real URLs to render them live.
      demoVideo: { todo: "Unlisted Loom / YouTube walkthrough — paste the embed URL" },
      liveUrl: { todo: "Hosted interactive solver demo — paste the URL" },
    },
    verify: {
      walkthrough: { todo: "cal.com / Calendly link for a 15-min walkthrough" },
    },
  },

  // ── SushrutaLGS data layer ──────────────────────────────────────────────
  samhita: {
    slug: "samhita",
    name: "Samhita",
    tagline:
      "Built a Python pipeline that turns full-length surgical-textbook PDFs into clean, structured, machine-readable data, processing 220 chapters into a searchable knowledge base of sections, figures, and tables enriched with AI-generated descriptions. It produces a versioned, hash-verified export that the search platform loads into its graph and vector databases.",
    type: "Data pipeline",
    place: "SushrutaLGS",
    repoStatus: "private",
    repoNote:
      "Source is private; SushrutaLGS is a live product. Happy to walk through the code or grant read access on request.",
    sections: [
      {
        label: "Overview",
        body: "SushrutaLGS answers surgical-exam questions with citations traced back to standard textbooks. Samhita is the data layer that makes that possible: it converts three full surgical textbooks from raw PDF into clean, structured, machine-readable knowledge that the retrieval backend can load.",
      },
      {
        label: "Approach",
        bullets: [
          "Deterministic parsing. An Adobe-JSON parser with a six-phase recovery pipeline extracts sections, figures, and tables, fixing documented edge cases such as a bug that silently dropped 968 table elements.",
          "Knowledge graph. The content is assembled into a 71,621-node, 130,057-edge graph spanning chapters, sections, figures, tables, and cross-references.",
          "Embeddings and taxonomy. Each unit is embedded with BioLORD, a medical-domain model, and tagged against a 17-domain taxonomy for retrieval.",
        ],
      },
      {
        label: "Results",
        body: "220 chapters and 5,941 pages processed end to end, into 52,871 embeddings and 5,987 resolved cross-references, with 100 percent structural validation across all 220 exported chapter packages and a clean rebuild that reproduced every count.",
      },
      {
        label: "Engineering",
        body: "Built in Python with Pydantic, PyMuPDF, and the Adobe PDF Services and Anthropic Claude APIs. Exports are immutable and content-hashed, published to Cloudflare R2 with manifest drift detection, and gated by a CI workflow with mocked tests.",
      },
    ],
    stack: ["Python", "Pydantic", "Adobe PDF Services", "Anthropic Claude", "BioLORD", "Cloudflare R2"],
    links: [{ label: "live product", href: "https://sushrutalgs.ai" }],
    artifacts: {
      diagram: "builtin",
      demoVideo: { todo: "Loom walkthrough of a chapter run" },
    },
    verify: { requestAccessEmail: "bhavsarrushir@gmail.com" },
  },

  hybridflow: {
    slug: "hybridflow",
    name: "HybridFlow",
    tagline:
      "Built a search-and-answer backend that lets clinicians and medical students ask questions of major surgical textbooks and get cited, structured answers. It combines semantic vector search, a knowledge graph of how the books are organized, and a streaming service that uses Claude to plan and write each answer.",
    type: "Retrieval backend",
    place: "SushrutaLGS",
    repoStatus: "private",
    repoNote:
      "Source is private; SushrutaLGS is a live product. Happy to walk through the code or grant read access on request.",
    sections: [
      {
        label: "Overview",
        body: "HybridFlow is the retrieval and answer engine behind SushrutaLGS. A user asks a question; the system finds the right passages across three surgical textbooks and streams back a cited, structured answer. It is built for the hard case where a single search method is not enough.",
      },
      {
        label: "Approach",
        bullets: [
          "Hybrid retrieval. Semantic search over medical-domain vectors in Qdrant runs alongside a Neo4j knowledge graph that captures the chapter-to-section-to-paragraph hierarchy, cross-references, and concepts.",
          "Agentic orchestration. A streaming FastAPI service runs a multi-call Claude pipeline: Haiku validates and selects chapters and scores figures and tables, then Sonnet writes the answer, all exposed through 15 retrieval tools.",
          "Quality gates. Answers pass an eight-gate regression suite covering classification, citation integrity, hallucination density, format, and fallbacks.",
        ],
      },
      {
        label: "Results",
        body: "Sustained 30 concurrent queries with zero errors at about 14.7 times the throughput of a sequential baseline, passing the answer-quality suite 20 of 20. Component vector retrieval scored success@5 of 0.90 and MRR 0.79 on a frozen gold set, with p50 search latency around 178 ms.",
      },
      {
        label: "Engineering",
        body: "Python and FastAPI with server-sent-events streaming, Qdrant and Neo4j for storage, and the Anthropic Claude API for planning and generation. Prompt caching cuts the planning call by thousands of tokens at an 80 percent hit rate, holding cost near 0.05 to 0.06 dollars per answered query. Served behind a Cloudflare Worker gateway with two-factor service auth.",
      },
    ],
    stack: ["Python", "FastAPI", "Qdrant", "Neo4j", "Anthropic Claude", "Docker", "Cloudflare"],
    links: [{ label: "live product", href: "https://sushrutalgs.ai" }],
    artifacts: {
      diagram: "builtin",
      demoVideo: { todo: "Loom of a streaming query" },
    },
    verify: { requestAccessEmail: "bhavsarrushir@gmail.com" },
  },

  "sushrutalgs-bff": {
    slug: "sushrutalgs-bff",
    name: "SushrutaLGS BFF",
    tagline:
      "Built a Cloudflare Worker gateway that sits between the SushrutaLGS web and iOS apps and the AI backend, handling user authentication, per-user daily usage limits, and secure request forwarding so both apps talk to one trusted entry point. It runs live in staging and production and adds only about 14 milliseconds of overhead at the edge.",
    type: "Backend-for-frontend",
    repoStatus: "private",
    repoNote:
      "Source is private; SushrutaLGS is a live product. Happy to walk through the code or grant read access on request.",
    sections: [
      {
        label: "Overview",
        body: "The BFF is the single trusted entry point for SushrutaLGS. Both the web and iOS apps call it instead of holding backend secrets or duplicating auth and billing logic. It verifies who the user is, enforces their daily usage limit, and forwards the request to the AI backend.",
      },
      {
        label: "Approach",
        bullets: [
          "One gateway, two clients. It accepts an iOS bearer token or a web auth cookie and verifies Supabase JWTs at the edge, so neither client embeds the backend API key.",
          "Atomic quota. A plan-aware daily limit is enforced through a single Supabase database function against the same row the apps read for their usage display, giving one source of truth.",
          "Streaming pass-through. The query endpoint streams server-sent events back byte for byte, failing closed on quota or backend errors.",
        ],
      },
      {
        label: "Results",
        body: "Live in staging and production at about 14 ms of edge overhead, a roughly 33 KB gzipped bundle, and JWT verification at p95 around 0.13 ms. Quota enforcement measured about 9,200 operations per second on a single hot row, with verified fail-closed mapping and zero errors through 200 concurrent requests.",
      },
      {
        label: "Engineering",
        body: "TypeScript and Hono on Cloudflare Workers, with the jose library for JWT and JWKS verification, Supabase for auth and the quota function, and Cloudflare Access service tokens for upstream auth. Staging auto-deploys on push; production is gated by a release, so the iOS app's uptime is decoupled from web deploys.",
      },
    ],
    stack: ["TypeScript", "Hono", "Cloudflare Workers", "jose (JWT)", "Supabase", "Vitest"],
    links: [{ label: "live product", href: "https://sushrutalgs.ai" }],
    artifacts: {
      diagram: "builtin",
      demoVideo: { todo: "Loom of a request lifecycle" },
    },
    verify: { requestAccessEmail: "bhavsarrushir@gmail.com" },
  },

  "sushrutalgs-ios": {
    slug: "sushrutalgs-ios",
    name: "SushrutaLGS iOS",
    tagline:
      "Built the native iOS app for SushrutaLGS, an AI study companion that answers surgical-exam questions with streaming responses backed by citations, figures, and tables from standard textbooks. It ships three sign-in options, conversation history that syncs across a user's devices, and an iPhone and iPad interface.",
    type: "iOS app",
    repoStatus: "private",
    repoNote:
      "Source is private; SushrutaLGS is a live product. Happy to walk through the code or grant read access on request.",
    sections: [
      {
        label: "Overview",
        body: "The iOS app is the native client for SushrutaLGS. It gives surgery residents a fast, polished way to study on iPhone and iPad: ask a question, watch the answer stream in with citations, figures, and tables, and pick up the same conversation on another device.",
      },
      {
        label: "Approach",
        bullets: [
          "Native and modern. SwiftUI only, iOS 26, Swift 6 strict concurrency, with a Model-View architecture and observable services injected at the root.",
          "Streaming chat. A five-type server-sent-events protocol drives a per-bubble typewriter reveal, with cross-device handoff broadcast over a Supabase Realtime channel.",
          "Secure auth. Email one-time codes, Google Sign-In, and Sign in with Apple, all exchanged through Supabase with nonce-based replay protection.",
        ],
      },
      {
        label: "Results",
        body: "About 33,200 lines of Swift across 105 files and 80 views, shipping at a 20.8 MB App Store install size. A CI security gate fails any build that would leak a backend host or secret, and the conversation model and streaming protocol are shared one-to-one with the web client.",
      },
      {
        label: "Engineering",
        body: "Swift 6 and SwiftUI with Swift Package Manager, supabase-swift for auth, Realtime, and database access, GoogleSignIn and Sign in with Apple for identity, and Xcode Cloud for CI. It is a leaf client: all model inference goes through the SushrutaLGS BFF, so it holds no backend secrets.",
      },
    ],
    stack: ["Swift 6", "SwiftUI", "supabase-swift", "Google Sign-In", "Sign in with Apple", "Xcode Cloud"],
    links: [{ label: "live product", href: "https://sushrutalgs.ai" }],
    artifacts: {
      diagram: "builtin",
      screenshots: {
        items: [
          { src: "https://v9fl0vq2qbxv8yrh.public.blob.vercel-storage.com/projects/sushrutalgs-ios/ios-chat-u22RCaYDX0sEbJh6W2WcUg5HHYkftt.webp", caption: "Streaming chat with a cited answer." },
          { src: "https://v9fl0vq2qbxv8yrh.public.blob.vercel-storage.com/projects/sushrutalgs-ios/ios-figures-f1DCQcrwoKsGACryvl5QdCrCcqKXlR.webp", caption: "Inline textbook figures with citations." },
          { src: "https://v9fl0vq2qbxv8yrh.public.blob.vercel-storage.com/projects/sushrutalgs-ios/ios-by-textbook-Nhf6nz4Eyau7uwrrABEUQThM26PQAg.webp", caption: "Citations grouped by source textbook." },
          { src: "https://v9fl0vq2qbxv8yrh.public.blob.vercel-storage.com/projects/sushrutalgs-ios/ios-new-chat-1PAX7DWp61oYbYG5DbBmphcVVLBc1u.webp", caption: "New chat and the textbook picker." },
        ],
      },
      demoVideo: { todo: "Screen recording of the app" },
    },
    verify: { requestAccessEmail: "bhavsarrushir@gmail.com" },
  },

  "sushrutalgs-web": {
    slug: "sushrutalgs-web",
    name: "SushrutaLGS Web",
    tagline:
      "Built the web application for SushrutaLGS, an AI study assistant for advanced surgical exam prep that answers questions with citations traced back to standard textbooks. It delivers a streaming chat interface with branching conversations, inline textbook figures and tables, and the marketing, sign-up, and onboarding flows.",
    type: "Web app",
    repoStatus: "private",
    repoNote:
      "Source is private; SushrutaLGS is a live product. Happy to walk through the code or grant read access on request.",
    sections: [
      {
        label: "Overview",
        body: "The web app is the primary SushrutaLGS client and marketing site. It delivers the streaming chat experience, the figure and table citations, and the sign-up and onboarding flows that bring a user into the product.",
      },
      {
        label: "Approach",
        bullets: [
          "Branching conversations. Retry and edit create sibling branches in a tree-structured message model, driven by a reducer store and mirrored in Postgres so a conversation can be resumed anywhere.",
          "Streaming UI. A server-sent-events client decodes tokens, thinking steps, citations, and figure and table artifacts as they arrive from the gateway.",
          "Hardened data path. Auth-gated Cloudflare R2 proxies serve textbook figures and tables, behind a build-time content-security policy and redaction-wrapped scripts.",
        ],
      },
      {
        label: "Results",
        body: "About 27,300 lines of TypeScript across 51 components, 18 routes, and 6 API routes, with 23 consecutive Supabase migrations hardening row-level security, quota enforcement, and search. Clean production build with a roughly 2 MB client footprint.",
      },
      {
        label: "Engineering",
        body: "Next.js 16 and React 19 with Tailwind CSS v4, Supabase for auth and Postgres, Cloudflare R2 for assets, and Resend for email, deployed on Vercel. Model inference is delegated to the SushrutaLGS BFF, so the web client never holds the backend key.",
      },
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Supabase", "Cloudflare R2", "Vercel"],
    links: [{ label: "live product", href: "https://sushrutalgs.ai" }],
    artifacts: {
      diagram: "builtin",
      screenshots: { todo: "Screenshots of the chat and citations" },
      demoVideo: { todo: "Screen recording of the live app" },
    },
    verify: { requestAccessEmail: "bhavsarrushir@gmail.com" },
  },

  // ── Standalone ML platform ──────────────────────────────────────────────
  "yelp-ml-platform": {
    slug: "yelp-ml-platform",
    name: "Yelp ML Platform",
    tagline:
      "Built an end-to-end machine learning platform on the full 7-million-review Yelp dataset that powers two services: a business recommendation engine and a sentiment classifier, served through one REST API. The work spans large-scale data processing, model training, API serving, containerization, and automated testing.",
    type: "Personal project",
    repoStatus: "public",
    sections: [
      {
        label: "Overview",
        body: "A production-style machine learning platform built on the full Yelp Open Dataset. It takes raw review data all the way to a served API, with two models: one that recommends businesses and one that scores the sentiment of review text.",
      },
      {
        label: "Approach",
        bullets: [
          "Large-scale ETL. A Spark pipeline converts the full seven-million-review dataset from JSON to Parquet at about 462,000 rows per second on a single eight-core node.",
          "Two models. A Spark ALS collaborative-filtering recommender and a TF-IDF plus logistic-regression sentiment classifier, tracked and versioned with MLflow.",
          "Fast serving. The sentiment model is exported to a Spark-free NumPy inference path with verified prediction parity, served through a FastAPI service.",
        ],
      },
      {
        label: "Results",
        body: "The recommender reached Recall@10 of 5.5 percent, 6.2 times a most-popular baseline, with a bias-augmented variant at RMSE 1.17. The sentiment classifier reached 86.3 percent accuracy and a macro-F1 of 0.73 with class weighting. The exported inference path runs at p99 0.11 ms with 100 percent parity to the training model.",
      },
      {
        label: "Engineering",
        body: "PySpark for ETL and model training, FastAPI for serving, MLflow for experiment tracking, and Docker Compose for orchestration, with a Pytest suite and GitHub Actions CI. Every headline number is backed by committed, provenance-stamped benchmark outputs.",
      },
    ],
    stack: ["PySpark", "FastAPI", "MLflow", "Docker", "NLTK", "NumPy", "Pytest"],
    links: [{ label: "github", href: "https://github.com/rushirb2001/yelp-ml-platform" }],
    artifacts: {
      diagram: "builtin",
      demoVideo: { todo: "Loom of the API and benchmarks" },
    },
    verify: {},
  },
}

// ─────────────────────────────────────────────────────────────────────────
// TEMPLATE — copy for a new (esp. PRIVATE-repo) project:
//
// "<slug>": {
//   slug: "<slug>",
//   name: "Project Name",
//   tagline: "One specific sentence — what it is and why it's impressive.",
//   type: "Personal project",   // or "Master's thesis", "Open-source", "Internship", ...
//   place: "Org / school",      // optional — omit entirely for personal projects
//   repoStatus: "private",
//   repoNote: "Source is private because <reason> — happy to grant read access or walk through it.",
//   highlights: [
//     "One concise line each — the main points (real numbers, not big paragraphs).",
//   ],
//   stack: ["..."],
//   links: [],  // no public repo when private; add a paper / blog / public sibling if any
//   artifacts: {
//     diagram: { todo: "System / data-flow diagram" },
//     clips: [{ src: "/projects/<slug>/clip.mp4", caption: "..." }],
//     demoVideo: { embedUrl: "https://www.loom.com/embed/XXXX" },
//     liveUrl: { url: "https://demo.example.com" },
//     screenshots: { items: [{ src: "/projects/<slug>/shot-1.png", caption: "..." }] },
//   },
//   verify: {
//     requestAccessEmail: "bhavsarrushir@gmail.com",
//     walkthrough: { url: "https://cal.com/rushir/15min" },
//     contactEmail: "bhavsarrushir@gmail.com",
//   },
// },
// ─────────────────────────────────────────────────────────────────────────

export function getProjectDetail(slug: string): ProjectDetail | undefined {
  return PROJECT_DETAILS[slug]
}

export const PROJECT_DETAIL_SLUGS = Object.keys(PROJECT_DETAILS)

export function hasProjectDetail(slug: string): boolean {
  return slug in PROJECT_DETAILS
}
