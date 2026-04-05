import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | Rushir Bhavsar",
  description:
    "Learn about Rushir Bhavsar — data scientist and AI engineer based in Arizona.",
  openGraph: {
    title: "About | Rushir Bhavsar",
    description:
      "Learn about Rushir Bhavsar — data scientist and AI engineer based in Arizona.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
