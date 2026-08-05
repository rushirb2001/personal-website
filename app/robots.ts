import type { MetadataRoute } from "next"
import { SITE_URL } from "./site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /buy is a geo-resolved 307 to an external storefront: no content, and
      // crawling it just burns budget on a hop. /playbook/in is the India price
      // variant, which middleware rewrites to; it carries noindex + a canonical
      // back to /playbook, so it stays crawlable (a disallowed URL can never be
      // read well enough to honour either signal).
      disallow: ["/buy"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    // NOTE: the RSS feed at /writing/rss.xml is discovered via the
    // <link rel="alternate"> in the /writing pages' head, not from here;
    // robots.txt has no directive for feeds.
    host: SITE_URL,
  }
}
