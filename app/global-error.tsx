"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans">
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <div className="border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/20 rounded-sm p-8 max-w-md w-full">
            <p className="text-xs tracking-[0.3em] uppercase text-red-600 dark:text-red-400 mb-4 font-mono">
              Critical System Failure
            </p>
            <h2 className="text-lg font-medium mb-2">
              Something went fundamentally wrong.
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              Please contact your department supervisor.
            </p>
            <button
              onClick={reset}
              className="px-4 py-2 text-xs tracking-[0.3em] uppercase border border-neutral-300 dark:border-neutral-700 hover:border-neutral-500 transition-colors rounded-sm"
            >
              Restart Session
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
