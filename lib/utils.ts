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
 * Check if code is running on the client
 * @returns Boolean indicating if code is running on client
 */
export function isClient(): boolean {
  return typeof window !== "undefined"
}
