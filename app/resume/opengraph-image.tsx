import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "../og"

export const alt = "Resume of Rushir Bhavsar"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

// Co-located because this route sets its own `openGraph` in metadata, which
// replaces the parent's block (images included).
export default function Image() {
  return ogCard({
    eyebrow: "Resume",
    title: "Rushir Bhavsar",
    subtitle: "Founding software engineer at sushrutalgs.ai. AI systems, APIs and ML pipelines, shipped end to end.",
  })
}
