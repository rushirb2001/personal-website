"use client"

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface NavigationContextType {
  navigateTo: (href: string) => void
  isTransitioning: boolean
  currentPath: string
  targetPath: string | null
  shouldAnimateEntrance: boolean
  isPageReady: boolean // New flag to signal when page can show content
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
  const [shouldAnimateEntrance, setShouldAnimateEntrance] = useState(false)
  const [isPageReady, setIsPageReady] = useState(true) // Track if page is ready to display
  const navigationInProgress = useRef(false)
  const prevPathnameRef = useRef(pathname)

  // Update current path when pathname changes
  useEffect(() => {
    if (pathname) {
      setCurrentPath(pathname)
      if (navigationInProgress.current && pathname !== prevPathnameRef.current) {
        // Page has changed, keep it hidden until transition ends
        setIsPageReady(false)
      }
      prevPathnameRef.current = pathname
    }
  }, [pathname])

  useEffect(() => {
    if (!isTransitioning && !isPageReady) {
      // Transition overlay just finished, now animate entrance
      setShouldAnimateEntrance(true)
      setIsPageReady(true)
      navigationInProgress.current = false
    }
  }, [isTransitioning, isPageReady])

  useEffect(() => {
    if (shouldAnimateEntrance) {
      const resetTimeout = setTimeout(() => {
        setShouldAnimateEntrance(false)
      }, 1000)
      return () => clearTimeout(resetTimeout)
    }
  }, [shouldAnimateEntrance])

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
      const totalDuration = 2500

      // Step 1: Set target path immediately
      setTargetPath(href)
      navigationInProgress.current = true

      setIsPageReady(false)

      // Step 2: Show transition animation immediately
      setIsTransitioning(true)

      // Random chance to trigger easter egg (1 in 10 navigations)
      if (Math.random() < 0.1) {
        setTimeout(() => {
          const event = new CustomEvent("easterEggTrigger")
          window.dispatchEvent(event)
        }, 300)
      }

      // Step 3: Navigate to new page at precise timing
      const navigationTimeout = setTimeout(() => {
        router.push(href)
      }, 1800)

      // Step 4: Hide animation after precise duration
      const hideTimeout = setTimeout(() => {
        setIsTransitioning(false)
        setTargetPath(null)
      }, totalDuration)

      return () => {
        clearTimeout(navigationTimeout)
        clearTimeout(hideTimeout)
      }
    },
    [pathname, router, isTransitioning, isReady],
  )

  // Prefetch all pages for smoother navigation
  useEffect(() => {
    const pagesToPrefetch = ["/", "/projects", "/skills", "/experience", "/education", "/publications", "/contact"]

    const prefetchPages = async () => {
      try {
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
      shouldAnimateEntrance,
      isPageReady, // Expose isPageReady
    }),
    [navigateTo, isTransitioning, currentPath, targetPath, shouldAnimateEntrance, isPageReady],
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
