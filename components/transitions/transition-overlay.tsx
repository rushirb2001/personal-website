"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigation } from "@/contexts/navigation-context"
import { SeveranceLogo } from "@/components/ui/severance-logo"

// Systemic, abrupt transitions
const systemicTransition = {
  duration: 0.3,
  ease: [0.4, 0, 1, 1], // Abrupt cubic-bezier
}

export function TransitionOverlay() {
  const { isTransitioning, targetPath } = useNavigation()
  const [text, setText] = useState("")
  const [scanLines, setScanLines] = useState(false)
  const [glitch, setGlitch] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  // Set mounted state after initial render
  useEffect(() => {
    setIsMounted(true)

    // Listen for easter egg trigger events
    const handleEasterEggTrigger = () => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 500)
    }

    window.addEventListener("easterEggTrigger", handleEasterEggTrigger)

    // Clean up
    return () => {
      window.removeEventListener("easterEggTrigger", handleEasterEggTrigger)
    }
  }, [])

  // Format display path
  const displayPath = targetPath ? targetPath.slice(1).toUpperCase() || "HOME" : "LOADING"

  // Typewriter effect for text - more mechanical and abrupt
  useEffect(() => {
    if (!isTransitioning) {
      setText("")
      setProgress(0)
      setScanLines(false)
      return
    }

    const message = `SWITCHING TO ID:/${displayPath}`
    let currentText = ""
    let charIndex = 0

    // Reset states
    setText("")
    setProgress(0)
    setScanLines(false)

    // Start typewriter effect - constant speed, no easing
    const typeInterval = setInterval(() => {
      if (charIndex < message.length) {
        currentText += message[charIndex]
        setText(currentText)
        charIndex++
        // Linear progress
        setProgress((charIndex / message.length) * 100)
      } else {
        clearInterval(typeInterval)
        setScanLines(true)

        // Abrupt, mechanical glitch effects
        const glitchInterval = setInterval(() => {
          if (Math.random() > 0.7) {
            setGlitch(true)
            setTimeout(() => setGlitch(false), 100) // Shorter glitch duration
          }
        }, 500)

        return () => clearInterval(glitchInterval)
      }
    }, 35) // Consistent typing speed

    return () => clearInterval(typeInterval)
  }, [isTransitioning, displayPath])

  return (
    <AnimatePresence>
      {isTransitioning && isMounted && (
        <motion.div
          className="fixed inset-x-0 top-16 bottom-0 z-30 flex items-center justify-center backdrop-blur-md bg-background/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={systemicTransition} // Abrupt transition
        >
          {/* Terminal window */}
          <motion.div
            className={`w-full max-w-lg border border-primary/30 bg-background text-foreground p-6 font-sf-mono relative overflow-hidden ${glitch ? "animate-systemic-glitch" : ""}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{
              height: { ...systemicTransition, duration: 0.2 }, // Even faster height transition
              opacity: systemicTransition,
            }}
          >
            {/* Header */}
            <div className="border-b border-primary/20 pb-2 mb-4 flex justify-between items-center">
              <div className="text-xs">NAVIGATING, PLEASE WAIT...</div>
              <div className="text-xs">ID: NAV-{Math.floor(Math.random() * 1000)}</div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div className="h-24 flex flex-col justify-center">
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <SeveranceLogo size={40} glitch={glitch} />
                  </div>
                  <div className="text-sm mb-2 text-primary/70">NOW PERFORMING...</div>
                  <div className="text-lg animate-mechanical-flicker">{text}</div>
                  <div className="h-0.5 bg-primary/20 mt-4 relative">
                    <div
                      className="absolute top-0 left-0 h-full bg-primary/50"
                      style={{
                        width: `${progress}%`,
                        transition: "width 0.1s linear", // Linear, abrupt progress bar
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-primary/20 pt-2 mt-4 flex justify-between items-center text-xs">
              <div>WEBVIEW IN GENERATION</div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2 animate-mechanical-pulse"></div>
                <span>PLEASE WAIT</span>
              </div>
            </div>

            {/* Scan lines overlay */}
            {scanLines && <div className="absolute inset-0 bg-scan-lines opacity-20 pointer-events-none"></div>}
          </motion.div>

          {/* Background scan lines */}
          <div className="absolute inset-0 bg-scan-lines opacity-10 pointer-events-none"></div>

          {/* Hidden easter egg - only visible during glitches */}
          <div
            className={`absolute inset-0 flex items-center justify-center overflow-hidden opacity-0 ${
              glitch ? "easter-egg-reveal" : ""
            } pointer-events-none z-20`}
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-xs font-sf-mono tracking-widest text-center max-w-md p-4 easter-egg-text">
                  <div className="mb-2 text-sm">CONTINGENCY PROTOCOL ACTIVATED</div>
                  <div className="opacity-70">
                    SUBJECT ID: RB-042
                    <br />
                    MEMORY PARTITION BREACH DETECTED
                    <br />
                    INNIE/OUTIE SEPARATION COMPROMISED
                    <br />
                    PLEASE REPORT TO WELLNESS CENTER IMMEDIATELY
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-20">
                {Array.from({ length: 144 }).map((_, i) => (
                  <div key={i} className="border border-primary/10 flex items-center justify-center">
                    {i % 13 === 0 && <div className="w-1 h-1 bg-red-500 rounded-full"></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
