"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface IntroLoaderProps {
  onLoadComplete: () => void
}

export function IntroLoader({ onLoadComplete }: IntroLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Small delay before showing content for smoother entrance
    const contentTimer = setTimeout(() => setShowContent(true), 100)

    // Animate progress bar
    const duration = 2000 // 2 seconds total
    const interval = 20 // Update every 20ms
    const increment = 100 / (duration / interval)

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment
        if (next >= 100) {
          clearInterval(progressTimer)
          // Complete after progress bar finishes
          setTimeout(() => onLoadComplete(), 400)
          return 100
        }
        return next
      })
    }, interval)

    return () => {
      clearTimeout(contentTimer)
      clearInterval(progressTimer)
    }
  }, [onLoadComplete])

  const greeting = "Hi, I'm"
  const name = "Rushir Bhavsar"
  const welcome = "Welcome to my portfolio"

  // Character animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.2,
      },
    },
  }

  const charVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  const welcomeVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 1,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center px-4"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      }}
    >
      {showContent && (
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto text-center">
          {/* Greeting line */}
          <motion.div
            className="flex flex-wrap justify-center gap-x-2 mb-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {greeting.split("").map((char, i) => (
              <motion.span
                key={`greeting-${i}`}
                variants={charVariants}
                className="text-lg sm:text-xl md:text-2xl font-sf-mono text-primary/60"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.div>

          {/* Name - Large and bold */}
          <motion.div
            className="flex flex-wrap justify-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {name.split("").map((char, i) => (
              <motion.span
                key={`name-${i}`}
                variants={charVariants}
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-sf-mono font-bold text-primary tracking-tight"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.div>

          {/* Welcome message */}
          <motion.p
            className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg font-sf-mono text-primary/50 tracking-wider uppercase"
            variants={welcomeVariants}
            initial="hidden"
            animate="visible"
          >
            {welcome}
          </motion.p>

          {/* Loading bar */}
          <motion.div
            className="w-full max-w-md sm:max-w-lg md:max-w-xl mt-8 sm:mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          >
            <div className="relative h-[2px] bg-primary/10 overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] sm:text-xs font-sf-mono text-primary/40 uppercase tracking-wider">
                Loading
              </span>
              <span className="text-[10px] sm:text-xs font-sf-mono text-primary/40">{Math.round(progress)}%</span>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
