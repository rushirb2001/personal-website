import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact | Rushir Bhavsar",
  description:
    "Get in touch with Rushir Bhavsar for collaboration or opportunities.",
  openGraph: {
    title: "Contact | Rushir Bhavsar",
    description:
      "Get in touch with Rushir Bhavsar for collaboration or opportunities.",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
