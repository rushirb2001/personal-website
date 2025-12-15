"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { getPostById, type BlogPost } from "@/lib/blog-data"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, FileText, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigation } from "@/contexts/navigation-context"
import { BlogContent } from "@/components/features/blog/blog-content"

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const { navigateTo } = useNavigation()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  const containerRef = useRef<HTMLDivElement>(null)
  const [containerRect, setContainerRect] = useState<{
    top: number
    left: number
    width: number
    height: number
  } | null>(null)

  const [animationPhase, setAnimationPhase] = useState<"expanding" | "revealing" | "complete" | "collapsing">(
    "expanding",
  )
  const [expandRect, setExpandRect] = useState<{ top: number; left: number; width: number; height: number } | null>(
    null,
  )
  const [originalRect, setOriginalRect] = useState<{ top: number; left: number; width: number; height: number } | null>(
    null,
  )
  const [reversePhase, setReversePhase] = useState<"idle" | "text-reverse" | "blank" | "nav-up" | "navigating">("idle")

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
    if (containerRef.current) {
      const measureContainer = () => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (rect) {
          setContainerRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          })
        }
      }

      // Use double RAF to ensure layout is complete
      requestAnimationFrame(() => {
        requestAnimationFrame(measureContainer)
      })
    }
  }, [loading, post])

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
      const timer = setTimeout(() => {
        setAnimationPhase("revealing")
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [expandRect, animationPhase])

  useEffect(() => {
    if (animationPhase === "revealing") {
      const timer = setTimeout(() => {
        setAnimationPhase("complete")
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [animationPhase])

  useEffect(() => {
    if (reversePhase === "text-reverse") {
      const timer = setTimeout(() => {
        setReversePhase("blank")
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [reversePhase])

  useEffect(() => {
    if (reversePhase === "blank") {
      const timer = setTimeout(() => {
        setReversePhase("nav-up")
      }, 50)
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
      if (containerRect) {
        sessionStorage.setItem("collapseContainerRect", JSON.stringify(containerRect))
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
        }),
      )

      setReversePhase("text-reverse")
    } else {
      router.push("/updates")
    }
  }

  const getTargetDimensions = () => {
    if (containerRect) {
      return containerRect
    }
    // Fallback calculation matching updates page exactly
    const viewportWidth = typeof window !== "undefined" ? document.documentElement.clientWidth : 1024
    const calculatedWidth = Math.min(viewportWidth - 32, 768)
    return {
      top: 152,
      left: Math.max(16, (viewportWidth - calculatedWidth) / 2),
      width: calculatedWidth,
      height: typeof window !== "undefined" ? window.innerHeight - 152 - 64 : 500,
    }
  }

  const targetDimensions = getTargetDimensions()

  return (
    <>
      {/* Navigation bar drops down from top */}
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
          delay: reversePhase === "idle" ? 0.1 : reversePhase === "nav-up" || reversePhase === "navigating" ? 0 : 0.7,
        }}
      >
        <div className="container max-w-3xl mx-auto px-4 py-4 flex justify-between">
          <Button
            variant="outline"
            className="rounded-none border-primary/20 text-xs font-sf-mono flex items-center bg-transparent"
            onClick={handleBackToUpdates}
            disabled={reversePhase !== "idle"}
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            BACK TO UPDATES
          </Button>

          <Button
            variant="outline"
            className="rounded-none border-primary/20 text-xs font-sf-mono bg-transparent"
            onClick={() => navigateTo("/")}
            disabled={reversePhase !== "idle"}
          >
            RETURN TO MAIN SYSTEM
          </Button>
        </div>
      </motion.div>

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
            top: targetDimensions.top,
            left: targetDimensions.left,
            width: targetDimensions.width,
            height: targetDimensions.height,
          }}
          transition={{
            duration: 0.6,
            ease: [0.32, 0.72, 0, 1],
          }}
        />
      )}

      {(reversePhase === "blank" || reversePhase === "nav-up" || reversePhase === "navigating") && (
        <motion.div
          className="fixed z-[100] border border-primary/20 bg-background dark:bg-eerie-black"
          style={{
            top: targetDimensions.top,
            left: targetDimensions.left,
            width: targetDimensions.width,
            height: targetDimensions.height,
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        />
      )}

      {/* Main content container */}
      <motion.div
        className="fixed top-[9.5rem] left-0 right-0 bottom-16 z-30"
        initial={{ opacity: 0 }}
        animate={{
          opacity: animationPhase === "expanding" ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
        style={{
          visibility: animationPhase === "expanding" ? "hidden" : "visible",
        }}
      >
        <div className="container max-w-3xl mx-auto px-4 h-full">
          <div
            ref={containerRef}
            className="h-full border border-primary/20 bg-background dark:bg-eerie-black/50 overflow-hidden"
          >
            {/* Scrollable Content Inside Window */}
            <div className="h-full overflow-y-auto p-6">
              <motion.div
                className="flex flex-col space-y-4"
                initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <motion.div className="flex items-center mb-4">
                  <FileText className="h-4 w-4 mr-2 text-primary/70" />
                  <div className="text-xs font-sf-mono text-primary/70">
                    RECORD ID: {post.id} • {formatDate(new Date(post.date))}
                  </div>
                </motion.div>

                <motion.h1 className="text-xl font-sf-mono mb-4">{post.title}</motion.h1>

                <motion.div className="flex items-center mb-6">
                  <Tag className="h-3 w-3 mr-2 text-primary/50" />
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-sf-mono px-2 py-0.5 border border-primary/20 text-primary/70"
                      >
                        {tag.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Blog content */}
                <motion.div className="prose prose-sm dark:prose-invert max-w-none font-sf-mono">
                  <BlogContent content={post.content} />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
