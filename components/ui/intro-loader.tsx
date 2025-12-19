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

  const firstName = "RUSHIR"
  const lastName = "BHAVSAR"

  const charVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2 + i * 0.04,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {showContent && (
        <div className="flex flex-col items-center justify-center w-full px-6">
          {/* Name */}
          <div className="flex flex-col items-center gap-1 md:gap-2">
            <div className="flex justify-center overflow-hidden">
              {firstName.split("").map((char, i) => (
                <motion.span
                  key={`first-${i}`}
                  custom={i}
                  variants={charVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-5xl md:text-7xl lg:text-8xl font-sf-mono font-bold text-primary leading-none tracking-tight"
                >
                  {char}
                </motion.span>
              ))}
            </div>

            <div className="flex justify-center overflow-hidden">
              {lastName.split("").map((char, i) => (
                <motion.span
                  key={`last-${i}`}
                  custom={firstName.length + i}
                  variants={charVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-5xl md:text-7xl lg:text-8xl font-sf-mono font-bold text-primary leading-none tracking-tight"
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Subtitle */}
          <motion.p
            className="mt-8 md:mt-12 text-[10px] md:text-[11px] font-sf-mono text-primary/40 tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            DATA SCIENTIST • AI ENGINEER • ML RESEARCHER
          </motion.p>

          {/* Progress */}
          <motion.div
            className="mt-16 md:mt-20 w-full max-w-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          >
            <div className="h-px bg-primary/10 overflow-hidden">
              <motion.div
                className="h-full bg-primary/60"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.05, ease: "linear" }}
              />
            </div>

            <div className="flex justify-end mt-2">
              <span className="text-[9px] font-sf-mono text-primary/30 tabular-nums">
                {Math.round(progress).toString().padStart(3, "0")}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
