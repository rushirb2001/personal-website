import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Education | Rushir Bhavsar",
  description:
    "Academic background and education of Rushir Bhavsar.",
  openGraph: {
    title: "Education | Rushir Bhavsar",
    description:
      "Academic background and education of Rushir Bhavsar.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
