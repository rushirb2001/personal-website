import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects | Rushir Bhavsar",
  description:
    "Portfolio of projects by Rushir Bhavsar spanning AI, data science, and web development.",
  openGraph: {
    title: "Projects | Rushir Bhavsar",
    description:
      "Portfolio of projects by Rushir Bhavsar spanning AI, data science, and web development.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
