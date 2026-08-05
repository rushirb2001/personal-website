import type { ComponentType } from "react"

import PortfolioProjects, { meta as portfolioProjects } from "./posts/ai-engineer-portfolio-projects"
import PrivateRepo, { meta as privateRepo } from "./posts/private-repo-credible-to-recruiters"
import FreeTierStack, { meta as freeTierStack } from "./posts/ml-portfolio-free-tier-stack"
import RagEval, { meta as ragEval } from "./posts/rag-eval-harness-interview"

// Posts are plain server components, not MDX. That is deliberate and matches
// the rest of this repo: no remark/rehype pipeline, no new dependencies, the
// existing design tokens used directly, and TypeScript checking the body of
// every post the same way it checks everything else. The cost is that a post is
// JSX rather than markdown; the benefit is that a post can drop a real diagram
// or table inline without a plugin.
//
// To add a post: create app/writing/posts/<slug>.tsx exporting `meta` and a
// default component, then add it to POSTS below. The sitemap, the index page
// and the JSON-LD all read from here, so there is nothing else to update.
export type PostMeta = {
  slug: string
  /** H1 and the base of the <title>. Front-load the phrase people search. */
  title: string
  /** Meta description. Keep to ~155 chars; past that Google truncates it. */
  description: string
  /** Deck under the H1 on the post itself. Longer and less clipped than the
   *  description, because nothing truncates it. */
  standfirst: string
  /** ISO date. Feeds datePublished and the sitemap's lastModified. */
  published: string
  /** ISO date, set only when a post is materially revised. */
  updated?: string
  readingTime: string
  topics: string[]
}

export type Post = PostMeta & { Body: ComponentType }

const ORDERED: Post[] = [
  { ...portfolioProjects, Body: PortfolioProjects },
  { ...ragEval, Body: RagEval },
  { ...privateRepo, Body: PrivateRepo },
  { ...freeTierStack, Body: FreeTierStack },
]

export const POSTS: Post[] = ORDERED
export const POST_SLUGS: string[] = ORDERED.map((p) => p.slug)

export function getPost(slug: string): Post | undefined {
  return ORDERED.find((p) => p.slug === slug)
}

export function hasPost(slug: string): boolean {
  return ORDERED.some((p) => p.slug === slug)
}

/** Newest of published/updated, for the sitemap. */
export function postLastModified(post: PostMeta): Date {
  return new Date(post.updated ?? post.published)
}
