import type { Metadata } from "next"
import Link from "next/link"
import { JsonLd, breadcrumbList } from "../JsonLd"
import { SITE_URL, absoluteUrl } from "../site"
import { POSTS } from "./posts-data"
import { WritingStyle } from "./WritingStyle"

export const metadata: Metadata = {
  // Not just "Writing": that spent the most valuable field on the page on a
  // nav label. The <title> is the strongest on-page relevance signal there is,
  // so it names the subject. The visible nav label stays "Writing".
  title: "Writing on AI engineering portfolios",
  description:
    "Notes on building an AI engineering portfolio that survives an interview: project selection, evaluation, free-tier infrastructure, and private-repo credibility.",
  alternates: { canonical: "/writing" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/writing"),
    title: "Writing · Rushir Bhavsar",
    description:
      "Notes on building an AI engineering portfolio that survives an interview: project selection, evaluation, free-tier infrastructure, and private-repo credibility.",
  },
}

const GRAPH = [
  breadcrumbList([
    { name: "Home", url: SITE_URL },
    { name: "Writing", url: absoluteUrl("/writing") },
  ]),
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/writing")}#collection`,
    url: absoluteUrl("/writing"),
    name: "Writing",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: "Building an AI engineering portfolio",
    hasPart: POSTS.map((p) => ({
      "@type": "Article",
      headline: p.title,
      url: absoluteUrl(`/writing/${p.slug}`),
      datePublished: p.published,
      author: { "@id": `${SITE_URL}/#person` },
    })),
  },
]

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  })
}

export default function WritingIndex() {
  return (
    <main className="paper grain min-h-[100svh]">
      <WritingStyle />
      <JsonLd data={GRAPH} />

      <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
        {/* Same top bar as the playbook: descriptor left, a discreet way back
            to the portfolio right. */}
        <nav className="flex items-center justify-between py-5 xs:py-6">
          <span className="mono small-caps accent">Writing</span>
          <Link href="/" className="accent-link mono text-[13px] inline-flex items-center gap-1.5">
            <span aria-hidden>&larr;</span> Rushir Bhavsar
          </Link>
        </nav>

        {/* Hero on the page grid rather than as a free-floating block, so the
            headline's left edge is the same one every row below it uses. */}
        <header className="grid grid-cols-1 xs:grid-cols-[clamp(80px,14vw,140px)_1fr] lg:grid-cols-[140px_1fr] gap-2 xs:gap-6 lg:gap-12 pt-4 xs:pt-8 lg:pt-10 pb-10 xs:pb-14">
          <p className="mono small-caps faint xs:pt-3">Notes</p>
          <div>
            <h1 className="display font-light tracking-tight leading-[1.08] text-[30px] xs:text-[clamp(34px,5vw,52px)] lg:text-[clamp(30px,3.6vw,44px)] max-w-[30ch]">
              What I learned making my own work checkable
              <span className="accent">.</span>
            </h1>
            <p className="mt-5 leading-relaxed text-[14px] xs:text-[15px] max-w-[62ch] mono">
              Which projects carry hiring signal, how to prove a system actually works, what to do
              when the repo has to stay private, and how to run all of it on nothing.
            </p>
          </div>
        </header>

        {/* Section head in the landing page's vocabulary: "+" marker, title
            with its trailing accent period, count in the right column. */}
        <div
          className="sticky top-0 z-30 -mx-6 lg:-mx-12 px-6 lg:px-12 py-3 border-b rule"
          style={{ backgroundColor: "#f4f1ec" }}
        >
          <div className="grid grid-cols-[auto_1fr_auto] xs:grid-cols-[clamp(80px,14vw,140px)_1fr_clamp(140px,22vw,240px)] lg:grid-cols-[140px_1fr_240px] gap-3 xs:gap-6 lg:gap-12 items-baseline">
            <span
              aria-hidden
              className="display accent text-[22px] xs:text-[clamp(20px,4.5vw,26px)] lg:text-3xl font-light leading-none"
            >
              +
            </span>
            <h2 className="display text-[22px] xs:text-[clamp(20px,4.5vw,26px)] lg:text-3xl font-light tracking-tight leading-none">
              All posts
              <span className="accent">.</span>
            </h2>
            <span className="mono text-[12px] xs:text-[13px] faint text-right tracking-[0.18em]">
              {String(POSTS.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Row shape lifted from the landing page's project list: meta in the
            left margin, title + blurb in the middle, tags in the right rail. */}
        <ol className="mt-2 lg:mt-3">
          {POSTS.map((post, i) => (
            <li
              key={post.slug}
              className={`grid grid-cols-1 xs:grid-cols-[clamp(80px,14vw,140px)_1fr_clamp(140px,22vw,240px)] lg:grid-cols-[140px_1fr_240px] gap-3 xs:gap-6 lg:gap-12 py-4 xs:py-6 lg:py-8 first:pt-2 xs:first:pt-3 lg:first:pt-4 ${
                i !== POSTS.length - 1 ? "border-b rule" : ""
              }`}
            >
              <div className="mono text-[12px] xs:text-[13px] leading-none ink xs:pt-2 lg:pt-[10px] flex xs:flex-col items-baseline gap-3 xs:gap-2">
                <time dateTime={post.published}>{shortDate(post.published)}</time>
                <span className="muted">{post.readingTime}</span>
              </div>

              <div>
                <h3 className="display text-[21px] xs:text-[26px] lg:text-3xl font-light tracking-tight leading-tight">
                  <Link href={`/writing/${post.slug}`} className="accent-link">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 xs:mt-5 leading-relaxed text-[14px] xs:text-[15px] max-w-[58ch] mono">
                  {post.standfirst}
                </p>
                {/* Phones drop the right rail, so the read link closes the
                    blurb instead, exactly as the project rows do. */}
                <p className="xs:hidden mt-3">
                  <Link
                    href={`/writing/${post.slug}`}
                    className="accent-link accent mono text-[12px] font-light tracking-[-0.525px] whitespace-nowrap"
                  >
                    read <span aria-hidden>&rarr;</span>
                  </Link>
                </p>
              </div>

              <div className="hidden xs:block xs:pt-2 lg:pt-[10px] xs:space-y-6">
                <div>
                  <p className="mono small-caps faint mb-1 xs:mb-1.5">Topics</p>
                  <ul className="flex flex-wrap gap-x-3 gap-y-1.5 mono xs:text-[13px]">
                    {post.topics.map((t) => (
                      <li key={t} className="muted">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mono small-caps faint mb-1 xs:mb-1.5">Read</p>
                  <Link
                    href={`/writing/${post.slug}`}
                    className="accent-link inline-flex items-center gap-1.5 mono text-[13px]"
                  >
                    open
                    <span aria-hidden>&rarr;</span>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <footer className="border-t rule mt-12 xs:mt-16 py-6 xs:py-8 mono text-[11px] flex items-center justify-between gap-4">
          <Link href="/" className="accent-link muted">
            <span className="faint">&copy; 2026 </span>Rushir Bhavsar
          </Link>
          <Link href="/playbook" className="footer-cta mono">
            The Playbook <span aria-hidden>↗</span>
          </Link>
          {/* Dropped on the narrowest phones: three items do not fit, and the
              location is the least useful of them. */}
          <span className="small-caps faint hidden xs:inline">Tempe, Arizona</span>
        </footer>
      </div>
    </main>
  )
}
