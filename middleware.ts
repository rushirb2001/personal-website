import { NextResponse, type NextRequest } from "next/server"
import { GUMROAD_CORE, SAUCE_INDIA } from "@/app/playbook/links"

export function middleware(req: NextRequest) {
  const country = req.headers.get("x-vercel-ip-country")
  const india = country === "IN"

  // /playbook: serve the India price rail without making the route dynamic.
  // Middleware runs before the edge cache on Vercel, so this rewrite still
  // resolves to a prerendered document; the page stays statically cached and
  // the visitor's URL stays /playbook. Reading geo inside the page instead
  // opted the route out of prerendering entirely (~1s TTFB, no-store).
  if (req.nextUrl.pathname === "/playbook") {
    return india
      ? NextResponse.rewrite(new URL("/playbook/in", req.url))
      : NextResponse.next()
  }

  // /buy: send the visitor to a checkout they can actually complete. Sauce
  // (UPI, priced in INR) for India, Gumroad for everyone else.
  const res = NextResponse.redirect(india ? SAUCE_INDIA : GUMROAD_CORE, 307)
  // The destination varies by request geo, so this hop must never be cached: a
  // cached copy would pin every later visitor to whichever rail was resolved
  // first. 307 rather than 301 for the same reason (browsers cache 301 forever).
  res.headers.set("Cache-Control", "no-store")
  return res
}

// Must stay a literal — Next parses this config statically at build time.
export const config = { matcher: ["/buy", "/playbook"] }
