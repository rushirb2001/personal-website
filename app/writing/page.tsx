import type { Metadata } from "next"
import Link from "next/link"
import { JsonLd, breadcrumbList } from "../JsonLd"
import { PageShell } from "../PageShell"
import {
  ChipList,
  ContactSection,
  ENTRY_BODY,
  ENTRY_TITLE,
  EntryRow,
  HeroFacts,
  PageHero,
  PageSection,
  Pills,
  RailLinks,
} from "../SiteChrome"
import { SITE_URL, absoluteUrl } from "../site"
import { POSTS } from "./posts-data"

export const metadata: Metadata = {
  // Not just "Writing": that spent the most valuable field on the page on a
  // nav label. The <title> is the strongest on-page relevance signal there is,
  // so it names the subject. The visible nav label stays "Writing".
  title: "Writing on AI engineering portfolios",
  description:
    "Building an AI engineering portfolio that survives an interview: project selection, evaluation, free-tier infrastructure, and private-repo credibility.",
  alternates: {
    canonical: "/writing",
    // Emits <link rel="alternate" type="application/rss+xml">, which is how
    // every feed reader and most aggregators find a feed. Without it the feed
    // exists but is effectively unlisted.
    types: { "application/rss+xml": [{ url: "/writing/rss.xml", title: "Writing · Rushir Bhavsar" }] },
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/writing"),
    title: "Writing · Rushir Bhavsar",
    description:
      "Building an AI engineering portfolio that survives an interview: project selection, evaluation, free-tier infrastructure, and private-repo credibility.",
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
    <PageShell current="/writing">
      <JsonLd data={GRAPH} />

      <PageHero
        title="What I learned making my own work checkable"
        aside={
          <>
            <HeroFacts items={[`${POSTS.length} posts`, "AI engineering portfolios"]} />
            <ChipList stackFrom="lg" className="mt-4" links={[{ label: "rss feed", href: "/writing/rss.xml" }]} />
          </>
        }
      >
        Which projects carry hiring signal, how to prove a system actually works, what to do when the
        repo has to stay private, and how to run all of it on nothing.
      </PageHero>

      {/* The home page's project rows: date and reading time in the margin,
          title and standfirst in the middle, topics as pills and the read
          chip in the rail. */}
      <PageSection title="All posts" count={POSTS.length}>
        <ol className="mt-2 lg:mt-3">
          {POSTS.map((post) => (
            <EntryRow
              key={post.slug}
              spacing="dense"
              meta={
                <>
                  <time dateTime={post.published}>{shortDate(post.published)}</time>
                  <span className="muted">{post.readingTime}</span>
                </>
              }
              rail={
                <>
                  <Pills items={post.topics} />
                  <RailLinks links={[{ label: "read", href: `/writing/${post.slug}` }]} />
                </>
              }
            >
              <h3 className={ENTRY_TITLE}>
                <Link href={`/writing/${post.slug}`} className="accent-link">
                  {post.title}
                </Link>
              </h3>
              <p className={`${ENTRY_BODY} mt-2 xs:mt-5`}>{post.standfirst}</p>
            </EntryRow>
          ))}
        </ol>
      </PageSection>

      <ContactSection heading="I build the systems these posts are about">
        The posts come out of shipped work. Here is{" "}
        <Link href="/projects" className="accent-link accent">
          every case study
        </Link>
        ,{" "}
        <Link href="/hire" className="accent-link accent">
          how I can help
        </Link>{" "}
        and my{" "}
        <Link href="/resume" className="accent-link accent">
          full resume
        </Link>
        .
      </ContactSection>
    </PageShell>
  )
}
