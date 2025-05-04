"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface PdfThumbnailProps {
  pdfUrl: string
  className?: string
}

export function PdfThumbnail({ pdfUrl, className = "" }: PdfThumbnailProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("")

  useEffect(() => {
    // For simplicity, we'll use a placeholder image
    // In a real implementation, you might want to generate a thumbnail from the PDF
    setThumbnailUrl("/placeholder.svg?key=ljpq4")
  }, [pdfUrl])

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl || "/placeholder.svg"}
          alt="Resume preview"
          width={600}
          height={800}
          className="max-h-full max-w-full object-contain"
        />
      ) : (
        <div className="flex items-center justify-center h-full w-full">
          <div className="h-6 w-6 border-2 border-primary/30 border-t-primary/80 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}
