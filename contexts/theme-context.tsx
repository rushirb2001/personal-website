"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useMemo } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

// Provide a default context value
const defaultContextValue: ThemeContextType = {
  theme: "light",
  setTheme: () => {},
}

const ThemeContext = createContext<ThemeContextType>(defaultContextValue)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  // Initialize theme on mount
  useEffect(() => {
    // Get theme from localStorage or default to light
    const getInitialTheme = (): Theme => {
      if (typeof window === "undefined") return "light"

      // Check localStorage first
      const storedTheme = localStorage.getItem("theme") as Theme
      if (storedTheme === "dark" || storedTheme === "light") return storedTheme

      // Always default to light theme
      return "light"
    }

    const initialTheme = getInitialTheme()
    setThemeState(initialTheme)
    applyTheme(initialTheme)
    setMounted(true)

    // Add listener for storage events (for cross-tab sync)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "theme") {
        const newTheme = e.newValue as Theme
        setThemeState(newTheme)
        applyTheme(newTheme)
      }
    }

    // Add listener for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleMediaChange = (e: MediaQueryListEvent) => {
      // Do nothing - we don't want to automatically change theme based on system preference
    }

    mediaQuery.addEventListener("change", handleMediaChange)
    window.addEventListener("storage", handleStorage)

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange)
      window.removeEventListener("storage", handleStorage)
    }
  }, [])

  // Function to set theme
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("theme", newTheme)
    applyTheme(newTheme)
  }

  // Apply theme to document
  const applyTheme = (theme: Theme) => {
    if (typeof document !== "undefined") {
      if (theme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({ theme, setTheme }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// Hook to use theme
export function useTheme() {
  const context = useContext(ThemeContext)
  return context
}
