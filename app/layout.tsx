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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/favicon.png",
        color: "#00ff00",
      },
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
  other: {
    appleWebAppCapable: "yes",
    themeColor: "#000000",
    msapplicationTileColor: "#000000",
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
