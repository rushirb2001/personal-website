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
        {/* Visible breadcrumb, matching the BreadcrumbList above. Google is
            explicit that structured data should describe what is on the page. */}
        <nav aria-label="Breadcrumb" className="py-5 xs:py-6">
          <ol className="mono small-caps faint flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <li>
              <Link href="/" className="accent-link">
                Rushir Bhavsar
              </Link>
            </li>
            <li aria-hidden className="accent">
              /
            </li>
            <li>
              <Link href="/writing" className="accent-link">
                Writing
              </Link>
            </li>
          </ol>
        </nav>

        <article className="pb-4">
          <header className="pb-8 xs:pb-10 border-b rule">
            <div className="mono small-caps faint flex flex-wrap items-center gap-x-3 gap-y-1">
              <time dateTime={post.published}>
                {new Date(post.published).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  timeZone: "UTC",
                })}
              </time>
              <span aria-hidden className="accent">
                &middot;
              </span>
              <span>{post.readingTime}</span>
            </div>

            <h1 className="display font-light tracking-tight leading-[1.1] text-[29px] xs:text-[clamp(32px,4.6vw,44px)] max-w-[26ch] mt-4">
              {post.title}
              <span className="accent">.</span>
            </h1>

            <p className="display font-light text-[17px] xs:text-[19px] leading-[1.55] muted max-w-[62ch] mt-5">
              {post.standfirst}
            </p>
          </header>

          <div className="prose pt-8 xs:pt-10">
            <Body />
          </div>
        </article>

        {/* Internal links out. Keeps the cluster crawlable from any entry point
            instead of relying on the index page being found first. */}
        <section className="mt-14 xs:mt-20 pt-8 border-t rule">
          <h2 className="mono small-caps accent">Also here</h2>
          <ul className="mt-5">
            {more.map((p) => (
              <li key={p.slug} className="border-b rule py-4">
                <Link
                  href={`/writing/${p.slug}`}
                  className="accent-link display font-light text-[17px] xs:text-[19px] leading-snug"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <footer className="py-8 xs:py-10 mono text-[11px] flex items-center justify-between gap-4">
          <Link href="/" className="accent-link muted">
            <span className="faint">&copy; 2026 </span>
            {AUTHOR.name}
          </Link>
          <span className="small-caps faint">{AUTHOR.location}</span>
        </footer>
      </div>
    </main>
  )
}
