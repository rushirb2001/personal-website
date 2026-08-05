// One code path for structured data. Server-rendered into the HTML so crawlers
// (and the AI answer engines that reuse Google's index) see it without running
// any JavaScript.
//
// The payload is app-authored data, never user input, so the only escape that
// matters is the one that would let a "</script>" inside a string close the
// block early. JSON.stringify does not escape "<", so we do.
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}

// Google reads a breadcrumb trail from this, and it is what turns the raw URL
// under a result into "rushirbhavsar.dev › Projects › Samhita".
export function breadcrumbList(
  items: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
