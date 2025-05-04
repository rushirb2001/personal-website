"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { getResponsiveSizes } from "@/lib/image-utils"

interface ResponsiveHeroProps {
  src: string
  alt: string
  className?: string
  overlayClassName?: string
  children?: React.ReactNode
  priority?: boolean
  importance?: "high" | "medium" | "low"
}

export function ResponsiveHero({
  src,
  alt,
  className,
  overlayClassName,
  children,
  priority = true,
  importance = "high",
}: ResponsiveHeroProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  // Get responsive sizes based on importance
  const sizes = getResponsiveSizes(importance)

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      {/* Hero image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={90}
          className={cn("object-cover transition-opacity duration-700", isLoaded ? "opacity-100" : "opacity-0")}
          onLoad={() => setIsLoaded(true)}
        />

        {/* Loading state */}
        {!isLoaded && <div className="absolute inset-0 bg-secondary/20 dark:bg-eerie-darkgray/20 animate-pulse" />}
      </div>

      {/* Content overlay */}
      <div className={cn("relative z-10", overlayClassName)}>{children}</div>
    </div>
  )
}
