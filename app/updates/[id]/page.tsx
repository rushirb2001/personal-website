"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { getPostById, type BlogPost } from "@/lib/blog-data"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Calendar, Tag } from "lucide-react"
import { BlogContent } from "@/components/features/blog/blog-content"

type AnimationPhase = "expanding" | "revealing" | "complete"
type ReversePhase = "idle" | "text-reverse" | "blank" | "nav-up" | "navigating"

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("expanding")
  const [expandRect, setExpandRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null)
  const [originalRect, setOriginalRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null)
  const [reversePhase, setReversePhase] = useState<ReversePhase>("idle")

  useEffect(() => {
    const stored = sessionStorage.getItem("expandRect")
    if (stored) {
      const rect = JSON.parse(stored)
      setExpandRect(rect)
      setOriginalRect(rect)
      sessionStorage.removeItem("expandRect")
    } else {
      setAnimationPhase("complete")
    }
  }, [])

  useEffect(() => {
    if (params.id) {
      const postData = getPostById(params.id as string)
      if (postData) {
        setPost(postData)
      } else {
        router.push("/updates")
      }
      setLoading(false)
    }
  }, [params.id, router])

  useEffect(() => {
    if (expandRect && animationPhase === "expanding") {
      const timer = setTimeout(() => setAnimationPhase("revealing"), 600)
      return () => clearTimeout(timer)
    }
  }, [expandRect, animationPhase])

  useEffect(() => {
    if (animationPhase === "revealing") {
      const timer = setTimeout(() => setAnimationPhase("complete"), 400)
      return () => clearTimeout(timer)
    }
  }, [animationPhase])

  useEffect(() => {
    if (reversePhase === "text-reverse") {
      const timer = setTimeout(() => setReversePhase("blank"), 300)
      return () => clearTimeout(timer)
    }
  }, [reversePhase])

  useEffect(() => {
    if (reversePhase === "blank") {
      const timer = setTimeout(() => setReversePhase("nav-up"), 50)
      return () => clearTimeout(timer)
    }
  }, [reversePhase])

  useEffect(() => {
    if (reversePhase === "nav-up") {
      const timer = setTimeout(() => {
        setReversePhase("navigating")
        router.push("/updates")
      }, 250)
      return () => clearTimeout(timer)
    }
  }, [reversePhase, router])

  const handleBackToUpdates = () => {
    if (originalRect && post) {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        sessionStorage.setItem(
          "collapseContainerRect",
          JSON.stringify({
            top: containerRect.top,
            left: containerRect.left,
            width: containerRect.width,
            height: containerRect.height,
          })
        )
      }

      sessionStorage.setItem("collapseToRect", JSON.stringify(originalRect))
      sessionStorage.setItem("collapseFromPost", post.id)
      sessionStorage.setItem(
        "collapsePostData",
        JSON.stringify({
          id: post.id,
          title: post.title,
          date: post.date,
          summary: post.summary,
          tags: post.tags,
        })
      )

      setReversePhase("text-reverse")
    } else {
      router.push("/updates")
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.05 },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.04, staggerDirection: -1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: {
      opacity: 0,
      y: 12,
      transition: { duration: 0.15, ease: [0.55, 0, 1, 0.45] },
    },
  }

  if (loading) {
    return (
      <div className="fixed inset-0 pt-14 md:pt-16 pb-16 flex items-center justify-center">
        <span className="text-xs font-sf-mono text-primary/50">LOADING...</span>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="fixed inset-0 pt-14 md:pt-16 pb-16 flex items-center justify-center">
        <span className="text-xs font-sf-mono text-primary/50">NOT FOUND</span>
      </div>
    )
  }

  const showContent = reversePhase === "idle" && (animationPhase === "revealing" || animationPhase === "complete")
  const isReversing = reversePhase !== "idle"

  return (
    <>
      {/* Top Navigation */}
      <motion.div
        className="fixed top-14 md:top-16 left-0 right-0 z-40 bg-background dark:bg-eerie-black border-b border-primary/20"
        initial={{ y: -60, opacity: 0 }}
        animate={{
          y: reversePhase === "nav-up" || reversePhase === "navigating" ? -60 : 0,
          opacity: reversePhase === "nav-up" || reversePhase === "navigating" ? 0 : 1,
        }}
        transition={{
          duration: 0.25,
          ease: [0.32, 0.72, 0, 1],
          delay: reversePhase === "idle" ? 0.1 : 0,
        }}
      >
        <div className="container max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
          <button
            onClick={handleBackToUpdates}
            disabled={isReversing}
            className="flex items-center gap-1 text-[10px] font-sf-mono border border-primary/20 px-3 py-1.5 hover:bg-primary hover:text-background transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="h-3 w-3" />
            BACK
          </button>
          <div className="flex items-center gap-2 text-[9px] font-sf-mono text-primary/50">
            <Calendar className="h-3 w-3" />
            {formatDate(new Date(post.date))}
          </div>
        </div>
      </motion.div>

      {/* Expansion Animation Box */}
      {expandRect && animationPhase === "expanding" && (
        <motion.div
          className="fixed z-40 pointer-events-none border border-primary/20 bg-background dark:bg-eerie-black"
          initial={{
            top: expandRect.top,
            left: expandRect.left,
            width: expandRect.width,
            height: expandRect.height,
          }}
          animate={{
            top: 120,
            left: "50%",
            x: "-50%",
            width: "min(100vw - 2rem, 48rem)",
            height: "calc(100vh - 8rem - 4rem)",
          }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        />
      )}

      {/* Blank overlay during reverse */}
      {(reversePhase === "blank" || reversePhase === "nav-up" || reversePhase === "navigating") && (
        <motion.div
          className="fixed z-[100] border border-primary/20 bg-background dark:bg-eerie-black"
          style={{
            top: 120,
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(100vw - 2rem, 48rem)",
            height: "calc(100vh - 8rem - 4rem)",
          }}
        />
      )}

      {/* Main Content Container */}
      <motion.div
        className="fixed top-[7.5rem] left-0 right-0 bottom-16 z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: animationPhase === "expanding" ? 0 : 1 }}
        transition={{ duration: 0.15 }}
        style={{ visibility: animationPhase === "expanding" ? "hidden" : "visible" }}
      >
        <div className="container max-w-3xl mx-auto px-4 h-full py-4">
          <div
            ref={containerRef}
            className="h-full border border-primary/20 bg-background dark:bg-eerie-black/50 overflow-hidden flex flex-col"
          >
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={showContent ? "visible" : isReversing ? "exit" : "hidden"}
              >
                {/* Title */}
                <motion.h1 variants={itemVariants} className="text-lg md:text-xl font-sf-mono font-bold mb-4">
                  {post.title}
                </motion.h1>

                {/* Tags */}
                <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4">
                  <Tag className="h-3 w-3 text-primary/40" />
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-sf-mono px-2 py-0.5 border border-primary/20 text-primary/60"
                      >
                        {tag.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Summary */}
                <motion.div variants={itemVariants} className="border-l-2 border-primary/20 pl-4 mb-6">
                  <p className="text-xs font-sf-mono text-primary/60 italic">{post.summary}</p>
                </motion.div>

                {/* Content */}
                <motion.div
                  variants={itemVariants}
                  className="prose prose-sm dark:prose-invert max-w-none font-sf-mono text-sm leading-relaxed"
                >
                  <BlogContent content={post.content} />
                </motion.div>
              </motion.div>
            </div>

            {/* Footer inside container */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.2, delay: 0.3 }}
              className="border-t border-primary/10 px-4 py-2 bg-primary/5 flex-shrink-0"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-sf-mono text-primary/30">ID: {post.id}</span>
                <span className="text-[9px] font-sf-mono text-primary/30">
                  {post.tags.length} TAGS
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
