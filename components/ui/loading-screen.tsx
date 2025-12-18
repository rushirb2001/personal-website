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
  const [initialFontSize, setInitialFontSize] = useState(50)

  useEffect(() => {
    const calculatePosition = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      // Header specs: h-14 (56px) mobile, h-16 (64px) desktop
      // Padding: px-3 (12px) mobile, px-4 (16px) desktop
      const headerHeight = mobile ? 56 : 64
      const headerPadding = mobile ? 12 : 16

      const currentInitialFontSize = Math.min(window.innerWidth * 0.08, 50)
      setInitialFontSize(currentInitialFontSize)

      // Target font sizes: text-xl (20px) mobile, text-3xl (30px) desktop
      const targetFontSize = mobile ? 20 : 30
      const scaleFactor = targetFontSize / currentInitialFontSize

      if (nameRef.current) {
        const rect = nameRef.current.getBoundingClientRect()

        const scaledWidth = rect.width * scaleFactor

        // Current center position of text
        const currentCenterX = window.innerWidth / 2
        const currentCenterY = window.innerHeight / 2

        // On mobile, reduce the offset to position text closer to left edge
        const mobileAdjustment = mobile ? -8 : 0

        // Target position: left padding + half of scaled width (since transform origin is center)
        const targetCenterX = headerPadding + scaledWidth / 2 + mobileAdjustment
        // Target Y: vertically centered in header
        const targetCenterY = headerHeight / 2

        setTargetPosition({
          x: targetCenterX - currentCenterX,
          y: targetCenterY - currentCenterY,
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

  const targetFontSize = isMobile ? 20 : 30
  const scaleFactor = targetFontSize / initialFontSize

  return (
    <AnimatePresence>
      {phase !== "complete" && (
        <motion.div
          className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Welcome message */}
          <motion.div
            className="text-center mb-8 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: phase === "loading" ? 1 : 0,
              y: phase === "loading" ? 0 : -20,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl font-sf-mono font-light text-primary/60 tracking-wide">
              Hi, Welcome to my portfolio
            </h1>
          </motion.div>

          <motion.div
            ref={nameRef}
            className="font-sf-mono font-bold tracking-tighter leading-7 text-primary px-4 py-8"
            style={{
              fontSize: `${initialFontSize}px`,
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
            className="mt-8 w-56 sm:w-72 md:w-80 px-4"
            initial={{ opacity: 0 }}
            animate={{
              opacity: phase === "loading" ? 1 : 0,
              y: phase === "loading" ? 0 : 20,
            }}
            transition={{ duration: 0.3, delay: phase === "loading" ? 0.2 : 0 }}
          >
            <div className="h-0.5 bg-primary/10 overflow-hidden">
              <motion.div
                className="h-full bg-primary origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
            <div className="flex justify-between mt-2 text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider">
              <span>Loading</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[8px] sm:text-[9px] font-sf-mono text-primary/20 uppercase tracking-widest px-4 text-center"
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
