import type { ReactNode } from "react"

interface PageLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function PageLayout({ title, subtitle, children }: PageLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-8 py-4 md:py-8 px-3 md:px-8 max-w-7xl mx-auto">
      <div className="md:sticky md:top-24 self-start flex flex-col justify-center md:h-[calc(100vh-12rem)]">
        <h1 className="relative pb-2 text-xl md:text-2xl font-medium tracking-tight before:content-[''] before:absolute before:top-0 before:left-0 before:w-24 md:before:w-32 before:h-0.5 before:bg-primary/70">
          {title}
        </h1>
        <p className="text-xs md:text-sm text-primary/70 font-sf-mono tracking-wide">{subtitle}</p>
      </div>
      <div className="w-full max-w-full flex flex-col justify-center">
        <div className="break-words overflow-hidden pt-2 md:pt-8 mobile-content-container">{children}</div>
      </div>
    </div>
  )
}
