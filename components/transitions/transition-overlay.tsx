"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigation } from "@/contexts/navigation-context"

export function TransitionOverlay() {
  const { isTransitioning, targetPath } = useNavigation()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Format display path
  const displayPath = targetPath ? targetPath.slice(1).toUpperCase() || "HOME" : "LOADING"

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
              className="relative flex flex-col items-center gap-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full bg-primary/5" />

                {/* Outer ring - thicker */}
                <motion.div
                  className="absolute inset-0 border-2 border-primary/40 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />

                {/* Middle ring - thicker */}
                <motion.div
                  className="absolute inset-3 border-2 border-primary/60 rounded-full"
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

                {/* Inner dot - larger */}
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
                  <div className="w-4 h-4 rounded-full bg-primary/80" />
                </motion.div>

                {/* Orbiting dots - larger */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2.5 h-2.5 rounded-full bg-primary/60"
                    style={{
                      top: "50%",
                      left: "50%",
                      marginTop: -5,
                      marginLeft: -5,
                    }}
                    animate={{
                      x: [
                        Math.cos((i * 120 * Math.PI) / 180) * 36,
                        Math.cos(((i * 120 + 120) * Math.PI) / 180) * 36,
                        Math.cos(((i * 120 + 240) * Math.PI) / 180) * 36,
                        Math.cos((i * 120 * Math.PI) / 180) * 36,
                      ],
                      y: [
                        Math.sin((i * 120 * Math.PI) / 180) * 36,
                        Math.sin(((i * 120 + 120) * Math.PI) / 180) * 36,
                        Math.sin(((i * 120 + 240) * Math.PI) / 180) * 36,
                        Math.sin((i * 120 * Math.PI) / 180) * 36,
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

              <div className="flex flex-col items-center gap-4">
                {/* Path text - larger font */}
                <motion.div
                  className="overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: "auto" }}
                  transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.span
                    className="block text-base font-sf-mono tracking-[0.25em] text-primary/80 whitespace-nowrap uppercase font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    /{displayPath}
                  </motion.span>
                </motion.div>

                {/* Loading bar - thicker and wider */}
                <motion.div
                  className="h-0.5 w-32 bg-primary/20 overflow-hidden"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <motion.div
                    className="h-full w-full bg-primary/70"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                      duration: 0.8,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
