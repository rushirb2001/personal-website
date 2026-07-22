import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import ReactDOM from "react-dom"
import type { ReactNode } from "react"
import { PlaybookBar } from "./PlaybookBar"
import { PlaybookRail } from "./PlaybookRail"
import { headers } from "next/headers"
import { BUY_PATH, PRICING_INR, PRICING_USD, type Pricing } from "./links"

// Product permalinks live in ./links.

// "What's inside" is built in two passes. MANIFEST is the literal list of
// what a buyer receives, kept to one line each; everything below it is the
// expansion of one manifest row, and each expansion is shaped by its own
// content rather than sharing a record type with the others.
const MANIFEST = [
  { name: "Pick-your-track guide", note: "3 tracks, mapped to real roles" },
  { name: "16 project specs", note: "30 of the 52 pages" },
  { name: "Free-tier stack guide", note: "commercial-grade tiers, and their limits" },
  { name: "Three playbooks", note: "git, DevOps, LinkedIn" },
  { name: "Companion zipfile", note: "skeletons, tracker, bullet bank, Discord", tag: "Core" },
]

// Sample roles with two example projects each: enough to show how the
// mapping works without reprinting the guide's own tables.
const ROLES = [
  {
    role: "Forward-Deployed Engineer",
    projects: ["Approval-gated support agent", "Customer data integration service"],
  },
  {
    role: "AI-ML Engineer",
    projects: ["RAG system with an eval harness", "Drift-monitored retraining pipeline"],
  },
  {
    role: "Data Engineer",
    projects: ["Real-time clickstream pipeline", "Warehouse model + analytics API"],
  },
]

const SPEC_SECTIONS = [
  { title: "What to build", body: "The scope, and the hiring signal it sends." },
  { title: "The build plan", body: "Week by week, to a working system." },
  { title: "The interview", body: "The questions this project prepares you to answer." },
  { title: "The bullets", body: "What goes on the resume when it ships." },
]

// The free tiers the stack guide covers. Only these five carry brand marks;
// every other chip on the page is a plain topic tag.
const STACK = [
  { name: "Groq", note: "inference", color: "#f55036" },
  { name: "Gemini", note: "LLM + embeddings", color: "#4285f4" },
  { name: "Colab", note: "GPU", color: "#f9ab00" },
  { name: "Oracle Cloud", note: "always-free ARM", color: "#c74634" },
  { name: "Supabase", note: "Postgres + auth", color: "#3ecf8e" },
]

// What unzips from the companion, drawn as a real tree so the reader can see
// the shape of it rather than read a list of nouns.
const ZIP_TREE: { path: string; note?: string; depth?: number }[] = [
  { path: "repo-skeleton/" },
  { path: "README.md", note: "the one a recruiter reads first", depth: 1 },
  { path: "design-doc.md", note: "decisions, tradeoffs, numbers", depth: 1 },
  { path: ".github/workflows/ci.yml", note: "tests green on every push", depth: 1 },
  { path: "CLAUDE.md", note: "agent context, preconfigured", depth: 1 },
  { path: "progress-tracker.md", note: "6 months, week by week" },
  { path: "resume-bullet-bank.md", note: "phrasing per project" },
  { path: "discord-invite.url", note: "feedback and accountability" },
]

// Where the zip plugs in. Marks are drawn in BrandMark below.
const OUTPUTS = [
  { name: "GitHub", color: "#1a1a1a" },
  { name: "Claude", color: "#d97757" },
  { name: "Discord", color: "#5865f2" },
]

// The three sample pages fan out behind the hero headline (HeroPages below);
// the center slot is the frontmost page, so it carries the most legible sample.
const SAMPLES = [
  {
    src: "/playbook/sample-1-pick-your-track.7fec722e.png",
    alt: "Sample page: the Pick-your-track guide mapping target roles to their 2-3 projects.",
  },
  {
    src: "/playbook/sample-2-project-rag-eval.9963c084.png",
    alt: "Sample page: a RAG + eval-harness project with a free stack and a week-by-week plan.",
  },
  {
    src: "/playbook/sample-3-linkedin-playbook.9c65c3f8.png",
    alt: "Sample page: the LinkedIn playbook that reads as engineering, not marketing.",
  },
]

// "The problem": the excuse a student tells themselves, crossed out, next to
// what a recruiter actually concludes from the repo it produced.
const PROBLEMS = [
  { excuse: "“I’ll add tests later”", result: "nothing proves it runs" },
  { excuse: "“the README explains it”", result: "README says “TODO”" },
  {
    excuse: "“five projects show range”",
    result: "zero depth, nothing to defend for ten minutes straight",
  },
  {
    excuse: "“one clean commit is fine”",
    result: "no history, no proof you built it yourself",
  },
]

// Everything Core includes. One tier is for sale, so this is a checklist of
// what you get rather than a grid of what you don't.
const CORE_INCLUDES = [
  "All 16 project specs, with week-by-week build plans",
  "The pick-your-track guide",
  "The free-tier stack guide",
  "git, DevOps and LinkedIn playbooks",
  "Companion zip: repo skeletons, tracker, Resume Bullet Bank",
  "Buyers' Discord",
  "Lifetime updates",
]

// Any answer that names a price or a storefront has to follow the visitor's rail,
// so the FAQ is built per request rather than living as a module const.
function faqs(p: Pricing) {
  return [
    {
      q: "What do I get?",
      a: `A 52-page PDF and the companion zip. ${
        p.usd ? "Gumroad" : "Sauce"
      } delivers both instantly at checkout.`,
    },
    { q: "Do I need a GPU or a budget?", a: "No. Every project runs on free tiers." },
    {
      q: "Solo, or do I need a partner?",
      a: "Solo. An appendix covers the two-person workflow if you find one.",
    },
    {
      q: "Is this just a list of ideas?",
      a: "No. Week-by-week plans, repo skeletons, a tracker, and the git and LinkedIn playbooks.",
    },
    {
      q: "I'm not in the US.",
      a: p.usd
        ? "Fine, none of it is US-specific. Price is USD; your card converts at checkout."
        : "You're seeing India pricing, and checkout takes UPI.",
    },
    {
      q: "Is there a discount?",
      a: p.list
        ? `The ${p.now} launch price is 10% off and already applied. After that it's ${p.list}.`
        : `${p.now}, already the India price.`,
    },
    { q: "Will it go stale?", a: "Lifetime updates. The stack moves, so does the playbook." },
  ]
}

export function generateMetadata(): Metadata {
  const title = "Zero to Hired: The AI-Engineer Portfolio Playbook · Rushir Bhavsar"
  const description =
    "Zero to Hired is the AI-engineer portfolio playbook: go from a blank GitHub to an interview-ready portfolio in six months, on $0 of compute. 16 production-grade projects chosen by target role, each with a week-by-week plan, the interview questions it prepares you for, and the resume bullets it produces."
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  }
}

export default async function PlaybookPage() {
  // The hero sub-paragraph (this page's LCP element) uses italic emphasis, so
  // the italic face is on the critical path here (it is not on other routes).
  // Without a preload the browser discovers it only after style/layout
  // (~90ms after the preloaded fonts) and the LCP text repaints late.
  // ReactDOM.preload dedupes correctly, matching the layout.tsx pattern.
  ReactDOM.preload("/fonts/google-sans-italic-latin.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  })

  // Reading geo opts this route out of static prerender, which is the deliberate
  // trade: an Indian visitor who reads "$10" prices themselves out before ever
  // reaching Sauce, so the rupee figure has to be in the HTML, not behind a hop.
  const country = (await headers()).get("x-vercel-ip-country")
  const pricing = country === "IN" ? PRICING_INR : PRICING_USD
  const faq = faqs(pricing)

  return (
    <main className="paper grain min-h-[100svh]">
      <PlaybookStyle />

      {/* Fixed Buy-CTA overlay: rides at the top-right over whichever section
          header is pinned; the headers themselves anchor and push natively. */}
      <PlaybookBar pricing={pricing} />

      {/* Minimal page map: tick lines in the left margin that fill as the
          reader scrolls; names appear on hover. Desktop + hover only. */}
      <PlaybookRail />

      <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
        {/* Top bar: a discreet way back to the portfolio, kept separate from
            the sales story. */}
        <nav className="flex items-center justify-between py-5 xs:py-6">
          {/* Descriptor only: the H1 below owns the "Zero to Hired" brand, so
              repeating it here would double the name in the first screenful. */}
          <span className="mono small-caps accent">
            <span className="sm:hidden">The Playbook</span>
            <span className="hidden sm:inline">The AI-Engineer Portfolio Playbook</span>
          </span>
          <Link href="/" className="accent-link mono text-[13px] inline-flex items-center gap-1.5">
            <span aria-hidden>←</span> Rushir Bhavsar
          </Link>
        </nav>

        {/* ---- Hero ---------------------------------------------------- */}
        <section className="pt-4 xs:pt-8 lg:pt-10 pb-4 xs:pb-6">
          {/* Named-area grid, not fixed columns: phones stack all four areas;
              the sm-1023px "compact" band pairs title+pages as a row with
              body+cta below (a title/para column next to a pages column
              read as two disconnected halves at this width); lg reverts to
              pages-left / title+body+cta-right. See .hero-grid in
              PlaybookStyle for the per-breakpoint grid-template-areas. */}
          <div className="hero-grid">
            <div className="hero-area-title">
              <h1 className="display font-light tracking-tight leading-[1.08] text-[30px] xs:text-[clamp(34px,5vw,52px)] lg:text-[clamp(30px,3.6vw,44px)] max-w-[38ch]">
                Zero to Hired: from a blank{" "}
                <span className="gh-pill"><GhMark />GitHub</span> to an{" "}
                <span className="nobreak">interview-ready</span> portfolio in{" "}
                <Shimmer text="six months" /><span className="accent">.</span>
              </h1>
            </div>
            <div className="hero-area-pages">
              <HeroPages />
            </div>
            {/* Kept short on purpose: below lg the pages visual competes with
                this for vertical space, and every extra line here delays it. */}
            <div className="hero-area-body display font-light text-[16px] sm:text-[clamp(16px,1.7vw,20px)] lg:text-[17px] leading-[1.5] max-w-[66ch] sm:max-w-none lg:max-w-none muted">
              <em>You can code.</em> Your GitHub doesn&rsquo;t prove it, and you don&rsquo;t know{" "}
              <em className="ink">which</em> projects matter for FDE, AI-ML, or data roles.{" "}
              <strong className="ink font-bold">Zero to Hired</strong> is the fix:{" "}
              <strong className="ink font-bold">16 production-grade projects</strong>, a git +
              LinkedIn playbook, and the resume bullets each one produces.
            </div>
            <div className="hero-area-cta">
              <CTAs pricing={pricing} note />
            </div>
          </div>
        </section>

        {/* Section wrappers carry data-pb-title for the PlaybookBar scrollspy;
            the in-flow Head stays visible in the document like any heading. */}
        {/* ---- The problem -------------------------------------------- */}
        <section data-pb-title="The problem">
        <Head title="The problem" />
        <Row label="The gap">
          <p className="display font-light text-[16px] xs:text-[18px] leading-relaxed ink max-w-[70ch]">
            Every company building with AI asks the same question:{" "}
            <em className="muted">how did you know it worked?</em> Here&rsquo;s what they find
            when they open your GitHub.
          </p>

          {/* The repo a recruiter actually opens: one commit, no tests, a
              README that never got written. Real enough to sting. */}
          <div className="repo-tree mt-6">
            <div className="repo-tree-head">
              <span className="repo-tree-dot repo-tree-dot-red" aria-hidden />
              <span className="repo-tree-dot repo-tree-dot-yellow" aria-hidden />
              <span className="repo-tree-dot repo-tree-dot-green" aria-hidden />
              <span className="mono small-caps faint ml-2">career-project/</span>
            </div>
            <div className="repo-tree-body">
              {/* Connectors are CSS borders, not Unicode box-drawing glyphs —
                  "├──"/"└──" fall back to a font without those glyphs and
                  render as oversized, misaligned characters. */}
              <ul className="repo-tree-list mono">
                <li>main.py</li>
                <li>model.pkl</li>
                <li>README.md</li>
                <li>requirements.txt</li>
              </ul>
              <p className="mono faint mt-4 mb-0">
                $ git log --oneline
                <br />
                a3f9c21 final version
              </p>
            </div>
          </div>

          {/* The excuse (mono, struck through, matches the tree's register)
              next to what it actually gets a recruiter to conclude (display
              font, full ink — the payoff, so it needs to outweigh the
              excuse, not match its size). Row dividers match the INSIDE/FAQ
              list treatment elsewhere on this page. */}
          <ul className="mt-6">
            {PROBLEMS.map((p, i) => (
              <li
                key={p.excuse}
                className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 py-3.5 ${
                  i !== PROBLEMS.length - 1 ? "border-b rule" : ""
                }`}
              >
                <span className="problem-badge self-center" aria-hidden>
                  !
                </span>
                <span className="mono text-[12.5px] xs:text-[13px] faint line-through decoration-1">
                  {p.excuse}
                </span>
                <span aria-hidden className="accent">
                  &rarr;
                </span>
                <span className="display text-[15px] xs:text-[16px] ink">{p.result}</span>
              </li>
            ))}
          </ul>

          <p className="display font-light text-[18px] xs:text-[20px] leading-snug ink mt-7 max-w-[70ch]">
            <strong className="font-bold">Zero to Hired</strong> replaces this: 2-3 deep
            projects, real git history, numbers you can defend
            <span className="accent">.</span>
          </p>
        </Row>

        {/* In-content spacer (not padding): sticky headers are constrained
            to the content box, so padding would end the pin early and open a
            gap in the push handoff. */}
        <div aria-hidden className="h-14 xs:h-20" />
        </section>

        {/* ---- What's inside ------------------------------------------ */}
        <section data-pb-title="What's inside">
        <Head title="What's inside" />
        <Row label="Inside">
          <p className="display font-light text-[16px] xs:text-[18px] leading-relaxed ink max-w-[70ch]">
            52 pages, five parts. The literal list first, then what each one actually does.
          </p>

          {/* The manifest: only what you literally receive, one line each.
              Deliberately no h3s here — the expansions below own the headings
              (and the PlaybookRail's subsection ticks), so the rail doesn't
              list every part twice. Row rhythm matches "The problem" above. */}
          <ol className="mt-6">
            {MANIFEST.map((m, i) => (
              <li
                key={m.name}
                className="manifest-row"
              >
                <span className="num-badge mono" aria-hidden>
                  {i + 1}
                </span>
                <span className="display manifest-name">
                  {m.name}
                  {m.tag ? (
                    <span className="mono small-caps accent align-middle ml-2">[{m.tag}]</span>
                  ) : null}
                </span>
                <span className="mono manifest-note faint">{m.note}</span>
              </li>
            ))}
          </ol>
        </Row>

        {/* ---- Expansions -------------------------------------------------
            Each manifest item, unpacked. They run as continuing prose rather
            than five copies of one card, and each block is shaped by its own
            content: a three-track split, a spec's fixed anatomy, a stack of
            named services, three practices, a zip's file list. */}

        {/* No left label and no heading on the expansions: the manifest above
            already named each part, so both would just re-index it. These read
            as continuing prose with a list under each. */}
        <Row label="">
          <p className="expand-p display">
            The sixteen specs are your <strong className="ink">options</strong>, not your
            workload. Understand what the role you want actually screens for, then build the{" "}
            <strong className="ink">three</strong> projects that prove it.{" "}
            <em>Depth is the whole point.</em> Here is how that maps for three sample roles:
          </p>
          <ol className="role-cards">
            {ROLES.map((r, i) => (
              <li key={r.role} className="role-card">
                <p className="role-head">
                  <span className="role-letter mono" aria-hidden>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="display role-name">{r.role}</span>
                </p>
                <ul className="role-sub mono">
                  {r.projects.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Row>

        <Row label="">
          <p className="expand-p display">
            Once you have picked those projects, the playbook hands you the same{" "}
            <strong className="ink">four-step build order</strong> for every one of them. Follow it
            end to end and the project finishes as something you can talk about, not just something
            that runs:
          </p>
          {/* One explicit grid rather than nested flex: the stack module has to
              feed a *specific* step (the build plan), so the connector needs a
              column it can actually land in. Children are placed by nth-child
              in the 640px+ rule; below that the grid collapses to a single
              column and everything stacks in source order. */}
          <div className="flow-module">
            <div className="flow-grid">
              {/* git spans the two steps it powers and sits ABOVE them,
                  pointing down; DevOps and LinkedIn hang BELOW theirs,
                  pointing up. Each rail is adjacent to its own steps. */}
              <div className="rail rail-above rail-git">
                <span className="mono small-caps accent rail-name">git</span>
                <span className="mono rail-note">
                  commit-discipline ladder: your history becomes the evidence
                </span>
                <VArrow className="rail-arrow" dir="down" />
              </div>

              <div className="flow-box fb-1">
                <p className="display flow-title">{SPEC_SECTIONS[0].title}</p>
                <p className="mono flow-body">{SPEC_SECTIONS[0].body}</p>
              </div>
              <FlowArrow className="fa-1" />
              <div className="flow-box is-fed fb-2">
                <p className="display flow-title">{SPEC_SECTIONS[1].title}</p>
                <p className="mono flow-body">{SPEC_SECTIONS[1].body}</p>
              </div>
              <FlowArrow className="fa-2" />
              <div className="flow-box fb-3">
                <p className="display flow-title">{SPEC_SECTIONS[2].title}</p>
                <p className="mono flow-body">{SPEC_SECTIONS[2].body}</p>
              </div>
              <FlowArrow className="fa-3" />
              <div className="flow-box fb-4">
                <p className="display flow-title">{SPEC_SECTIONS[3].title}</p>
                <p className="mono flow-body">{SPEC_SECTIONS[3].body}</p>
              </div>

              <div className="rail rail-devops">
                <span className="mono small-caps accent rail-name">DevOps</span>
                <span className="mono rail-note">networking + deployment depth map</span>
                <VArrow className="rail-arrow" />
              </div>
              <div className="rail rail-linkedin">
                <span className="mono small-caps accent rail-name">LinkedIn</span>
                <span className="mono rail-note">posts that read as engineering</span>
                <VArrow className="rail-arrow" />
              </div>

              <div className="flow-feed">
                <VArrow />
              </div>

              <div className="flow-stack">
                <p className="mono small-caps accent flow-stack-label">The $0 stack</p>
                <ul className="brand-row">
                  {STACK.map((s) => (
                    <li key={s.name} className="brand-chip mono">
                      <BrandMark name={s.name} color={s.color} />
                      <span className="ink">{s.name}</span>
                      <span className="faint">{s.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <p className="expand-p display">
            Run that four times and you have a portfolio. To make week one about building instead
            of scaffolding, the <strong className="ink">companion zip</strong> ships every file the
            specs assume you already have:
          </p>

          {/* Output of the whole chart: the companion zip. Same window
              vocabulary as the repo tree in "The problem", inverted — that one
              was the repo you have now, this is the one you start from. */}
          <div className="out-arrow">
            <VArrow dir="down" />
          </div>

          <div className="repo-tree zip-window">
            <div className="repo-tree-head">
              <span className="repo-tree-dot repo-tree-dot-red" aria-hidden />
              <span className="repo-tree-dot repo-tree-dot-yellow" aria-hidden />
              <span className="repo-tree-dot repo-tree-dot-green" aria-hidden />
              <span className="mono small-caps faint ml-2">companion.zip</span>
            </div>
            <div className="repo-tree-body">
              <ul className="repo-tree-list mono">
                {ZIP_TREE.map((z) => (
                  <li key={z.path} className={z.depth ? "is-nested" : undefined}>
                    <span className="ink">{z.path}</span>
                    {z.note ? <span className="faint">  {z.note}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
            <div className="zip-foot">
              <ul className="brand-row">
                {OUTPUTS.map((o) => (
                  <li key={o.name} className="brand-chip mono">
                    <BrandMark name={o.name} color={o.color} />
                    <span className="ink">{o.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Row>

        {/* In-content spacer (not padding): sticky headers are constrained
            to the content box, so padding would end the pin early and open a
            gap in the push handoff. */}
        <div aria-hidden className="h-14 xs:h-20" />
        </section>

        {/* ---- Why trust this ----------------------------------------- */}
        <section data-pb-title="Why trust this">
        <Head title="Why trust this" />
        <Row label="Proof">
          <p className="display font-light text-[16px] xs:text-[18px] leading-relaxed ink max-w-[70ch]">
            You are standing in it. My portfolio is what this method produces, so every claim
            below is something you can go and check right now.
          </p>

          {/* Links out, not adjectives: a trust section that asks to be taken
              at its word is worth nothing. Each row names a thing that exists
              and points at it. */}
          <ul className="proof-list">
            <li>
              <Link href="/" className="accent-link accent proof-link display">
                Seven case studies
              </Link>
              <span className="mono proof-note">
                Role-targeted projects, each written up so that even a private repo still reads as
                credible to someone who cannot see the code.
              </span>
            </li>
            <li>
              <a
                href="https://github.com/rushirb2001/yelp-ml-platform"
                target="_blank"
                rel="noopener noreferrer"
                className="accent-link accent proof-link display"
              >
                yelp-ml-platform
                <span aria-hidden className="mono text-[0.8em] align-middle ml-1">↗</span>
                <span className="sr-only"> (opens in new tab)</span>
              </a>
              <span className="mono proof-note">
                Public repo. 7M reviews, ETL at ~462K rows/sec, 86.3% sentiment accuracy, p99
                0.11 ms serving. Every headline number has a committed benchmark output behind it.
              </span>
            </li>
            <li>
              <a
                href="https://github.com/rushirb2001/cohors"
                target="_blank"
                rel="noopener noreferrer"
                className="accent-link accent proof-link display"
              >
                cohors
                <span aria-hidden className="mono text-[0.8em] align-middle ml-1">↗</span>
                <span className="sr-only"> (opens in new tab)</span>
              </a>
              <span className="mono proof-note">
                Open source. Read the commit history instead of taking my word about commit
                discipline.
              </span>
            </li>
          </ul>

          <p className="mono proof-close">
            No hustle, no inflated numbers. The playbook tells you to publish only numbers you can
            defend for ten minutes, because one hard question in the comments undoes months of
            credibility. I hold myself to the same rule here.
          </p>
        </Row>

        {/* In-content spacer (not padding): sticky headers are constrained
            to the content box, so padding would end the pin early and open a
            gap in the push handoff. */}
        <div aria-hidden className="h-14 xs:h-20" />
        </section>

        {/* ---- Pricing ------------------------------------------------ */}
        <section data-pb-title="Pricing">
        <Head title="Pricing" />
        <Row label="Core">
          {/* One tier, one price. The old three-column table asked the reader
              to compare against a free tier and an unreleased cohort, which
              only ever argued them out of the thing that is for sale. */}
          <div className="price-block">
            <div className="price-head">
              <p className="price-now display">
                {pricing.list ? (
                  <span className="price-was mono">{pricing.list}</span>
                ) : null}
                {pricing.now}
              </p>
              <p className="mono small-caps faint price-terms">
                One payment &middot; lifetime updates
                {pricing.list ? " · 10% launch discount, pre-applied" : ""}
              </p>
            </div>

            <ul className="price-list mono">
              {CORE_INCLUDES.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>

            <div className="price-cta">
              <CTAs pricing={pricing} coreLabel={<>Get the playbook &middot; {pricing.now}</>} />
            </div>
          </div>

          <p className="mono text-[11px] faint mt-5">
            {pricing.list
              ? `Launch price ${pricing.now} (10% off), then ${pricing.list}.`
              : `${pricing.now}.`}{" "}
            A live cohort opens later; Core buyers get it at a discount, and everything in Core
            carries over.
          </p>

          {/* Separators ride with their preceding label so a wrapped line can
              never start with a bare dot. */}
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 mono small-caps faint">
            <span className="inline-flex items-center gap-x-3">
              <span>Instant access</span>
              <span aria-hidden className="accent">·</span>
            </span>
            <span className="inline-flex items-center gap-x-3">
              <span>Lifetime updates</span>
              <span aria-hidden className="accent">·</span>
            </span>
            <span>7-day money-back guarantee</span>
          </div>
        </Row>

        {/* In-content spacer (not padding): sticky headers are constrained
            to the content box, so padding would end the pin early and open a
            gap in the push handoff. */}
        <div aria-hidden className="h-14 xs:h-20" />
        </section>

        {/* ---- FAQ ---------------------------------------------------- */}
        <section data-pb-title="FAQ">
        <Head title="FAQ" />
        {/* Same Row shape as every other section: keyword in the left column,
            all content in the right. Plain h3 + p, not a <dl> — decorative dt
            text reads as "Q, Q, Q" in screen readers. */}
        <Row label="Common questions">
          <div className="faq">
            {faq.map((f) => (
              <div key={f.q} className="faq-row">
                <h3 className="display faq-q">{f.q}</h3>
                <p className="mono faq-a">{f.a}</p>
              </div>
            ))}
          </div>
        </Row>

        {/* In-content spacer (not padding): sticky headers are constrained
            to the content box, so padding would end the pin early and open a
            gap in the push handoff. */}
        <div aria-hidden className="h-14 xs:h-20" />
        </section>

        {/* ---- Guarantee ---------------------------------------------- */}
        <section data-pb-title="Guarantee">
        <Head title="Guarantee" />
        <Row label="7 days">
          <p className="display font-light text-[16px] xs:text-[18px] leading-relaxed ink max-w-[68ch]">
            If the playbook doesn&rsquo;t hand you a plan you are actually excited to start, you
            get your money back. No form, no justification, no &ldquo;what didn&rsquo;t you
            like&rdquo;.
          </p>

          {/* Two routes, because a guarantee nobody can find is not a
              guarantee. The self-serve route is Gumroad-only, so the India
              rail shows the email route alone rather than pointing at a
              receipt page that does not exist there. */}
          <ul className="proof-list">
            {pricing.usd ? (
              <li>
                <span className="display proof-link ink">From your Gumroad receipt</span>
                <span className="mono proof-note">
                  The refund request is a button in the emailed receipt. You never have to talk to
                  me.
                </span>
              </li>
            ) : null}
            <li>
              <a
                href="mailto:bhavsarrushir@gmail.com?subject=Zero%20to%20Hired%20refund"
                className="accent-link accent proof-link display"
              >
                Email me
              </a>
              <span className="mono proof-note">
                bhavsarrushir@gmail.com. One line is enough; I refund it and we are done.
              </span>
            </li>
          </ul>
        </Row>

        {/* In-content spacer (not padding): sticky headers are constrained
            to the content box, so padding would end the pin early and open a
            gap in the push handoff. */}
        <div aria-hidden className="h-6 xs:h-8" />
        </section>

        {/* ---- Final CTA ---------------------------------------------- */}
        {/* The close sells the destination, not the problem: "stop shipping
            demos" was the argument five sections ago, and repeating it here
            ends the page on the reader's failure rather than on the work. */}
        <section className="py-16 xs:py-24 text-center">
          <h2 className="display font-light tracking-tight leading-[1.12] text-[24px] xs:text-[clamp(28px,4vw,40px)] max-w-[22ch] mx-auto">
            Six months from now your GitHub either proves something, or it doesn&rsquo;t
            <span className="accent">.</span>
          </h2>
          <p className="display font-light text-[15px] xs:text-[17px] leading-relaxed ink max-w-[52ch] mx-auto mt-5">
            It is the same six months either way. The only question is whether you spend them
            building the right three things.
          </p>
          <div className="mt-9 flex justify-center">
            <CTAs pricing={pricing} center note />
          </div>
        </section>

        <footer className="border-t rule py-6 xs:py-8 mono text-[11px] flex items-center justify-between gap-4">
          <Link href="/" className="accent-link muted">
            <span className="faint">© 2026 </span>Rushir Bhavsar
          </Link>
          <span className="small-caps faint">Tempe, Arizona</span>
        </footer>
      </div>
    </main>
  )
}

// --- helpers ---------------------------------------------------------------

// Section header in the landing page's vocabulary: a "+" marker and the title
// with its trailing accent period, aligned to the section grid. Sticky within
// its own section: it anchors at the top while its content scrolls, and the
// NEXT section's header physically pushes it out, scroll-synchronized by the
// browser (sections carry their spacing as padding-BOTTOM, so each header sits
// at its section's very top edge and the push hands off with zero gap).
function Head({ title }: { title: string }) {
  return (
    <div
      className="sticky top-0 z-30 -mx-6 lg:-mx-12 px-6 lg:px-12 py-3 border-b rule"
      style={{ backgroundColor: "#f4f1ec" }}
    >
      <div className="grid grid-cols-[auto_1fr] xs:grid-cols-[clamp(80px,14vw,140px)_1fr] lg:grid-cols-[140px_1fr] gap-3 xs:gap-6 lg:gap-12 items-baseline">
        <span
          aria-hidden
          className="display accent text-[22px] xs:text-[clamp(20px,4.5vw,26px)] lg:text-3xl font-light leading-none"
        >
          +
        </span>
        <h2 className="display text-[22px] xs:text-[clamp(20px,4.5vw,26px)] lg:text-3xl font-light tracking-tight leading-none">
          {title}
          <span className="accent">.</span>
        </h2>
      </div>
    </div>
  )
}

// A single label-left / content-right block on the section grid (right column
// left open for the prose to breathe), mirroring the project case-study rows.
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-[clamp(80px,14vw,140px)_1fr] lg:grid-cols-[140px_1fr] gap-2 xs:gap-6 lg:gap-12 pt-6 xs:pt-8">
      <p className="mono small-caps faint xs:pt-1">{label}</p>
      {/* min-w-0 zeroes the grid item's automatic minimum so wide children
          (the pricing table's min-w) scroll inside their overflow wrapper
          instead of blowing the page out horizontally at 475-615px. */}
      <div className="min-w-0">{children}</div>
    </div>
  )
}

// Buy buttons. The primary is a filled accent block, the one deliberate
// departure from the site's text-link vocabulary, because a storefront needs
// an unmistakable buy action. The secondary stays a site-standard accent-link.
// `note` adds a compact risk-reversal line under the pair (used at the hero
// and final CTA, where the full trust row is not on screen).
function CTAs({
  pricing,
  coreLabel,
  center,
  note,
}: {
  pricing: Pricing
  coreLabel?: ReactNode
  center?: boolean
  note?: boolean
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <div
        className={`flex flex-col xs:flex-row items-stretch xs:items-center gap-4 xs:gap-6 ${
          center ? "xs:justify-center" : ""
        }`}
      >
        <a href={BUY_PATH} className="cta-buy display">
          {coreLabel ?? (
            <>
              Get the playbook ·{" "}
              {pricing.list ? (
                <>
                  <span className="line-through" style={{ opacity: 0.6 }}>{pricing.list}</span>{" "}
                </>
              ) : null}
              {pricing.now}
            </>
          )}
        </a>
      </div>
      {note ? <p className="mono small-caps faint mt-4">Instant access · 7-day refund</p> : null}
    </div>
  )
}

// GitHub mark rendered inline in the hero headline; colored purple via .gh-mark.
function GhMark() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden className="gh-mark">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

// Closing words rendered one letter per span so a size pulse can swipe left
// to right across them. Screen readers get real (visually hidden) text; the
// animated letters are one aria-hidden group, aria-label on a bare span is
// ignored by most AT and would drop "six months" from the h1.
function Shimmer({ text }: { text: string }) {
  return (
    <span className="shimmer">
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {[...text].map((ch, i) =>
          ch === " " ? (
            " "
          ) : (
            <span
              key={i}
              className="shimmer-ch"
              style={{ animationDelay: `${(i * 0.11).toFixed(2)}s` }}
            >
              {ch}
            </span>
          ),
        )}
      </span>
    </span>
  )
}

// Vertical connector, drawn with the same stroke weight and chevron head as
// the horizontal arrows so every arrow in the diagram matches.
function VArrow({ className, dir = "up" }: { className?: string; dir?: "up" | "down" }) {
  return (
    <svg
      className={className}
      data-dir={dir}
      viewBox="0 0 12 20"
      fill="none"
      aria-hidden
      preserveAspectRatio="none"
    >
      <path
        d="M6 19V2M2 6l4-4 4 4"
        stroke="#1f3a5f"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

// Flow connector between two steps. Drawn rather than typed: a text "→"
// renders at the font's own weight and baseline, which never matched the
// 1.5px strokes used everywhere else in this diagram.
function FlowArrow({ className }: { className: string }) {
  return (
    <svg className={`flow-arrow ${className}`} viewBox="0 0 26 12" fill="none" aria-hidden>
      <path
        d="M1 6h20M17 1.5 21.5 6 17 10.5"
        stroke="#1f3a5f"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Brand marks for the free-tier stack row, drawn inline so they cost no
// requests and inherit the page's crispness. Gemini, Colab and Supabase have
// simple, unmistakable geometric marks worth drawing; Groq and Oracle are
// wordmark-led brands with no such shape, so they get a brand-coloured
// monogram tile rather than an invented "logo". Marks are decorative — the
// chip already names the service in text.
function BrandMark({ name, color }: { name: string; color: string }) {
  const common = { className: "brand-mark", viewBox: "0 0 24 24", "aria-hidden": true } as const

  if (name === "Gemini") {
    // Four-pointed spark with concave sides.
    return (
      <svg {...common}>
        <path
          d="M12 1c0 6.08-4.92 11-11 11 6.08 0 11 4.92 11 11 0-6.08 4.92-11 11-11-6.08 0-11-4.92-11-11Z"
          fill={color}
        />
      </svg>
    )
  }
  if (name === "Supabase") {
    // Lightning bolt, pointing down.
    return (
      <svg {...common}>
        <path d="M13.2 1 3.6 13.3c-.5.7 0 1.7.9 1.7H11v8l9.4-12.3c.5-.7 0-1.7-.9-1.7H13.2V1Z" fill={color} />
      </svg>
    )
  }
  if (name === "Colab") {
    // Two linked rings.
    return (
      <svg {...common} fill="none">
        <circle cx="8" cy="12" r="5" stroke={color} strokeWidth="3.2" />
        <circle cx="16" cy="12" r="5" stroke={color} strokeWidth="3.2" />
      </svg>
    )
  }
  if (name === "GitHub") {
    return (
      <svg {...common} viewBox="0 0 16 16">
        <path
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
          fill={color}
        />
      </svg>
    )
  }
  if (name === "Claude") {
    // Radiating burst: the Claude mark reads as spokes from a centre.
    return (
      <svg {...common} fill="none">
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4
          return (
            <line
              key={i}
              x1={12 + Math.cos(a) * 3}
              y1={12 + Math.sin(a) * 3}
              x2={12 + Math.cos(a) * 10.5}
              y2={12 + Math.sin(a) * 10.5}
              stroke={color}
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          )
        })}
      </svg>
    )
  }
  return (
    <span className="brand-mono mono" style={{ backgroundColor: color }} aria-hidden>
      {name.charAt(0)}
    </span>
  )
}

// Hero signature: three real PDF pages fanned behind a centered frontmost
// page, echoing an actual stack of paper. The center page is the true LCP
// candidate (frontmost, largest, above the fold), so it alone gets priority
// and the more generous `sizes`; the two side pages are smaller and mostly
// occluded, so they load at default priority.
function HeroPages() {
  return (
    <div className="hero-pages">
      <div className="hero-pages-frame">
        <div className="hero-page hero-page-side hero-page-left">
          <Image
            src={SAMPLES[0].src}
            alt={SAMPLES[0].alt}
            width={1275}
            height={1650}
            sizes="(max-width: 1023px) 38vw, 20vw"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="hero-page hero-page-side hero-page-right">
          <Image
            src={SAMPLES[2].src}
            alt={SAMPLES[2].alt}
            width={1275}
            height={1650}
            sizes="(max-width: 1023px) 38vw, 20vw"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="hero-page hero-page-center">
          <Image
            src={SAMPLES[1].src}
            alt={SAMPLES[1].alt}
            width={1275}
            height={1650}
            priority
            sizes="(max-width: 1023px) 42vw, 23vw"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

// Editorial design tokens, injected inline per this repo's convention (see the
// <style> block in app/page.tsx and TOKENS in ProjectModal.tsx).
function PlaybookStyle() {
  return (
    <style>{`
      /* overflow-anchor: none stops the browser's scroll anchoring from nudging
         the viewport as sticky section headers engage/release during scroll. */
      /* scroll-padding-top keeps keyboard focus and programmatic scrolls clear
         of the fixed header bar. */
      html { scrollbar-gutter: stable; overflow-anchor: none; scroll-padding-top: 64px; }
      .paper { background-color: #f4f1ec; color: #1a1a1a; }
      .ink { color: #1a1a1a; }
      .muted { color: rgba(26,26,26,0.62); }
      /* 0.62 is the minimum alpha that clears WCAG AA 4.5:1 for the 10-13px
         small-caps text on paper and on the tinted .accent-col cells; .faint
         stays distinct from .muted via size and letterspacing, not lightness. */
      .faint { color: rgba(26,26,26,0.62); }
      .rule { border-color: rgba(26,26,26,0.12); }
      .accent { color: #1f3a5f; }
      .accent-col { background-color: rgba(31,58,95,0.05); }
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

      /* The one filled control on the site. Colour is static; only the hover
         shade transitions, and it is (hover: hover)-gated so touch never
         latches it. */
      .cta-buy {
        display: inline-flex; align-items: center; justify-content: center;
        text-align: center; padding: 13px 22px; border-radius: 6px;
        font-size: 15px; letter-spacing: -0.01em; line-height: 1;
        background-color: #1f3a5f; color: #f4f1ec;
        transition: background-color 200ms ease;
      }
      @media (hover: hover) { .cta-buy:hover { background-color: #16314f; } }

      /* GitHub set as a tight deep-purple pill: white mark + white wordmark. */
      /* Compact pill. Uniform padding + the icon as the tallest element makes
         the left cap sit concentric around the icon; the equal right padding
         mirrors that roundness on the other end. */
      .gh-pill {
        display: inline-flex; align-items: center; gap: 0.32em;
        padding: 0.16em; border-radius: 999px;
        background: #2e1065; color: #fff;
        font-size: 0.64em; line-height: 1; letter-spacing: 0;
        vertical-align: middle; position: relative; top: -0.09em;
      }
      .gh-mark {
        display: inline-block; width: 1.18em; height: 1.18em;
        color: #fff; flex: none;
      }
      /* Keep the compound adjective whole so the second line starts cleanly. */
      .nobreak { white-space: nowrap; }

      /* "The problem": a terminal-window mock of the repo a recruiter
         actually opens (three-dot chrome is decorative, aria-hidden), plus a
         crossed-out-excuse / real-consequence list. Both lean on the same
         git vocabulary the product itself teaches. */
      .repo-tree {
        max-width: 560px; border-radius: 8px; overflow: hidden;
        border: 1px solid rgba(26,26,26,0.12); background: #fff;
        box-shadow: 0 8px 24px -12px rgba(26,26,26,0.18);
      }
      .repo-tree-head {
        display: flex; align-items: center; gap: 6px;
        padding: 9px 14px; background: rgba(26,26,26,0.025);
        border-bottom: 1px solid rgba(26,26,26,0.1);
      }
      /* Traffic-light window controls, macOS style, at reduced saturation
         to stay in the site's muted palette rather than full stoplight red. */
      .repo-tree-dot { width: 9px; height: 9px; border-radius: 50%; flex: none; }
      .repo-tree-dot-red { background: #e6675e; }
      .repo-tree-dot-yellow { background: #e6b95e; }
      .repo-tree-dot-green { background: #5eb96e; }
      .repo-tree-body { padding: 16px 18px; font-size: 12.5px; color: #1a1a1a; }

      /* Tree connectors are drawn with borders, not typed — the branch is a
         bottom-border "elbow" on each row's left rail, and the rail itself
         is a full-height border that a row's own ::before stops at its
         midpoint on the last row (the "└" instead of "├"). */
      .repo-tree-list { list-style: none; margin: 0; padding: 0; }
      .repo-tree-list li { position: relative; padding-left: 22px; line-height: 2; }
      .repo-tree-list li::before {
        content: ""; position: absolute; left: 5px; top: 0; height: 100%;
        border-left: 1px solid rgba(26,26,26,0.28);
      }
      .repo-tree-list li:last-child::before { height: 50%; }
      .repo-tree-list li::after {
        content: ""; position: absolute; left: 5px; top: 50%; width: 11px;
        border-top: 1px solid rgba(26,26,26,0.28);
      }

      .problem-badge {
        display: inline-flex; align-items: center; justify-content: center;
        width: 17px; height: 17px; border-radius: 50%; flex: none;
        background-color: #1f3a5f; color: #f4f1ec;
        font-family: "Google Sans Code", ui-monospace, "SFMono-Regular", monospace;
        font-size: 11px; font-weight: 700; line-height: 1;
      }

      /* "What's inside" — the manifest: numbered rows in the same rhythm as
         the problem list above (filled navy badge, hairline between). Name
         and note sit on one line from 640px and stack below it, so the note
         never crowds a long name on a phone. */
      .manifest-row {
        display: grid; grid-template-columns: 21px 1fr;
        column-gap: 12px; row-gap: 3px; align-items: center; padding: 7px 0;
      }
      .manifest-row:first-child { padding-top: 0; }
      .manifest-name { color: #1a1a1a; font-size: 16px; font-weight: 300; letter-spacing: -0.01em; line-height: 1.35; }
      .manifest-note { grid-column: 2; font-size: 12px; line-height: 1.4; }
      @media (min-width: 640px) {
        .manifest-row { grid-template-columns: 21px minmax(0, auto) 1fr; }
        .manifest-note { grid-column: 3; }
      }
      .num-badge {
        display: inline-flex; align-items: center; justify-content: center;
        width: 21px; height: 21px; border-radius: 50%; flex: none;
        background-color: #1f3a5f; color: #f4f1ec;
        font-size: 11px; font-weight: 700; line-height: 1;
      }

      /* Every expansion block opens with the same lede paragraph treatment,
         so the five of them read as continuing prose; only the artifact under
         each one changes shape. */
      .expand-p {
        margin: 9px 0 0; font-weight: 300; font-size: 15px; line-height: 1.6;
        color: #1a1a1a; max-width: 68ch;
      }
      @media (min-width: 475px) { .expand-p { font-size: 16px; } }

      /* Sample roles: three side-by-side cards, A/B/C. */
      .role-cards {
        list-style: none; margin: 20px 0 0; padding: 0;
        display: grid; grid-template-columns: 1fr; gap: 12px;
      }
      @media (min-width: 640px) { .role-cards { grid-template-columns: repeat(3, 1fr); gap: 14px; } }
      .role-card {
        border: 1px solid rgba(26,26,26,0.16); border-radius: 8px;
        background: #fff; padding: 16px 17px;
      }
      .role-letter {
        display: inline-flex; align-items: center; justify-content: center;
        width: 22px; height: 22px; border-radius: 50%;
        background: #1f3a5f; color: #f4f1ec;
        font-size: 11px; font-weight: 700; line-height: 1;
      }
      .role-head { display: flex; align-items: center; gap: 9px; margin: 0; }
      .role-name { font-size: 15px; font-weight: 500; letter-spacing: -0.01em; line-height: 1.35; color: #1a1a1a; }
      .role-sub { list-style: none; margin: 9px 0 0; padding: 0; }
      .role-sub li {
        position: relative; padding-left: 16px; font-size: 12.5px;
        line-height: 1.6; color: #1a1a1a; margin-top: 5px;
      }
      .role-sub li::before {
        content: ""; position: absolute; left: 0; top: 0.68em; width: 8px;
        border-top: 1px solid #1f3a5f;
      }

      /* Build-order module: four sequenced steps, with the $0 stack wired in
         as an input to the step it actually feeds (the build plan). Placement
         is explicit (nth-child into a 7-column grid) because the connector
         has to land in one specific column, which nested flex can't promise. */
      .flow-module {
        margin-top: 20px; border: 1px solid rgba(26,26,26,0.16);
        border-radius: 10px; background: #fff; padding: 15px;
      }
      .flow-grid { display: grid; grid-template-columns: 1fr; row-gap: 20px; }

      .flow-box {
        border: 1px solid rgba(26,26,26,0.12); border-radius: 7px;
        background: rgba(26,26,26,0.02); padding: 12px 14px;
      }
      /* The fed step is the one the stack plugs into, so it carries the accent
         edge and the connector points at it. */
      .flow-box.is-fed { border-color: rgba(31,58,95,0.45); background: rgba(31,58,95,0.04); }
      .flow-title { margin: 0; font-size: 14.5px; font-weight: 500; letter-spacing: -0.01em; line-height: 1.35; color: #1a1a1a; }
      .flow-body { margin: 5px 0 0; font-size: 12px; line-height: 1.55; color: #1a1a1a; }
      .flow-arrow { width: 26px; height: 12px; display: block; margin: 7px auto; rotate: 90deg; }

      /* Connector: arrowhead butted against the fed box, dashed line running
         down from it to the stack module. */
      .flow-feed { display: flex; justify-content: center; }
      .flow-feed svg { width: 12px; height: 20px; }

      .flow-stack {
        border: 1px solid rgba(31,58,95,0.28); border-radius: 8px;
        background: rgba(31,58,95,0.035); padding: 11px 13px;
        display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px;
      }
      .flow-stack-label { margin: 0; flex: none; }

      /* Proof rows: the link leads, the note explains what it proves. An
         accent tick marks each one, matching the sublists elsewhere. */
      .proof-list { list-style: none; margin: 22px 0 0; padding: 0; display: flex; flex-direction: column; gap: 16px; }
      .proof-list li { position: relative; padding-left: 18px; display: flex; flex-direction: column; gap: 4px; }
      .proof-list li::before {
        content: ""; position: absolute; left: 0; top: 0.62em; width: 9px;
        border-top: 1px solid #1f3a5f;
      }
      .proof-link { font-size: 15px; font-weight: 500; letter-spacing: -0.01em; align-self: flex-start; }
      .proof-note { font-size: 12.5px; line-height: 1.6; color: #1a1a1a; max-width: 68ch; }
      .proof-close {
        margin: 22px 0 0; padding-top: 16px; border-top: 1px solid rgba(26,26,26,0.12);
        font-size: 12.5px; line-height: 1.65; color: #1a1a1a; max-width: 70ch;
      }

      /* FAQ: question and answer side by side from 640px, so seven of them
         stay compact instead of running as fourteen stacked blocks. */
      .faq { display: grid; grid-template-columns: 1fr; gap: 18px; }
      @media (min-width: 640px) { .faq { grid-template-columns: 1fr 1fr; gap: 20px 34px; } }
      .faq-row { display: flex; flex-direction: column; gap: 5px; }
      /* Hairline over each question, so the pairs read as cells in a grid
         rather than as a run-on stack. */
      .faq-row { border-top: 1px solid rgba(26,26,26,0.12); padding-top: 11px; }
      .faq-q { font-size: 14.5px; font-weight: 500; letter-spacing: -0.01em; line-height: 1.45; color: #1a1a1a; }
      .faq-a { margin: 0; font-size: 12.5px; line-height: 1.6; color: #1a1a1a; max-width: 68ch; }

      /* Pricing: one Core block. The price leads, the included list carries
         the detail, the CTA closes it. */
      .price-block {
        margin-top: 6px; border: 1px solid rgba(26,26,26,0.16); border-radius: 10px;
        background: #fff; padding: 20px;
      }
      .price-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 14px; }
      .price-now { margin: 0; font-size: 40px; font-weight: 300; letter-spacing: -0.02em; line-height: 1; color: #1a1a1a; }
      .price-was { margin-right: 10px; font-size: 17px; text-decoration: line-through; color: rgba(26,26,26,0.45); }
      .price-terms { margin: 0; }

      .price-list { list-style: none; margin: 18px 0 0; padding: 0; display: grid; grid-template-columns: 1fr; gap: 7px; }
      @media (min-width: 640px) { .price-list { grid-template-columns: 1fr 1fr; gap: 8px 20px; } }
      .price-list li {
        position: relative; padding-left: 21px; font-size: 12.5px;
        line-height: 1.55; color: #1a1a1a;
      }
      /* Checkmark drawn from two borders, so it never depends on a glyph. */
      .price-list li::before {
        content: ""; position: absolute; left: 3px; top: 0.28em;
        width: 5px; height: 9px; rotate: 45deg;
        border-right: 1.5px solid #1f3a5f; border-bottom: 1.5px solid #1f3a5f;
      }
      .price-cta { margin-top: 20px; padding-top: 18px; border-top: 1px solid rgba(26,26,26,0.12); }

      /* Brand chips: mark + service name (+ what it's for), so a row of tools
         reads as a stack rather than a tag cloud. */
      .brand-row { list-style: none; display: flex; flex-wrap: wrap; gap: 7px; margin: 12px 0 0; padding: 0; }
      .brand-chip {
        display: inline-flex; align-items: center; gap: 7px; padding: 5px 11px;
        border-radius: 999px; border: 1px solid rgba(26,26,26,0.16);
        background: #fff; font-size: 11.5px; white-space: nowrap;
      }
      .brand-chip .faint { font-size: 10.5px; }
      .brand-mark { width: 13px; height: 13px; flex: none; }
      .brand-mono {
        display: inline-flex; align-items: center; justify-content: center;
        width: 13px; height: 13px; border-radius: 3px; flex: none;
        color: #fff; font-size: 9px; font-weight: 700; line-height: 1;
      }
      .flow-stack .brand-row { margin: 0; }
      .flow-stack .brand-chip { background: #fff; }

      @media (min-width: 640px) {
        /* 4 step columns with an arrow gutter between each. */
        .flow-grid { grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr; align-items: stretch; }
        /* Connector under the build-plan column; stack spans the full width;
           the flow's own arrows carry the rest. */
        .flow-grid { row-gap: 20px; }
        .rail-git { grid-area: 1 / 3 / 2 / 6; }
        .fb-1 { grid-area: 2 / 1; }
        .fa-1 { grid-area: 2 / 2; }
        .fb-2 { grid-area: 2 / 3; }
        .fa-2 { grid-area: 2 / 4; }
        .fb-3 { grid-area: 2 / 5; }
        .fa-3 { grid-area: 2 / 6; }
        .fb-4 { grid-area: 2 / 7; }
        .rail-devops { grid-area: 3 / 3 / 4 / 4; }
        .rail-linkedin { grid-area: 3 / 7 / 4 / 8; }
        .flow-feed { grid-area: 4 / 3; }
        .flow-stack { grid-area: 5 / 1 / 6 / -1; }
        .flow-arrow { rotate: none; margin: 0 9px; align-self: center; }
      }

      /* Support rails: a labelled bar spanning exactly the steps it powers.
         Above the boxes it points down, below them it points up, so each rail
         is adjacent to its own steps instead of stacked in one distant band. */
      .rail {
        position: relative; background: rgba(31,58,95,0.035);
        padding: 8px 11px; display: flex; flex-wrap: wrap; align-items: baseline;
        gap: 3px 9px;
        border-top: 2px solid rgba(31,58,95,0.5); border-radius: 0 0 6px 6px;
      }
      /* Connector is an SVG, same stroked chevron as the horizontal arrows —
         a filled triangle on a hairline read as a blob and matched nothing. */
      .rail-arrow { position: absolute; left: 14px; top: -20px; width: 12px; height: 20px; }
      .rail-arrow[data-dir="down"] { top: auto; bottom: -20px; rotate: 180deg; }
      .rail-above {
        border-top: 0; border-bottom: 2px solid rgba(31,58,95,0.5);
        border-radius: 6px 6px 0 0;
      }
      .rail-name { flex: none; }
      .rail-note { font-size: 11.5px; line-height: 1.5; color: #1a1a1a; }

      /* Output of the whole chart, down into the companion zip. */
      .out-arrow { display: flex; justify-content: center; padding: 8px 0; }
      .out-arrow svg { width: 12px; height: 26px; rotate: 180deg; }

      .zip-window { max-width: none; }
      /* Nested entries indent one level under their parent folder. */
      .repo-tree-list li.is-nested { padding-left: 40px; }
      .repo-tree-list li.is-nested::before,
      .repo-tree-list li.is-nested::after { left: 23px; }
      .repo-tree-list li.is-nested::after { width: 11px; }
      .zip-foot {
        padding: 11px 18px 13px; border-top: 1px solid rgba(26,26,26,0.1);
        background: rgba(26,26,26,0.02);
      }
      .zip-foot .brand-row { margin: 0; }

      /* Hero layout: named grid areas so title/pages/body/cta can regroup
         per breakpoint (a fixed 2-column grid can't do this — the pairing
         itself changes, not just the widths). Phones: one stacked column,
         pages right after the title so the proof shows up fast. 640-1023px
         ("compact" — a resized/tablet-width window): title+pages ride as a
         row, body+cta run full-width below. 1024px+: pages spans the full
         left column, title/body/cta stack on the right (align-items:center
         centers that stack against the pages column's height). */
      .hero-grid {
        display: grid; grid-template-columns: 1fr; row-gap: 1.75rem;
        grid-template-areas: "title" "pages" "body" "cta";
      }
      @media (min-width: 640px) and (max-width: 1023.98px) {
        .hero-grid {
          grid-template-columns: minmax(0,1.3fr) minmax(0,1fr);
          column-gap: 2.5rem; row-gap: 2rem; align-items: center;
          grid-template-areas: "title pages" "body body" "cta cta";
        }
      }
      @media (min-width: 1024px) {
        .hero-grid {
          grid-template-columns: minmax(0,1fr) minmax(0,1fr);
          column-gap: 4rem; row-gap: 0; align-items: center;
          grid-template-areas: "pages title" "pages body" "pages cta";
        }
      }
      .hero-area-title { grid-area: title; }
      .hero-area-pages { grid-area: pages; }
      .hero-area-body { grid-area: body; margin-top: 0; }
      .hero-area-cta { grid-area: cta; }
      @media (min-width: 1024px) {
        .hero-area-body { margin-top: 1.75rem; }
        .hero-area-cta { margin-top: 2.25rem; }
      }

      /* Hero signature: three PDF pages fanned like a stack of paper, center
         page frontmost. hero-pages-frame carries the aspect-ratio (so the
         absolutely-positioned pages have a box to sit in); the caption below
         it stays in normal flow. Percent offsets scale with the frame, so the
         fan holds its proportions from 375px phones up through desktop. */
      /* Ratio is the tight bounding box of the rotated fan (side pages at
         +/-10deg reach lower than the upright center page), not a guessed
         portrait ratio — a taller box left dead space below the pages and
         read as a gap between the CTAs and the visual. */
      .hero-pages { width: 100%; max-width: clamp(230px, 30vw, 340px); margin: 0 auto; }
      .hero-pages-frame { position: relative; width: 100%; aspect-ratio: 1 / 0.92; }
      .hero-page {
        position: absolute; aspect-ratio: 1275 / 1650; border-radius: 6px;
        overflow: hidden; background: #fff;
        box-shadow: 0 14px 34px -10px rgba(26,26,26,0.32);
      }
      .hero-page-left { width: 54%; left: -3%; top: 15%; transform: rotate(-10deg); z-index: 1; opacity: 0.92; }
      .hero-page-right { width: 54%; right: -3%; top: 15%; transform: rotate(10deg); z-index: 2; opacity: 0.92; }
      .hero-page-center {
        width: 58%; left: 50%; top: 2%; transform: translateX(-50%); z-index: 3;
        box-shadow: 0 22px 48px -12px rgba(26,26,26,0.4);
      }

      /* Blue closing words. Each letter pulses in size on a staggered delay so
         the bump swipes left to right across "six months" (a "shimmer" done as
         a scale wave, not a colour sweep). transform: scale avoids the per-frame
         reflow that animating font-size would cause. */
      /* nowrap: the per-letter inline-blocks would otherwise create soft-wrap
         points inside the words, splitting "six months" mid-word at some
         viewport widths. */
      .shimmer { color: #1f3a5f; white-space: nowrap; }
      .shimmer-ch {
        display: inline-block; transform-origin: center bottom;
        animation: shimmer 3.6s ease-in-out infinite; will-change: transform;
      }
      @keyframes shimmer {
        0% { transform: scale(1); }
        7% { transform: scale(1.12); }
        16% { transform: scale(1); }
        100% { transform: scale(1); }
      }

      /* No mix-blend-mode: multiplying 3.5% near-black dots over opaque paper
         is visually identical to plain alpha, and the blend forced the
         compositor to re-blend the full viewport on every scrolled frame.
         Alpha matches the landing page's grain (0.035). */
      .grain::before {
        content: ""; position: fixed; inset: 0; pointer-events: none;
        background-image: radial-gradient(rgba(26,26,26,0.035) 1px, transparent 1px);
        background-size: 3px 3px; z-index: 1;
      }

      /* The Buy-CTA overlay. The section headers anchor and push natively
         (sticky), so this strip carries only the buttons: click-through
         everywhere except the buttons themselves, faded in/out as the reader
         enters and leaves the sections. */
      .pb-bar {
        visibility: hidden; opacity: 0; pointer-events: none;
        transition: opacity 200ms ease, visibility 0s linear 200ms;
      }
      .pb-bar[data-shown] {
        visibility: visible; opacity: 1;
        transition: opacity 200ms ease;
      }
      .pb-bar .sh-cta { pointer-events: auto; }
      .sh-cta {
        display: inline-flex; align-items: center; justify-content: center;
        padding: 7px 14px; border-radius: 5px; white-space: nowrap;
        font-family: "Google Sans", ui-sans-serif, system-ui, sans-serif;
        font-size: 12.5px; letter-spacing: -0.01em; line-height: 1;
        transition: background-color 200ms ease;
      }
      .sh-cta-solid { background-color: #1f3a5f; color: #f4f1ec; }
      @media (hover: hover) {
        .sh-cta-solid:hover { background-color: #16314f; }
      }

      /* Page-map rail: tick lines fixed in the left margin. Long line =
         section, short line = subsection. Lines fill with the accent once
         scrolled past; the current one stretches. No labels or hover chrome,
         just the ticks. Desktop + hover devices only. */
      .pb-rail {
        position: fixed; left: 18px; top: 50%; transform: translateY(-50%);
        z-index: 35; display: none;
      }
      @media (min-width: 1024px) and (hover: hover) {
        .pb-rail { display: flex; flex-direction: column; gap: 6px; }
      }
      .pb-rail-item {
        position: relative; display: flex; align-items: center;
        background: none; border: 0; padding: 4px 0; cursor: pointer;
      }
      .pb-rail-line {
        width: 22px; height: 2px; border-radius: 1px; flex: none;
        background-color: rgba(26,26,26,0.18);
        transition: background-color 200ms ease, width 240ms cubic-bezier(0.22,1,0.36,1);
      }
      .pb-rail-item.is-sub .pb-rail-line { width: 12px; }
      .pb-rail-item.is-passed .pb-rail-line { background-color: rgba(31,58,95,0.55); }
      .pb-rail-item.is-current .pb-rail-line { background-color: #1f3a5f; width: 28px; }
      .pb-rail-item.is-current.is-sub .pb-rail-line { width: 18px; }
      .pb-rail-item:focus-visible { outline: 2px solid #1f3a5f; outline-offset: 2px; }

      @media (prefers-reduced-motion: reduce) {
        .accent-link, .accent-link::after, .cta-buy { transition: none; }
        .shimmer-ch { animation: none; transform: none; }
        .sh-cta { transition: none; }
        .pb-bar, .pb-bar[data-shown] { transition: none; }
        .pb-rail-line { transition: none; }
      }
    `}</style>
  )
}
