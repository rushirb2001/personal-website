import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="border border-primary/20 bg-card rounded-sm p-8 max-w-md w-full">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4 font-mono">
          Record Not Found
        </p>
        <h2 className="text-lg font-medium text-foreground mb-2">
          404 — This file does not exist.
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          The requested record could not be located in the system.
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-2 text-xs tracking-[0.2em] uppercase border border-primary/30 hover:border-primary/60 bg-background text-foreground transition-colors rounded-sm"
        >
          Return to Lobby
        </Link>
      </div>
    </div>
  )
}
