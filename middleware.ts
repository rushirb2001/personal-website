import { NextResponse, type NextRequest } from "next/server"
import { GUMROAD_CORE, SAUCE_INDIA } from "@/app/playbook/links"

// Sends /buy to a checkout the visitor can actually complete: Sauce (UPI, priced
// in INR) for India, Gumroad for everyone else.
export function middleware(req: NextRequest) {
  const country = req.headers.get("x-vercel-ip-country")
  const res = NextResponse.redirect(country === "IN" ? SAUCE_INDIA : GUMROAD_CORE, 307)
  // The destination varies by request geo, so this hop must never be cached: a
  // cached copy would pin every later visitor to whichever rail was resolved
  // first. 307 rather than 301 for the same reason (browsers cache 301 forever).
  res.headers.set("Cache-Control", "no-store")
  return res
}

// Must stay a literal — Next parses this config statically at build time.
export const config = { matcher: "/buy" }
