"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/theme-context"
import { ClientOnly } from "@/components/ui/client-only"
import { isClient } from "@/lib/utils"

export function ThemeToggle() {
  // Add local state as fallback
  const [localTheme, setLocalTheme] = useState<"light" | "dark">("light")
  const [mounted, setMounted] = useState(false)

  // Try to use the theme context, but handle the case when it's not available
  const themeContext = useTheme()
  const { theme, setTheme } = themeContext || { theme: localTheme, setTheme: setLocalTheme }

  // Initialize on mount
  useEffect(() => {
    if (!isClient()) return

    // Get initial theme from localStorage or default to light
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    let initialTheme: "light" | "dark"

    if (storedTheme) {
      initialTheme = storedTheme
    } else {
      // Always default to light theme
      initialTheme = "light"
      localStorage.setItem("theme", initialTheme)
    }

    setLocalTheme(initialTheme)
    applyTheme(initialTheme)
    setMounted(true)
  }, [])

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)

    // Also update localStorage and apply theme directly as a fallback
    if (isClient()) {
      localStorage.setItem("theme", newTheme)
    }
    applyTheme(newTheme)
  }

  // Apply theme to document
  const applyTheme = (theme: "light" | "dark") => {
    if (!isClient()) return

    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Use the ClientOnly component to avoid hydration mismatch
  return (
    <ClientOnly
      fallback={
        <Button
          variant="outline"
          size="icon"
          className="rounded-none border-primary/20 w-9 h-9 bg-eerie-offwhite dark:bg-eerie-black"
        >
          <span className="sr-only">Toggle theme</span>
        </Button>
      }
    >
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className="rounded-none border-primary/20 w-9 h-9 bg-eerie-offwhite dark:bg-eerie-black"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
      </Button>
    </ClientOnly>
  )
}
