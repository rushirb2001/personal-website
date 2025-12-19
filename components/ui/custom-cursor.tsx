"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CustomCursor() {
  const [cursorType, setCursorType] = useState<"default" | "pointer" | "text">("default")
  const [isVisible, setIsVisible] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const lastUpdateTime = useRef(0)

  // Motion values for cursor movement
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Create springs with optimized settings for better performance
  // Higher stiffness and lower damping for more responsive movement
  const followerX = useSpring(mouseX, { damping: 12, stiffness: 300, mass: 0.5 })
  const followerY = useSpring(mouseY, { damping: 12, stiffness: 300, mass: 0.5 })

  useEffect(() => {
    // Detect touch device
    const detectTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0 || (navigator as any).msMaxTouchPoints > 0,
      )
    }

    detectTouch()

    // If it's a touch device, don't initialize the custom cursor
    if (isTouchDevice) {
      document.documentElement.classList.remove("hide-cursor")
      return
    }

    // Handle mouse movement with throttling for better performance
    const onMouseMove = (e: MouseEvent) => {
      // Throttle updates to every 10ms for better performance
      const now = Date.now()
      if (now - lastUpdateTime.current < 10) return
      lastUpdateTime.current = now

      // Use requestAnimationFrame for smoother updates
      requestAnimationFrame(() => {
        mouseX.set(e.clientX)
        mouseY.set(e.clientY)
      })
      setIsVisible(true)
    }

    const onMouseLeave = () => setIsVisible(false)
    const onMouseEnter = () => setIsVisible(true)

    // Track elements to change cursor type with debounced checks
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Check if element or any of its parents has cursor:pointer
      let element: HTMLElement | null = target
      let newCursorType: "default" | "pointer" | "text" = "default"

      while (element) {
        const cursor = window.getComputedStyle(element).cursor

        if (cursor === "pointer") {
          newCursorType = "pointer"
          break
        }

        if (cursor === "text") {
          newCursorType = "text"
          break
        }

        element = element.parentElement
      }

      setCursorType(newCursorType)
    }

    // Handle click animation
    const handleMouseDown = () => setIsClicked(true)
    const handleMouseUp = () => setIsClicked(false)

    document.addEventListener("mousemove", onMouseMove, { passive: true })
    document.addEventListener("mouseleave", onMouseLeave)
    document.addEventListener("mouseenter", onMouseEnter)
    document.addEventListener("mouseover", onMouseOver, { passive: true })
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)

    // Hide native cursor
    document.documentElement.classList.add("hide-cursor")

    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseleave", onMouseLeave)
      document.removeEventListener("mouseenter", onMouseEnter)
      document.removeEventListener("mouseover", onMouseOver)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.documentElement.classList.remove("hide-cursor")
    }
  }, [mouseX, mouseY, isTouchDevice])

  // Don't render the custom cursor on touch devices
  if (isTouchDevice) return null

  return (
    <>
      {/* Main cursor - larger and more visible */}
      <motion.div
        className="fixed pointer-events-none z-[100] mix-blend-difference will-change-transform"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div
          className={`
            ${isClicked ? "scale-75" : "scale-100"}
            ${cursorType === "pointer" ? "scale-125" : ""} 
            ${cursorType === "text" ? "w-[4px] h-[20px]" : "w-4 h-4 rounded-full"} 
            transition-all duration-150
            bg-white dark:bg-white
            transform-gpu
          `}
        />
      </motion.div>

      {/* Secondary cursor - simplified and properly aligned */}
      <motion.div
        className="fixed pointer-events-none z-[99] mix-blend-difference will-change-transform"
        style={{
          x: followerX,
          y: followerY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
      >
        {cursorType === "default" && (
          <div
            className={`
              border-2 border-white dark:border-white rounded-full
              w-10 h-10 opacity-40
              ${isClicked ? "opacity-60 scale-75" : ""}
              transition-all duration-150
              transform-gpu
            `}
          />
        )}

        {cursorType === "pointer" && (
          <div
            className={`
              flex items-center justify-center
              w-12 h-12 opacity-60
              ${isClicked ? "scale-90" : ""}
              transition-all duration-150
              transform-gpu
            `}
          >
            <div className="w-8 h-8 border-2 border-white dark:border-white rounded-full" />
          </div>
        )}

        {cursorType === "text" && (
          <div
            className={`
              w-6 h-6 opacity-40
              border-l-2 border-r-2 border-white dark:border-white
              ${isClicked ? "opacity-60 scale-75" : ""}
              transition-all duration-150
              transform-gpu
            `}
          />
        )}
      </motion.div>
    </>
  )
}
