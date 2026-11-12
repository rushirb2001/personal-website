import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "../og"

export const alt = "Case studies by Rushir Bhavsar"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

// Co-located because this route sets its own `openGraph` in metadata, which
// replaces the parent's block (images included).
export default function Image() {
  return ogCard({
    eyebrow: "Projects",
    title: "Systems I designed, built and shipped",
    subtitle: "A production RAG backend, an edge API gateway, web and iOS clients, a data pipeline, and ML research.",
  })
}
