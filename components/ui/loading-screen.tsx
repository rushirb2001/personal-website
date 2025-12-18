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
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const calculatePosition = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      // Header specs: h-14 (56px) mobile, h-16 (64px) desktop
      // Padding: px-3 (12px) mobile, px-4 (16px) desktop
      const headerHeight = mobile ? 56 : 64
      const headerPadding = mobile ? 12 : 16

      // Target: left edge + padding, vertically centered in header
      const targetX = headerPadding
      const targetY = headerHeight / 2

      if (nameRef.current) {
        const rect = nameRef.current.getBoundingClientRect()
        // Calculate from center of screen to target position
        setTargetPosition({
          x: targetX - window.innerWidth / 2 + (rect.width / 2) * 0.4, // Account for scale
          y: targetY - window.innerHeight / 2,
        })
      }
    }

    calculatePosition()
    window.addEventListener("resize", calculatePosition)
    return () => window.removeEventListener("resize", calculatePosition)
  }, [])

  // Loading progress animation
  useEffect(() => {
    const duration = 1800
    const interval = 20
    const increment = 100 / (duration / interval)

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment
        if (next >= 100) {
          clearInterval(timer)
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
      const timer = setTimeout(() => {
        setPhase("complete")
        onComplete()
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [phase, onComplete])

  // Initial: ~50px (large display), Target: 20px mobile / 30px desktop
  const targetFontSize = isMobile ? 20 : 30
  const initialFontSize = Math.min(window.innerWidth * 0.08, 50) || 50
  const scaleFactor = targetFontSize / initialFontSize

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

          <motion.div
            ref={nameRef}
            className="font-sf-mono font-bold tracking-tighter leading-7 text-primary"
            style={{
              fontSize: "clamp(2rem, 8vw, 3.125rem)", // Large initial size
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 1,
            }}
            animate={
              phase === "transitioning"
                ? {
                    x: targetPosition.x,
                    y: targetPosition.y,
                    scale: scaleFactor,
                  }
                : {
                    x: 0,
                    y: 0,
                    scale: 1,
                  }
            }
            transition={{
              duration: 1,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            RUSHIR BHAVSAR.
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
            <div className="h-1 bg-primary/10 overflow-hidden">
              <motion.div
                className="h-full bg-primary origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
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
