import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Publications | Rushir Bhavsar",
  description:
    "Research publications and academic papers by Rushir Bhavsar.",
  openGraph: {
    title: "Publications | Rushir Bhavsar",
    description:
      "Research publications and academic papers by Rushir Bhavsar.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
