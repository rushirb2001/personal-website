"use client"

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface NavigationContextType {
  navigateTo: (href: string) => void
  isTransitioning: boolean
  currentPath: string
  targetPath: string | null
  hasJustNavigated: boolean
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

interface NavigationProviderProps {
  children: ReactNode
  isReady?: boolean
}

export function NavigationProvider({ children, isReady = true }: NavigationProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [targetPath, setTargetPath] = useState<string | null>(null)
  const [currentPath, setCurrentPath] = useState("")
  const [hasJustNavigated, setHasJustNavigated] = useState(false)

  // Update current path when pathname changes
  useEffect(() => {
    if (pathname) {
      setCurrentPath(pathname)
    }
  }, [pathname])

  // Custom navigation function with abrupt, systemic timings
  const navigateTo = useCallback(
    (href: string) => {
      if (href === pathname || isTransitioning) return

      // If not ready for transitions, navigate immediately without animation
      if (!isReady) {
        router.push(href)
        return
      }

      // More abrupt, systemic timing
      const totalDuration = 2500 // Slightly shorter total duration

      // Step 1: Set target path immediately
      setTargetPath(href)

      // Step 2: Show transition animation immediately
      setIsTransitioning(true)

      // Random chance to trigger easter egg (1 in 10 navigations)
      if (Math.random() < 0.1) {
        // Trigger a brief glitch effect
        setTimeout(() => {
          const event = new CustomEvent("easterEggTrigger")
          window.dispatchEvent(event)
        }, 300)
      }

      // Step 3: Navigate to new page at precise timing
      const navigationTimeout = setTimeout(() => {
        router.push(href)
      }, 1800) // Exact timing for navigation

      // Step 4: Hide animation after precise duration
      const hideTimeout = setTimeout(() => {
        setIsTransitioning(false)
        setTargetPath(null)
        setHasJustNavigated(true)
      }, totalDuration)

      // Return cleanup function to clear timeouts if component unmounts during transition
      return () => {
        clearTimeout(navigationTimeout)
        clearTimeout(hideTimeout)
      }
    },
    [pathname, router, isTransitioning, isReady],
  )

  useEffect(() => {
    if (hasJustNavigated) {
      const resetTimeout = setTimeout(() => {
        setHasJustNavigated(false)
      }, 800) // Allow entrance animations to complete
      return () => clearTimeout(resetTimeout)
    }
  }, [hasJustNavigated])

  // Prefetch all pages for smoother navigation
  useEffect(() => {
    const pagesToPrefetch = ["/", "/projects", "/skills", "/experience", "/education", "/publications", "/contact"]

    const prefetchPages = async () => {
      try {
        // Prefetch all pages for smoother transitions
        pagesToPrefetch.forEach((path) => {
          if (path !== pathname) {
            router.prefetch(path)
          }
        })
      } catch (error) {
        console.error("Error prefetching pages:", error)
      }
    }

    prefetchPages()
  }, [pathname, router])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      navigateTo,
      isTransitioning,
      currentPath,
      targetPath,
      hasJustNavigated,
    }),
    [navigateTo, isTransitioning, currentPath, targetPath, hasJustNavigated],
  )

  return <NavigationContext.Provider value={contextValue}>{children}</NavigationContext.Provider>
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider")
  }
  return context
}
