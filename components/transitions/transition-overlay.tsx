"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigation } from "@/contexts/navigation-context"

// Page order from left to right
const PAGE_ORDER = ["/", "/projects", "/skills", "/experience", "/education", "/publications", "/updates", "/contact"]

function getPageIndex(path: string): number {
  // Handle dynamic routes like /updates/[id]
  if (path.startsWith("/updates/")) return PAGE_ORDER.indexOf("/updates")
  const index = PAGE_ORDER.indexOf(path)
  return index === -1 ? 0 : index
}

export function TransitionOverlay() {
  const { isTransitioning, targetPath, currentPath } = useNavigation()
  const [isMounted, setIsMounted] = useState(false)
  const [morphProgress, setMorphProgress] = useState(0)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Calculate rotation direction based on page positions
  const rotationDirection = useMemo(() => {
    if (!targetPath) return 1
    const sourceIndex = getPageIndex(currentPath)
    const targetIndex = getPageIndex(targetPath)
    // Left to right = clockwise (1), right to left = counter-clockwise (-1)
    return targetIndex > sourceIndex ? 1 : -1
  }, [currentPath, targetPath])

  // Animate morph progress
  useEffect(() => {
    if (isTransitioning) {
      setMorphProgress(0)
      const duration = 1500
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        // Eased progress for smooth morphing
        const easedProgress = 1 - Math.pow(1 - progress, 3)
        setMorphProgress(easedProgress)

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    } else {
      setMorphProgress(0)
    }
  }, [isTransitioning])

  // Format display path
  const displayPath = targetPath ? targetPath.slice(1).toUpperCase() || "HOME" : "LOADING"

  // Calculate border radius based on morph progress (0% = square, 50% = circle)
  const borderRadius = `${morphProgress * 50}%`

  // Total rotation based on direction
  const totalRotation = rotationDirection * 720 // Two full rotations

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
          {/* Solid background */}
          <motion.div
            className="absolute inset-0 bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative flex flex-col items-center gap-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Morphing square-to-circle loader */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* Outer morphing shape */}
                <motion.div
                  className="absolute w-24 h-24 border-2 border-primary/50"
                  initial={{
                    rotate: 0,
                    borderRadius: "0%",
                    scale: 0.8,
                  }}
                  animate={{
                    rotate: totalRotation,
                    borderRadius: borderRadius,
                    scale: [0.8, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 1.8, ease: [0.22, 1, 0.36, 1] },
                    borderRadius: { duration: 1.5, ease: [0.22, 1, 0.36, 1] },
                    scale: { duration: 1.5, ease: [0.22, 1, 0.36, 1] },
                  }}
                />

                {/* Middle morphing shape - offset timing */}
                <motion.div
                  className="absolute w-16 h-16 border-2 border-primary/70"
                  initial={{
                    rotate: 45,
                    borderRadius: "0%",
                    scale: 0.9,
                  }}
                  animate={{
                    rotate: 45 + totalRotation * 0.8,
                    borderRadius: borderRadius,
                    scale: [0.9, 1.15, 1],
                  }}
                  transition={{
                    rotate: { duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
                    borderRadius: { duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
                    scale: { duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
                  }}
                />

                {/* Inner morphing shape - more offset */}
                <motion.div
                  className="absolute w-8 h-8 border-2 border-primary/90"
                  initial={{
                    rotate: 22.5,
                    borderRadius: "0%",
                    scale: 1,
                  }}
                  animate={{
                    rotate: 22.5 + totalRotation * 0.6,
                    borderRadius: borderRadius,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    rotate: { duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
                    borderRadius: { duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
                    scale: { duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
                  }}
                />

                {/* Center dot - pulses */}
                <motion.div
                  className="absolute w-3 h-3 bg-primary"
                  initial={{ borderRadius: "0%", scale: 0 }}
                  animate={{
                    borderRadius: borderRadius,
                    scale: [0, 1.2, 1],
                  }}
                  transition={{
                    borderRadius: { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
                    scale: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
                  }}
                />

                {/* Corner particles that fly off during rotation */}
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-primary/60"
                    style={{
                      top: i < 2 ? 0 : "auto",
                      bottom: i >= 2 ? 0 : "auto",
                      left: i % 2 === 0 ? 0 : "auto",
                      right: i % 2 === 1 ? 0 : "auto",
                    }}
                    initial={{
                      scale: 1,
                      opacity: 1,
                      x: 0,
                      y: 0,
                      borderRadius: "0%",
                    }}
                    animate={{
                      scale: [1, 0.5, 0],
                      opacity: [1, 0.5, 0],
                      x: rotationDirection * (i % 2 === 0 ? -30 : 30),
                      y: i < 2 ? -30 : 30,
                      borderRadius: "50%",
                    }}
                    transition={{
                      duration: 0.8,
                      delay: 0.5 + i * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                ))}
              </div>

              {/* Text and loading bar */}
              <div className="flex flex-col items-center gap-4">
                {/* Direction indicator */}
                <motion.div
                  className="flex items-center gap-3 text-primary/40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.span
                    className="text-xs font-sf-mono"
                    animate={{ opacity: rotationDirection === -1 ? 1 : 0.3 }}
                  >
                    {"<"}
                  </motion.span>
                  <motion.span
                    className="text-[10px] font-sf-mono tracking-wider uppercase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                  >
                    navigating
                  </motion.span>
                  <motion.span
                    className="text-xs font-sf-mono"
                    animate={{ opacity: rotationDirection === 1 ? 1 : 0.3 }}
                  >
                    {">"}
                  </motion.span>
                </motion.div>

                {/* Path text */}
                <motion.div
                  className="overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: "auto" }}
                  transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.span
                    className="block text-base font-sf-mono tracking-[0.2em] text-primary whitespace-nowrap uppercase font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    /{displayPath}
                  </motion.span>
                </motion.div>

                {/* Loading bar with directional fill */}
                <motion.div
                  className="h-0.5 w-36 bg-primary/20 overflow-hidden"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <motion.div
                    className="h-full w-full bg-primary/80"
                    initial={{ x: rotationDirection === 1 ? "-100%" : "100%" }}
                    animate={{ x: rotationDirection === 1 ? "100%" : "-100%" }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Corner accents - also morph from square to rounded */}
          <motion.div
            className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-primary/30"
            initial={{ opacity: 0, scale: 0.8, borderRadius: "0%" }}
            animate={{
              opacity: 1,
              scale: 1,
              borderTopLeftRadius: borderRadius,
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
          />
          <motion.div
            className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-primary/30"
            initial={{ opacity: 0, scale: 0.8, borderRadius: "0%" }}
            animate={{
              opacity: 1,
              scale: 1,
              borderTopRightRadius: borderRadius,
            }}
            transition={{ duration: 0.3, delay: 0.15 }}
          />
          <motion.div
            className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-primary/30"
            initial={{ opacity: 0, scale: 0.8, borderRadius: "0%" }}
            animate={{
              opacity: 1,
              scale: 1,
              borderBottomLeftRadius: borderRadius,
            }}
            transition={{ duration: 0.3, delay: 0.2 }}
          />
          <motion.div
            className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-primary/30"
            initial={{ opacity: 0, scale: 0.8, borderRadius: "0%" }}
            animate={{
              opacity: 1,
              scale: 1,
              borderBottomRightRadius: borderRadius,
            }}
            transition={{ duration: 0.3, delay: 0.25 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
