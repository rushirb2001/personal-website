import { OG_CONTENT_TYPE, OG_SIZE, clip, ogCard } from "../../og"
import { getPost, POST_SLUGS } from "../posts-data"

export const alt = "Writing by Rushir Bhavsar"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

// Without this the card is generated on demand at the edge instead of at build.
export function generateStaticParams() {
  return POST_SLUGS.map((slug) => ({ slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)

  return ogCard({
    eyebrow: "Writing",
    title: clip(post?.title ?? "Writing", 78),
    subtitle: clip(post?.description ?? "", 130),
  })
}
