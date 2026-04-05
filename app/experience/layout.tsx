import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Experience | Rushir Bhavsar",
  description:
    "Professional experience and career history of Rushir Bhavsar.",
  openGraph: {
    title: "Experience | Rushir Bhavsar",
    description:
      "Professional experience and career history of Rushir Bhavsar.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
