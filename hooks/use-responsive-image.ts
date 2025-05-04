"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getOptimalImageQuality, isHighDpiDevice } from "@/lib/image-utils"

interface ResponsiveImageOptions {
  src: string
  width: number
  height: number
  quality?: number
  priority?: boolean
}

interface ResponsiveImageResult {
  src: string
  width: number
  height: number
  quality: number
  isHighDpi: boolean
  isLoaded: boolean
  isVisible: boolean
  containerRef: React.RefObject<HTMLDivElement>
}

export function useResponsiveImage({
  src,
  width,
  height,
  quality,
  priority = false,
}: ResponsiveImageOptions): ResponsiveImageResult {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(priority)
  const [containerRef] = useState(() => {
    if (typeof document !== "undefined") {
      return { current: document.createElement("div") }
    }
    return { current: null }
  })
  const [isHighDpi] = useState(() => isHighDpiDevice())
  const [optimalQuality] = useState(() => quality || getOptimalImageQuality())

  useEffect(() => {
    if (priority) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: "200px" },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [containerRef, priority])

  // Handle image load
  useEffect(() => {
    if (!isVisible) return

    const img = new Image()
    img.src = src
    img.onload = () => setIsLoaded(true)

    return () => {
      img.onload = null
    }
  }, [src, isVisible])

  return {
    src,
    width,
    height,
    quality: optimalQuality,
    isHighDpi,
    isLoaded,
    isVisible,
    containerRef,
  }
}
