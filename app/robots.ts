import type { MetadataRoute } from "next"
import { SITE_URL } from "./site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // Nothing is disallowed. The retired /playbook, /playbook/in and /buy URLs
      // 308 to the home page (next.config.mjs); a disallowed URL can never be
      // fetched, so crawlers would never see the redirect and the old URLs
      // would linger in the index.
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    // NOTE: the RSS feed at /writing/rss.xml is discovered via the
    // <link rel="alternate"> in the /writing pages' head, not from here;
    // robots.txt has no directive for feeds.
    host: SITE_URL,
  }
}
