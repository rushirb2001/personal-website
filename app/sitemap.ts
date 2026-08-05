import type { MetadataRoute } from "next"
import { PROJECT_DETAIL_SLUGS } from "./projects/projects-data"
import { SITE_URL } from "./site"
import { POSTS, postLastModified } from "./writing/posts-data"

// Only canonical, indexable URLs belong here. Notably absent:
//   /buy           a geo-resolved redirect, no content
//   /playbook/in   the India price variant; noindex, canonical to /playbook
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    // No trailing slash, so this matches the canonical the home page emits
    // exactly. Google normalizes the two, but a sitemap that disagrees with a
    // canonical is a needless "alternate page" report in Search Console.
    { url: SITE_URL, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/playbook`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/writing`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...POSTS.map((post) => ({
      url: `${SITE_URL}/writing/${post.slug}`,
      lastModified: postLastModified(post),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...PROJECT_DETAIL_SLUGS.map((slug) => ({
      url: `${SITE_URL}/projects/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]
}
