import type { ReactNode } from "react"

interface PageLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function PageLayout({ title, subtitle, children }: PageLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-[1fr_2fr] gap-3 sm:gap-4 md:gap-6 lg:gap-8 py-3 sm:py-4 md:py-6 lg:py-8 px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="md:sticky md:top-20 lg:top-24 self-start flex flex-col justify-center md:h-auto lg:h-[calc(100vh-12rem)] md:mb-4 lg:mb-0">
        <h1 className="relative pb-2 text-lg sm:text-xl md:text-xl uppercase before:content-[''] before:absolute before:top-0 before:left-0 before:w-20 sm:before:w-24 md:before:w-28 lg:before:w-32 before:h-0.5 before:bg-primary/70 font-black lg:text-6xl tracking-widest">
          {title}
        </h1>
        <p className="sm:text-xs md:text-xs text-primary/70 font-sf-mono font-extrabold px-0 lg:text-sm tracking-tighter">
          {subtitle}
        </p>
      </div>
      <div className="w-full min-w-0 max-w-full flex flex-col justify-center overflow-hidden">
        <div className="break-words overflow-hidden pt-2 sm:pt-3 md:pt-4 lg:pt-8 px-0 sm:px-2 md:px-4 lg:px-0">
          {children}
        </div>
      </div>
    </div>
  )
}
