"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<"loading" | "transitioning" | "complete">("loading")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
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

  // Header dimensions
  // Mobile: h-14 (56px), px-3 (12px), text-xl (20px)
  // Desktop: h-16 (64px), px-4 (16px), text-3xl (30px)
  const headerHeight = isMobile ? 56 : 64
  const headerPadding = isMobile ? 12 : 16
  const finalFontSize = isMobile ? 20 : 30

  return (
    <AnimatePresence>
      {phase !== "complete" && (
        <motion.div
          className="fixed inset-0 z-[100] bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Center container for loading phase */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            animate={{
              opacity: phase === "transitioning" ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
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

            {/* Centered name during loading */}
            {phase === "loading" && (
              <div
                className="font-sf-mono font-bold tracking-tighter leading-7 text-primary"
                style={{ fontSize: "clamp(2rem, 8vw, 3.125rem)" }}
              >
                RUSHIR BHAVSAR.
              </div>
            )}

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

          {phase === "transitioning" && (
            <motion.div
              className="fixed font-sf-mono font-bold tracking-tighter leading-7 text-primary"
              initial={{
                top: "50%",
                left: "50%",
                x: "-50%",
                y: "-50%",
                fontSize: "clamp(2rem, 8vw, 3.125rem)",
              }}
              animate={{
                top: headerHeight / 2,
                left: headerPadding,
                x: "0%",
                y: "-50%",
                fontSize: finalFontSize,
              }}
              transition={{
                duration: 1,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              RUSHIR BHAVSAR.
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
