"use client"

import { motion } from "framer-motion"
import { useState, useEffect, useCallback } from "react"

interface IntroLoaderProps {
  onLoadComplete: () => void
}

export function IntroLoader({ onLoadComplete }: IntroLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [showContent, setShowContent] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  const handleComplete = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      onLoadComplete()
    }, 600)
  }, [onLoadComplete])

  useEffect(() => {
    const contentTimer = setTimeout(() => setShowContent(true), 100)

    const duration = 2200
    const interval = 20
    const increment = 100 / (duration / interval)

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment
        if (next >= 100) {
          clearInterval(progressTimer)
          setTimeout(() => handleComplete(), 400)
          return 100
        }
        return next
      })
    }, interval)

    return () => {
      clearTimeout(contentTimer)
      clearInterval(progressTimer)
    }
  }, [handleComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center px-8 md:px-16"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {showContent && (
        <div className="flex flex-col items-center w-full max-w-2xl">
          {/* Name */}
          <motion.h1
            className="text-2xl md:text-3xl font-sf-mono font-bold text-primary tracking-wider mb-8 md:mb-12"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            RUSHIR BHAVSAR
          </motion.h1>

          {/* Greeting */}
          <motion.div
            className="flex flex-col md:flex-row items-center gap-1 md:gap-3 mb-12 md:mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <span className="text-sm md:text-base font-sf-mono text-primary/70 tracking-wide">
              HI, THERE!
            </span>
            <span className="text-sm md:text-base font-sf-mono text-primary tracking-wide">
              WELCOME TO MY PORTFOLIO
            </span>
          </motion.div>

          {/* Loading Section */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            {/* Loading label */}
            <span className="text-xs font-sf-mono font-bold text-primary tracking-widest mb-2 block">
              LOADING
            </span>

            {/* Progress bar container with percentage */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Progress box */}
              <div className="flex-1 h-6 md:h-8 border-[3px] border-primary overflow-hidden relative">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-primary"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.05, ease: "linear" }}
                />
              </div>

              {/* Percentage */}
              <span className="text-xl md:text-2xl font-sf-mono font-bold text-primary tabular-nums min-w-[4ch]">
                {Math.round(progress)}%
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
