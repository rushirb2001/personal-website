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
  /**
   * <title> for search results. `name` alone produces "BFF", "iOS", "Web",
   * which say nothing to a searcher and rank for nothing; `title` is often too
   * long to survive truncation. This is the middle: ~45 characters, leading
   * with the term someone would actually type. Falls back to `name`.
   */
  seoTitle?: string
  /**
   * Meta description. `tagline` runs 300+ characters and Google shows ~155, so
   * without this the useful half is never displayed. Falls back to `tagline`.
   */
  seoDescription?: string
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
  /**
   * Headline numbers for the outcomes band. Structured on purpose: an earlier
   * attempt derived these by regex-splitting `highlights`, which turned
   * "2.3-3.5% relative L2..." into a heading of "2". A case study leads with
   * its measurements, so they get a real field.
   */
  metrics?: { value: string; label: string }[]
  /** Deeper case-study sections rendered below the hero (Overview, Approach, …). */
  sections?: CaseSection[]
  stack: string[]
  /** Repo / paper / write-up links. Omit the repo when private. */
  links: ProjectLink[]
  artifacts: {
    diagram?: Diagram
    /** Local, muted, autoplay-loop result clips (mp4). Strong, real proof. */
    clips?: Clip[]
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
    seoTitle: "MACE-PINN: ensemble physics-informed neural networks",
    seoDescription:
      "Master's thesis at ASU: coupled ensembles of physics-informed neural networks, benchmarked against traditional solvers. Public repo and thesis.",
    tagline:
      "Built a physics-informed neural network that solves coupled reaction-diffusion equations, using a dedicated subnetwork per variable, Fourier input features, and self-balancing loss weights. It matches reference solutions within a few percent and cuts error 40 to 60 percent against a standard PINN.",
    type: "Master's thesis",
    place: "Arizona State University",
    repoStatus: "public",
    highlights: [
      "Parallel U/V subnetworks: 40–60% lower relative L2 than single-network PINNs.",
      "64-dim random Fourier embeddings capture sharp spot, stripe, and self-replication patterns.",
      "Gradient-norm adaptive loss weighting for stable IC / residual / data convergence.",
      "2.3–3.5% relative L2 on Gray-Scott and Ginzburg-Landau, trained on one NVIDIA H100.",
    ],
    sections: [
      {
        label: "The problem",
        body:
          "Reaction-diffusion equations describe how patterns organize themselves out of nothing much: chemical fronts, spots that split and replicate, spiral waves in excitable media. Solving them normally means stepping a fine grid forward in time, and the grid has to stay fine wherever the solution is sharp, which is exactly where the interesting behavior is. Physics-informed neural networks offer a mesh-free alternative that learns a solution from the governing equations themselves, but the standard formulation is demonstrated mostly on single-field, well-behaved problems. On genuinely coupled, stiff systems (Gray-Scott, Ginzburg-Landau) the standard formulation breaks down, and that gap is what the thesis went after.",
      },
      {
        label: "Why it is hard",
        body:
          "Three failure modes stack on top of each other. One network predicting both fields shares every weight between two objectives, so gradients from one field's residual drag the shared representation away from what the other field needs, and the coupling that makes the system worth solving is also what makes it fight itself. Separately, an MLP fed raw (x, y, t) has a spectral bias: it fits the smooth, low-frequency part of the solution first, and the sharp spot boundaries and stripe edges are precisely the high-frequency content it learns last or not at all. Then the loss itself is unbalanced, because the initial-condition, residual and data terms do not arrive with comparable gradient magnitudes, so a fixed hand-tuned weighting is a knob you have to rediscover for every system you touch.",
      },
      {
        label: "The design",
        body:
          "The answer was one jointly trained block that gives each coupled field its own network instead of splitting one network's capacity between them. The cheaper obvious alternative, a single wider MLP with two output heads, was rejected on purpose: shared weights are where the gradient interference lives, so widening the network buys capacity without removing the actual conflict. Three decisions do the work.",
        bullets: [
          "A subnetwork per field. The u and v networks are trained together under one physics-informed loss with an iterative coupling between them, so the fields stay linked without sharing parameters.",
          "A 64-dimensional random Fourier lift. The (x, y, t) inputs are embedded before they reach either subnetwork, which sidesteps spectral bias and lets the model resolve sharp structure instead of smoothing it away.",
          "Gradient-norm adaptive loss weights. Per-term weights are set from running gradient magnitudes and fed back into the block, so the initial-condition, residual and data objectives balance themselves rather than being tuned by hand per system.",
        ],
      },
      {
        label: "What it cost",
        body:
          "Two subnetworks plus a coupling term is more parameters and more compute per training step than one shared network, and it adds another moving part that has to stay stable. The two are also not symmetric (u is 3 layers of 64 units, v is 4 of 128) because the fields do not have equal complexity, and those shapes were picked empirically rather than derived. The structural limit is the one every vanilla PINN has: a trained model solves one parameter setting, not a family, so changing the coefficients means training again rather than re-running a solver.",
      },
      {
        label: "Where it stands",
        body:
          "Across four benchmark variations spanning both systems, relative L2 error against a reference numerical solution landed between 2.3 and 3.5 percent, 40 to 60 percent below single-network PINN baselines on the same problems. The model reproduces the behavior that defeats a standard PINN here, including spot splitting, stripe formation and the chaotic Gray-Scott regime shown in the clips. Everything was implemented from scratch in JAX and Flax, and every run fit on a single GPU in under two and a half hours.",
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
    ],
    metrics: [
      { value: "2.3-3.5%", label: "relative L2 error" },
      { value: "40-60%", label: "lower than a single-network PINN" },
      { value: "1x H100", label: "whole thesis, one GPU" },
      { value: "4", label: "benchmark variations" },
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
      liveUrl: { todo: "Hosted interactive solver demo. Paste the URL" },
    },
    verify: {
      walkthrough: { todo: "cal.com / Calendly link for a 15-min walkthrough" },
    },
  },

  // ── sushrutalgs.ai data layer ──────────────────────────────────────────────
  "samhita": {
    slug: "samhita",
    name: "Samhita",
    seoTitle: "Samhita: surgical textbook PDFs to structured data",
    seoDescription:
      "A Python pipeline turning 220 surgical-textbook chapters into versioned, hash-verified structured data for a graph and vector search stack.",
    tagline:
      "Built a Python pipeline that turns full-length surgical-textbook PDFs into clean, structured, machine-readable data, processing 220 chapters into a searchable knowledge base of sections, figures, and tables enriched with AI-generated descriptions. It produces a versioned, hash-verified export that the search platform loads into its graph and vector databases.",
    type: "Data pipeline",
    place: "sushrutalgs.ai",
    repoStatus: "private",
    repoNote:
      "Source is private; sushrutalgs.ai is a live product. Happy to walk through the code or grant read access on request.",
    sections: [
      {
        label: "The problem",
        body:
          "sushrutalgs.ai answers surgical-exam questions and traces every claim back to a line in a standard textbook, so a citation is only worth anything if the text behind it is intact and addressable down to the section, figure or table. What actually existed was three full surgical textbooks as print PDFs: 220 chapters and 5,941 pages laid out for a typesetter, where a table is drawn rather than encoded and a figure's caption is a floating run of text that happens to sit near it. None of the retrieval work could start until that was structured data, and nobody was going to re-key three textbooks by hand.",
      },
      {
        label: "Why it is hard",
        body:
          "PDF extraction fails silently. A parser that loses content does not raise an error, it returns a slightly smaller document, and every downstream count still looks plausible, so the loss only surfaces months later when someone asks about a topic the book plainly covers and the answer has nothing to cite. One bug in the extraction path quietly dropped 968 table elements while the run reported success. The second half of the problem is that layout rules tuned to one publisher break on the next, so a single static rule set cannot be trusted across three books, and \"it ran without errors\" is not evidence of anything.",
      },
      {
        label: "The design",
        body:
          "Two rules shaped the pipeline: structure is decided only by code that behaves the same way twice, and every stage has to be able to say what it lost.",
        bullets: [
          "Recovery as its own phase, not as error handling. Parsing starts from Adobe's PDF extraction JSON and runs parse, recover and structure, then cleaning, enhancement and annotation in parallel; the six-phase recovery stage exists to detect and repair the specific ways each book breaks rather than to skip the pages it cannot read.",
          "Deterministic structure, models only at the edges. The tempting alternative was to hand whole pages to an LLM and ask for structured output, which is far less work to build, but it reruns differently and gives you no way to tell a hallucinated section boundary from a real one, which is fatal when the citation is the product. Claude is used only to describe figures and tables that a deterministic pass has already located.",
          "Structure before embeddings. Content is assembled into a knowledge graph of 71,621 nodes and 130,057 edges with 5,987 cross-references resolved and a 17-domain taxonomy over the top, and only then embedded, into 52,871 vectors from BioLORD, a medical-domain model, rather than a general-purpose one that flattens surgical vocabulary.",
          "Immutable, content-hashed exports. Each run publishes versioned chapter packages under SHA-256 hashes to Cloudflare R2 with manifest drift detection, so the retrieval backend pins a known version instead of reading a bucket that can change underneath it, and a CI workflow with mocked services runs the pipeline so a parser change cannot quietly alter an export.",
        ],
      },
      {
        label: "Where it stands",
        body:
          "All 220 chapters and 5,941 pages went through end to end, and all 220 exported chapter packages pass structural validation. The check that mattered most was a clean rebuild from the source PDFs reproducing every count, because that is the only way to know the output does not depend on incremental state left over from earlier runs. The honest limit is that the validation is structural: it shows nothing went missing or landed in the wrong chapter, but a model-written figure description is still a model's description, and those are spot-checked by hand rather than measured. A fourth textbook would still need parser work; the pipeline adapts, it is not publisher-agnostic.",
      },
    ],
    metrics: [
      { value: "220", label: "chapters ingested" },
      { value: "71,621", label: "knowledge-graph nodes" },
      { value: "52,871", label: "dense vectors" },
      { value: "SHA-256", label: "content-hashed exports" },
    ],
    stack: ["Python", "Pydantic", "BioLORD", "Cloudflare R2"],
    links: [{ label: "live product", href: "https://sushrutalgs.ai" }],
    artifacts: {
      diagram: "builtin",
    },
    verify: { requestAccessEmail: "bhavsarrushir@gmail.com" },
  },

  "hybridflow": {
    slug: "hybridflow",
    name: "HybridFlow",
    seoTitle: "HybridFlow: hybrid RAG over surgical textbooks",
    seoDescription:
      "A search backend combining vector retrieval, a knowledge graph and streaming LLM planning to answer clinical questions with traceable citations.",
    tagline:
      "Built a search-and-answer backend that lets clinicians and medical students ask questions of major surgical textbooks and get cited, structured answers. It combines semantic vector search, a knowledge graph of how the books are organized, and a streaming service that uses Claude to plan and write each answer.",
    type: "Retrieval backend",
    place: "sushrutalgs.ai",
    repoStatus: "private",
    repoNote:
      "Source is private; sushrutalgs.ai is a live product. Happy to walk through the code or grant read access on request.",
    sections: [
      {
        label: "The problem",
        body:
          "sushrutalgs.ai answers surgical exam questions with citations that trace back to a specific place in a specific textbook, so retrieval has to return more than a plausible paragraph. Three full surgical textbooks are structured documents: the same sentence carries a different meaning under operative technique than under complications, and the answer to a real clinical question is usually spread across a chapter rather than sitting in one chunk. Ordinary chunk-and-embed search finds text that reads correctly but hands it back stripped of where it came from, which is the part a clinician needs in order to check it. HybridFlow exists to keep the structure of the book attached to whatever retrieval returns.",
      },
      {
        label: "Why one index is not enough",
        body:
          "Vector search can find the right paragraph from a question phrased in a clinician's words, but it cannot say which chapter that paragraph belongs to or which cross-reference qualifies it. A graph of the book's hierarchy knows all of that and cannot be searched by meaning, so on its own it never finds the entry point. The naive fix, querying both and concatenating, produces two rankings on no shared scale and leaves the writing model to reconcile them, while every extra passage it drags in widens the context. That is the condition under which the answer stays fluent and starts attributing a figure to the wrong chapter, which is the one failure a cited product cannot absorb.",
      },
      {
        label: "The design",
        bullets: [
          "Vector first, graph second. Semantic search over 53K 768-dim BioLORD vectors finds the entry points, then each hit is expanded through a 73K-node, four-level Neo4j graph to pick up its chapter, its siblings and its cross-references. One ranking decides relevance and structure is attached afterwards, rather than two incomparable scores being merged.",
          "A cheap model narrows before an expensive one writes. Claude Haiku validates the question, selects the chapters worth reading and scores the figures and tables; Sonnet only ever sees the shortlist. The rejected alternative was a single large Sonnet call over everything retrieved: fewer moving parts, but it pays full price for a wide context on every query and gives the writing model no reason to prefer one retrieved passage over another.",
          "One query, three stores, one loader. Qdrant, Neo4j and a SQLite metadata store covering 220 chapters are read together per query and written together on ingest, with content-hash change detection so a re-run of the Samhita export only touches what changed. The cost is that a partial write becomes a real failure mode, so ingestion is transactional across all three instead of three independent upserts.",
        ],
      },
      {
        label: "What it cost",
        body:
          "Splitting the pipeline into a planning call and a writing call adds a round trip to every query, and prompt caching is what makes that affordable: the planning prompt hits cache about 80 percent of the time, holding an answered query near five to six cents. The other standing cost is verification. Answers run against an eight-gate regression suite covering classification, citation integrity, hallucination density, format and fallbacks, because a system that cites its sources is only worth the extra machinery if the citations are checked automatically rather than by reading.",
      },
      {
        label: "Where it stands",
        body:
          "It runs live behind sushrutalgs.ai, reached through a Cloudflare Worker gateway with two-factor service auth. Under load it sustained 30 concurrent queries with zero errors at about 14.7 times the throughput of a sequential baseline, and it passes the answer-quality suite 20 of 20. Measured on its own, vector retrieval scores success@5 of 0.90 and MRR 0.79 against a frozen gold set, at a p50 search latency around 178 ms. The honest reading of that 0.90 is that roughly one question in ten does not have its best passage in the top five, and the chapter-selection pass and graph expansion are what keep those cases turning into thin answers rather than confident wrong ones.",
      },
    ],
    metrics: [
      { value: "15", label: "agentic tools exposed" },
      { value: "53K", label: "vectors, 768-dim" },
      { value: "73K", label: "graph nodes, 4-level" },
      { value: "3", label: "stores, one query" },
    ],
    stack: ["Python", "FastAPI", "Qdrant", "Neo4j", "Docker", "Cloudflare"],
    links: [{ label: "live product", href: "https://sushrutalgs.ai" }],
    artifacts: {
      diagram: "builtin",
    },
    verify: { requestAccessEmail: "bhavsarrushir@gmail.com" },
  },

  "sushrutalgs-bff": {
    slug: "sushrutalgs-bff",
    name: "BFF",
    seoTitle: "Cloudflare Worker BFF gateway for an AI product",
    seoDescription:
      "An edge gateway handling auth, per-user rate limits and secure forwarding for a RAG product's web and iOS clients, at roughly 14ms of overhead.",
    tagline:
      "Built a Cloudflare Worker gateway that sits between the sushrutalgs.ai web and iOS apps and the AI backend, handling user authentication, per-user daily usage limits, and secure request forwarding so both apps talk to one trusted entry point. It runs live in staging and production and adds only about 14 milliseconds of overhead at the edge.",
    type: "Backend-for-frontend",
    place: "sushrutalgs.ai",
    repoStatus: "private",
    repoNote:
      "Source is private; sushrutalgs.ai is a live product. Happy to walk through the code or grant read access on request.",
    sections: [
      {
        label: "The problem",
        body:
          "sushrutalgs.ai has two clients, a Next.js web app and a native iOS app, and both need to reach the same AI backend. The obvious route, letting each client call the backend directly, means shipping the backend credential inside an App Store binary and writing the sign-in check and the paid usage limit twice, once in TypeScript and once in Swift. Two copies of a billing rule drift, and the copy inside a shipped iOS build cannot be corrected until the next review cycle. The gateway exists so there is exactly one place that knows who the user is, what they are still allowed, and how to talk upstream.",
      },
      {
        label: "Why it is hard",
        body:
          "The hard part is not proxying, it is charging correctly for a response that has not finished yet. A user with a phone and a laptop open can fire two questions in the same instant: read the daily counter, decide, then write it back, and both requests pass, because both reads happened before either write. Answers also arrive as a server-sent-event stream, so once the first byte is on the wire the decision cannot be taken back, and a retry is not safe either: replaying a paid stream either charges twice or hands out an answer nobody paid for. All of this sits in front of every single request, so the budget for solving it is a few milliseconds.",
      },
      {
        label: "The design",
        body:
          "The worker runs five stages in a fixed order: origin check, token verify, quota debit, body transform, forward. The ordering is the design. Nothing that costs money happens before the debit, and nothing that identifies the user travels past the transform.",
        bullets: [
          "One gateway, two credential shapes. The web sends an auth cookie and iOS sends a bearer token, and both resolve to a Supabase JWT verified at the edge against cached JWKS (above a 99.9 percent hit rate), so neither client holds the backend key.",
          "The debit is a database function, not an edge counter. A Workers KV or Durable Object counter would have been faster and saved a round trip, but it becomes a second source of truth beside the row the apps already read for their usage display, and eventually consistent reads let a user overspend. One Supabase function does the check and the decrement atomically on the row the user sees, and measured about 9,200 operations per second on a single hot row, far above anything the product generates.",
          "Fail closed, and only before the first byte. Quota and upstream failures are resolved while the response can still be refused; after that the stream is piped through byte for byte, never buffered, with no retry on a paid stream.",
          "The backend never sees a user id. The transform stage swaps verified identity for a scoped user_context, and the upstream hop is authenticated twice over, by a Cloudflare Access service token as well as the backend's own credential, so a compromise on either side does not hand over the other's users.",
        ],
      },
      {
        label: "What it cost",
        body:
          "The extra hop is real: about 14 milliseconds at p50, plus the Supabase round trip on the debit, added to every question anyone asks. Failing closed means a Supabase outage stops the product rather than quietly serving free answers, which is the trade taken on purpose for a paid product. The worker also stays deliberately thin, roughly 33 KiB gzipped, which rules out most of what a normal Node service would reach for: it runs on Hono and jose and very little else.",
      },
      {
        label: "Where it stands",
        body:
          "It is live in staging and production, serving both clients. Edge overhead sits at about 14 milliseconds p50 with JWT verification at p95 around 0.13 milliseconds, and a load run held 200 concurrent requests with zero errors and the fail-closed mapping verified. Staging deploys on every push while production is gated behind a release, so a web change cannot take the shipped iOS app down with it.",
      },
    ],
    metrics: [
      { value: "~14 ms", label: "p50 edge overhead" },
      { value: "33 KiB", label: "gzipped worker" },
      { value: "200", label: "concurrent, zero errors" },
      { value: "5", label: "pipeline stages" },
    ],
    stack: ["TypeScript", "Hono", "Cloudflare Workers", "jose (JWT)", "Supabase", "Vitest"],
    links: [{ label: "live product", href: "https://sushrutalgs.ai" }],
    artifacts: {
      diagram: "builtin",
    },
    verify: { requestAccessEmail: "bhavsarrushir@gmail.com" },
  },

  "sushrutalgs-ios": {
    slug: "sushrutalgs-ios",
    name: "iOS",
    seoTitle: "sushrutalgs.ai iOS app: streaming cited answers",
    seoDescription:
      "The native iOS client for sushrutalgs.ai: streaming answers cited to surgical textbooks, three sign-in options, and history synced across devices.",
    tagline:
      "Built the native iOS app for sushrutalgs.ai, an AI study companion that answers surgical-exam questions with streaming responses backed by citations, figures, and tables from standard textbooks. It ships three sign-in options, conversation history that syncs across a user's devices, and an iPhone and iPad interface.",
    type: "iOS app",
    place: "sushrutalgs.ai",
    repoStatus: "private",
    repoNote:
      "Source is private; sushrutalgs.ai is a live product. Happy to walk through the code or grant read access on request.",
    sections: [
      {
        label: "The problem",
        body:
          "sushrutalgs.ai already worked in a mobile browser, and that was the problem. Residents study in the gaps between cases, on a phone, and an answer arrives as a stream that takes several seconds to fill in with its citations, figures and tables, so a backgrounded tab or a dropped connection costs the whole answer rather than delaying it. The same people move between a phone and an iPad mid-session and expect the thread to be where they left it. A native client was the way to hold a session in the Keychain, survive app state changes while a stream is open, and hand a live answer to the user's other device.",
      },
      {
        label: "Why it is hard",
        body:
          "The hard part is not the chat UI: it is that the same conversation has to be true in two clients. Retry and edit fork a thread into a tree instead of overwriting it, and the web client already owned that model, so an iOS version that grew its own idea of a fork would drift on exactly the awkward cases (editing a message halfway up a branch, resuming a partly streamed reply) and the drift would only surface later, in stored conversations neither client could render. The stream is the second constraint: frames arrive off the network as thinking, metadata, text, error and done, every one of them mutates view state, and under Swift 6 strict concurrency that has to be actor-correct before it compiles at all. And because the gateway debits a daily quota per request, anything that quietly re-sends a query (a token refresh mid-answer, a retry after a timeout) spends the user's allowance a second time.",
      },
      {
        label: "The design",
        bullets: [
          "Port the tree, do not redesign it. The conversation model is a one-to-one port of the web client's tree, down to how a fork is created and identified, so a thread started on one client opens correctly on the other. A Swift-idiomatic rewrite was the tempting option and was rejected: it would have been better Swift and a second definition of what a conversation is.",
          "No ViewModels. Observable services are injected once at the root and views read them directly, which keeps one source of truth for the tree and the open stream. The conventional MVVM layer would have handed every screen its own copy of state the model already holds, which is the same divergence problem one layer down.",
          "A leaf client. All inference goes through the Cloudflare Worker gateway, so the app ships no backend host and no key, and a CI check fails any build that would embed one. The cost is that nothing can be answered offline: cached history and Keychain state make a cold start useful, but the answer path always needs the network.",
          "Handoff by broadcast, not polling. A stream in progress is published on a Supabase Realtime channel so the second device picks it up live, instead of persisting the finished answer and letting that device discover it whenever it next opens.",
          "Three ways in. Email one-time codes, Google and Apple, each exchanged for a Supabase session with nonce-based replay protection. Offering Google on iOS obliges Sign in with Apple too, so the third path was a requirement rather than a choice.",
        ],
      },
      {
        label: "Where it stands",
        body:
          "It ships on the App Store at 20.8 MB installed, with one SwiftUI shell covering both iPhone and iPad. Answers stream with the same citations, figures and tables as the web client, and a conversation started on either one opens correctly on the other, which is the whole point of porting the tree rather than rewriting it. The honest limits: it targets iOS 26, so the observation model that removes the ViewModel layer also gives up older devices; the iPad runs the phone's shell rather than a layout of its own; and offline gets you your history, not an answer.",
      },
    ],
    metrics: [
      { value: "7", label: "Observable services" },
      { value: "1:1", label: "chat tree ported from web" },
      { value: "3", label: "sign-in methods" },
      { value: "iOS 26", label: "Model-View, no ViewModels" },
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
    },
    verify: { requestAccessEmail: "bhavsarrushir@gmail.com" },
  },

  "sushrutalgs-web": {
    slug: "sushrutalgs-web",
    name: "Web",
    seoTitle: "sushrutalgs.ai web app: a cited RAG study assistant",
    seoDescription:
      "Streaming chat with branching conversations, inline textbook figures and tables, and every answer traced back to a source, for surgical exam prep.",
    tagline:
      "Built the web application for sushrutalgs.ai, an AI study assistant for advanced surgical exam prep that answers questions with citations traced back to standard textbooks. It delivers a streaming chat interface with branching conversations, inline textbook figures and tables, and the marketing, sign-up, and onboarding flows.",
    type: "Web app",
    place: "sushrutalgs.ai",
    repoStatus: "private",
    repoNote:
      "Source is private; sushrutalgs.ai is a live product. Happy to walk through the code or grant read access on request.",
    sections: [
      {
        label: "The problem",
        body:
          "Surgery residents revising for advanced exams cannot act on an answer they cannot check. A chat box that streams confident prose is worse than useless there: if a claim does not point back to a page, a figure or a table in a standard textbook, it is not revisable, it is just fluent. So the web client's job was never to render text. It was to keep every answer attached to its sources while the answer is still arriving, from a browser that must never hold a backend key.",
      },
      {
        label: "Why it is hard",
        body:
          "An answer does not arrive as a document. It arrives as an interleaved stream of eight server-sent-event frame types (thinking steps, metadata, text, citations, figure and table artifacts, error, done), any of which can stop mid-flight when the connection drops or a token expires. Buffering until the stream ends is the easy version, and it makes a long answer feel broken, so the client has to render as frames land and keep message state consistent through partial and aborted answers. Studying is also not linear: a user retries a question, or edits it to ask a sharper one, and a flat message list can only serve that by destroying the answer they were comparing against.",
      },
      {
        label: "The design",
        bullets: [
          "A tree, not a list. Retry and edit fork sibling branches in a tree-structured message model held in a reducer store and mirrored into Postgres, so a conversation resumes anywhere and both answers survive. The cheaper option, an append-only list where regenerate overwrites the previous reply, was rejected because comparing two answers is exactly what a revising resident does.",
          "Parse frames, do not buffer. A dedicated chat service decodes all eight frame types as they arrive, so thinking steps and citations can land before the prose finishes, and error and done are handled as terminal states rather than edge cases.",
          "No secrets in the browser. Every inference call goes through the Cloudflare Worker gateway, which verifies the Supabase session and debits the daily quota, so the client holds no backend key and cannot be talked into spending someone else's allowance. Refresh-on-401 keeps that invisible to the user.",
          "Licensed assets behind a proxy. Textbook figures (WebP) and tables (JSON) sit in two private R2 buckets served through auth-gated routes instead of public URLs. That costs a hop and rules out plain public CDN caching, but the content is licensed, and public object URLs would hand it to anyone with the link.",
        ],
      },
      {
        label: "Where it stands",
        body:
          "It is live at sushrutalgs.ai as the primary client, carrying the streaming chat, the citation and figure rendering, and the sign-up and onboarding path into the product. Session verification is cheap in practice: the JWKS cache behind it runs above a 99.9 percent hit rate, so a signed-in request almost never pays for a key fetch. The honest cost is weight. The production build ships roughly 2 MB of client JavaScript, which is more than a text-first reading interface should need, and trimming it is the open work; the proxy in front of the asset buckets is the other standing tax, and that one I would pay again.",
      },
    ],
    metrics: [
      { value: "8", label: "SSE frame types parsed" },
      { value: "2", label: "R2 buckets, auth-gated" },
      { value: ">99.9%", label: "JWKS cache hit rate" },
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Supabase", "Cloudflare R2", "Vercel"],
    links: [{ label: "live product", href: "https://sushrutalgs.ai" }],
    artifacts: {
      diagram: "builtin",
      // Real capture of the product, which replaces the screenshots placeholder
      // that used to sit here. Re-encoded before upload: the source was 16MB at
      // 3556x2160/60fps with an audio track, for a slot that renders ~700px
      // wide and plays muted. 1440px wide at 30fps with the audio stripped is
      // 4.2MB, a 74% cut, with no visible difference at display size.
      clips: [
        {
          src: "https://v9fl0vq2qbxv8yrh.public.blob.vercel-storage.com/projects/sushrutalgs-web-app/thread-FZeoxDWlo7Jb5j0O219ek9lNb5lKeB.mp4",
          caption:
            "A study thread in the web app: a question, the streamed answer, and the textbook citations behind it.",
        },
      ],
      // Still a placeholder: the clip above shows the flow, but stills of the
      // citation panel would carry it better in a link preview. Dev-only.
      screenshots: { todo: "Screenshots of the chat and citations" },
    },
    verify: { requestAccessEmail: "bhavsarrushir@gmail.com" },
  },

  // ── Standalone ML platform ──────────────────────────────────────────────
  "yelp-ml-platform": {
    slug: "yelp-ml-platform",
    name: "Yelp ML Platform",
    seoTitle: "Yelp ML platform: 7M reviews, recsys and sentiment API",
    seoDescription:
      "An end-to-end ML platform on 7M Yelp reviews: recommendations and sentiment behind one REST API. ETL at 462K rows/sec, p99 0.11ms serving.",
    tagline:
      "Built an end-to-end machine learning platform on the full 7-million-review Yelp dataset that powers two services: a business recommendation engine and a sentiment classifier, served through one REST API. The work spans large-scale data processing, model training, API serving, containerization, and automated testing.",
    type: "Personal project",
    repoStatus: "public",
    sections: [
      {
        label: "The problem",
        body:
          "A model that scores well in a notebook is not a service, and the distance between the two is where most of the actual work hides. The Yelp Open Dataset is 5.3 GB of raw JSON across 6.99 million reviews, which is past the point where a single-machine dataframe stays comfortable and past the point where the training code and the serving code can honestly be the same code. The aim was to take the raw dumps all the way to a REST API answering two unrelated questions, which business to recommend and how a review actually feels, and find out what breaks in between.",
      },
      {
        label: "Why it is hard",
        body:
          "Spark is the right tool for the first half of that and the wrong tool for the second. It converts 5.3 GB and factorises 4.39 million interactions without complaining, but the same session called from inside a web request spends roughly 290 ms on a single prediction, almost all of it planning a query and crossing into the JVM to score one row. The data pushes back as well: Yelp star ratings pile up at the top end, so a three-class sentiment model can post a healthy accuracy while barely handling the middle class, and recall on a recommender is a small number by nature (any honest figure looks like failure until a baseline sits next to it).",
      },
      {
        label: "The design",
        body:
          "The shape follows from that split. Everything heavy happens once, offline, and the request path is allowed to know nothing about Spark.",
        bullets: [
          "One pass over the raw JSON. The ETL writes snappy Parquet in a single Spark pass at about 462,000 rows per second on one eight-core node, then 5-core filters to 4.39 million interactions over 287,000 users and 148,000 items, so every job downstream reads a columnar table instead of re-parsing JSON.",
          "Train in Spark, serve without it. The sentiment model is exported to plain numpy artifacts (the TF-IDF vocabulary, the IDF vector, the logistic-regression coefficients) and the transform is reimplemented on top of them, which takes p99 to 0.11 ms and about 34,000 predictions per second.",
          "The rejected option was keeping Spark in the request path. It is one code path rather than two and it cannot drift, but 290 ms per single-row prediction is not a serving story, and a dedicated model server meant another runtime to install and version for what is, in the end, a sparse dot product.",
          "Bias terms before bigger models. ALS on its own predicts ratings poorly when the ratings are this skewed, so global, user and item bias terms went in first and took RMSE to 1.17, which is a cheaper win than widening the latent space.",
        ],
      },
      {
        label: "What it cost",
        body:
          "Two implementations of the same maths is a genuine liability: the numpy path can drift from the trained model and nothing would visibly fail, it would just answer differently. The fix is to make parity a test rather than a claim, checking that the exported artifacts reproduce Spark's predictions on held-out reviews, which currently holds at 100 percent. The rest of the tax is ordinary but not free: MLflow to keep runs and model versions straight, Docker Compose so the API and its dependencies come up the same way twice, a Pytest suite in CI, and benchmark numbers written to provenance-stamped files that are committed rather than quoted from a terminal.",
      },
      {
        label: "Where it stands",
        body:
          "The serving side is the clean result: 0.11 ms at p99 against roughly 290 ms for the in-process Spark path, at full prediction parity. The models are more modest and are worth stating plainly. Recall@10 of 5.5 percent means nothing on its own, but it is 6.2 times the most-popular baseline it was measured against, and 86.3 percent sentiment accuracy sits beside a macro-F1 of 0.70 against a 0.67 baseline, which is the class imbalance showing through. Both are reported against those baselines below rather than in isolation.",
      },
    ],
    metrics: [
      { value: "6.99M", label: "reviews processed" },
      { value: "462K", label: "rows/sec ETL" },
      { value: "0.11 ms", label: "p99 serving latency" },
      { value: "86.3%", label: "sentiment accuracy" },
    ],
    stack: ["PySpark", "FastAPI", "MLflow", "Docker", "NLTK", "NumPy", "Pytest"],
    links: [{ label: "github", href: "https://github.com/rushirb2001/yelp-ml-platform" }],
    artifacts: {
      diagram: "builtin",
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
//   seoTitle: "Name: what it is",           // ~45 chars, leads with the searchable term
//   seoDescription: "...",                  // ~155 chars; past that Google truncates
//   tagline: "One specific sentence: what it is and why it's impressive.",
//   type: "Personal project",   // or "Master's thesis", "Open-source", "Internship", ...
//   place: "Org / school",      // optional, omit entirely for personal projects
//   repoStatus: "private",
//   repoNote: "Source is private because <reason>. Happy to grant read access or walk through it.",
//   highlights: [
//     "One concise line each: the main points (real numbers, not big paragraphs).",
//   ],
//   stack: ["..."],
//   links: [],  // no public repo when private; add a paper / blog / public sibling if any
//   artifacts: {
//     diagram: { todo: "System / data-flow diagram" },
//     clips: [{ src: "/projects/<slug>/clip.mp4", caption: "..." }],
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

// The record KEY is the URL segment (this is what generateStaticParams reads),
// so a key that disagrees with its own `slug` field silently ships a page whose
// data thinks it lives at a different address. TypeScript cannot catch it:
// both sides are just strings.
//
// This bit during the 2026-08-05 slug rename. Two keys were unquoted JS
// identifiers (`samhita:`, `hybridflow:`) rather than quoted strings, so a
// find-and-replace over quoted occurrences updated every `slug` value but left
// those two keys behind. The build happily emitted /projects/samhita while its
// data claimed /projects/samhita-textbook-pipeline. Fail loudly instead.
for (const [key, detail] of Object.entries(PROJECT_DETAILS)) {
  if (key !== detail.slug) {
    throw new Error(
      `PROJECT_DETAILS key "${key}" does not match its slug "${detail.slug}". ` +
        "The key is the URL segment; keep the two identical."
    )
  }
}

export const PROJECT_DETAIL_SLUGS = Object.keys(PROJECT_DETAILS)

export function hasProjectDetail(slug: string): boolean {
  return slug in PROJECT_DETAILS
}
