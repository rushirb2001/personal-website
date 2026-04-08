"use client"

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily:
            'ui-monospace, "SF Mono", Menlo, Monaco, "Cascadia Mono", monospace',
          background: "#f7f7f7",
          color: "#1f1f1f",
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "28rem" }}>
          <p
            style={{
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              opacity: 0.5,
              margin: "0 0 0.75rem",
            }}
          >
            Critical error
          </p>
          <h1
            style={{
              fontSize: "1.125rem",
              fontWeight: 500,
              margin: "0 0 0.5rem",
            }}
          >
            Something broke at the root.
          </h1>
          <p style={{ fontSize: "0.875rem", opacity: 0.7, margin: "0 0 1.5rem" }}>
            Refresh the page. If it keeps happening, please email{" "}
            bhavsarrushir@gmail.com.
          </p>
          <button
            onClick={reset}
            style={{
              fontSize: "0.875rem",
              textDecoration: "underline",
              textUnderlineOffset: "4px",
              background: "none",
              border: "none",
              color: "inherit",
              fontFamily: "inherit",
              cursor: "pointer",
              padding: 0,
            }}
          >
            try again
          </button>
        </div>
      </body>
    </html>
  )
}
