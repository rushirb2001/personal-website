import type { Metadata } from "next"
import { JsonLd } from "../../JsonLd"
import { PlaybookPage } from "../PlaybookPage"
import { PRICING_INR } from "../links"
import { playbookJsonLd, playbookMetadata } from "../seo"

// The India rail, prerendered. Visitors never type this URL: middleware.ts
// rewrites /playbook to it when the request geo is IN, so the address bar still
// reads /playbook. It exists as a real route only so the rupee price can be
// baked into a cacheable document instead of forcing the main route dynamic.
//
// noindex because it is the same offer as /playbook in a second currency, and
// two indexed copies of one sales page compete with each other. `follow` stays
// on so the links out of it still pass through. It is deliberately NOT
// disallowed in robots.txt: a blocked URL is never fetched, so neither the
// noindex nor the canonical below would ever be read.
export const metadata: Metadata = {
  ...playbookMetadata(),
  robots: { index: false, follow: true },
}

export default function Page() {
  return (
    <>
      <JsonLd data={playbookJsonLd(PRICING_INR)} />
      <PlaybookPage pricing={PRICING_INR} />
    </>
  )
}
