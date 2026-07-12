import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import Script from "next/script"
import type { ReactNode } from "react"
import { StickyHead } from "./StickyHead"
import { GUMROAD_CORE, GUMROAD_LITE } from "./links"

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
  { label: "3 projects + git section", lite: true, core: true, cohort: true },
  { label: "All 16 projects + interview prep + resume bank", lite: false, core: true, cohort: true },
  { label: "Repo skeletons + progress tracker", lite: false, core: true, cohort: true },
  { label: "Buyers' Discord + lifetime updates", lite: false, core: true, cohort: true },
  { label: "Live cohort + office hours", lite: false, core: false, cohort: true },
]

const FAQ = [
  {
    q: "Do I need money or a GPU?",
    a: "No. Every project runs on free tiers. That's the whole point.",
  },
  {
    q: "Solo, or do I need a partner?",
    a: "Solo-first: the plans are written for one person. A Partner Bonus covers the two-person review workflow if you find one.",
  },
  {
    q: "Is this just a list of ideas?",
    a: "No, it's a 6-month system: week-by-week plans, the git/LinkedIn operating manual, repo skeletons, and a tracker.",
  },
  {
    q: "I'm not in the US / not a student.",
    a: "It still works, and the playbook is about what to build and how to show it, which is universal.",
  },
  {
    q: "Will it go stale?",
    a: "Lifetime updates. The stack and projects evolve with the market.",
  },
]

export function generateMetadata(): Metadata {
  const title = "Zero to Hired: The AI-Engineer Portfolio Playbook · Rushir Bhavsar"
  const description =
    "Zero to Hired is the AI-engineer portfolio playbook: go from a blank GitHub to a hireable portfolio in six months, on $0 of compute. 16 production-grade projects chosen by target role, each with a week-by-week plan, the interview questions it prepares you for, and the resume bullets it produces."
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  }
}

export default function PlaybookPage() {
  return (
    <main className="paper grain min-h-[100svh]">
      {/* gumroad.js upgrades the overlay anchors into an on-page checkout
          modal. lazyOnload keeps it entirely off the render-blocking path so
          it never touches FCP/LCP. */}
      <Script src="https://gumroad.com/js/gumroad.js" strategy="lazyOnload" />

      <PlaybookStyle />

      <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
        {/* Top bar: a discreet way back to the portfolio, kept separate from
            the sales story. */}
        <nav className="flex items-center justify-between py-5 xs:py-6">
          {/* Product name on the left; the descriptor tags along on wider
              screens, short brand on phones so it never collides with the
              back-link. */}
          <span className="mono small-caps accent">
            <span className="sm:hidden">Zero to Hired</span>
            <span className="hidden sm:inline">Zero to Hired · The AI-Engineer Portfolio Playbook</span>
          </span>
          <Link href="/" className="accent-link mono text-[13px] inline-flex items-center gap-1.5">
            <span aria-hidden>←</span> Rushir Bhavsar
          </Link>
        </nav>

        {/* ---- Hero ---------------------------------------------------- */}
        <section className="pt-4 xs:pt-8 lg:pt-10">
          <h1 className="display font-light tracking-tight leading-[1.08] text-[30px] xs:text-[clamp(34px,5vw,52px)] max-w-[38ch]">
            Zero to Hired: from a blank{" "}
            <span className="gh-pill"><GhMark />GitHub</span> to an{" "}
            <span className="nobreak">interview-ready</span> portfolio in{" "}
            <Shimmer text="six months" /><span className="accent">.</span>
          </h1>
          <div className="display font-light text-[16px] sm:text-[clamp(16px,1.7vw,20px)] mt-6 lg:mt-7 leading-[1.5] max-w-[66ch] muted">
            <em>You can code</em>, but your GitHub is thin, and you don&rsquo;t know{" "}
            <em className="ink">which</em> projects get you an FDE, AI-ML, or data role.{" "}
            <strong className="ink font-bold">Zero to Hired</strong> is the system I used:{" "}
            <strong className="ink font-bold">16 production-grade projects</strong> on free
            tiers, a git and LinkedIn playbook, and the resume bullets each one produces.
          </div>
          <div className="mt-9 xs:mt-10">
            <CTAs />
          </div>
        </section>

        {/* ---- The problem -------------------------------------------- */}
        {/* Each section wraps its header + content so the sticky header anchors
            only while that section is in view, then releases at its boundary
            (the landing page's per-section anchoring, without the collapse). */}
        <section>
        <StickyHead title="The problem" tight />
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
            week, for free, plus the git history, writeups, and LinkedIn presence that make
            recruiters reach out first.
          </p>
        </Row>

        </section>

        {/* ---- What's inside ------------------------------------------ */}
        <section>
        <StickyHead title="What's inside" />
        <ol>
          {INSIDE.map((item, i) => (
            <li
              key={item.name}
              className={`grid grid-cols-1 xs:grid-cols-[clamp(80px,14vw,140px)_1fr_clamp(140px,22vw,240px)] lg:grid-cols-[140px_1fr_240px] gap-3 xs:gap-6 lg:gap-12 py-5 xs:py-7 lg:py-8 first:pt-4 xs:first:pt-6 ${
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
              <div className="xs:pt-2 lg:pt-[10px]">
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

        </section>

        {/* ---- A look inside (samples) -------------------------------- */}
        <section>
        <StickyHead title="A look inside" />
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
                    sizes="(max-width: 475px) 88vw, 300px"
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

        </section>

        {/* ---- Why trust this ----------------------------------------- */}
        <section>
        <StickyHead title="Why trust this" />
        <Row label="Proof">
          <p className="display font-light text-[16px] xs:text-[18px] leading-relaxed ink max-w-[76ch]">
            The portfolio you&rsquo;re reading this on was built exactly the way the guide
            teaches: role-targeted projects, case studies that make even private work
            credible, real metrics. I ship in public:{" "}
            <Link href="/" className="accent-link accent">
              the projects on this site
            </Link>
            , and open-source tools like{" "}
            <a
              href="https://github.com/rushirb2001"
              target="_blank"
              rel="noopener noreferrer"
              className="accent-link accent"
            >
              cohors <span aria-hidden className="mono text-[0.85em] align-middle">↗</span>
            </a>
            . The proof is the site you&rsquo;re standing on. No hustle, no exaggerated
            numbers, and the guide even tells you to use numbers you can defend for ten minutes,
            because a commenter&rsquo;s one hard question undoes months of credibility.
          </p>
        </Row>

        </section>

        {/* ---- Pricing ------------------------------------------------ */}
        <section>
        <StickyHead title="Pricing" />
        <Row label="Plans">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse mono text-[12px] xs:text-[13px] min-w-[460px]">
              <thead>
                <tr className="border-b rule">
                  <th className="small-caps faint font-normal text-left py-3 pr-6"></th>
                  <th className="font-normal text-left py-3 px-4">
                    <span className="display ink text-[15px] font-light">Lite</span>{" "}
                    <span className="small-caps faint">Free</span>
                  </th>
                  <th className="font-normal text-left py-3 px-4">
                    <span className="display ink text-[15px] font-light">Core</span>{" "}
                    <span className="small-caps accent">$15</span>
                  </th>
                  <th className="font-normal text-left py-3 pl-4">
                    <span className="display muted text-[15px] font-light">Cohort</span>{" "}
                    <span className="small-caps faint">soon</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRICING_ROWS.map((r, ri) => (
                  <tr key={r.label} className={ri < PRICING_ROWS.length - 1 ? "border-b rule" : ""}>
                    <td className="py-3 pr-6 ink">{r.label}</td>
                    <Mark on={r.lite} />
                    <Mark on={r.core} accent />
                    <Mark on={r.cohort} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mono text-[11px] faint mt-4">
            Launch price $9-12 for the first 50 buyers, then $15.
          </p>
          <div className="mt-7">
            <CTAs coreLabel="Get Core · $15" liteLabel="Start with 3 free projects →" />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 mono small-caps faint">
            <span>Instant access</span>
            <span aria-hidden className="accent">·</span>
            <span>Lifetime updates</span>
            <span aria-hidden className="accent">·</span>
            <span>7-day money-back guarantee</span>
          </div>
        </Row>

        </section>

        {/* ---- FAQ ---------------------------------------------------- */}
        <section>
        <StickyHead title="FAQ" />
        <dl>
          {FAQ.map((f, i) => (
            <div
              key={f.q}
              className={`grid grid-cols-1 xs:grid-cols-[clamp(80px,14vw,140px)_1fr] lg:grid-cols-[140px_1fr] gap-2 xs:gap-6 lg:gap-12 py-5 xs:py-6 first:pt-4 xs:first:pt-6 ${
                i !== FAQ.length - 1 ? "border-b rule" : ""
              }`}
            >
              <dt className="mono small-caps faint xs:pt-1">Q</dt>
              <div>
                <p className="display text-[16px] xs:text-[18px] font-light tracking-tight ink">
                  {f.q}
                </p>
                <dd className="mono text-[13px] xs:text-[14px] leading-relaxed muted mt-2 max-w-[74ch] m-0">
                  {f.a}
                </dd>
              </div>
            </div>
          ))}
        </dl>

        </section>

        {/* ---- Guarantee ---------------------------------------------- */}
        <section>
        <StickyHead title="Guarantee" />
        <Row label="7 days">
          <p className="display font-light text-[16px] xs:text-[18px] leading-relaxed ink max-w-[68ch]">
            7-day, no-questions-asked refund. If it doesn&rsquo;t give you a clear plan
            you&rsquo;re excited to start, email me and I&rsquo;ll refund you.
          </p>
        </Row>
        </section>

        {/* ---- Final CTA ---------------------------------------------- */}
        <section className="py-16 xs:py-24 text-center">
          <h2 className="display font-light tracking-tight leading-[1.12] text-[24px] xs:text-[clamp(28px,4vw,40px)] max-w-[24ch] mx-auto">
            Stop shipping demos nobody reads. Build 2-3 things that get you hired
            <span className="accent">.</span>
          </h2>
          <div className="mt-9 flex justify-center">
            <CTAs center />
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

// A single label-left / content-right block on the section grid (right column
// left open for the prose to breathe), mirroring the project case-study rows.
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-[clamp(80px,14vw,140px)_1fr] lg:grid-cols-[140px_1fr] gap-2 xs:gap-6 lg:gap-12 pt-6 xs:pt-8">
      <p className="mono small-caps faint xs:pt-1">{label}</p>
      <div>{children}</div>
    </div>
  )
}

// Pricing check / dash cell, matching the site's table treatment.
function Mark({ on, accent }: { on: boolean; accent?: boolean }) {
  return (
    <td className="py-3 px-4">
      {on ? (
        <span className={accent ? "accent" : "ink"} aria-label="included">
          ✓
        </span>
      ) : (
        <span className="faint" aria-label="not included">
          ·
        </span>
      )}
    </td>
  )
}

// Buy buttons. The primary is a filled accent block, the one deliberate
// departure from the site's text-link vocabulary, because a storefront needs
// an unmistakable buy action. The secondary stays a site-standard accent-link.
function CTAs({
  coreLabel = "Get the playbook · $15",
  liteLabel = "Read 3 projects free →",
  center,
}: {
  coreLabel?: string
  liteLabel?: string
  center?: boolean
}) {
  return (
    <div
      className={`flex flex-col xs:flex-row items-stretch xs:items-center gap-4 xs:gap-6 ${
        center ? "xs:justify-center" : ""
      }`}
    >
      <a href={GUMROAD_CORE} data-gumroad-overlay className="cta-buy display">
        {coreLabel}
      </a>
      <a href={GUMROAD_LITE} data-gumroad-overlay className="cta-ghost display">
        {liteLabel}
      </a>
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

// Closing words rendered one letter per span so a size pulse can swipe
// left to right across them. The wrapper carries the accessible label; the
// per-letter spans are decorative.
function Shimmer({ text }: { text: string }) {
  return (
    <span className="shimmer" aria-label={text}>
      {[...text].map((ch, i) =>
        ch === " " ? (
          " "
        ) : (
          <span
            key={i}
            aria-hidden
            className="shimmer-ch"
            style={{ animationDelay: `${(i * 0.11).toFixed(2)}s` }}
          >
            {ch}
          </span>
        ),
      )}
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
      html { scrollbar-gutter: stable; overflow-anchor: none; }
      .paper { background-color: #f4f1ec; color: #1a1a1a; }
      .ink { color: #1a1a1a; }
      .muted { color: rgba(26,26,26,0.62); }
      .faint { color: rgba(26,26,26,0.42); }
      .rule { border-color: rgba(26,26,26,0.12); }
      .accent { color: #1f3a5f; }
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
      .shimmer { color: #1f3a5f; }
      .shimmer-ch {
        display: inline-block; transform-origin: center bottom;
        animation: shimmer 3.6s ease-in-out infinite; will-change: transform;
      }
      @keyframes shimmer {
        0% { transform: scale(1); }
        7% { transform: scale(1.24); }
        16% { transform: scale(1); }
        100% { transform: scale(1); }
      }

      .grain::before {
        content: ""; position: fixed; inset: 0; pointer-events: none;
        background-image: radial-gradient(rgba(26,26,26,0.05) 1px, transparent 1px);
        background-size: 3px 3px; mix-blend-mode: multiply; z-index: 1;
      }

      /* Sticky section headers: while a header is anchored (data-stuck), the two
         Buy CTAs slide in from the right, absolutely positioned so they never
         push the title. Hidden (and out of the flow) otherwise. */
      .stickhead-grid { position: relative; }
      .stickhead-cta {
        position: absolute; top: 50%; right: 0;
        transform: translateY(-50%) translateX(10px);
        align-items: center; gap: 10px;
        opacity: 0; pointer-events: none;
        transition: opacity 300ms ease, transform 400ms cubic-bezier(0.22,1,0.36,1);
      }
      .stickhead[data-stuck] .stickhead-cta {
        opacity: 1; pointer-events: auto;
        transform: translateY(-50%) translateX(0);
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

      @media (prefers-reduced-motion: reduce) {
        .accent-link, .accent-link::after, .cta-buy, .cta-ghost { transition: none; }
        .shimmer-ch { animation: none; transform: none; }
        .stickhead-cta, .sh-cta { transition: none; }
      }
    `}</style>
  )
}
