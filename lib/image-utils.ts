/**
 * Utility functions for responsive image handling
 */

// Calculate image dimensions based on aspect ratio and max width
export function calculateResponsiveImageDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight
  const width = Math.min(originalWidth, maxWidth)
  const height = Math.round(width / aspectRatio)

  return { width, height }
}

// Generate responsive sizes string based on image importance
export function getResponsiveSizes(importance: "high" | "medium" | "low" = "medium"): string {
  switch (importance) {
    case "high":
      return "(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw"
    case "medium":
      return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    case "low":
      return "(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
    default:
      return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  }
}

// Get appropriate image quality based on connection speed
export function getOptimalImageQuality(): number {
  if (typeof navigator === "undefined") return 85 // Default for SSR

  // Use connection API if available
  if ("connection" in navigator) {
    const connection = (navigator as any).connection

    if (connection) {
      // Low quality for slow connections
      if (connection.saveData || connection.effectiveType === "slow-2g" || connection.effectiveType === "2g") {
        return 60
      }

      // Medium quality for 3G
      if (connection.effectiveType === "3g") {
        return 75
      }
    }
  }

  // Default high quality
  return 85
}

// Generate a simple blur placeholder
export function generateBlurPlaceholder(width: number, height: number, color = "#f0f0f0"): string {
  return `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' x='0' y='0' fill='${color.replace("#", "%23")}' filter='url(%23b)'/%3E%3C/svg%3E`
}

// Check if device is high-DPI
export function isHighDpiDevice(): boolean {
  if (typeof window === "undefined") return false
  return window.devicePixelRatio > 1.5
}
