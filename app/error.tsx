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
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="border border-destructive/30 bg-destructive/5 rounded-sm p-8 max-w-md w-full">
        <p className="text-xs tracking-[0.3em] uppercase text-destructive mb-4 font-mono">
          System Error Detected
        </p>
        <h2 className="text-lg font-medium text-foreground mb-2">
          An unexpected error has occurred.
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Your outie has been notified. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 text-xs tracking-[0.2em] uppercase border border-primary/30 hover:border-primary/60 bg-background text-foreground transition-colors rounded-sm"
        >
          Retry Refinement
        </button>
      </div>
    </div>
  )
}
