"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface LoaderProps {
  isVisible: boolean
  onComplete?: () => void
}

export function Loader({ isVisible, onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0)
  const [dataText, setDataText] = useState("LOADING DATA")

  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            onComplete?.()
          }, 300)
          return 100
        }
        return prev + 1
      })
    }, 20)

    const textInterval = setInterval(() => {
      setDataText((prev) => {
        const dots = prev.match(/\.*/g)?.join("") || ""
        if (dots.length >= 3) {
          return "LOADING DATA"
        }
        return `LOADING DATA${dots}.`
      })
    }, 500)

    return () => {
      clearInterval(interval)
      clearInterval(textInterval)
    }
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <div className="font-sf-mono text-xs text-primary/70 mb-4">{dataText}</div>
        <div className="w-40 h-1 bg-primary/10 relative">
          <motion.div
            className="absolute top-0 left-0 h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
        <div className="font-sf-mono text-xs text-primary/70 mt-2">{progress}%</div>
      </div>
    </motion.div>
  )
}
