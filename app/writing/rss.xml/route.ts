import { AUTHOR, absoluteUrl } from "../../site"
import { POSTS, postLastModified } from "../posts-data"

// RSS 2.0 for /writing, served at /writing/rss.xml.
//
// A route handler rather than a file in public/, so the feed is generated from
// the same POSTS registry the index page and the sitemap read and can never
// list something that no longer exists.
//
// Why RSS at all, on a four-post section: it is the one machine-readable
// surface that feed readers, aggregators (Feedly, Inoreader), newsletter tools
// and several AI crawlers all consume without a bespoke integration. It is also
// how a post gets picked up and syndicated by someone else, which is the link
// that actually moves rankings.

export const dynamic = "force-static"

// XML has exactly five predefined entities. Escaping is not optional here:
// several post titles contain "$0" and apostrophes, and one description
// contains an ampersand.
function xml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export function GET(): Response {
  const feedUrl = absoluteUrl("/writing/rss.xml")
  const indexUrl = absoluteUrl("/writing")

  // Newest first, which is what every reader expects regardless of the order
  // the index page chooses to present.
  const posts = [...POSTS].sort(
    (a, b) => postLastModified(b).getTime() - postLastModified(a).getTime()
  )
  const updated = posts.length ? postLastModified(posts[0]) : new Date()

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/writing/${post.slug}`)
      return `    <item>
      <title>${xml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${postLastModified(post).toUTCString()}</pubDate>
      <description>${xml(post.standfirst)}</description>
      <dc:creator>${xml(AUTHOR.name)}</dc:creator>
${post.topics.map((t) => `      <category>${xml(t)}</category>`).join("\n")}
    </item>`
    })
    .join("\n")

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Writing · ${xml(AUTHOR.name)}</title>
    <link>${indexUrl}</link>
    <description>Notes on building an AI engineering portfolio that survives an interview: project selection, evaluation, free-tier infrastructure, and private-repo credibility.</description>
    <language>en-us</language>
    <lastBuildDate>${updated.toUTCString()}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      // Prerendered and immutable per deploy, but readers poll frequently, so
      // give the CDN a short window and let it serve stale while revalidating.
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
