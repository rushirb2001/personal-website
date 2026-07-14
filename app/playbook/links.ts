// Gumroad product permalinks (no ?wanted=true, so the overlay opens the product
// page rather than dropping straight into checkout). Shared by the page's Buy
// buttons and the sticky-header CTAs. Core routes through the pre-applied
// launch-price link so the overlay shows $10 the instant it loads, matching
// what this page advertises, instead of surfacing Gumroad's $15 list price.
export const GUMROAD_CORE = "https://rushirbhavsar.gumroad.com/l/playbook/LAUNCH"
export const GUMROAD_LITE = "https://rushirbhavsar.gumroad.com/l/playbook-lite"

// India's rail. Sauce prices in INR and takes UPI; Indian debit cards have
// international transactions disabled by default under RBI rules, so a Gumroad
// checkout is a dead end for most of the audience the LinkedIn posts reach.
export const SAUCE_INDIA =
  "https://www.getsauce.in/rushirbhavsar/zero-to-hired-the-ai-engineer-portfolio-playbook"

// Core CTAs point here rather than straight at Gumroad: middleware.ts resolves it
// per-request from the visitor's geo. A real path, so it survives JS being off.
export const BUY_PATH = "/buy"

// Price copy per rail, resolved from request geo in page.tsx. India sees INR
// because a rupee figure reads as an ordinary Indian price while "$10" reads as a
// foreign one, and it has to be visible *before* the click or the India rail never
// gets a chance to work.
//
// `list` is the real pre-discount price and renders as a strikethrough anchor, so
// it is only set where a discount actually exists: the USD LAUNCH code genuinely
// makes $10 out of $15. Sauce carries no discount, so INR omits it rather than
// inventing an anchor to strike through. Keep these strings matched to the live
// storefronts — nothing here reads the real price at runtime.
export type Pricing = { list?: string; now: string; usd: boolean }
export const PRICING_USD: Pricing = { list: "$15", now: "$10", usd: true }
export const PRICING_INR: Pricing = { now: "₹1650", usd: false }
