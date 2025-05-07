import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and tailwind-merge
 * @param inputs Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date as YYYY.MM.DD
 * @param date Date to format (Date object or string)
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toISOString().split("T")[0].replace(/-/g, ".")
}

/**
 * Debounce a function call
 * @param fn Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Check if code is running on the client
 * @returns Boolean indicating if code is running on client
 */
export function isClient(): boolean {
  return typeof window !== "undefined"
}

/**
 * Get window dimensions with safety check
 * @returns Object with width and height properties
 */
export function getWindowDimensions(): { width: number; height: number } {
  if (!isClient()) {
    return {
      width: 0,
      height: 0,
    }
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

// Function to get image dimensions from a URL (client-side only)
export async function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve({ width: 0, height: 0 })
      return
    }

    const img = new Image()
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      })
    }
    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }
    img.src = url
  })
}

// Function to check if WebP is supported
export function supportsWebP(): boolean {
  if (typeof document === "undefined") return false

  const elem = document.createElement("canvas")
  if (elem.getContext && elem.getContext("2d")) {
    // was able or not to get WebP representation
    return elem.toDataURL("image/webp").indexOf("data:image/webp") === 0
  }

  // very old browser like IE 8, canvas not supported
  return false
}

// Function to get the best image format for the current browser
export function getBestImageFormat(): "avif" | "webp" | "jpg" {
  if (typeof window === "undefined") return "jpg"

  // Check for AVIF support
  const canUseAvif = document.createElement("canvas").toDataURL("image/avif").startsWith("data:image/avif")

  if (canUseAvif) return "avif"

  // Check for WebP support
  if (supportsWebP()) return "webp"

  // Fallback to JPG
  return "jpg"
}
