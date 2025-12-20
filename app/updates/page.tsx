"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getPublishedPosts, type BlogPost } from "@/lib/blog-data"
import { formatDate } from "@/lib/utils"
import { ArrowRight, Calendar, Tag, ChevronDown, X, ChevronLeft, ChevronRight } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { useRouter } from "next/navigation"
import { useMediaQuery } from "@/hooks/use-media-query"

const ITEMS_PER_PAGE = 3

function getInitialCollapseAnimation(): {
  show: boolean
  startRect: { top: number; left: number; width: number; height: number }
  endRect: { top: number; left: number; width: number; height: number } | null
  postData: BlogPost | null
} {
  if (typeof window !== "undefined") {
    const containerRect = sessionStorage.getItem("collapseContainerRect")
    const collapseRect = sessionStorage.getItem("collapseToRect")
    const collapsePostData = sessionStorage.getItem("collapsePostData")

    if (containerRect && collapseRect && collapsePostData) {
      const startRect = JSON.parse(containerRect)
      const endRect = JSON.parse(collapseRect)
      const postData = JSON.parse(collapsePostData)
      return { show: true, startRect, endRect, postData }
    }
  }
  return { show: false, startRect: { top: 0, left: 0, width: 0, height: 0 }, endRect: null, postData: null }
}

function getInitialReturningPostId(): string | null {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("collapseFromPost")
  }
  return null
}

function getInitialSelectedTags(): string[] {
  if (typeof window !== "undefined") {
    const storedTags = sessionStorage.getItem("selectedTags")
    if (storedTags) {
      return JSON.parse(storedTags)
    }
  }
  return []
}

export default function UpdatesPage() {
  const posts = getPublishedPosts()
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")

  const [selectedTags, setSelectedTags] = useState<string[]>(() => getInitialSelectedTags())
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [startIndex, setStartIndex] = useState(0)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const articleRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const [returningPostId, setReturningPostId] = useState<string | null>(() => getInitialReturningPostId())
  const [highlightedPostId, setHighlightedPostId] = useState<string | null>(null)
  const isReturningFromArticle = useRef(returningPostId !== null)
  const [collapseAnimation, setCollapseAnimation] = useState(() => getInitialCollapseAnimation())
  const [cardRevealed, setCardRevealed] = useState<string | null>(null)
  const [collapseStarted, setCollapseStarted] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("collapseFromPost") !== null
    }
    return false
  })

  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)))

  const filteredPosts =
    selectedTags.length > 0
      ? posts.filter((post) => post.tags.some((tag) => selectedTags.includes(tag)))
      : posts

  const visiblePosts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  const canShowPrevious = startIndex > 0
  const canShowNext = startIndex + ITEMS_PER_PAGE < filteredPosts.length
  const showPaginationControls = filteredPosts.length > ITEMS_PER_PAGE

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
    setStartIndex(0)
  }

  const clearTags = () => {
    setSelectedTags([])
    setIsFilterOpen(false)
    setStartIndex(0)
  }

  useEffect(() => {
    const collapsePostId = sessionStorage.getItem("collapseFromPost")

    if (collapsePostId && collapseAnimation.show) {
      sessionStorage.removeItem("collapseContainerRect")
      sessionStorage.removeItem("collapseToRect")
      sessionStorage.removeItem("collapseFromPost")
      sessionStorage.removeItem("collapsePostData")
      sessionStorage.removeItem("selectedTags")

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const targetElement = articleRefs.current.get(collapsePostId)
          if (targetElement) {
            const endRect = targetElement.getBoundingClientRect()
            setCollapseAnimation((prev) => ({
              ...prev,
              endRect: {
                top: endRect.top,
                left: endRect.left,
                width: endRect.width,
                height: endRect.height,
              },
            }))
          }
        })
      })

      setTimeout(() => {
        setCollapseAnimation((prev) => ({ ...prev, show: false }))
        setCardRevealed(collapsePostId)

        setTimeout(() => {
          setCollapseStarted(false)
          setReturningPostId(null)
          setHighlightedPostId(collapsePostId)

          setTimeout(() => {
            setHighlightedPostId(null)
            setCardRevealed(null)
          }, 400)
        }, 50)
      }, 700)
    }
  }, [])

  const handleArticleClick = (e: React.MouseEvent, post: BlogPost) => {
    e.preventDefault()
    const element = articleRefs.current.get(post.id)
    if (element) {
      const rect = element.getBoundingClientRect()
      sessionStorage.setItem(
        "expandRect",
        JSON.stringify({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        })
      )
      sessionStorage.setItem("selectedTags", JSON.stringify(selectedTags))

      router.push(`/updates/${post.id}`)
    }
  }

  const isCardHidden = (postId: string) => {
    return returningPostId === postId && collapseStarted && cardRevealed !== postId
  }

  return (
    <PageLayout title="BLOG" subtitle="ARTICLES & UPDATES">
      {/* Collapse Animation Overlay */}
      <AnimatePresence>
        {collapseAnimation.show && collapseAnimation.endRect && collapseAnimation.postData && (
          <motion.div
            className="fixed z-[100] border border-primary/20 bg-background dark:bg-eerie-black overflow-hidden pointer-events-none"
            initial={{
              top: collapseAnimation.startRect.top,
              left: collapseAnimation.startRect.left,
              width: collapseAnimation.startRect.width,
              height: collapseAnimation.startRect.height,
              opacity: 1,
            }}
            animate={{
              top: collapseAnimation.endRect.top,
              left: collapseAnimation.endRect.left,
              width: collapseAnimation.endRect.width,
              height: collapseAnimation.endRect.height,
              opacity: 1,
            }}
            exit={{ opacity: 0, transition: { duration: 0.08 } }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="p-3 h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4.3, duration: 0.35, ease: "easeOut" }}
            >
              <h2 className="text-base md:text-base font-sf-mono font-medium line-clamp-1 mb-1">
                {collapseAnimation.postData.title}
              </h2>
              <p className="text-[14px] md:text-[14px] text-primary/60 font-sf-mono line-clamp-2">
                {collapseAnimation.postData.summary}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-0 max-w-3xl mx-auto">
        {/* Filter Header with Inline Pagination */}
        <div className={`border border-primary/20 mb-3 ${showPaginationControls ? 'flex gap-0' : ''}`}>
          {/* Filter Dropdown */}
          <div className={showPaginationControls ? 'flex-[6] border-r border-primary/20' : 'w-full'}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full flex items-center justify-between px-3 py-2 bg-primary/5 hover:bg-primary/10 transition-colors h-[42px]"
            >
              <span className="font-sf-mono text-primary/60 text-sm">
                {selectedTags.length > 0
                  ? `FILTER: SHOWING ${selectedTags.slice(0, 2).join(", ").toUpperCase()}${selectedTags.length > 2 ? ` +${selectedTags.length - 2}` : ""}`
                  : "FILTER BY TAG"}
              </span>
              <motion.div animate={{ rotate: isFilterOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-3 h-3 text-primary/50" />
              </motion.div>
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t border-primary/10"
                >
                  <div className="p-3">
                    <div className="flex flex-wrap gap-1.5">
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-2 py-1 font-sf-mono border transition-colors text-sm ${
                            selectedTags.includes(tag)
                              ? "bg-primary text-background border-primary"
                              : "border-primary/20 text-primary/60 hover:border-primary/40"
                          }`}
                        >
                          {tag.toUpperCase()}
                        </button>
                      ))}
                    </div>
                    {selectedTags.length > 0 && (
                      <button
                        onClick={clearTags}
                        className="mt-2 text-[9px] font-sf-mono text-primary/50 hover:text-primary flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        CLEAR ALL
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Inline Pagination Controls */}
          {showPaginationControls && (
            <div className="flex-[4] flex">
              <button
                onClick={() => setStartIndex((prev) => Math.max(0, prev - ITEMS_PER_PAGE))}
                disabled={!canShowPrevious}
                className={`flex-1 flex items-center justify-center border-r border-primary/20 h-[42px] transition-colors ${
                  canShowPrevious
                    ? "text-primary/70 hover:bg-primary/10"
                    : "text-primary/20 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setStartIndex((prev) => prev + ITEMS_PER_PAGE)}
                disabled={!canShowNext}
                className={`flex-1 flex items-center justify-center h-[42px] transition-colors ${
                  canShowNext
                    ? "text-primary/70 hover:bg-primary/10"
                    : "text-primary/20 cursor-not-allowed"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Posts List */}
        <div className="space-y-2 min-h-[360px] md:min-h-[360px]">
          {visiblePosts.length > 0 ? (
            visiblePosts.map((post, index) => (
              <motion.div
                key={post.id}
                ref={(el) => {
                  if (el) articleRefs.current.set(post.id, el)
                }}
                initial={{
                  opacity: isReturningFromArticle.current ? 1 : 0,
                  y: isReturningFromArticle.current ? 0 : 10,
                }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: isReturningFromArticle.current ? 0 : index * 0.05,
                  duration: isReturningFromArticle.current ? 0 : 0.2,
                }}
                className={`border transition-all duration-150 cursor-pointer ${
                  highlightedPostId === post.id
                    ? "border-primary/60 bg-primary/10"
                    : hoveredId === post.id
                      ? "border-primary/40 bg-primary/5"
                      : "border-primary/20"
                }`}
                style={{
                  opacity: isCardHidden(post.id) ? 0 : undefined,
                  visibility: isCardHidden(post.id) ? "hidden" : undefined,
                }}
                onMouseEnter={() => setHoveredId(post.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={(e) => handleArticleClick(e, post)}
              >
                <div className="p-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h2 className="font-sf-mono flex-1 font-bold tracking-tight text-base">{post.title}</h2>
                    <div className="flex items-center text-primary/50 font-sf-mono whitespace-nowrap text-sm">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(new Date(post.date))}
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-primary/60 mb-2 font-sf-mono line-clamp-2 tracking-tighter text-xs">{post.summary}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3 text-primary/40" />
                      <div className="flex gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-primary/40 font-sf-mono text-xs">
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-[9px] text-primary/30 font-sf-mono">
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="font-sf-mono text-primary/50 flex items-center text-xs">
                      READ
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex items-center justify-center py-12 border border-primary/10">
              <p className="text-xs font-sf-mono text-primary/50">NO POSTS FOUND</p>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <motion.div
          className="flex items-center justify-between border-t border-primary/20 pt-3 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3 }}
        >
          <div className="flex gap-1 sm:gap-2 text-[9px] sm:text-[10px] font-sf-mono text-primary/40 uppercase tracking-wider">
            <span className="text-sm">{posts.length} {isMobile ? "POSTS" : "ARTICLES"}</span>
            <span className="text-primary/20">/</span>
            <span className="text-sm">{allTags.length} TAGS</span>
            <span className="text-primary/20">/</span>
            <span className="text-sm">{filteredPosts.length} {isMobile ? "SHOWN" : "FILTERED"}</span>
          </div>
          <div className="text-[9px] sm:text-[10px] font-sf-mono text-primary/30">
            <span className="text-sm">LAST.UPDATED: 2025</span>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
}
