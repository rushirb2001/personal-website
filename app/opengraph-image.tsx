import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "./og"

export const alt = "Rushir Bhavsar, ML engineer and AI researcher"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

// The site-wide default. Any route that does not define its own opengraph-image
// inherits this one, which is why /writing and /projects do not need theirs.
export default function Image() {
  return ogCard({
    eyebrow: "Portfolio",
    title: "Rushir Bhavsar",
    subtitle: "ML engineer and AI researcher. Research, case studies, and the work behind sushrutalgs.ai.",
  })
}
