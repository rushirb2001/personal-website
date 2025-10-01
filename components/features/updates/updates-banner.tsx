"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ChevronDown } from "lucide-react"
import { useNavigation } from "@/contexts/navigation-context"
import { getRecentPosts } from "@/lib/blog-data"
import { formatDate } from "@/lib/utils"

export function UpdatesBanner() {
  const [showAlternateText, setShowAlternateText] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const { navigateTo } = useNavigation()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const bannerRef = useRef<HTMLDivElement>(null)

  // Get recent posts for the dropdown and count
  const recentPosts = getRecentPosts(2)
  const updateCount = getRecentPosts().length

  // Toggle between showing "[ UPDATES ]" and "[n-NEW UPDATES]"
  useEffect(() => {
    const interval = setInterval(() => {
      setShowAlternateText((prev) => !prev)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        bannerRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !bannerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleBannerClick = () => {
    setShowDropdown((prev) => !prev)
  }

  const handleViewAllClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigateTo("/updates")
    setShowDropdown(false)
  }

  const handleUpdateClick = (id: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    navigateTo(`/updates/${id}`)
    setShowDropdown(false)
  }

  return (
    <>
      {/* Banner */}
      <div
        ref={bannerRef}
        onClick={handleBannerClick}
        className="fixed top-14 md:top-16 left-0 z-40 flex items-center justify-start space-x-2 py-1 px-2 border-r border-b border-primary/20 bg-background/95 backdrop-blur-sm text-xs font-sf-mono text-primary/70 cursor-pointer hover:bg-primary/10 transition-colors rounded-br-md"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-[blink_1s_ease-in-out_infinite]"></div>
        <AnimatePresence mode="wait">
          {showAlternateText ? (
            <motion.div
              key="alternate"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              [{updateCount}-NEW UPDATES]
            </motion.div>
          ) : (
            <motion.div
              key="standard"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              [ UPDATES ] <ArrowRight className="ml-1 h-3 w-3" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[calc(3.5rem+1.75rem)] md:top-[calc(4rem+1.75rem)] left-0 z-50 w-64 border border-primary/30 bg-background/95 backdrop-blur-sm shadow-sm rounded-b-md"
          >
            <div className="p-2 border-b border-primary/20 flex items-center justify-between">
              <div className="text-xs font-sf-mono text-primary/70">RECENT UPDATES</div>
              <div className="text-[10px] text-primary/50">{updateCount} TOTAL</div>
            </div>

            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {recentPosts.map((post, index) => (
                <div
                  key={post.id}
                  onClick={handleUpdateClick(post.id)}
                  className={`p-2 cursor-pointer hover:bg-primary/5 transition-colors ${
                    index < recentPosts.length - 1 ? "border-b border-primary/10" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium text-xs text-primary/80">{post.title}</div>
                    <div className="text-[10px] text-primary/50 ml-2">{formatDate(post.date)}</div>
                  </div>
                  <div className="text-[10px] text-primary/60 line-clamp-2">{post.summary}</div>
                </div>
              ))}
            </div>

            <div
              onClick={handleViewAllClick}
              className="p-2 border-t border-primary/20 text-xs font-sf-mono text-primary/70 flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer"
            >
              VIEW ALL UPDATES <ChevronDown className="ml-1 h-3 w-3" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
