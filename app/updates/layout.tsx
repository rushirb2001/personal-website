import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Updates | Rushir Bhavsar",
  description:
    "Latest updates, blog posts, and announcements from Rushir Bhavsar.",
  openGraph: {
    title: "Updates | Rushir Bhavsar",
    description:
      "Latest updates, blog posts, and announcements from Rushir Bhavsar.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
