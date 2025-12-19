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

    const duration = 2200000
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
            className="items-center font-sf-mono text-primary tracking-wider mb-10 md:mb-14 py-0 text-4xl font-black"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            RUSHIR BHAVSAR
          </motion.h1>

          {/* Greeting */}
          <motion.div
            className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mb-16 md:mb-20 px-4 py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <span className="text-sm md:text-base font-sf-mono text-primary/70 tracking-tighter">
              HI, THERE!
            </span>
            <span className="text-sm md:text-base font-sf-mono text-primary tracking-tighter">
              WELCOME TO MY PORTFOLIO
            </span>
          </motion.div>

          {/* Loading Section */}
          <motion.div
            className="w-full flex flex-col items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            {/* Loading label */}
            <span className="text-xs font-sf-mono font-bold text-primary tracking-widest mb-3 block">
              LOADING...
            </span>

            {/* Progress box - centered independently */}
            <div className="w-full max-w-sm h-7 md:h-8 border-[3px] border-primary p-[3px]">
              <div className="h-full w-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.05, ease: "linear" }}
                />
              </div>
            </div>

            {/* Percentage - below bar */}
            <span className="mt-3 font-sf-mono font-bold text-primary tabular-nums text-sm">
              {Math.round(progress)}%
            </span>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
