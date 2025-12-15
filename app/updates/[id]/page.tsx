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

  const [animationPhase, setAnimationPhase] = useState<"expanding" | "revealing" | "complete" | "collapsing">(
    "expanding",
  )
  const [expandRect, setExpandRect] = useState<{ top: number; left: number; width: number; height: number } | null>(
    null,
  )
  const [originalRect, setOriginalRect] = useState<{ top: number; left: number; width: number; height: number } | null>(
    null,
  )
  const [containerRect, setContainerRect] = useState<{
    top: number
    left: number
    width: number
    height: number
  } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
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
      const rect = containerRef.current.getBoundingClientRect()
      setContainerRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      })
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
      // Text reverse animation takes 300ms
      const timer = setTimeout(() => {
        setReversePhase("blank")
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [reversePhase])

  useEffect(() => {
    if (reversePhase === "blank") {
      // Small delay then pull up nav
      const timer = setTimeout(() => {
        setReversePhase("nav-up")
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [reversePhase])

  useEffect(() => {
    if (reversePhase === "nav-up") {
      // Nav pulls up over 250ms, then navigate
      const timer = setTimeout(() => {
        setReversePhase("navigating")
        router.push("/updates")
      }, 250)
      return () => clearTimeout(timer)
    }
  }, [reversePhase, router])

  const handleBackToUpdates = () => {
    if (originalRect && post) {
      // Store data for updates page collapse animation
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        sessionStorage.setItem(
          "containerRect",
          JSON.stringify({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          }),
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
        }),
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
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.35,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: {
      opacity: 0,
      y: 15,
      filter: "blur(4px)",
      transition: {
        duration: 0.2,
        ease: [0.55, 0, 1, 0.45],
      },
    },
  }

  if (loading) {
    return (
      <div className="fixed inset-0 pt-14 md:pt-16 pb-16 flex items-center justify-center">
        <div className="text-sm font-sf-mono text-primary/70">LOADING RECORD...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="fixed inset-0 pt-14 md:pt-16 pb-16 flex items-center justify-center">
        <div className="text-sm font-sf-mono text-primary/70">RECORD NOT FOUND</div>
      </div>
    )
  }

  const showContent = reversePhase === "idle" && (animationPhase === "revealing" || animationPhase === "complete")
  const isReversing = reversePhase !== "idle"

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
            disabled={isReversing}
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            BACK TO UPDATES
          </Button>

          <Button
            variant="outline"
            className="rounded-none border-primary/20 text-xs font-sf-mono bg-transparent"
            onClick={() => navigateTo("/")}
            disabled={isReversing}
          >
            RETURN TO MAIN SYSTEM
          </Button>
        </div>
      </motion.div>

      {/* Expansion animation box */}
      {expandRect && animationPhase === "expanding" && containerRect && (
        <motion.div
          className="fixed z-40 pointer-events-none border border-primary/20 bg-background dark:bg-eerie-black"
          initial={{
            top: expandRect.top,
            left: expandRect.left,
            width: expandRect.width,
            height: expandRect.height,
          }}
          animate={{
            top: containerRect.top,
            left: containerRect.left,
            width: containerRect.width,
            height: containerRect.height,
          }}
          transition={{
            duration: 0.6,
            ease: [0.32, 0.72, 0, 1],
          }}
        />
      )}

      {(reversePhase === "blank" || reversePhase === "nav-up" || reversePhase === "navigating") && containerRect && (
        <motion.div
          className="fixed z-[100] border border-primary/20 bg-background dark:bg-eerie-black"
          style={{
            top: containerRect.top,
            left: containerRect.left,
            width: containerRect.width,
            height: containerRect.height,
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
                variants={containerVariants}
                initial="hidden"
                animate={showContent ? "visible" : isReversing ? "exit" : "hidden"}
              >
                <motion.div variants={itemVariants} className="flex items-center mb-4">
                  <FileText className="h-4 w-4 mr-2 text-primary/70" />
                  <div className="text-xs font-sf-mono text-primary/70">
                    RECORD ID: {post.id} • {formatDate(new Date(post.date))}
                  </div>
                </motion.div>

                <motion.h1 variants={itemVariants} className="text-xl font-sf-mono mb-4">
                  {post.title}
                </motion.h1>

                <motion.div variants={itemVariants} className="flex items-center mb-6">
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
                <motion.div
                  variants={itemVariants}
                  className="prose prose-sm dark:prose-invert max-w-none font-sf-mono"
                >
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
