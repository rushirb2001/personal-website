import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { JsonLd, breadcrumbList } from "../../JsonLd"
import { AUTHOR, SITE_URL, absoluteUrl } from "../../site"
import { getPost, POSTS, POST_SLUGS } from "../posts-data"
import { WritingStyle } from "../WritingStyle"

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
    // The root layout's template appends the name, so the title stays short
    // enough to survive truncation in a result.
    title: post.title,
    description: post.description,
    alternates: { canonical: `/writing/${post.slug}` },
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
    <main className="paper grain min-h-[100svh]">
      <WritingStyle />
      <JsonLd data={graph} />

      <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
        {/* Top bar doubles as the visible breadcrumb the BreadcrumbList above
            describes. Same row as the playbook's and the index's. */}
        <nav aria-label="Breadcrumb" className="flex items-center justify-between py-5 xs:py-6">
          <ol className="mono small-caps accent flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <li>
              <Link href="/writing" className="accent-link">
                Writing
              </Link>
            </li>
          </ol>
          <Link href="/" className="accent-link mono text-[13px] inline-flex items-center gap-1.5">
            <span aria-hidden>&larr;</span> Rushir Bhavsar
          </Link>
        </nav>

        <article>
          {/* Header on the page grid: publication meta in the left margin,
              headline and deck in the content column, so the h1's left edge
              matches every section head below it. */}
          <header className="grid grid-cols-1 xs:grid-cols-[clamp(80px,14vw,140px)_1fr] lg:grid-cols-[140px_1fr] gap-2 xs:gap-6 lg:gap-12 pt-4 xs:pt-8 lg:pt-10 pb-12 xs:pb-16">
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
        <section>
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
                Also here
                <span className="accent">.</span>
              </h2>
            </div>
          </div>

          <ol className="mt-2 lg:mt-3">
            {more.map((p, i) => (
              <li
                key={p.slug}
                className={`grid grid-cols-1 xs:grid-cols-[clamp(80px,14vw,140px)_1fr] lg:grid-cols-[140px_1fr] gap-3 xs:gap-6 lg:gap-12 py-4 xs:py-6 first:pt-2 xs:first:pt-3 ${
                  i !== more.length - 1 ? "border-b rule" : ""
                }`}
              >
                <p className="mono text-[12px] xs:text-[13px] leading-none muted xs:pt-2">
                  {p.readingTime}
                </p>
                <div>
                  <h3 className="display text-[19px] xs:text-[22px] font-light tracking-tight leading-tight">
                    <Link href={`/writing/${p.slug}`} className="accent-link">
                      {p.title}
                    </Link>
                  </h3>
                  <p className="mt-2 leading-relaxed text-[13px] xs:text-[14px] max-w-[58ch] mono muted">
                    {p.standfirst}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <footer className="border-t rule mt-12 xs:mt-16 py-6 xs:py-8 mono text-[11px] flex items-center justify-between gap-4">
          <Link href="/" className="accent-link muted">
            <span className="faint">&copy; 2026 </span>
            {AUTHOR.name}
          </Link>
          <Link href="/playbook" className="accent-link small-caps faint whitespace-nowrap">
            The Playbook
          </Link>
          <span className="small-caps faint">{AUTHOR.location}</span>
        </footer>
      </div>
    </main>
  )
}
