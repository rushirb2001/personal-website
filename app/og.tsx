import { ImageResponse } from "next/og"

// Shared 1200x630 link card. One design for every route, so a link to a post,
// a case study and the playbook all read as the same site in a feed.
//
// Typeface note: this renders through Satori, which cannot read WOFF2, and
// every face in public/fonts is WOFF2. Rather than commit a second copy of the
// font in another format or fetch one over the network at build time (a build
// that fails when the CDN hiccups), the card uses next/og's bundled default and
// carries the site's identity through palette, rule and rhythm instead.
export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = "image/png"

const PAPER = "#f4f1ec"
const INK = "#1a1a1a"
const ACCENT = "#1f3a5f"
const MUTED = "rgba(26,26,26,0.62)"

export function ogCard({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle?: string
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: PAPER,
          color: INK,
          padding: "72px 80px",
        }}
      >
        {/* The accent hairline that opens every section on the site. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", width: 120, height: 3, backgroundColor: ACCENT }} />
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: ACCENT,
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 60 ? 60 : 72,
              lineHeight: 1.1,
              letterSpacing: -1.5,
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                display: "flex",
                marginTop: 26,
                fontSize: 28,
                lineHeight: 1.4,
                color: MUTED,
                maxWidth: 900,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid rgba(26,26,26,0.18)`,
            paddingTop: 24,
            fontSize: 22,
            color: MUTED,
          }}
        >
          <div style={{ display: "flex" }}>Rushir Bhavsar</div>
          <div style={{ display: "flex", color: ACCENT }}>rushirbhavsar.dev</div>
        </div>
      </div>
    ),
    OG_SIZE
  )
}

// Satori truncates nothing on its own, so long strings have to be clipped
// before they are laid out or they overflow the card silently.
export function clip(text: string, max: number) {
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`
}
