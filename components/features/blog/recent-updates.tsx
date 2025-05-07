"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { getRecentPosts } from "@/lib/blog-data"
import { formatDate } from "@/lib/utils"
import { ArrowRight, Calendar, FileText } from "lucide-react"
import Link from "next/link"
import { useNavigation } from "@/contexts/navigation-context"

export function RecentUpdates() {
  const [mounted, setMounted] = useState(false)
  const { navigateTo } = useNavigation()
  const recentPosts = getRecentPosts(3)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="border border-primary/20 bg-background dark:bg-eerie-black/50"
    >
      <div className="border-b border-primary/20 p-3 flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="h-4 w-4 mr-2 text-primary/70" />
          <h2 className="text-sm font-sf-mono">LATEST UPDATES</h2>
        </div>
        <button
          onClick={() => navigateTo("/updates")}
          className="text-xs font-sf-mono text-primary/70 hover:text-primary flex items-center"
        >
          VIEW ALL
          <ArrowRight className="ml-1 h-3 w-3" />
        </button>
      </div>

      <div className="divide-y divide-primary/10">
        {recentPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            className="p-3 hover:bg-primary/5 transition-colors"
          >
            <div className="flex justify-between items-start mb-1">
              <Link
                href={`/updates/${post.id}`}
                className="text-xs font-sf-mono font-medium hover:text-primary transition-colors"
              >
                {post.title}
              </Link>
              <div className="flex items-center text-xs text-primary/60 font-sf-mono whitespace-nowrap ml-2">
                <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                {formatDate(new Date(post.date))}
              </div>
            </div>
            <p className="text-xs text-primary/70 line-clamp-2 font-sf-mono">{post.summary}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
