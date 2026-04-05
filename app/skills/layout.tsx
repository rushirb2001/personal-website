import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Skills | Rushir Bhavsar",
  description:
    "Technical skills and expertise of Rushir Bhavsar in data science, AI, and software engineering.",
  openGraph: {
    title: "Skills | Rushir Bhavsar",
    description:
      "Technical skills and expertise of Rushir Bhavsar in data science, AI, and software engineering.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
