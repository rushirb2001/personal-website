"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen bg-background text-foreground font-sf-mono flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/50 mb-3">
          Error
        </p>
        <h1 className="text-lg font-medium mb-2">Something broke.</h1>
        <p className="text-sm text-foreground/70 mb-6">
          Sorry about that. Try refreshing — if it keeps happening, email me at{" "}
          <a
            href="mailto:bhavsarrushir@gmail.com"
            className="underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground"
          >
            bhavsarrushir@gmail.com
          </a>
          .
        </p>
        <button
          onClick={reset}
          className="text-sm underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground"
        >
          try again
        </button>
      </div>
    </main>
  )
}
