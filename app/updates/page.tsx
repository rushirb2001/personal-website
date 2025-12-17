"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getPublishedPosts } from "@/lib/blog-data"
import { formatDate } from "@/lib/utils"
import { ArrowRight, Calendar, Tag, ChevronDown, X } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { useRouter } from "next/navigation"
import { useMediaQuery } from "@/hooks/use-media-query"

const ITEMS_PER_PAGE = 5

export default function UpdatesPage() {
  const posts = getPublishedPosts()
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [startIndex, setStartIndex] = useState(0)

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

  return (
    <PageLayout title="BLOG" subtitle="ARTICLES & UPDATES">
      <div className="space-y-0 max-w-3xl mx-auto">
        
        {/* Filter Header */}
        <div className="border border-primary/20 mb-3">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full flex items-center justify-between px-3 py-2 bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <span className="text-[10px] font-sf-mono text-primary/60">
              {selectedTags.length > 0 
                ? `FILTER: ${selectedTags.length} TAG${selectedTags.length !== 1 ? "S" : ""}`
                : "FILTER BY TAG"
              }
            </span>
            <motion.div
              animate={{ rotate: isFilterOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
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
                        className={`px-2 py-1 text-[9px] font-sf-mono border transition-colors ${
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

        {/* Pagination Controls */}
        {showPaginationControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col md:flex-row items-center justify-center gap-2 py-3 mb-2"
          >
            <div className="flex items-center gap-2 w-full md:w-auto justify-center">
              <button
                onClick={() => setStartIndex((prev) => Math.max(0, prev - ITEMS_PER_PAGE))}
                disabled={!canShowPrevious}
                className={`px-3 md:px-4 py-1.5 text-[10px] font-sf-mono uppercase tracking-wider border transition-all duration-150 flex-1 md:flex-none md:w-32 ${
                  canShowPrevious
                    ? "border-primary/30 text-primary/70 hover:bg-primary/10 hover:border-primary/50"
                    : "border-primary/10 text-primary/20 cursor-not-allowed"
                }`}
              >
                ← PREVIOUS
              </button>
              <button
                onClick={() => setStartIndex((prev) => prev + ITEMS_PER_PAGE)}
                disabled={!canShowNext}
                className={`px-3 md:px-4 py-1.5 text-[10px] font-sf-mono uppercase tracking-wider border transition-all duration-150 flex-1 md:flex-none md:w-32 ${
                  canShowNext
                    ? "border-primary/30 text-primary/70 hover:bg-primary/10 hover:border-primary/50"
                    : "border-primary/10 text-primary/20 cursor-not-allowed"
                }`}
              >
                NEXT →
              </button>
            </div>
            <span className="text-[9px] font-sf-mono text-primary/40 md:px-2">
              {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredPosts.length)} OF {filteredPosts.length}
            </span>
          </motion.div>
        )}

        {/* Table Header - Desktop Only */}
        <div className="hidden md:grid grid-cols-[1fr_120px_100px_40px] gap-2 px-3 py-2 border-b border-primary/30 text-[10px] font-sf-mono text-primary/50 uppercase tracking-wider">
          <span>TITLE</span>
          <span>DATE</span>
          <span>TAGS</span>
          <span></span>
        </div>

        {/* Posts List */}
        {visiblePosts.length > 0 ? (
          visiblePosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15, delay: index * 0.05 }}
              className={`border-b border-primary/10 cursor-pointer transition-all duration-150 ${
                selectedPost === post.id
                  ? hoveredId === post.id
                    ? "bg-primary/90 text-background"
                    : "bg-primary text-background"
                  : hoveredId === post.id
                    ? "bg-primary/10"
                    : ""
              }`}
              onMouseEnter={() => setHoveredId(post.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => router.push(`/updates/${post.id}`)}
            >
              {/* Desktop Row */}
              <div className="hidden md:grid grid-cols-[1fr_120px_100px_40px] gap-2 px-3 py-3 items-center">
                <div>
                  <span className="text-xs font-sf-mono font-medium">{post.title}</span>
                  <p className={`text-[10px] font-sf-mono mt-0.5 line-clamp-1 ${
                    selectedPost === post.id ? "text-background/60" : "text-primary/50"
                  }`}>
                    {post.summary}
                  </p>
                </div>
                <span className={`text-[10px] font-sf-mono ${
                  selectedPost === post.id ? "text-background/70" : "text-primary/50"
                }`}>
                  {formatDate(new Date(post.date))}
                </span>
                <div className="flex gap-1">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className={`text-[8px] font-sf-mono px-1 py-0.5 border ${
                        selectedPost === post.id 
                          ? "border-background/30 text-background/70" 
                          : "border-primary/20 text-primary/50"
                      }`}
                    >
                      {tag.toUpperCase()}
                    </span>
                  ))}
                  {post.tags.length > 2 && (
                    <span className={`text-[8px] font-sf-mono ${
                      selectedPost === post.id ? "text-background/50" : "text-primary/30"
                    }`}>
                      +{post.tags.length - 2}
                    </span>
                  )}
                </div>
                <ArrowRight className={`w-3 h-3 ${
                  selectedPost === post.id ? "text-background/70" : "text-primary/30"
                }`} />
              </div>

              {/* Mobile Row */}
              <div className="md:hidden px-3 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[11px] font-sf-mono font-medium">{post.title}</h3>
                    <p className={`text-[10px] font-sf-mono mt-0.5 line-clamp-1 ${
                      selectedPost === post.id ? "text-background/60" : "text-primary/50"
                    }`}>
                      {post.summary}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[9px] font-sf-mono ${
                        selectedPost === post.id ? "text-background/50" : "text-primary/40"
                      }`}>
                        {formatDate(new Date(post.date))}
                      </span>
                      <span className={`text-[9px] font-sf-mono ${
                        selectedPost === post.id ? "text-background/40" : "text-primary/30"
                      }`}>
                        •
                      </span>
                      <span className={`text-[9px] font-sf-mono ${
                        selectedPost === post.id ? "text-background/50" : "text-primary/40"
                      }`}>
                        {post.tags[0]?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className={`w-3 h-3 flex-shrink-0 mt-1 ${
                    selectedPost === post.id ? "text-background/70" : "text-primary/30"
                  }`} />
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex items-center justify-center py-12 border border-primary/10">
            <p className="text-xs font-sf-mono text-primary/50">NO POSTS FOUND</p>
          </div>
        )}

        {/* Footer Stats */}
        <motion.div
          className="flex items-center justify-between border-t border-primary/20 pt-3 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3 }}
        >
          <div className="flex gap-1 sm:gap-2 text-[9px] sm:text-[10px] font-sf-mono text-primary/40 uppercase tracking-wider">
            <span>{posts.length} {isMobile ? "POSTS" : "ARTICLES"}</span>
            <span className="text-primary/20">/</span>
            <span>{allTags.length} {isMobile ? "TAGS" : "TOPICS"}</span>
            <span className="text-primary/20">/</span>
            <span>{filteredPosts.length} {isMobile ? "SHOWN" : "FILTERED"}</span>
          </div>
          <div className="text-[9px] sm:text-[10px] font-sf-mono text-primary/30">LAST.UPDATED: 2025</div>
        </motion.div>
      </div>
    </PageLayout>
  )
}
