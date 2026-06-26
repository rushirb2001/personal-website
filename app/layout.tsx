import type { Metadata, Viewport } from "next"
import ReactDOM from "react-dom"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: "Rushir Bhavsar · Product & RAG",
  description:
    "Building sushrutalgs.ai — medical AI for India. Previously ASU and Cadence. Open to Product Management and RAG roles.",
}

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  // Self-hosted fonts (see @font-face in globals.css). Preload only the
  // above-the-fold latin roman files so first paint isn't render-blocked.
  // ReactDOM.preload dedupes correctly; a manual <link> in <head> gets
  // double-emitted by React 19's resource hoisting.
  ReactDOM.preload("/fonts/google-sans-latin.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  })
  ReactDOM.preload("/fonts/google-sans-code-latin.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  })

  return (
    <html lang="en">
      <body>
        {children}
        {modal}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
