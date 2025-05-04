"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  sizes?: string
  quality?: number
  fill?: boolean
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
  blurDataURL?: string
  placeholder?: "blur" | "empty"
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  quality = 85,
  fill = false,
  objectFit = "cover",
  blurDataURL,
  placeholder,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [error, setError] = useState(false)

  // Generate a simple blur data URL if not provided
  const defaultBlurDataURL =
    blurDataURL ||
    `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Cfilter id='b' colorInterpolationFilters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' x='0' y='0' fill='%23f0f0f0' filter='url(%23b)'/%3E%3C/svg%3E`

  useEffect(() => {
    // Use Intersection Observer to detect when image is in viewport
    if (!priority && typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true)
              observer.disconnect()
            }
          })
        },
        { rootMargin: "200px" }, // Load images when they're within 200px of viewport
      )

      const element = document.getElementById(`image-${src.replace(/\W/g, "")}`)
      if (element) {
        observer.observe(element)
      }

      return () => {
        observer.disconnect()
      }
    } else {
      // If priority is true or IntersectionObserver not supported, load immediately
      setIsInView(true)
    }
  }, [src, priority])

  // Handle window resize for responsive images
  useEffect(() => {
    const handleResize = () => {
      // Force re-render on significant size changes
      if (
        window.innerWidth < 640 ||
        (window.innerWidth >= 640 && window.innerWidth < 1024) ||
        window.innerWidth >= 1024
      ) {
        setIsLoaded(false)
        setTimeout(() => setIsLoaded(true), 10)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      id={`image-${src.replace(/\W/g, "")}`}
      className={cn("relative overflow-hidden", fill ? "w-full h-full" : "", className)}
      style={!fill ? { width, height } : undefined}
    >
      {/* Show placeholder until image is loaded */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-secondary/20 dark:bg-eerie-darkgray/20 animate-pulse"
          style={!fill ? { width, height } : undefined}
        />
      )}

      {/* Fallback for image load errors */}
      {error && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-secondary/10 dark:bg-eerie-darkgray/10 text-sm text-muted-foreground"
          style={!fill ? { width, height } : undefined}
        >
          Image not available
        </div>
      )}

      {/* Only render the image when it's in view or has priority */}
      {(isInView || priority) && !error && (
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            fill ? "object-cover" : "",
          )}
          style={fill ? { objectFit } : undefined}
          sizes={sizes}
          quality={quality}
          fill={fill}
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          placeholder={placeholder || "empty"}
          blurDataURL={placeholder === "blur" ? defaultBlurDataURL : undefined}
        />
      )}
    </div>
  )
}
