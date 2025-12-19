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

  const fullName = "RUSHIR BHAVSAR"

  const charVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: 0.15 + i * 0.035,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-8 md:p-12"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {showContent && (
        <div className="flex flex-col items-center justify-center w-full max-w-md">
          {/* Name */}
          <div className="flex justify-center flex-wrap overflow-hidden">
            {fullName.split("").map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={charVariants}
                initial="hidden"
                animate="visible"
                className={`text-2xl md:text-3xl lg:text-4xl font-sf-mono font-bold text-primary leading-none tracking-wider ${char === " " ? "w-3 md:w-4" : ""}`}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>

          {/* Divider */}
          <motion.div
            className="w-12 h-px bg-primary/20 mt-6 mb-6"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          />

          {/* Subtitle */}
          <motion.p
            className="text-xs md:text-sm font-sf-mono text-primary/60 tracking-wider text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            DATA SCIENTIST • AI ENGINEER • ML RESEARCHER
          </motion.p>

          {/* Progress Section */}
          <motion.div
            className="mt-12 md:mt-16 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.4 }}
          >
            {/* Progress label */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-sf-mono text-primary/40 tracking-widest">
                LOADING
              </span>
              <span className="text-[10px] font-sf-mono text-primary/70 tabular-nums tracking-wider">
                {Math.round(progress)}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-[3px] bg-primary/10 overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.05, ease: "linear" }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
