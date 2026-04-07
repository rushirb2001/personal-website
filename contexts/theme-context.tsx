"use client"

import type React from "react"
import { createContext, useContext, useEffect } from "react"
import { useTheme as useNextTheme, ThemeProvider as NextThemeProvider } from "next-themes"

interface ThemeContextType {
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="theme"
    >
      <ThemeContextBridge>{children}</ThemeContextBridge>
    </NextThemeProvider>
  )
}

function ThemeContextBridge({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, resolvedTheme } = useNextTheme()

  useEffect(() => {
    // Small delay to ensure the initial theme is applied without transition
    const timer = setTimeout(() => {
      document.documentElement.style.setProperty("--theme-transition-duration", "0.15s")
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const contextValue: ThemeContextType = {
    theme: (resolvedTheme as "light" | "dark") || "light",
    setTheme: (newTheme: "light" | "dark") => setTheme(newTheme),
  }

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

// Hook to use theme
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    // Fallback if used outside provider
    return { theme: "light" as const, setTheme: () => {} }
  }
  return context
}
