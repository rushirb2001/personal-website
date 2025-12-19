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

  const lineOne = "SYSTEM.INIT"
  const firstName = "RUSHIR"
  const lastName = "BHAVSAR"
  const lineThree = "PORTFOLIO.V1"

  const lineVariants = {
    hidden: { opacity: 0 },
    visible: (delay: number) => ({
      opacity: 1,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
  }

  const nameContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.4,
      },
    },
  }

  const charVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center px-6"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 0.98 : 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {showContent && (
        <div className="w-full max-w-md border border-primary/20 bg-primary/[0.02]">
          {/* Header */}
          <div className="bg-primary/5 px-4 py-3 border-b border-primary/20">
            <motion.p
              className="text-[9px] font-sf-mono text-primary/60 tracking-wider uppercase"
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              custom={0.1}
            >
              {lineOne}
            </motion.p>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            {/* Name display */}
            <div className="flex flex-col gap-1 mb-6">
              {/* First name */}
              <motion.div
                className="flex"
                variants={nameContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {firstName.split("").map((char, i) => (
                  <motion.span
                    key={`first-${i}`}
                    variants={charVariants}
                    className="text-xl font-sf-mono font-bold text-primary tracking-tight leading-none"
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>

              {/* Last name */}
              <motion.div
                className="flex"
                variants={nameContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {lastName.split("").map((char, i) => (
                  <motion.span
                    key={`last-${i}`}
                    variants={charVariants}
                    className="text-xl font-sf-mono font-bold text-primary tracking-tight leading-none"
                    style={{ transitionDelay: `${(firstName.length + i) * 0.04}s` }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            {/* Progress bar */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <div className="relative h-[1px] bg-primary/20 overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-primary transition-[width] duration-75 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[9px] font-sf-mono text-primary/60 uppercase tracking-wider">
                  Loading
                </span>
                <span className="text-[9px] font-sf-mono text-primary/60 tabular-nums tracking-wider">
                  {Math.round(progress).toString().padStart(3, "0")}%
                </span>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="bg-primary/5 px-4 py-3 border-t border-primary/20">
            <motion.p
              className="text-[9px] font-sf-mono text-primary/40 tracking-wider uppercase"
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              custom={1.2}
            >
              {lineThree}
            </motion.p>
          </div>
        </div>
      )}
    </motion.div>
  )
}
