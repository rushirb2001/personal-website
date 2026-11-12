import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "../og"

export const alt = "Work with Rushir Bhavsar"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

// Co-located because this route sets its own `openGraph` in metadata, which
// replaces the parent's block (images included).
export default function Image() {
  return ogCard({
    eyebrow: "Hire me",
    title: "Work with me",
    subtitle: "AI engineer for full-time roles and contract builds: RAG, LLM systems, API gateways, ML pipelines.",
  })
}
