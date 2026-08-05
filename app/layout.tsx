import type { Metadata, Viewport } from "next"
import ReactDOM from "react-dom"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GoogleAnalytics } from "./GoogleAnalytics"
import { AUTHOR, SITE_URL } from "./site"
import "./globals.css"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Matches the paper background, so the browser chrome does not flash a
  // default white or black band around the page on mobile.
  themeColor: "#f4f1ec",
}

export const metadata: Metadata = {
  // Without this, every relative URL in the metadata tree (og:image, canonical)
  // resolves against nothing and Next drops or mangles it. Everything else in
  // this file assumes it is set.
  metadataBase: new URL(SITE_URL),
  // `default` is the home page's own title; `template` wraps every child route
  // that exports a plain string title, so those routes no longer hand-append
  // the name themselves.
  title: {
    default: "Rushir Bhavsar · ML Engineer and AI Researcher",
    template: "%s · Rushir Bhavsar",
  },
  // Front-loads credentials, then the three technical areas someone would
  // actually type, then availability. Two deliberate changes from the first
  // pass: "FDE" is gone (an acronym nobody searches and that reads as noise in
  // a snippet), and the product pitch for sushrutalgs.ai gave way to the
  // techniques, because this page has to answer "what does he do" for a
  // recruiter, not sell the product. 151 chars, inside the ~155 Google shows.
  description:
    "ML engineer and researcher at ASU, previously Cadence. Physics-informed neural networks, RAG, and distributed ML pipelines. Open to AI and product roles.",
  applicationName: "Rushir Bhavsar",
  authors: [{ name: AUTHOR.name, url: SITE_URL }],
  creator: AUTHOR.name,
  // NOTE: `alternates` is inherited by child segments, so a canonical set here
  // would silently point every page at "/". Each route declares its own.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Without max-image-preview:large the generated OG card is not eligible
      // to render at full size in results or in Discover.
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Rushir Bhavsar",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  // Set GOOGLE_SITE_VERIFICATION in the Vercel project to verify Search Console
  // without editing code; unset, Next omits the tag entirely.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
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
        <GoogleAnalytics />
      </body>
    </html>
  )
}
