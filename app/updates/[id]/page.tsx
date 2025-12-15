"use client"

import { useEffect, useState } from "react"
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
  const [showNavBar, setShowNavBar] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [expandRect, setExpandRect] = useState<{ top: number; left: number; width: number; height: number } | null>(
    null,
  )

  useEffect(() => {
    const stored = sessionStorage.getItem("expandRect")
    if (stored) {
      setExpandRect(JSON.parse(stored))
      sessionStorage.removeItem("expandRect")
    }
  }, [])

  useEffect(() => {
    if (params.id) {
      const postData = getPostById(params.id as string)
      if (postData) {
        setPost(postData)
        setShowNavBar(true)
        setTimeout(() => {
          setShowContent(true)
        }, 550)
      } else {
        router.push("/updates")
      }
      setLoading(false)
    }
  }, [params.id, router])

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
      {/* Navigation bar drops down from top */}
      <motion.div
        className="fixed top-14 md:top-16 left-0 right-0 z-50 bg-background dark:bg-eerie-black border-b border-primary/20"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: showNavBar ? 0 : -60, opacity: showNavBar ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="container max-w-3xl mx-auto px-4 py-4 flex justify-between">
          <Button
            variant="outline"
            className="rounded-none border-primary/20 text-xs font-sf-mono flex items-center bg-transparent"
            onClick={() => router.push("/updates")}
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

      {expandRect && (
        <motion.div
          className="fixed z-40 overflow-hidden pointer-events-none"
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
            duration: 0.55,
            ease: [0.32, 0.72, 0, 1],
          }}
        >
          <div className="h-full w-full border border-primary/20 bg-background dark:bg-eerie-black/50 overflow-hidden" />
        </motion.div>
      )}

      {/* Wrapped content container with invisible initial state, becomes visible during blur animation */}
      <div
        className="fixed top-[9.5rem] md:top-[9.5rem] left-0 right-0 bottom-16 z-30 opacity-0"
        style={{ visibility: showContent ? "visible" : "hidden" }}
      >
        <div className="container max-w-3xl mx-auto px-4 h-full">
          <div className="h-full border border-primary/20 bg-background dark:bg-eerie-black/50 overflow-hidden">
            {/* Scrollable Content Inside Window */}
            <div className="h-full overflow-y-auto p-6">
              <motion.div
                initial={{ opacity: 0, filter: "blur(12px)" }}
                animate={{
                  opacity: showContent ? 1 : 0,
                  filter: showContent ? "blur(0px)" : "blur(12px)",
                }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              >
                <div className="flex items-center mb-4">
                  <FileText className="h-4 w-4 mr-2 text-primary/70" />
                  <div className="text-xs font-sf-mono text-primary/70">
                    RECORD ID: {post.id} • {formatDate(new Date(post.date))}
                  </div>
                </div>

                <h1 className="text-xl font-sf-mono mb-4">{post.title}</h1>

                <div className="flex items-center mb-6">
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
                </div>

                {/* Blog content */}
                <div className="prose prose-sm dark:prose-invert max-w-none font-sf-mono">
                  <BlogContent content={post.content} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
