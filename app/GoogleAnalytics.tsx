import Script from "next/script"
import { GA_MEASUREMENT_ID } from "./site"

// GA4 (gtag.js).
//
// Google's snippet says to paste this "immediately after the <head> element".
// That instruction is written for hand-authored HTML; in the App Router the
// equivalent is next/script, and a literal <head> paste would put a synchronous
// third-party request in front of first paint on a site that self-hosts its
// fonts and prerenders every route precisely to keep that slot empty.
//
// lazyOnload rather than the more usual afterInteractive, chosen on mechanism:
// it defers gtag to browser idle after the load event and emits no
// <link rel="preload" as="script">, so by construction it cannot compete with
// the font preloads this page's LCP text waits on. afterInteractive does emit
// that preload, at High priority.
//
// What was actually measured (local prod build, a static route):
//   - TBT rises from ~25ms to ~90ms once gtag is on the page, on either
//     strategy. That is real and mechanistic (gtag.js is ~90KB to parse and
//     run) and still well inside Google's "good" band of <200ms.
//   - FCP is unchanged at 0.9s in every configuration.
//   - Lighthouse LCP could NOT separate the two strategies: numbers drifted
//     monotonically upward across the session (3.8s baseline to 6.5s) for
//     changes that could not have caused it, so the machine, not the code, was
//     moving them. Do not trust a single local LCP run to justify a change
//     here; check the deployed Speed Insights instead.
//   - On an unthrottled load the fonts finish at ~60ms and gtag does not start
//     until ~136ms, so the two never actually contend on a fast connection.
//     The preload only matters on a slow one, which is exactly where LCP hurts.
//
// The cost of lazyOnload is that a visitor who bounces almost immediately may
// go uncounted. For a page whose job is to sell something, that tail is worth
// less than protecting paint on a slow phone.
export function GoogleAnalytics() {
  // Local dev would otherwise file every hot reload as a pageview. NODE_ENV,
  // not VERCEL_ENV, so preview deploys still report and the tag can be
  // verified before it reaches production. Tighten to
  // process.env.VERCEL_ENV === "production" if preview traffic becomes noise.
  if (process.env.NODE_ENV !== "production" || !GA_MEASUREMENT_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      {/* Client-side route changes are covered by GA4's enhanced measurement,
          which listens for History API pushes; the App Router's soft
          navigations (notably the /projects/[slug] modal) go through exactly
          that, so no manual page_view call is needed. */}
      {/* lead_click: the one conversion this site has. Pageviews say someone
          arrived; they do not say whether anyone emailed, opened the resume
          or went to LinkedIn. Any element carrying data-lead="<type>" reports
          a lead_click event with that type and the page it happened on, from
          one delegated listener, so no component needs client JS to be
          measured. Mark lead_click as a key event in GA4 to see it in
          reports. */}
      <Script id="ga4-init" strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');
document.addEventListener('click', function (e) {
  var el = e.target && e.target.closest ? e.target.closest('[data-lead]') : null;
  if (!el) return;
  gtag('event', 'lead_click', {
    lead_type: el.getAttribute('data-lead'),
    page_path: location.pathname
  });
}, { capture: true, passive: true });`}
      </Script>
    </>
  )
}
