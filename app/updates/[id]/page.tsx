"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { getPostById, type BlogPost } from "@/lib/blog-data"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Calendar, Tag } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { BlogContent } from "@/components/features/blog/blog-content"

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <PageLayout title="LOADING" subtitle="...">
        <div className="flex items-center justify-center py-20">
          <span className="text-xs font-sf-mono text-primary/50">LOADING ARTICLE...</span>
        </div>
      </PageLayout>
    )
  }

  if (!post) {
    return (
      <PageLayout title="NOT FOUND" subtitle="ARTICLE DOES NOT EXIST">
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <span className="text-xs font-sf-mono text-primary/50">ARTICLE NOT FOUND</span>
          <button
            onClick={() => router.push("/updates")}
            className="text-[10px] font-sf-mono border border-primary/20 px-3 py-1.5 hover:bg-primary hover:text-background transition-colors"
          >
            ← BACK TO BLOG
          </button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="BLOG" subtitle={post.title.toUpperCase()}>
      <div className="max-w-3xl mx-auto">
        {/* Back Button & Meta */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-between mb-4 pb-3 border-b border-primary/20"
        >
          <button
            onClick={() => router.push("/updates")}
            className="flex items-center gap-1 text-[10px] font-sf-mono text-primary/60 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            BACK TO BLOG
          </button>
          <div className="flex items-center gap-1 text-[10px] font-sf-mono text-primary/50">
            <Calendar className="w-3 h-3" />
            {formatDate(new Date(post.date))}
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="text-lg md:text-xl font-sf-mono font-bold mb-4"
        >
          {post.title}
        </motion.h1>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="flex items-center gap-2 mb-6"
        >
          <Tag className="w-3 h-3 text-primary/40" />
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="border-l-2 border-primary/30 pl-4 mb-6"
        >
          <p className="text-xs font-sf-mono text-primary/60 italic">{post.summary}</p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="border border-primary/20 p-4 md:p-6"
        >
          <div className="prose prose-sm dark:prose-invert max-w-none font-sf-mono text-sm leading-relaxed">
            <BlogContent content={post.content} />
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3 }}
          className="flex items-center justify-between mt-6 pt-3 border-t border-primary/20"
        >
          <span className="text-[9px] font-sf-mono text-primary/30">ID: {post.id}</span>
          <button
            onClick={() => router.push("/updates")}
            className="text-[10px] font-sf-mono border border-primary/20 px-3 py-1.5 hover:bg-primary hover:text-background transition-colors"
          >
            ← ALL ARTICLES
          </button>
        </motion.div>
      </div>
    </PageLayout>
  )
}
