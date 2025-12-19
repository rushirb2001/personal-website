"use client"

import { useState, useRef } from "react"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useNavigation } from "@/contexts/navigation-context"
import { useOnClickOutside } from "@/lib/use-optimized-event"
import { NAV_ITEMS } from "@/lib/constants"

// Update the component to use the constants
export function NavMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { navigateTo } = useNavigation()

  // Close dropdown when clicking outside
  useOnClickOutside(dropdownRef, () => setIsOpen(false))

  const handleNavigation = (path: string) => {
    navigateTo(path)
    if (isOpen) setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Mobile dropdown trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center text-xs font-sf-mono text-primary/70 hover:text-primary transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <span className="mr-1">MENU</span>
        {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-background dark:bg-eerie-black border border-primary/20 shadow-md z-[95] md:hidden">
          <div className="py-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full text-left px-3 py-2 text-xs font-sf-mono flex items-center ${
                  pathname === item.path ? "bg-primary/10 text-primary" : "text-primary/70 hover:bg-primary/5"
                }`}
              >
                {pathname === item.path ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-[blink_0.5s_ease-in-out_infinite]"></span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500/70 mr-2"></span>
                )}
                <span>[{item.name}]</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Desktop navigation */}
      <nav className="hidden md:flex items-center space-x-6 font-sf-mono text-xs tracking-wider">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={`hover:text-primary/70 transition-colors flex items-center ${
              pathname === item.path ? "text-primary" : "text-primary/50"
            }`}
          >
            {pathname === item.path ? (
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-[blink_0.5s_ease-in-out_infinite]"></span>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-red-500/70 mr-2"></span>
            )}
            <span className="text-sm tracking-tighter">[{item.name}]</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
