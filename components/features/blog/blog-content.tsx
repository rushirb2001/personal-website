"use client"

import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Image from "next/image"
import mermaid from "mermaid"

interface BlogContentProps {
  content: string
}

export function BlogContent({ content }: BlogContentProps) {
  const [mounted, setMounted] = useState(false)

  // Initialize mermaid when component mounts
  useEffect(() => {
    setMounted(true)

    // Configure mermaid with dark theme to match site aesthetic
    mermaid.initialize({
      startOnLoad: true,
      theme: "dark",
      securityLevel: "loose",
      fontFamily: "SF Mono, monospace",
      fontSize: 12,
      darkMode: true,
      themeVariables: {
        primaryColor: "#cccccc",
        primaryTextColor: "#ffffff",
        primaryBorderColor: "#444444",
        lineColor: "#666666",
        secondaryColor: "#333333",
        tertiaryColor: "#222222",
      },
    })

    // Render any mermaid diagrams
    setTimeout(() => {
      mermaid.contentLoaded()
    }, 300)
  }, [])

  // Function to process code blocks and identify mermaid diagrams
  const processMermaidDiagrams = () => {
    if (mounted) {
      setTimeout(() => {
        mermaid.contentLoaded()
      }, 100)
    }
  }

  // Process diagrams when content changes
  useEffect(() => {
    processMermaidDiagrams()
  }, [content, mounted])

  if (!mounted) {
    return <div className="animate-pulse h-40 bg-primary/5"></div>
  }

  return (
    <div className="blog-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-lg font-medium border-b border-primary/20 pb-2 mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-base font-medium border-b border-primary/10 pb-2 mb-3 mt-6" {...props} />
          ),
          h3: ({ node, ...props }) => <h3 className="text-sm font-medium mb-2 mt-4" {...props} />,
          p: ({ node, ...props }) => <p className="text-xs leading-relaxed mb-3 text-primary/80" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-4 text-xs text-primary/80" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-4 text-xs text-primary/80" {...props} />,
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-2 border-primary/30 pl-4 italic text-primary/70 my-4" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "")

            // Handle Mermaid code blocks
            if (match && match[1] === "mermaid") {
              return (
                <div className="my-6 border border-primary/20 p-3 bg-primary/5">
                  <div className="mermaid text-xs">{String(children).replace(/\n$/, "")}</div>
                </div>
              )
            }

            // Handle regular code blocks
            return inline ? (
              <code className="bg-primary/10 px-1 py-0.5 rounded text-xs" {...props}>
                {children}
              </code>
            ) : (
              <code className="block bg-primary/5 p-3 rounded-sm text-xs overflow-x-auto my-4 font-mono" {...props}>
                {children}
              </code>
            )
          },
          img: ({ node, alt, src, ...props }) => {
            if (!src) return null

            return (
              <div className="my-6 border border-primary/20 p-1">
                <div className="relative w-full h-[300px]">
                  <Image
                    src={src || "/placeholder.svg?height=300&width=700&query=terminal%20interface"}
                    alt={alt || "Blog image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 700px"
                    onError={(e) => {
                      // Replace with placeholder on error
                      const imgElement = e.currentTarget as HTMLImageElement
                      imgElement.src = "/placeholder.svg?key=2jaay"
                      imgElement.onerror = null // Prevent infinite error loop
                    }}
                  />
                </div>
                {alt && <div className="text-xs text-center text-primary/60 mt-1 px-1">{alt}</div>}
              </div>
            )
          },
          a: ({ node, ...props }) => (
            <a
              className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          hr: ({ node, ...props }) => <hr className="border-primary/20 my-6" {...props} />,
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-primary/20 text-xs" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-primary/5 border-b border-primary/20" {...props} />,
          tbody: ({ node, ...props }) => <tbody className="divide-y divide-primary/10" {...props} />,
          tr: ({ node, ...props }) => <tr className="hover:bg-primary/5 transition-colors" {...props} />,
          th: ({ node, ...props }) => <th className="px-3 py-2 text-left font-medium text-primary/80" {...props} />,
          td: ({ node, ...props }) => <td className="px-3 py-2 text-primary/70" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
