import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { JsonLd, breadcrumbList } from "../../JsonLd"
import { PageShell } from "../../PageShell"
import { ChipList, ENTRY_BODY, ENTRY_TITLE, EntryRow, PageSection } from "../../SiteChrome"
import { SITE_URL, absoluteUrl } from "../../site"
import { getPost, POSTS, POST_SLUGS } from "../posts-data"

// Every post is known at build time, so all of /writing prerenders.
export function generateStaticParams() {
  return POST_SLUGS.map((slug) => ({ slug }))
}

// Next 16: params is async.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return { title: "Not found" }

  const url = absoluteUrl(`/writing/${post.slug}`)
  return {
    // seoTitle where the headline is too long for a result; the H1 keeps the
    // full phrasing either way. The layout template appends the site name.
    title: post.seoTitle ?? post.title,
    description: post.description,
    alternates: {
      canonical: `/writing/${post.slug}`,
      // Also advertised from each post, since a reader arriving from search
      // lands here rather than on the index.
      types: { "application/rss+xml": [{ url: "/writing/rss.xml", title: "Writing · Rushir Bhavsar" }] },
    },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.published,
      modifiedTime: post.updated ?? post.published,
      authors: [SITE_URL],
      tags: [...post.topics],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const url = absoluteUrl(`/writing/${post.slug}`)
  const { Body } = post
  const more = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3)

  const graph = [
    breadcrumbList([
      { name: "Home", url: SITE_URL },
      { name: "Writing", url: absoluteUrl("/writing") },
      { name: post.title, url },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${url}#article`,
      headline: post.title,
      description: post.description,
      url,
      datePublished: post.published,
      dateModified: post.updated ?? post.published,
      // Points at the Person node declared once on the home page rather than
      // restating the author on every post.
      author: { "@id": `${SITE_URL}/#person` },
      publisher: { "@id": `${SITE_URL}/#person` },
      image: absoluteUrl(`/writing/${post.slug}/opengraph-image`),
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntityOfPage: url,
      keywords: post.topics.join(", "),
      inLanguage: "en-US",
    },
  ]

  return (
    <PageShell current="/writing">
      <JsonLd data={graph} />

      <article>
        {/* Header on the page grid: publication meta in the left margin,
            headline and deck in the content column, so the h1's left edge
            matches every section head below it. An article keeps this
            narrower headline rather than the index pages' hero: its title is
            a sentence, and it is the first line of a column of reading. */}
        <header className="grid grid-cols-1 xs:grid-cols-[clamp(80px,14vw,140px)_1fr] lg:grid-cols-[140px_1fr] gap-2 xs:gap-6 lg:gap-12 pt-8 xs:pt-10 lg:pt-14 pb-12 xs:pb-16">
          <div className="mono text-[12px] xs:text-[13px] leading-none ink xs:pt-3 flex xs:flex-col items-baseline gap-3 xs:gap-2">
            <time dateTime={post.published}>
              {new Date(post.published).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                timeZone: "UTC",
              })}
            </time>
            <span className="muted">{post.readingTime}</span>
          </div>

          <div>
            <h1 className="display font-light tracking-tight leading-[1.08] text-[30px] xs:text-[clamp(34px,5vw,52px)] lg:text-[clamp(30px,3.6vw,44px)] max-w-[30ch]">
              {post.title}
              <span className="accent">.</span>
            </h1>
            <p className="display font-light text-[16px] xs:text-[18px] leading-[1.55] muted max-w-[64ch] mt-5">
              {post.standfirst}
            </p>
          </div>
        </header>

        {/* The body owns its own section heads and rows (see ../Prose). */}
        <Body />
      </article>

      {/* Internal links out, in the index's row vocabulary. Keeps the cluster
          crawlable from any entry point rather than only via the index. */}
      <PageSection title="Also here" count={more.length}>
        <ol className="mt-2 lg:mt-3">
          {more.map((p) => (
            <EntryRow
              key={p.slug}
              spacing="dense"
              meta={<span className="muted">{p.readingTime}</span>}
              rail={<ChipList links={[{ label: "read", href: `/writing/${p.slug}` }]} />}
            >
              <h3 className={ENTRY_TITLE}>
                <Link href={`/writing/${p.slug}`} className="accent-link">
                  {p.title}
                </Link>
              </h3>
              <p className={`${ENTRY_BODY} mt-2 xs:mt-5`}>{p.standfirst}</p>
            </EntryRow>
          ))}
        </ol>
      </PageSection>
    </PageShell>
  )
}
