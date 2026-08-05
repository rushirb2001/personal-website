import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "../og"

export const alt = "Writing by Rushir Bhavsar"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

// Declared here rather than inherited from the root card: this route sets its
// own `openGraph` in metadata, which replaces the parent's block (images
// included), so without a co-located file the index would ship no og:image.
export default function Image() {
  return ogCard({
    eyebrow: "Writing",
    title: "Notes on building a portfolio that survives the interview",
    subtitle: "Project selection, evaluation, free-tier infrastructure, and private-repo credibility.",
  })
}
