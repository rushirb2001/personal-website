"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface TouchPoint {
  id: number
  x: number
  y: number
  timestamp: number
}

export function TouchFeedback() {
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([])
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Check if this is a touch device
    const checkTouch = () => {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0)
    }

    checkTouch()

    // Only add listeners if this is a touch device
    if (!isTouchDevice) return

    const handleTouchStart = (e: TouchEvent) => {
      const newPoints = Array.from(e.touches).map((touch) => ({
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now(),
      }))

      setTouchPoints(newPoints)
    }

    const handleTouchMove = (e: TouchEvent) => {
      const newPoints = Array.from(e.touches).map((touch) => ({
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now(),
      }))

      setTouchPoints(newPoints)
    }

    const handleTouchEnd = () => {
      // Clear touch points after a short delay to allow for animation
      setTimeout(() => {
        setTouchPoints([])
      }, 300)
    }

    document.addEventListener("touchstart", handleTouchStart)
    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)
    document.addEventListener("touchcancel", handleTouchEnd)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
      document.removeEventListener("touchcancel", handleTouchEnd)
    }
  }, [isTouchDevice])

  // Don't render anything if not a touch device
  if (!isTouchDevice) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[110]">
      <AnimatePresence>
        {touchPoints.map((point) => (
          <motion.div
            key={point.id}
            className="absolute w-12 h-12 pointer-events-none"
            style={{
              left: point.x,
              top: point.y,
              translateX: "-50%",
              translateY: "-50%",
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.5, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-full h-full rounded-full border-2 border-white mix-blend-difference" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
