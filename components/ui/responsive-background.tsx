"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { generateBlurPlaceholder } from "@/lib/image-utils"

interface ResponsiveBackgroundProps {
  src: string
  fallbackSrc?: string
  mobileSrc?: string
  className?: string
  children?: React.ReactNode
  priority?: boolean
  overlayClassName?: string
}

export function ResponsiveBackground({
  src,
  fallbackSrc,
  mobileSrc,
  className,
  children,
  priority = false,
  overlayClassName,
}: ResponsiveBackgroundProps) {
  const [currentSrc, setCurrentSrc] = useState<string>("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Generate placeholder
  const placeholderSrc = generateBlurPlaceholder(16, 9)

  useEffect(() => {
    // Check if mobile on mount and when window resizes
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    // Determine which image to load
    const imageToLoad = isMobile && mobileSrc ? mobileSrc : src

    if (priority) {
      setCurrentSrc(imageToLoad)

      const img = new Image()
      img.src = imageToLoad
      img.onload = () => setIsLoaded(true)
      img.onerror = () => {
        if (fallbackSrc) {
          setCurrentSrc(fallbackSrc)
          const fallbackImg = new Image()
          fallbackImg.src = fallbackSrc
          fallbackImg.onload = () => setIsLoaded(true)
        }
      }

      return () => {
        img.onload = null
        img.onerror = null
      }
    } else {
      // Use Intersection Observer for lazy loading
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setCurrentSrc(imageToLoad)

              const img = new Image()
              img.src = imageToLoad
              img.onload = () => setIsLoaded(true)
              img.onerror = () => {
                if (fallbackSrc) {
                  setCurrentSrc(fallbackSrc)
                  const fallbackImg = new Image()
                  fallbackImg.src = fallbackSrc
                  fallbackImg.onload = () => setIsLoaded(true)
                }
              }

              observer.disconnect()
            }
          })
        },
        { rootMargin: "200px" },
      )

      const element = document.getElementById(`bg-${src.replace(/\W/g, "")}`)
      if (element) {
        observer.observe(element)
      }

      return () => observer.disconnect()
    }
  }, [src, mobileSrc, fallbackSrc, priority, isMobile])

  return (
    <div
      id={`bg-${src.replace(/\W/g, "")}`}
      className={cn("relative overflow-hidden", className)}
      style={{
        backgroundImage: `url(${currentSrc || placeholderSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 0.5s ease-in-out",
      }}
    >
      {/* Overlay for content */}
      <div className={cn("relative z-10", overlayClassName)}>{children}</div>

      {/* Loading overlay */}
      {!isLoaded && <div className="absolute inset-0 bg-secondary/20 dark:bg-eerie-darkgray/20 animate-pulse" />}
    </div>
  )
}
