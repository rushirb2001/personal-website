"use client"

import { useState, useEffect } from "react"
import { OptimizedImage } from "./optimized-image"
import { cn } from "@/lib/utils"
import { calculateResponsiveImageDimensions } from "@/lib/image-utils"

interface GalleryImage {
  src: string
  alt: string
  width: number
  height: number
}

interface ResponsiveGalleryProps {
  images: GalleryImage[]
  className?: string
  imageClassName?: string
  columns?: { mobile: number; tablet: number; desktop: number }
  gap?: number
  maxWidth?: number
}

export function ResponsiveGallery({
  images,
  className,
  imageClassName,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 4,
  maxWidth = 400,
}: ResponsiveGalleryProps) {
  const [currentColumns, setCurrentColumns] = useState(columns.desktop)
  const [imageDimensions, setImageDimensions] = useState<Array<{ width: number; height: number }>>([])

  // Update columns based on screen size
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 640) {
        setCurrentColumns(columns.mobile)
      } else if (window.innerWidth < 1024) {
        setCurrentColumns(columns.tablet)
      } else {
        setCurrentColumns(columns.desktop)
      }
    }

    updateColumns()
    window.addEventListener("resize", updateColumns)

    return () => window.removeEventListener("resize", updateColumns)
  }, [columns])

  // Calculate responsive dimensions for all images
  useEffect(() => {
    const dimensions = images.map((image) => calculateResponsiveImageDimensions(image.width, image.height, maxWidth))
    setImageDimensions(dimensions)
  }, [images, maxWidth])

  return (
    <div className={cn("w-full", className)}>
      <div
        className="grid w-full"
        style={{
          gridTemplateColumns: `repeat(${currentColumns}, 1fr)`,
          gap: `${gap * 0.25}rem`,
        }}
      >
        {images.map((image, index) => (
          <div key={`gallery-image-${index}`} className={cn("overflow-hidden", imageClassName)}>
            {imageDimensions[index] && (
              <OptimizedImage
                src={image.src}
                alt={image.alt}
                width={imageDimensions[index].width}
                height={imageDimensions[index].height}
                sizes={`(max-width: 640px) ${100 / columns.mobile}vw, (max-width: 1024px) ${100 / columns.tablet}vw, ${100 / columns.desktop}vw`}
                className="w-full h-auto transition-transform duration-300 hover:scale-105"
                placeholder="blur"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
