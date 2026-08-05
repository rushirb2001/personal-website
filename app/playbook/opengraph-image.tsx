import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "../og"
import { PLAYBOOK_DESCRIPTION } from "./seo"

export const alt = "Zero to Hired: the AI-engineer portfolio playbook"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return ogCard({
    eyebrow: "The Playbook",
    title: "Zero to Hired",
    subtitle: PLAYBOOK_DESCRIPTION,
  })
}
