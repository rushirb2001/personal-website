"use client"

import type React from "react"
import { NavMenu } from "@/components/navigation/nav-menu"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { MobileDropdownNav } from "@/components/navigation/mobile-dropdown-nav"
import { useNavigation } from "@/contexts/navigation-context"

export function Header() {
  const { navigateTo, currentPath } = useNavigation()

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (currentPath !== "/") {
      navigateTo("/")
    }
    // If already on home page, do nothing to prevent animation
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-60 bg-background border-b border-primary/10">
      <div className="w-full flex items-center justify-between h-14 md:h-16 px-3 md:px-4">
        <div className="flex items-center gap-3 md:gap-4">
          <a
            href="/"
            onClick={handleHomeClick}
            className="text-base md:text-lg font-sf-mono font-medium tracking-tighter truncate cursor-pointer"
          >
            RUSHIR BHAVSAR
          </a>

          <div className="hidden md:flex items-center gap-1.5 text-[10px] font-sf-mono text-green-500 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-[blink_0.5s_ease-in-out_infinite]" />
            SEEKING FULL-TIME ML ROLES
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Mobile dropdown navigation */}
          <div className="md:hidden">
            <MobileDropdownNav />
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block">
            <NavMenu />
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
