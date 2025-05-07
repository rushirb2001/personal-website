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

  useEffect(() => {
    if (params.id) {
      const postData = getPostById(params.id as string)
      if (postData) {
        setPost(postData)
      } else {
        // Post not found, redirect to updates page
        router.push("/updates")
      }
      setLoading(false)
    }
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-24 flex items-center justify-center">
        <div className="text-sm font-sf-mono text-primary/70">LOADING RECORD...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-20 pb-24 flex items-center justify-center">
        <div className="text-sm font-sf-mono text-primary/70">RECORD NOT FOUND</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="container max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 border border-primary/20 p-4 bg-background dark:bg-eerie-black/50"
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
                <span key={tag} className="text-xs font-sf-mono px-2 py-0.5 border border-primary/20 text-primary/70">
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

        <div className="flex justify-between">
          <Button
            variant="outline"
            className="rounded-none border-primary/20 text-xs font-sf-mono flex items-center"
            onClick={() => router.push("/updates")}
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            BACK TO UPDATES
          </Button>

          <Button
            variant="outline"
            className="rounded-none border-primary/20 text-xs font-sf-mono"
            onClick={() => navigateTo("/")}
          >
            RETURN TO MAIN SYSTEM
          </Button>
        </div>
      </div>
    </div>
  )
}
