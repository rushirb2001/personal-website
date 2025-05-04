import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"

export const metadata: Metadata = {
  title: "Rushir Bhavsar | Portfolio",
  description: "Personal portfolio website of Rushir Bhavsar, a data scientist and AI engineer.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  other: {
    appleWebAppCapable: "yes",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}
