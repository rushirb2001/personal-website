import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "../../og"
import { PLAYBOOK_DESCRIPTION } from "../seo"

export const alt = "Zero to Hired: the AI-engineer portfolio playbook"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

// The India variant is noindex, but it is still what a social crawler resolving
// a shared /playbook link from an Indian IP receives, and the parent card does
// not carry down (this route sets its own `openGraph`). Same card, so a shared
// link looks identical on both rails.
export default function Image() {
  return ogCard({
    eyebrow: "The Playbook",
    title: "Zero to Hired",
    subtitle: PLAYBOOK_DESCRIPTION,
  })
}
