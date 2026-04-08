import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, JetBrains_Mono, Pixelify_Sans, Source_Code_Pro } from "next/font/google"
import "./globals.css"

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

const pixelFont = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
})

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code",
  display: "swap",
})

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: "Rushir Bhavsar — ML Engineer",
  description:
    "ML engineer working at the intersection of research and production systems. Distributed pipelines, custom CUDA, physics-informed models.",
  icons: {
    icon: "https://v9fl0vq2qbxv8yrh.public.blob.vercel-storage.com/favicon-iZp2vAIsQyqsrMC97HCq9KOcfFFtgt.ico",
    apple:
      "https://v9fl0vq2qbxv8yrh.public.blob.vercel-storage.com/apple-touch-icon-i2OMEl4KJIHzWPGval5Fmnx2KxDqhQ.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistMono.variable} ${pixelFont.variable} ${geistSans.variable} ${jetbrainsMono.variable} ${sourceCodePro.variable}`}>
      <body>{children}</body>
    </html>
  )
}
