import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import Script from "next/script"
import ReactDOM from "react-dom"
import type { ReactNode } from "react"
import { PlaybookBar } from "./PlaybookBar"
import { PlaybookRail } from "./PlaybookRail"
import { headers } from "next/headers"
import { BUY_PATH, GUMROAD_LITE, PRICING_INR, PRICING_USD, type Pricing } from "./links"

// gumroad.js (loaded lazily below) upgrades any <a data-gumroad-overlay> into an
// on-page checkout overlay. Product permalinks live in ./links.

const INSIDE = [
  {
    label: "Projects",
    name: "16 production-grade projects",
    body: "RAG + eval harnesses, FDE agents with approval gates, MLOps pipelines, streaming data, system-design builds, GitOps infra. Each with what to build, why it matters to hiring, a free stack, a week-by-week plan, the interview questions it prepares you for, and the resume bullets it produces.",
    meta: ["RAG", "Agents", "MLOps", "Infra"],
  },
  {
    label: "Track",
    name: "Pick-your-track guide",
    body: "Target role → your exact 2-3 projects. Don't build all 16; build the right few, deep.",
    meta: ["FDE", "AI-ML", "Data"],
  },
  {
    label: "Stack",
    name: "The $0 stack",
    body: "Groq/Gemini free tiers, Colab/Kaggle GPU, Oracle always-free ARM, Supabase. No GPU bills, no course fees.",
    meta: ["Groq", "Colab", "Oracle", "Supabase"],
  },
  {
    label: "System",
    name: "The operating system most guides skip",
    body: "A git-history + commit-discipline ladder, a DevOps/networking depth map, and a LinkedIn playbook that reads as engineering, not marketing.",
    meta: ["git", "DevOps", "LinkedIn"],
  },
  {
    label: "Companion",
    name: "The companion",
    tag: "Core",
    body: "Clone-ready repo skeletons (README, design-doc, CI, CLAUDE.md), a 6-month progress tracker, a Resume Bullet Bank, and a buyers' Discord for feedback and accountability.",
    meta: ["Skeletons", "Tracker", "Discord"],
  },
]

const SAMPLES = [
  {
    src: "/playbook/sample-1-pick-your-track.7fec722e.png",
    alt: "Sample page: the Pick-your-track guide mapping target roles to their 2-3 projects.",
    caption: "Pick your track",
  },
  {
    src: "/playbook/sample-2-project-rag-eval.9963c084.png",
    alt: "Sample page: a RAG + eval-harness project with a free stack and a week-by-week plan.",
    caption: "A project, in full",
  },
  {
    src: "/playbook/sample-3-linkedin-playbook.9c65c3f8.png",
    alt: "Sample page: the LinkedIn playbook that reads as engineering, not marketing.",
    caption: "The LinkedIn playbook",
  },
]

const PRICING_ROWS = [
  { label: "3 projects + the git-history section", lite: true, core: true, cohort: true },
  { label: "All 16 projects + interview prep + resume bank", lite: false, core: true, cohort: true },
  { label: "Repo skeletons + progress tracker", lite: false, core: true, cohort: true },
  { label: "Buyers' Discord + lifetime updates", lite: false, core: true, cohort: true },
  { label: "Live cohort + office hours", lite: false, core: false, cohort: true },
]

// Any answer that names a price or a storefront has to follow the visitor's rail,
// so the FAQ is built per request rather than living as a module const.
function faqs(p: Pricing) {
  return [
    {
      q: "What exactly do I get, and how?",
      a: `A 52-page PDF plus the companion zip: clone-ready repo skeletons, the 6-month tracker, and the Resume Bullet Bank. ${
        p.usd ? "Gumroad" : "Sauce"
      } delivers everything instantly after checkout, and updates land in your library free.`,
    },
    {
      q: "Do I need money or a GPU?",
      a: "No. Every project runs on free tiers. That's the whole point.",
    },
    {
      q: "Solo, or do I need a partner?",
      a: "Solo-first: the plans are written for one person. A Partner Bonus appendix covers the two-person review workflow if you find one.",
    },
    {
      q: "Is this just a list of ideas?",
      a: "No, it's a 6-month system: week-by-week plans, the git/LinkedIn operating manual, repo skeletons, and a tracker.",
    },
    {
      q: "I'm not in the US / not a student.",
      a: p.usd
        ? "It still works, and the playbook is about what to build and how to show it, which is universal. Price is shown in USD; your card network converts it automatically at checkout."
        : "It still works, and the playbook is about what to build and how to show it, which is universal. You are seeing India pricing, and checkout takes UPI.",
    },
    {
      q: "Is there a student discount?",
      a: p.list
        ? `Launch price is ${p.now} (33% off), pre-applied at checkout for the first 50 buyers. After that it returns to ${p.list}.`
        : `The playbook is ${p.now}. The Lite tier is free, and every project in it runs on a $0 stack, so you can start without paying anything.`,
    },
    {
      q: "Will it go stale?",
      a: "Lifetime updates on Core. The stack and projects evolve with the market.",
    },
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
      {/* gumroad.js upgrades the overlay anchors into an on-page checkout
          modal. lazyOnload keeps it entirely off the render-blocking path so
          it never touches FCP/LCP. */}
      <Script src="https://gumroad.com/js/gumroad.js" strategy="lazyOnload" />

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
          <h1 className="display font-light tracking-tight leading-[1.08] text-[30px] xs:text-[clamp(34px,5vw,52px)] max-w-[38ch]">
            Zero to Hired: from a blank{" "}
            <span className="gh-pill"><GhMark />GitHub</span> to an{" "}
            <span className="nobreak">interview-ready</span> portfolio in{" "}
            <Shimmer text="six months" /><span className="accent">.</span>
          </h1>
          <div className="display font-light text-[16px] sm:text-[clamp(16px,1.7vw,20px)] mt-6 lg:mt-7 leading-[1.5] max-w-[66ch] muted">
            <em>You can code</em>, but your GitHub is thin, and you don&rsquo;t know{" "}
            <em className="ink">which</em> projects matter for FDE (forward-deployed
            engineer), AI-ML, or data roles.{" "}
            <strong className="ink font-bold">Zero to Hired</strong> is the system behind
            the portfolio on this site:{" "}
            <strong className="ink font-bold">16 production-grade projects</strong> on free
            tiers, a git and LinkedIn playbook, and the resume bullets each one produces.
          </div>
          <div className="mt-9 xs:mt-10">
            <CTAs pricing={pricing} note />
          </div>
        </section>

        {/* Section wrappers carry data-pb-title for the PlaybookBar scrollspy;
            the in-flow Head stays visible in the document like any heading. */}
        {/* ---- The problem -------------------------------------------- */}
        <section data-pb-title="The problem">
        <Head title="The problem" />
        <Row label="The gap">
          <p className="display font-light text-[16px] xs:text-[18px] leading-relaxed ink max-w-[76ch]">
            Most students ship five shallow demos and wonder why nobody replies. Every
            company building with AI asks the same question:{" "}
            <em className="muted">how did you know it worked?</em> A demo has no answer. The
            advice online is a pile of &ldquo;10 project ideas&rdquo; with no depth, no
            numbers, no plan, no idea which maps to which role.
          </p>
          <p className="display font-light text-[16px] xs:text-[18px] leading-relaxed muted max-w-[76ch] mt-4">
            One deep project with real numbers beats five demos. Zero to Hired gives you{" "}
            <span className="ink">2-3, chosen for your target role</span> and built week by
            week, for free, plus the git history, writeups, and LinkedIn presence that let a
            recruiter verify your work in two minutes.
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
        <ol>
          {INSIDE.map((item, i) => (
            <li
              key={item.name}
              className={`grid grid-cols-1 xs:grid-cols-[clamp(80px,14vw,140px)_1fr] sm:grid-cols-[clamp(80px,14vw,140px)_1fr_clamp(140px,22vw,240px)] lg:grid-cols-[140px_1fr_240px] gap-3 xs:gap-6 lg:gap-12 py-5 xs:py-7 lg:py-8 first:pt-4 xs:first:pt-6 ${
                i !== INSIDE.length - 1 ? "border-b rule" : ""
              }`}
            >
              <div className="mono text-[12px] xs:text-[13px] leading-none ink xs:pt-2 lg:pt-[10px]">
                {item.label}
              </div>
              <div>
                <h3 className="display text-[20px] xs:text-[24px] lg:text-[27px] font-light tracking-tight leading-tight">
                  {item.name}
                  {item.tag ? (
                    <span className="mono small-caps accent align-middle ml-2">[{item.tag}]</span>
                  ) : null}
                </h3>
                <p className="mono text-[13px] xs:text-[14px] leading-relaxed muted mt-3 max-w-[74ch]">
                  {item.body}
                </p>
              </div>
              {/* Third column from sm up; in the 475-639px band it drops under
                  the body copy so the content column keeps readable width. */}
              <div className="xs:col-start-2 sm:col-auto xs:pt-2 lg:pt-[10px]">
                <p className="mono small-caps faint mb-2 xs:mb-3">Covers</p>
                <ul className="flex flex-wrap gap-x-3 gap-y-1.5 mono text-[12px] xs:text-[13px]">
                  {item.meta.map((m) => (
                    <li key={m} className="muted">
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        {/* In-content spacer (not padding): sticky headers are constrained
            to the content box, so padding would end the pin early and open a
            gap in the push handoff. */}
        <div aria-hidden className="h-14 xs:h-20" />
        </section>

        {/* ---- A look inside (samples) -------------------------------- */}
        <section data-pb-title="A look inside">
        <Head title="A look inside" />
        <Row label="Sample pages">
          <div className="grid grid-cols-1 xs:grid-cols-3 gap-4 lg:gap-6">
            {SAMPLES.map((s) => (
              <figure key={s.src} className="m-0">
                <div className="rounded-lg overflow-hidden ring-1 ring-black/10 bg-white shadow-[0_2px_16px_-6px_rgba(0,0,0,0.25)]">
                  <Image
                    src={s.src}
                    alt={s.alt}
                    width={1275}
                    height={1650}
                    sizes="(max-width: 474px) 88vw, (max-width: 1023px) 25vw, 260px"
                    className="w-full h-auto block"
                  />
                </div>
                <figcaption className="mono small-caps faint mt-3 text-center">
                  {s.caption}
                </figcaption>
              </figure>
            ))}
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
          <p className="display font-light text-[16px] xs:text-[18px] leading-relaxed ink max-w-[76ch]">
            The portfolio you&rsquo;re reading this on was built exactly the way the guide
            teaches: role-targeted projects, case studies that make even private work
            credible, and on every project a number you can challenge me on. I ship in
            public:{" "}
            <Link href="/" className="accent-link accent">
              the projects on this site
            </Link>
            , and open-source tools like{" "}
            <a
              href="https://github.com/rushirb2001/cohors"
              target="_blank"
              rel="noopener noreferrer"
              className="accent-link accent"
            >
              cohors <span aria-hidden className="mono text-[0.85em] align-middle">↗</span>
              <span className="sr-only"> (opens in new tab)</span>
            </a>
            . No hustle, no exaggerated numbers, and the guide even tells you to use numbers
            you can defend for ten minutes, because a commenter&rsquo;s one hard question
            undoes months of credibility.
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
        <Row label="Plans">
          <div className="overflow-x-auto pb-scroll" tabIndex={0} role="region" aria-label="Pricing comparison">
            <table className="w-full border-collapse mono text-[12px] xs:text-[13px] min-w-[460px]">
              <thead>
                <tr className="border-b rule">
                  <td className="py-3 pr-6">
                    <span className="sr-only">Feature</span>
                  </td>
                  <th scope="col" className="font-normal text-left py-3 px-4">
                    <span className="display ink text-[15px] font-light">Lite</span>{" "}
                    <span className="small-caps faint">Free</span>
                  </th>
                  <th scope="col" className="accent-col font-normal text-left py-3 px-4">
                    <span className="display ink text-[15px] font-light">Core</span>{" "}
                    {pricing.list ? (
                      <>
                        <span className="small-caps faint line-through">{pricing.list}</span>{" "}
                      </>
                    ) : null}
                    <span className="small-caps accent">{pricing.now}</span>
                  </th>
                  <th scope="col" className="font-normal text-left py-3 pl-4">
                    <span className="display muted text-[15px] font-light">Cohort</span>{" "}
                    <span className="small-caps faint">soon</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRICING_ROWS.map((r, ri) => (
                  <tr key={r.label} className={ri < PRICING_ROWS.length - 1 ? "border-b rule" : ""}>
                    <th scope="row" className="py-3 pr-6 ink font-normal text-left">
                      {r.label}
                    </th>
                    <Mark on={r.lite} />
                    <Mark on={r.core} accent />
                    <Mark on={r.cohort} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mono text-[11px] faint mt-4">
            {pricing.list
              ? `Launch price ${pricing.now} (33% off), first 50 buyers, then ${pricing.list}.`
              : `${pricing.now}.`}{" "}
            Core buyers get the cohort at a discount when it opens, and everything in Core
            carries over.
          </p>
          <div className="mt-7">
            <CTAs
              pricing={pricing}
              coreLabel={
                <>
                  Get Core ·{" "}
                  {pricing.list ? (
                    <>
                      <span className="line-through" style={{ opacity: 0.6 }}>{pricing.list}</span>{" "}
                    </>
                  ) : null}
                  {pricing.now}
                </>
              }
            />
          </div>
          {/* Separators ride with their preceding label so a wrapped line can
              never start with a bare dot. */}
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 mono small-caps faint">
            <span className="inline-flex items-center gap-x-3">
              <span>Instant access</span>
              <span aria-hidden className="accent">·</span>
            </span>
            <span className="inline-flex items-center gap-x-3">
              <span>Lifetime updates (Core)</span>
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
        {/* Plain headings + paragraphs: dl semantics with decorative dt text
            read as "Q, Q, Q" in screen readers; h3s match the tier list. */}
        <div>
          {faq.map((f, i) => (
            <div
              key={f.q}
              className={`grid grid-cols-1 xs:grid-cols-[clamp(80px,14vw,140px)_1fr] lg:grid-cols-[140px_1fr] gap-2 xs:gap-6 lg:gap-12 py-5 xs:py-6 first:pt-4 xs:first:pt-6 ${
                i !== faq.length - 1 ? "border-b rule" : ""
              }`}
            >
              <span aria-hidden className="mono small-caps faint xs:pt-1">
                Q
              </span>
              <div>
                <h3 className="display text-[16px] xs:text-[18px] font-light tracking-tight ink">
                  {f.q}
                </h3>
                <p className="mono text-[13px] xs:text-[14px] leading-relaxed muted mt-2 max-w-[74ch]">
                  {f.a}
                </p>
              </div>
            </div>
          ))}
        </div>

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
            7-day, no-questions-asked refund. If it doesn&rsquo;t give you a clear plan
            you&rsquo;re excited to start,{" "}
            <a
              href="mailto:bhavsarrushir@gmail.com?subject=Zero%20to%20Hired%20refund"
              className="accent-link accent"
            >
              email me
            </a>{" "}
            and I&rsquo;ll refund you. Or request it straight from your Gumroad receipt.
          </p>
        </Row>
        {/* In-content spacer (not padding): sticky headers are constrained
            to the content box, so padding would end the pin early and open a
            gap in the push handoff. */}
        <div aria-hidden className="h-6 xs:h-8" />
        </section>

        {/* ---- Final CTA ---------------------------------------------- */}
        <section className="py-16 xs:py-24 text-center">
          <h2 className="display font-light tracking-tight leading-[1.12] text-[24px] xs:text-[clamp(28px,4vw,40px)] max-w-[24ch] mx-auto">
            Stop shipping demos nobody reads. Build 2-3 projects that get you interviews
            <span className="accent">.</span>
          </h2>
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

// Pricing check / dash cell, matching the site's table treatment. The accent
// (Core) column carries a whisper of navy so the recommended tier reads first.
// State is real (visually hidden) text for screen readers; the glyphs are
// decorative, aria-label on a bare span is ignored by most AT.
function Mark({ on, accent }: { on: boolean; accent?: boolean }) {
  return (
    <td className={`py-3 px-4 ${accent ? "accent-col" : ""}`}>
      <span className="sr-only">{on ? "Included" : "Not included"}</span>
      {on ? (
        <span aria-hidden className={accent ? "accent" : "ink"}>
          ✓
        </span>
      ) : (
        <span aria-hidden className="faint">
          ·
        </span>
      )}
    </td>
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
  liteLabel = "Read 3 projects free →",
  center,
  note,
}: {
  pricing: Pricing
  coreLabel?: ReactNode
  liteLabel?: string
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
        <a href={GUMROAD_LITE} data-gumroad-overlay aria-haspopup="dialog" className="cta-ghost display">
          {liteLabel}
        </a>
      </div>
      {note ? (
        <p className="mono small-caps faint mt-4">
          {pricing.list ? `${pricing.now} launch price, first 50 buyers` : pricing.now} · Instant
          access · 7-day refund
        </p>
      ) : null}
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

      /* Secondary CTA: outline button, same footprint as .cta-buy (12px pad +
         1px border == 13px). */
      .cta-ghost {
        display: inline-flex; align-items: center; justify-content: center;
        text-align: center; padding: 12px 21px; border-radius: 6px;
        font-size: 15px; letter-spacing: -0.01em; line-height: 1;
        border: 1px solid #1f3a5f; color: #1f3a5f; background-color: transparent;
        transition: background-color 200ms ease;
      }
      @media (hover: hover) { .cta-ghost:hover { background-color: rgba(31,58,95,0.06); } }

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

      /* Visible focus for the keyboard-scrollable pricing region. */
      .pb-scroll:focus-visible { outline: 2px solid #1f3a5f; outline-offset: 2px; }

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
      /* Phones: one clear buy action; the secondary joins at 640px+. (Declared
         here, not with Tailwind's hidden utility, this style block loads after
         the compiled sheet, so .sh-cta's display would win the cascade.) */
      @media (max-width: 639px) {
        .pb-bar .sh-cta-ghost { display: none; }
      }

      .sh-cta {
        display: inline-flex; align-items: center; justify-content: center;
        padding: 7px 14px; border-radius: 5px; white-space: nowrap;
        font-family: "Google Sans", ui-sans-serif, system-ui, sans-serif;
        font-size: 12.5px; letter-spacing: -0.01em; line-height: 1;
        transition: background-color 200ms ease;
      }
      .sh-cta-solid { background-color: #1f3a5f; color: #f4f1ec; }
      .sh-cta-ghost { border: 1px solid #1f3a5f; color: #1f3a5f; background-color: transparent; padding: 6px 13px; }
      @media (hover: hover) {
        .sh-cta-solid:hover { background-color: #16314f; }
        .sh-cta-ghost:hover { background-color: rgba(31,58,95,0.06); }
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
        .accent-link, .accent-link::after, .cta-buy, .cta-ghost { transition: none; }
        .shimmer-ch { animation: none; transform: none; }
        .sh-cta { transition: none; }
        .pb-bar, .pb-bar[data-shown] { transition: none; }
        .pb-rail-line { transition: none; }
      }
    `}</style>
  )
}
