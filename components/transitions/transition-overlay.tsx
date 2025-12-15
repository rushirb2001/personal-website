"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigation } from "@/contexts/navigation-context"

export function TransitionOverlay() {
  const { isTransitioning, targetPath } = useNavigation()
  const [isMounted, setIsMounted] = useState(false)
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Format display path
  const displayPath = targetPath ? targetPath.slice(1).toUpperCase() || "HOME" : "LOADING"

  // Phase management
  useEffect(() => {
    if (isTransitioning) {
      setPhase("enter")
      const holdTimer = setTimeout(() => setPhase("hold"), 300)
      return () => clearTimeout(holdTimer)
    } else {
      setPhase("exit")
    }
  }, [isTransitioning])

  // Generate random positions for floating particles
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 0.5,
        duration: Math.random() * 2 + 1,
      })),
    [],
  )

  // Generate horizontal lines
  const lines = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        y: (i + 1) * 11,
        delay: i * 0.05,
      })),
    [],
  )

  return (
    <AnimatePresence>
      {isTransitioning && isMounted && (
        <motion.div
          className="fixed inset-x-0 top-14 md:top-16 bottom-0 z-30 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Fluid gradient background */}
          <motion.div
            className="absolute inset-0 bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Animated horizontal lines sweeping across */}
          <div className="absolute inset-0 overflow-hidden">
            {lines.map((line) => (
              <motion.div
                key={line.id}
                className="absolute left-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                style={{ top: `${line.y}%`, width: "100%" }}
                initial={{ x: "-100%", opacity: 0 }}
                animate={{
                  x: ["100%", "-100%"],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: line.delay,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full bg-primary/20"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: particle.size,
                  height: particle.size,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.6, 0],
                  scale: [0, 1, 0],
                  y: [0, -30, -60],
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          {/* Central content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Morphing circle loader */}
              <div className="relative w-16 h-16 mb-6">
                {/* Outer ring */}
                <motion.div
                  className="absolute inset-0 border border-primary/30 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />

                {/* Middle ring */}
                <motion.div
                  className="absolute inset-2 border border-primary/50 rounded-full"
                  animate={{
                    scale: [1.1, 0.9, 1.1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />

                {/* Inner dot */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-primary/70" />
                </motion.div>

                {/* Orbiting dots */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-primary/50"
                    style={{
                      top: "50%",
                      left: "50%",
                      marginTop: -3,
                      marginLeft: -3,
                    }}
                    animate={{
                      x: [
                        Math.cos((i * 120 * Math.PI) / 180) * 24,
                        Math.cos(((i * 120 + 120) * Math.PI) / 180) * 24,
                        Math.cos(((i * 120 + 240) * Math.PI) / 180) * 24,
                        Math.cos((i * 120 * Math.PI) / 180) * 24,
                      ],
                      y: [
                        Math.sin((i * 120 * Math.PI) / 180) * 24,
                        Math.sin(((i * 120 + 120) * Math.PI) / 180) * 24,
                        Math.sin(((i * 120 + 240) * Math.PI) / 180) * 24,
                        Math.sin((i * 120 * Math.PI) / 180) * 24,
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                ))}
              </div>

              {/* Path text with reveal animation */}
              <motion.div
                className="overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: "auto" }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.span
                  className="block text-sm font-sf-mono tracking-widest text-primary/70 whitespace-nowrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  /{displayPath}
                </motion.span>
              </motion.div>

              {/* Subtle loading bar */}
              <motion.div
                className="mt-4 h-px w-32 bg-primary/10 overflow-hidden rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  className="h-full bg-primary/40"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Corner accents */}
          <motion.div
            className="absolute top-4 left-4 w-8 h-8 border-l border-t border-primary/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          />
          <motion.div
            className="absolute top-4 right-4 w-8 h-8 border-r border-t border-primary/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          />
          <motion.div
            className="absolute bottom-4 left-4 w-8 h-8 border-l border-b border-primary/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          />
          <motion.div
            className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-primary/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
