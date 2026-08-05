import type { Metadata } from "next"
import Link from "next/link"
import { JsonLd, breadcrumbList } from "../JsonLd"
import { SITE_URL, absoluteUrl } from "../site"
import { POSTS } from "./posts-data"
import { WritingStyle } from "./WritingStyle"

export const metadata: Metadata = {
  title: "Writing",
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

export default function WritingIndex() {
  return (
    <main className="paper grain min-h-[100svh]">
      <WritingStyle />
      <JsonLd data={GRAPH} />

      <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
        <nav className="flex items-center justify-between py-5 xs:py-6">
          <span className="mono small-caps accent">Writing</span>
          <Link href="/" className="accent-link mono text-[13px] inline-flex items-center gap-1.5">
            <span aria-hidden>&larr;</span> Rushir Bhavsar
          </Link>
        </nav>

        <header className="pt-6 xs:pt-10 pb-8 xs:pb-12 border-b rule">
          <h1 className="display font-light tracking-tight leading-[1.1] text-[30px] xs:text-[clamp(34px,5vw,48px)] max-w-[24ch]">
            Notes on building a portfolio that survives the interview
            <span className="accent">.</span>
          </h1>
          <p className="display font-light text-[16px] xs:text-[18px] leading-[1.55] muted max-w-[62ch] mt-5">
            What I have learned making my own work checkable: which projects carry signal, how
            to prove a system works, and what to do when the repo has to stay private.
          </p>
        </header>

        <ul className="py-4 xs:py-6">
          {POSTS.map((post) => (
            <li key={post.slug} className="border-b rule py-7 xs:py-9">
              <article>
                <div className="mono small-caps faint flex flex-wrap items-center gap-x-3 gap-y-1">
                  <time dateTime={post.published}>
                    {new Date(post.published).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      timeZone: "UTC",
                    })}
                  </time>
                  <span aria-hidden className="accent">
                    &middot;
                  </span>
                  <span>{post.readingTime}</span>
                </div>

                <h2 className="display font-light tracking-tight leading-[1.18] text-[21px] xs:text-[26px] lg:text-[28px] mt-3 max-w-[34ch]">
                  <Link href={`/writing/${post.slug}`} className="accent-link">
                    {post.title}
                  </Link>
                </h2>

                <p className="display font-light text-[15px] xs:text-[16px] leading-relaxed muted max-w-[64ch] mt-3">
                  {post.standfirst}
                </p>

                <ul className="flex flex-wrap gap-x-3 gap-y-1.5 mono text-[12px] faint mt-4">
                  {post.topics.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>

        <footer className="py-8 xs:py-10 mono text-[11px] flex items-center justify-between gap-4">
          <Link href="/" className="accent-link muted">
            <span className="faint">&copy; 2026 </span>Rushir Bhavsar
          </Link>
          <Link href="/playbook" className="accent-link accent small-caps">
            The Playbook
          </Link>
        </footer>
      </div>
    </main>
  )
}
