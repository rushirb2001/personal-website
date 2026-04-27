import type { Metadata, Viewport } from "next"
import "./globals.css"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: "Rushir Bhavsar — ML Engineer",
  description:
    "ML engineer working at the intersection of research and production systems. Distributed pipelines, custom CUDA, physics-informed models.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=Google+Sans+Code:ital,wght,MONO@0,300..800,1;1,300..800,1&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
