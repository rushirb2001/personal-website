import type { Metadata } from "next"
import { AUTHOR, SITE_URL, absoluteUrl } from "../site"
import { faqs } from "./PlaybookPage"
import type { Pricing } from "./links"

// Shared by both pricing variants so the two routes can never drift apart on
// anything a crawler reads.

// The old title was 66 characters including a hand-appended name and got cut in
// results. The root layout's template appends the name now, so this only has to
// carry the phrase people actually search, front-loaded.
export const PLAYBOOK_TITLE = "AI-Engineer Portfolio Playbook: 16 Projects That Get You Hired"

// The old description ran past 300 characters against a ~155 display budget, so
// everything after "on $0 of compute" was never seen by anyone.
export const PLAYBOOK_DESCRIPTION =
  "Go from a blank GitHub to an interview-ready AI engineering portfolio in six months, on $0 of compute. 16 project specs with week-by-week build plans."

export const PLAYBOOK_URL = absoluteUrl("/playbook")

export function playbookMetadata(): Metadata {
  return {
    title: PLAYBOOK_TITLE,
    description: PLAYBOOK_DESCRIPTION,
    // Both variants point here. /playbook/in is a rendering of the same offer
    // for a different rail, not a separate page.
    alternates: { canonical: "/playbook" },
    openGraph: {
      type: "website",
      url: PLAYBOOK_URL,
      title: PLAYBOOK_TITLE,
      description: PLAYBOOK_DESCRIPTION,
    },
    twitter: {
      card: "summary_large_image",
      title: PLAYBOOK_TITLE,
      description: PLAYBOOK_DESCRIPTION,
    },
  }
}

// Product markup is only eligible while the marked-up price equals the price on
// the page, so both are derived from the one Pricing record the page renders
// rather than restated here. `now` is a display string ("$45", "₹4999"); strip
// it to digits for schema and take the currency from the rail flag.
function offerPrice(p: Pricing) {
  return { price: p.now.replace(/[^\d.]/g, ""), currency: p.usd ? "USD" : "INR" }
}

export function playbookJsonLd(pricing: Pricing) {
  const { price, currency } = offerPrice(pricing)
  // The Offer's seller points at the Person node declared in full on the home
  // page. A cross-page @id reference is legitimate and Google often resolves it
  // site-wide, but nothing on THIS page defines the node, so a validator reading
  // /playbook on its own falls back to a bare Thing (confirmed in the Rich
  // Results Test: seller came out as `type: Thing`). Restating a minimal Person
  // under the same @id makes the reference resolve in-document while still
  // folding into the one entity everywhere else.
  const seller = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: AUTHOR.name,
    url: SITE_URL,
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "The Playbook", item: PLAYBOOK_URL },
    ],
  }

  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${PLAYBOOK_URL}#product`,
    name: "Zero to Hired: The AI-Engineer Portfolio Playbook",
    description:
      "A 52-page playbook and companion zip: 16 production-grade project specs chosen by target role, each with a week-by-week build plan, the interview questions it prepares you for, and the resume bullets it produces. Plus a pick-your-track guide, a free-tier stack guide, and git, DevOps and LinkedIn playbooks.",
    url: PLAYBOOK_URL,
    image: absoluteUrl("/playbook/opengraph-image"),
    brand: { "@type": "Brand", name: "Zero to Hired" },
    category: "Educational digital product",
    // NOTE: deliberately no aggregateRating or review. Google treats invented
    // review markup as a policy violation, and there are no published reviews
    // on the page to describe. Add both together, or neither.
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      url: PLAYBOOK_URL,
      seller: { "@id": `${SITE_URL}/#person` },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        applicableCountry: currency === "INR" ? "IN" : "US",
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
  }

  // FAQ rich results were deprecated in May 2026, so this is not a SERP-feature
  // play. It stays because the markup is still valid, still parsed for page
  // understanding, and is generated from the visible Q&A at zero maintenance
  // cost.
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${PLAYBOOK_URL}#faq`,
    mainEntity: faqs(pricing).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }

  return [seller, breadcrumb, product, faqPage]
}
