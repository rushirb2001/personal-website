import type { MetadataRoute } from "next"
import { PROJECT_DETAIL_SLUGS } from "./projects/projects-data"
import { SITE_URL } from "./site"
import { POSTS, postLastModified } from "./writing/posts-data"

// Only canonical, indexable URLs belong here.
//
// lastModified is set only where there is a real date to report (posts carry
// one). It used to be the build time on every other URL, which told Google the
// whole site changed on every deploy; a lastmod that is always "now" is one
// Google learns to ignore, including on the pages where it is true.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // No trailing slash, so this matches the canonical the home page emits
    // exactly. Google normalizes the two, but a sitemap that disagrees with a
    // canonical is a needless "alternate page" report in Search Console.
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/projects`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/hire`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/resume`, changeFrequency: "monthly", priority: 0.9 },
    ...PROJECT_DETAIL_SLUGS.map((slug) => ({
      url: `${SITE_URL}/projects/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/writing`, changeFrequency: "weekly", priority: 0.7 },
    ...POSTS.map((post) => ({
      url: `${SITE_URL}/writing/${post.slug}`,
      lastModified: postLastModified(post),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]
}
