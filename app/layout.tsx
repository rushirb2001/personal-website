import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next"
import ClientLayout from "./ClientLayout"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: "Rushir Bhavsar | Portfolio",
  description: "Personal portfolio website of Rushir Bhavsar, a data scientist and AI engineer.",
  icons: {
    icon: "https://v9fl0vq2qbxv8yrh.public.blob.vercel-storage.com/favicon-iZp2vAIsQyqsrMC97HCq9KOcfFFtgt.ico",
    shortcut: "https://v9fl0vq2qbxv8yrh.public.blob.vercel-storage.com/favicon-iZp2vAIsQyqsrMC97HCq9KOcfFFtgt.ico",
    apple:
      "https://v9fl0vq2qbxv8yrh.public.blob.vercel-storage.com/apple-touch-icon-i2OMEl4KJIHzWPGval5Fmnx2KxDqhQ.png",
  },
  other: {
    appleWebAppCapable: "yes",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.NodeNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}
