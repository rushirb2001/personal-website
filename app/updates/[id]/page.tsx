"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { getPostById, type BlogPost } from "@/lib/blog-data"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, ArrowRight, Calendar, FileText, Tag } from "lucide-react"
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
    if (animationPhase === "collapsing") {
      const timer = setTimeout(() => {
        router.push("/updates")
      }, 550)
      return () => clearTimeout(timer)
    }
  }, [animationPhase, router])

  const handleBackToUpdates = () => {
    if (originalRect && post) {
      // Store the target card position and post info for the updates page
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
      setAnimationPhase("collapsing")
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

  return (
    <>
      {/* Navigation bar drops down from top, slides up on collapse */}
      <motion.div
        className="fixed top-14 md:top-16 left-0 right-0 z-50 bg-background dark:bg-eerie-black border-b border-primary/20"
        initial={{ y: -60, opacity: 0 }}
        animate={{
          y: animationPhase === "collapsing" ? -60 : 0,
          opacity: animationPhase === "collapsing" ? 0 : 1,
        }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1], delay: animationPhase === "collapsing" ? 0 : 0.1 }}
      >
        <div className="container max-w-3xl mx-auto px-4 py-4 flex justify-between">
          <Button
            variant="outline"
            className="rounded-none border-primary/20 text-xs font-sf-mono flex items-center bg-transparent"
            onClick={handleBackToUpdates}
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            BACK TO UPDATES
          </Button>

          <Button
            variant="outline"
            className="rounded-none border-primary/20 text-xs font-sf-mono bg-transparent"
            onClick={() => navigateTo("/")}
          >
            RETURN TO MAIN SYSTEM
          </Button>
        </div>
      </motion.div>

      {/* Expansion animation box */}
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
            top: 152,
            left: "50%",
            x: "-50%",
            width: "min(100vw - 2rem, 48rem)",
            height: "calc(100vh - 9.5rem - 4rem)",
          }}
          transition={{
            duration: 0.6,
            ease: [0.32, 0.72, 0, 1],
          }}
        />
      )}

      {originalRect && animationPhase === "collapsing" && post && (
        <motion.div
          className="fixed z-40 pointer-events-none border border-primary/20 bg-background dark:bg-eerie-black overflow-hidden"
          initial={{
            top: 152,
            left: "50%",
            x: "-50%",
            width: "min(100vw - 2rem, 48rem)",
            height: "calc(100vh - 9.5rem - 4rem)",
          }}
          animate={{
            top: originalRect.top,
            left: originalRect.left,
            x: 0,
            width: originalRect.width,
            height: originalRect.height,
          }}
          transition={{
            duration: 0.5,
            ease: [0.32, 0.72, 0, 1],
          }}
        >
          {/* Card preview content that appears during collapse */}
          <motion.div
            className="p-4 h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.25 }}
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-sm font-sf-mono font-medium line-clamp-1">{post.title}</h2>
              <div className="flex items-center text-xs text-primary/60 font-sf-mono whitespace-nowrap ml-2">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(new Date(post.date))}
              </div>
            </div>

            <p className="text-xs text-primary/70 mb-3 font-sf-mono line-clamp-2">{post.summary}</p>

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
          </motion.div>
        </motion.div>
      )}

      {/* Main content container - hide during collapse */}
      <motion.div
        className="fixed top-[9.5rem] left-0 right-0 bottom-16 z-30"
        initial={{ opacity: 0 }}
        animate={{
          opacity: animationPhase === "expanding" || animationPhase === "collapsing" ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
        style={{
          visibility: animationPhase === "expanding" || animationPhase === "collapsing" ? "hidden" : "visible",
        }}
      >
        <div className="container max-w-3xl mx-auto px-4 h-full">
          <div className="h-full border border-primary/20 bg-background dark:bg-eerie-black/50 overflow-hidden">
            {/* Scrollable Content Inside Window */}
            <div className="h-full overflow-y-auto p-6">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={animationPhase === "complete" || animationPhase === "revealing" ? "visible" : "hidden"}
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
