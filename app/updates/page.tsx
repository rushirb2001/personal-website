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

  const articleRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const [returningPostId, setReturningPostId] = useState<string | null>(null)
  const [highlightedPostId, setHighlightedPostId] = useState<string | null>(null)
  const isReturningFromArticle = useRef(false)

  const [collapseAnimation, setCollapseAnimation] = useState<{
    show: boolean
    phase: "collapsing" | "landing" | "done"
    startRect: { top: number; left: number; width: number; height: number }
    endRect: { top: number; left: number; width: number; height: number } | null
    postData: BlogPost | null
  }>({ show: false, phase: "done", startRect: { top: 0, left: 0, width: 0, height: 0 }, endRect: null, postData: null })

  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)))

  const filteredPosts =
    selectedTags.length > 0 ? posts.filter((post) => post.tags.some((tag) => selectedTags.includes(tag))) : posts

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  // Check synchronously before first render
  if (typeof window !== "undefined" && !isReturningFromArticle.current) {
    const collapseRect = sessionStorage.getItem("collapseToRect")
    const collapsePostId = sessionStorage.getItem("collapseFromPost")
    if (collapseRect && collapsePostId) {
      isReturningFromArticle.current = true
    }
  }

  useEffect(() => {
    const collapseRect = sessionStorage.getItem("collapseToRect")
    const collapsePostId = sessionStorage.getItem("collapseFromPost")
    const collapsePostData = sessionStorage.getItem("collapsePostData")

    if (collapseRect && collapsePostId && collapsePostData) {
      const originalCardRect = JSON.parse(collapseRect)
      const postData = JSON.parse(collapsePostData)

      setReturningPostId(collapsePostId)

      sessionStorage.removeItem("collapseToRect")
      sessionStorage.removeItem("collapseFromPost")
      sessionStorage.removeItem("collapsePostData")

      // Start collapse animation from full container position
      // Calculate starting position (same as article page container)
      const startRect = {
        top: 152, // 9.5rem in pixels
        left: Math.max(16, (window.innerWidth - Math.min(window.innerWidth - 32, 768)) / 2),
        width: Math.min(window.innerWidth - 32, 768),
        height: window.innerHeight - 152 - 64, // viewport minus top and bottom
      }

      // Get target card position after a frame to ensure DOM is ready
      requestAnimationFrame(() => {
        const targetElement = articleRefs.current.get(collapsePostId)
        if (targetElement) {
          const endRect = targetElement.getBoundingClientRect()

          setCollapseAnimation({
            show: true,
            phase: "collapsing",
            startRect,
            endRect: {
              top: endRect.top,
              left: endRect.left,
              width: endRect.width,
              height: endRect.height,
            },
            postData,
          })

          // After collapse animation completes, show the actual card
          setTimeout(() => {
            setCollapseAnimation((prev) => ({ ...prev, phase: "landing" }))

            setTimeout(() => {
              setCollapseAnimation((prev) => ({ ...prev, show: false, phase: "done" }))
              setReturningPostId(null)
              setHighlightedPostId(collapsePostId)

              setTimeout(() => {
                setHighlightedPostId(null)
              }, 300)
            }, 100)
          }, 500)
        } else {
          // Fallback if element not found
          setReturningPostId(null)
        }
      })
    }
  }, [])

  const handleReturnToMain = () => {
    router.push("/")
  }

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
        }),
      )
      router.push(`/updates/${post.id}`)
    }
  }

  return (
    <PageLayout title="BLOG" subtitle="ARTICLES, DAILY BLOGS AND LIFE UPDATES">
      <AnimatePresence>
        {collapseAnimation.show && collapseAnimation.endRect && collapseAnimation.postData && (
          <motion.div
            className="fixed z-50 border border-primary/20 bg-background dark:bg-eerie-black overflow-hidden pointer-events-none"
            initial={{
              top: collapseAnimation.startRect.top,
              left: collapseAnimation.startRect.left,
              width: collapseAnimation.startRect.width,
              height: collapseAnimation.startRect.height,
            }}
            animate={{
              top: collapseAnimation.endRect.top,
              left: collapseAnimation.endRect.left,
              width: collapseAnimation.endRect.width,
              height: collapseAnimation.endRect.height,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.32, 0.72, 0, 1],
            }}
          >
            {/* Card content that morphs into place */}
            <motion.div
              className="p-4 h-full"
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.15, duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-sm font-sf-mono font-medium line-clamp-1">{collapseAnimation.postData.title}</h2>
                <div className="flex items-center text-xs text-primary/60 font-sf-mono whitespace-nowrap ml-2">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(new Date(collapseAnimation.postData.date))}
                </div>
              </div>

              <p className="text-xs text-primary/70 mb-3 font-sf-mono line-clamp-2">
                {collapseAnimation.postData.summary}
              </p>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3 text-primary/50" />
                  <div className="flex gap-1">
                    {collapseAnimation.postData.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-xs text-primary/50 font-sf-mono">
                        {tag}
                      </span>
                    ))}
                    {collapseAnimation.postData.tags.length > 3 && (
                      <span className="text-xs text-primary/50 font-sf-mono">
                        +{collapseAnimation.postData.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs font-sf-mono text-primary/70 flex items-center">
                  READ ENTRY
                  <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </div>
            </motion.div>
          </motion.div>
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
                            setIsDropdownOpen(false)
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
                          setIsDropdownOpen(false)
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

          <div className="space-y-4">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                ref={(el) => {
                  if (el) articleRefs.current.set(post.id, el)
                }}
                initial={{
                  opacity: isReturningFromArticle.current ? 1 : 0,
                  y: isReturningFromArticle.current ? 0 : 20,
                }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: isReturningFromArticle.current ? 0 : index * 0.1,
                  duration: isReturningFromArticle.current ? 0 : 0.5,
                }}
                className={`border transition-all duration-300 cursor-pointer ${
                  highlightedPostId === post.id
                    ? "border-primary/60 bg-primary/10"
                    : "border-primary/20 hover:border-primary/40"
                }`}
                style={{
                  opacity: returningPostId === post.id && collapseAnimation.phase !== "done" ? 0 : undefined,
                  visibility: returningPostId === post.id && collapseAnimation.phase !== "done" ? "hidden" : undefined,
                }}
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
