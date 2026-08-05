import { OG_CONTENT_TYPE, OG_SIZE, clip, ogCard } from "../../og"
import { getProjectDetail, PROJECT_DETAIL_SLUGS } from "../projects-data"

export const alt = "Project case study by Rushir Bhavsar"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export function generateStaticParams() {
  return PROJECT_DETAIL_SLUGS.map((slug) => ({ slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const detail = getProjectDetail(slug)

  return ogCard({
    eyebrow: "Case study",
    // The display `title` where there is one, since the card has room for it.
    title: clip(detail?.title ?? detail?.name ?? "Project", 78),
    subtitle: clip(detail?.seoDescription ?? detail?.tagline ?? "", 130),
  })
}
