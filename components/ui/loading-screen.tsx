"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<"loading" | "transitioning" | "complete">("loading")
  const nameRef = useRef<HTMLDivElement>(null)
  const [namePosition, setNamePosition] = useState({ x: 0, y: 0 })

  // Calculate target position (header location)
  useEffect(() => {
    // Target position: top-left of viewport with header padding
    const targetX = window.innerWidth >= 768 ? 16 : 12 // px-3 md:px-4
    const targetY = window.innerWidth >= 768 ? 32 : 28 // h-14 md:h-16 / 2

    if (nameRef.current) {
      const rect = nameRef.current.getBoundingClientRect()
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2

      // Calculate offset from center to target
      setNamePosition({
        x: targetX - centerX + rect.width / 2,
        y: targetY - centerY,
      })
    }
  }, [])

  // Loading progress animation
  useEffect(() => {
    const duration = 1800 // 1.8 seconds for loading
    const interval = 20
    const increment = 100 / (duration / interval)

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment
        if (next >= 100) {
          clearInterval(timer)
          // Start transition phase after a brief pause
          setTimeout(() => setPhase("transitioning"), 300)
          return 100
        }
        return next
      })
    }, interval)

    return () => clearInterval(timer)
  }, [])

  // Handle transition completion
  useEffect(() => {
    if (phase === "transitioning") {
      // Wait for name animation to complete
      const timer = setTimeout(() => {
        setPhase("complete")
        onComplete()
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [phase, onComplete])

  return (
    <AnimatePresence>
      {phase !== "complete" && (
        <motion.div
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Welcome message */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: phase === "loading" ? 1 : 0,
              y: phase === "loading" ? 0 : -20,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-sf-pro font-light text-primary/60 tracking-wide">
              Hi, Welcome to my portfolio
            </h1>
          </motion.div>

          {/* Name that will animate to header */}
          <motion.div
            ref={nameRef}
            className="font-sf-mono font-bold tracking-tighter"
            initial={{
              scale: 1,
              x: 0,
              y: 0,
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
            }}
            animate={
              phase === "transitioning"
                ? {
                    scale: 0.4,
                    x: namePosition.x,
                    y: namePosition.y,
                    fontSize: "clamp(1.25rem, 3vw, 1.875rem)",
                  }
                : {
                    scale: 1,
                    x: 0,
                    y: 0,
                  }
            }
            transition={{
              duration: 1,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <span className="text-primary">RUSHIR BHAVSAR</span>
            <motion.span
              className="text-primary"
              initial={{ opacity: 1 }}
              animate={{ opacity: phase === "transitioning" ? 1 : 1 }}
            >
              .
            </motion.span>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            className="mt-12 w-64 sm:w-80 md:w-96"
            initial={{ opacity: 0 }}
            animate={{
              opacity: phase === "loading" ? 1 : 0,
              y: phase === "loading" ? 0 : 20,
            }}
            transition={{ duration: 0.3, delay: phase === "loading" ? 0.2 : 0 }}
          >
            {/* Bar container */}
            <div className="h-1 bg-primary/10 overflow-hidden">
              {/* Progress fill */}
              <motion.div
                className="h-full bg-primary origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>

            {/* Progress text */}
            <div className="flex justify-between mt-2 text-[10px] font-sf-mono text-primary/40 uppercase tracking-wider">
              <span>Loading</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-sf-mono text-primary/20 uppercase tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "loading" ? 1 : 0 }}
            transition={{ delay: 0.5 }}
          >
            Data Scientist • AI Engineer • ML Researcher
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
