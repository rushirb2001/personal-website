"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme as useNextTheme } from "next-themes"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useNextTheme()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  // Show placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="rounded-none border-primary/20 w-9 h-9 bg-background">
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-none border-primary/20 w-9 h-9 bg-background transition-colors duration-200"
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-transform duration-200" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-transform duration-200" />
      )}
    </Button>
  )
}
