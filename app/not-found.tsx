import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sf-mono flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/50 mb-3">
          404
        </p>
        <h1 className="text-lg font-medium mb-2">This page does not exist.</h1>
        <p className="text-sm text-foreground/70 mb-6">
          Nothing here. Probably never was.
        </p>
        <Link
          href="/"
          className="text-sm underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground"
        >
          back home
        </Link>
      </div>
    </main>
  )
}
