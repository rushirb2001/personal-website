"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getPublishedPosts, type BlogPost } from "@/lib/blog-data"
import { formatDate } from "@/lib/utils"
import { ArrowRight, Calendar, Tag, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageLayout } from "@/components/layout/page-layout"
import { useRouter } from "next/navigation"

export default function UpdatesPage() {
  const posts = getPublishedPosts()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  const [expandingPost, setExpandingPost] = useState<BlogPost | null>(null)
  const [expandRect, setExpandRect] = useState<DOMRect | null>(null)
  const articleRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // Get all unique tags
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)))

  // Filter posts by selected tags
  const filteredPosts =
    selectedTags.length > 0 ? posts.filter((post) => post.tags.some((tag) => selectedTags.includes(tag))) : posts

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  // Use useEffect to ensure we're mounted before trying to use context
  useEffect(() => {
    setMounted(true)
  }, [])

  // Function to navigate without using the context
  const handleReturnToMain = () => {
    router.push("/")
  }

  const handleArticleClick = (e: React.MouseEvent, post: BlogPost) => {
    e.preventDefault()
    const element = articleRefs.current.get(post.id)
    if (element) {
      const rect = element.getBoundingClientRect()
      setExpandRect(rect)
      setExpandingPost(post)

      setTimeout(() => {
        router.push(`/updates/${post.id}`)
      }, 400)
    }
  }

  return (
    <PageLayout title="BLOG" subtitle="ARTICLES, DAILY BLOGS AND LIFE UPDATES">
      <AnimatePresence>
        {expandingPost && expandRect && (
          <motion.div
            className="fixed z-50 overflow-hidden pointer-events-none"
            initial={{
              top: expandRect.top,
              left: expandRect.left,
              width: expandRect.width,
              height: expandRect.height,
              borderRadius: 0,
            }}
            animate={{
              top: "9.5rem",
              left: "50%",
              x: "-50%",
              width: "min(100vw - 2rem, 48rem)",
              height: "calc(100vh - 9.5rem - 4rem)",
              borderRadius: 0,
            }}
            transition={{
              duration: 0.45,
              ease: [0.32, 0.72, 0, 1],
            }}
          >
            <motion.div
              className="h-full w-full border border-primary/20 bg-background dark:bg-eerie-black overflow-hidden"
              initial={{ scale: 1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="h-full overflow-hidden p-6">
                <motion.div
                  initial={{ opacity: 1, filter: "blur(0px)" }}
                  animate={{ opacity: 0, filter: "blur(8px)" }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-sm font-sf-mono font-medium">{expandingPost.title}</h2>
                    <div className="flex items-center text-xs text-primary/60 font-sf-mono">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(new Date(expandingPost.date))}
                    </div>
                  </div>
                  <p className="text-xs text-primary/70 mb-3 font-sf-mono">{expandingPost.summary}</p>
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3 text-primary/50" />
                    {expandingPost.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs text-primary/50 font-sf-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {expandingPost && (
          <motion.div
            className="fixed inset-0 z-40 bg-background/50 dark:bg-eerie-black/50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <div className="container max-w-4xl mx-auto px-2 md:px-4">
        <div className="mb-8 border border-primary/20 p-2 md:p-4 bg-background dark:bg-eerie-black/50 -mx-2 md:mx-0">
          <div className="flex flex-col mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Terminal className="h-4 w-4 mr-2 text-primary/70" />
                <h1 className="text-lg font-sf-mono">BLOG ARTICLES </h1>
              </div>
              <div className="text-xs font-sf-mono text-primary/70">
                DISPLAYING {filteredPosts.length} ARTICLE{filteredPosts.length !== 1 ? "S" : ""}
              </div>
            </div>

            {/* Tags filter dropdown */}
            <div className="relative w-full border border-primary/20 mb-4 mt-2 bg-card/10">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-sf-mono bg-card/20"
              >
                <span className="text-primary/70">
                  {selectedTags.length > 0
                    ? `FILTER: ${selectedTags.length} TAG${selectedTags.length !== 1 ? "S" : ""} SELECTED`
                    : "FILTER BY TAG"}
                </span>
                <span className="text-primary/70">{isDropdownOpen ? "▲" : "▼"}</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 w-full bg-background dark:bg-eerie-black/90 border border-primary/20 border-t-0 max-h-60 overflow-y-auto">
                  <div className="p-2 grid grid-cols-2 gap-1">
                    {allTags.map((tag) => (
                      <div key={tag} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`tag-${tag}`}
                          checked={selectedTags.includes(tag)}
                          onChange={() => {
                            toggleTag(tag)
                            setIsDropdownOpen(false) // Auto-collapse after selection
                          }}
                          className="mr-2 accent-primary"
                        />
                        <label htmlFor={`tag-${tag}`} className="text-xs font-sf-mono cursor-pointer">
                          {tag.toUpperCase()}
                        </label>
                      </div>
                    ))}
                  </div>
                  {selectedTags.length > 0 && (
                    <div className="border-t border-primary/20 p-2 flex justify-between bg-card/20">
                      <span className="text-xs font-sf-mono text-primary/70">{selectedTags.length} SELECTED</span>
                      <button
                        onClick={() => {
                          setSelectedTags([])
                          setIsDropdownOpen(false) // Auto-collapse after clearing
                        }}
                        className="text-xs font-sf-mono text-primary/70 hover:text-primary"
                      >
                        CLEAR ALL
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Posts list */}
          <div className="space-y-4">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                ref={(el) => {
                  if (el) articleRefs.current.set(post.id, el)
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: expandingPost?.id === post.id ? 0 : 1,
                  y: 0,
                }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="border border-primary/20 hover:border-primary/40 transition-colors cursor-pointer"
                onClick={(e) => handleArticleClick(e, post)}
              >
                <div className="p-4 hover:bg-primary/5 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-sm font-sf-mono font-medium">{post.title}</h2>
                    <div className="flex items-center text-xs text-primary/60 font-sf-mono">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(new Date(post.date))}
                    </div>
                  </div>

                  <p className="text-xs text-primary/70 mb-3 font-sf-mono">{post.summary}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3 text-primary/50" />
                      <div className="flex gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs text-primary/50 font-sf-mono">
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-primary/50 font-sf-mono">+{post.tags.length - 3}</span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs font-sf-mono text-primary/70 flex items-center">
                      READ ENTRY
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-8 border border-primary/10 mt-4">
              <div className="text-sm font-sf-mono text-primary/50 mb-2">NO RECORDS FOUND</div>
              <div className="text-xs font-sf-mono text-primary/40">Try adjusting your filter criteria</div>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            className="rounded-none border-primary/20 text-xs font-sf-mono bg-transparent"
            onClick={handleReturnToMain}
          >
            RETURN TO MAIN PAGE
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}
