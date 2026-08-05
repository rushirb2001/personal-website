import type { Metadata } from "next"
import { JsonLd } from "../JsonLd"
import { PlaybookPage } from "./PlaybookPage"
import { PRICING_USD } from "./links"
import { playbookJsonLd, playbookMetadata } from "./seo"

// The canonical, indexed playbook. Static: no headers(), no cookies(), so it
// prerenders at build and is served from the edge cache. Googlebot crawls from
// the US and lands here, which is the URL in the sitemap and the target of
// every canonical on the route.
export const metadata: Metadata = playbookMetadata()

export default function Page() {
  return (
    <>
      <JsonLd data={playbookJsonLd(PRICING_USD)} />
      <PlaybookPage pricing={PRICING_USD} />
    </>
  )
}
