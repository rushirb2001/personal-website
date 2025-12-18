"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ChevronDown, X } from "lucide-react"
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
      {/* Banner - only show when dropdown is closed */}
<AnimatePresence>
  {!showDropdown && (
    <motion.div
      ref={bannerRef}
      onClick={handleBannerClick}
      initial={{ opacity: 0, scaleY: 0, originY: 0 }}
      animate={{ opacity: 1, scaleY: 1, originY: 0 }}
      exit={{ opacity: 0, scaleY: 0, originY: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-14 md:top-16 right-0 md:right-auto md:left-0 z-40 flex items-center justify-start space-x-2 py-1 px-2 border-l md:border-l-0 md:border-r border-b border-primary/20 bg-background cursor-pointer hover:bg-primary/10 transition-colors duration-150"
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
            className="flex items-center text-[10px] font-sf-mono tracking-wider text-primary/70"
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
            className="flex items-center text-[10px] font-sf-mono tracking-wider text-primary/70"
          >
            [ UPDATES ] <ArrowRight className="ml-1 h-3 w-3" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )}
</AnimatePresence>

{/* Dropdown - only show when banner is clicked */}
<AnimatePresence>
  {showDropdown && (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, scaleY: 0, originY: 0 }}
      animate={{ opacity: 1, scaleY: 1, originY: 0 }}
      exit={{ opacity: 0, scaleY: 0, originY: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-14 md:top-16 right-0 md:right-auto md:left-0 z-50 w-64 border border-primary/20 bg-background overflow-hidden"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.2 }}
        className="p-3 bg-primary/5 border-b border-primary/20"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-sf-mono tracking-wider text-primary/70">
            RECENT UPDATES
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-sf-mono tracking-wider text-primary/50">
              [{String(updateCount).padStart(2, '0')}]
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(false);
              }}
              className="w-4 h-4 flex items-center justify-center hover:bg-primary/10 transition-colors duration-150 cursor-pointer"
            >
              <X className="h-3 w-3 text-primary/60" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Updates List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.2 }}
        className="max-h-60 overflow-y-auto"
      >
        {recentPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + index * 0.05, duration: 0.2 }}
            onClick={handleUpdateClick(post.id)}
            className="p-3 border-b border-primary/10 cursor-pointer hover:bg-primary/5 transition-all duration-150"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <span className="text-[10px] font-sf-mono tracking-tight text-primary/80 uppercase line-clamp-1">
                {post.title}
              </span>
              <span className="text-[9px] font-sf-mono tracking-wider text-primary/50 whitespace-nowrap">
                {formatDate(post.date)}
              </span>
            </div>
            <div className="text-[9px] font-sf-mono tracking-tight text-primary/60 line-clamp-2 uppercase">
              {post.summary}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.2 }}
        onClick={handleViewAllClick}
        className="p-3 border-t border-primary/20 cursor-pointer hover:bg-primary/10 transition-all duration-150"
      >
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-[10px] font-sf-mono tracking-wider text-primary/70">
            VIEW ALL
          </span>
          <span className="text-[9px] text-primary/50">→</span>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </>
  )
}
