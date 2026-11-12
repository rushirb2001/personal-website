import type { MetadataRoute } from "next"
import { PROJECT_DETAIL_SLUGS } from "./projects/projects-data"
import { HOME_SECTIONS, SITE_URL } from "./site"
import { POSTS, postLastModified } from "./writing/posts-data"

// Only canonical, indexable URLs belong here: the home page, a path per
// section of it (/projects is the home page with Projects open), and the long
// reads the rows link to.
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
    // One path per home section: the same page with that section open.
    ...HOME_SECTIONS.map((s) => ({
      url: `${SITE_URL}/${s.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...PROJECT_DETAIL_SLUGS.map((slug) => ({
      url: `${SITE_URL}/projects/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...POSTS.map((post) => ({
      url: `${SITE_URL}/writing/${post.slug}`,
      lastModified: postLastModified(post),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]
}
