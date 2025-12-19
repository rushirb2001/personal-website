"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useNavigation } from "@/contexts/navigation-context"
import { motion, AnimatePresence } from "framer-motion"
import { NAV_ITEMS } from "@/lib/constants"

export function MobileDropdownNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { navigateTo } = useNavigation()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Get current page name
  const currentPage = NAV_ITEMS.find((item) => item.path === pathname)?.name || "HOME"

  const handleNavigation = (path: string) => {
    navigateTo(path)
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-2 py-1 border border-primary/20 text-xs font-sf-mono w-32"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-[blink_0.5s_ease-in-out_infinite]"></span>
          <span className="text-base">{currentPage}</span>
        </div>
        {isOpen ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-1 w-40 bg-background dark:bg-eerie-black border border-primary/20 shadow-md z-50"
          >
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
                  {item.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
