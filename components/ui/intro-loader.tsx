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

  const lineOne = "HI, MY NAME IS"
  const firstName = "RUSHIR"
  const lastName = "BHAVSAR"
  const lineThree = "WELCOME TO MY PORTFOLIO"

  const lineVariants = {
    hidden: { opacity: 0 },
    visible: (delay: number) => ({
      opacity: 1,
      transition: {
        duration: 0.5,
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
        staggerChildren: 0.03,
        delayChildren: 0.3,
      },
    },
  }

  const charVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center px-8 md:px-12"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 0.98 : 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {showContent && (
        <div className="flex flex-col items-center justify-center w-full max-w-5xl">
          {/* Top label - more space from name */}
          <motion.div
            className="mb-16 md:mb-20"
            variants={lineVariants}
            initial="hidden"
            animate="visible"
            custom={0.1}
          >
            <p className="text-[10px] md:text-xs font-sf-mono text-primary/60 tracking-widest uppercase">
              {lineOne}
            </p>
          </motion.div>

          {/* Name display - proper letter spacing */}
          <div className="flex flex-col items-center gap-2 md:gap-3">
            {/* First name */}
            <motion.div
              className="flex justify-center gap-[2px] md:gap-1"
              variants={nameContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {firstName.split("").map((char, i) => (
                <motion.span
                  key={`first-${i}`}
                  variants={charVariants}
                  className="text-5xl md:text-7xl lg:text-8xl font-sf-mono font-bold text-primary leading-none"
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>

            {/* Last name */}
            <motion.div
              className="flex justify-center gap-[2px] md:gap-1"
              variants={nameContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {lastName.split("").map((char, i) => (
                <motion.span
                  key={`last-${i}`}
                  variants={charVariants}
                  className="text-5xl md:text-7xl lg:text-8xl font-sf-mono font-bold text-primary leading-none"
                  style={{ transitionDelay: `${(firstName.length + i) * 0.03}s` }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Bottom label - more space from name */}
          <motion.div
            className="mt-16 md:mt-20"
            variants={lineVariants}
            initial="hidden"
            animate="visible"
            custom={1.0}
          >
            <p className="text-[10px] md:text-xs font-sf-mono text-primary/40 tracking-widest uppercase">
              {lineThree}
            </p>
          </motion.div>

          {/* Progress bar - proper separation and width */}
          <motion.div
            className="w-full max-w-xs md:max-w-md mt-20 md:mt-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          >
            <div className="relative h-[2px] bg-primary/20 overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-primary transition-[width] duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Progress labels - proper spacing */}
            <div className="flex justify-between items-center mt-3">
              <span className="text-[9px] md:text-[10px] font-sf-mono text-primary/40 uppercase tracking-wider">
                Loading
              </span>
              <span className="text-[9px] md:text-[10px] font-sf-mono text-primary/60 tabular-nums tracking-wider">
                {Math.round(progress).toString().padStart(3, "0")}%
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
