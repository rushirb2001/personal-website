"use client"

import { ArrowRight, Linkedin, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigation } from "@/contexts/navigation-context"
import { useEffect, useState, useRef } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SeveranceLogo } from "@/components/ui/severance-logo"
import { UpdatesBanner } from "@/components/features/updates/updates-banner"
import Link from "next/link"

// Systemic transitions
const systemicTransition = {
  duration: 0.3,
  ease: [0.4, 0, 1, 1],
}

export default function Home() {
  const { navigateTo } = useNavigation()

  // Boot animation states
  const [bootStage, setBootStage] = useState(0)
  const [bootText, setBootText] = useState("")
  const [bootScanLines, setBootScanLines] = useState(false)
  const [bootGlitch, setBootGlitch] = useState(false)

  // Animation sequence states
  const [showBoot, setShowBoot] = useState(true)
  const [showHeader, setShowHeader] = useState(false)
  const [showFooter, setShowFooter] = useState(false)
  const [showContent, setShowContent] = useState(false)

  // Animation refs
  const animationRef = useRef<NodeJS.Timeout | null>(null)
  const typeIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Boot sequence text content
  const bootSequence = [
    "INITIALIZING PORTFOLIO SYSTEM...",
    "ESTABLISHING SECURE CONNECTION...",
    "VERIFYING USER IDENTITY...",
    "ACCESSING PERSONNEL FILE...",
    "AUTHORIZATION GRANTED",
    "DISPLAYING PORTFOLIO",
  ]

  const bootSequencePrefix = [
    "SPI", // System Peripheral Init
    "ESP", // Encrypted Secure Protocol
    "VID", // Verify ID
    "ACF", // Access File
    "AUT", // Authorization
    "DSP", // Display
  ]

  // Check if this is the first visit
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if already booted before (using localStorage for persistence across sessions)
      const hasBooted = localStorage.getItem("portfolio-system-booted")
      if (hasBooted === "true") {
        // Skip boot animation completely
        setShowBoot(false)
        setShowHeader(true)
        setShowFooter(true)
        setShowContent(true)
      } else {
        // First visit - set the flag for future visits
        localStorage.setItem("portfolio-system-booted", "true")
      }
    }

    // Cleanup function to clear any remaining timeouts
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current)
      if (typeIntervalRef.current) clearInterval(typeIntervalRef.current)
    }
  }, [])

  // Typewriter effect for boot text
  useEffect(() => {
    if (!showBoot) return

    if (bootStage < bootSequence.length) {
      let currentText = ""
      const currentMessage = bootSequence[bootStage]
      let charIndex = 0

      typeIntervalRef.current = setInterval(() => {
        if (charIndex < currentMessage.length) {
          currentText += currentMessage[charIndex]
          setBootText(currentText)
          charIndex++
        } else {
          if (typeIntervalRef.current) clearInterval(typeIntervalRef.current)

          // Abrupt glitch effect
          if (Math.random() > 0.5) {
            setTimeout(() => {
              setBootGlitch(true)
              setTimeout(() => setBootGlitch(false), 100) // Shorter glitch duration
            }, 200)
          }

          // Move to next stage after precise delay
          animationRef.current = setTimeout(() => {
            setBootStage((prev) => prev + 1)
          }, 100) // More precise timing
        }
      }, 40) // Consistent typing speed

      return () => {
        if (typeIntervalRef.current) clearInterval(typeIntervalRef.current)
        if (animationRef.current) clearTimeout(animationRef.current)
      }
    } else {
      // Final stage - transition to main content
      animationRef.current = setTimeout(() => {
        setBootScanLines(true)

        // Start transition sequence
        animationRef.current = setTimeout(() => {
          setShowBoot(false)

          // Show header and footer first
          animationRef.current = setTimeout(() => {
            setShowHeader(true)
            setShowFooter(true)

            // Then show main content
            animationRef.current = setTimeout(() => {
              setShowContent(true)
            }, 300)
          }, 200)
        }, 600)
      }, 600)
    }
  }, [bootStage, showBoot])

  // Preload critical pages from the homepage
  useEffect(() => {
    const preloadPages = async () => {
      // Use dynamic imports to preload key pages
      const paths = ["/about", "/skills", "/experience"]

      // Create a slight delay to prioritize current page render first
      setTimeout(() => {
        paths.forEach((path) => {
          const link = document.createElement("link")
          link.rel = "prefetch"
          link.href = path
          document.head.appendChild(link)
        })
      }, 1000)
    }

    preloadPages()
  }, [])

  return (
    <>
      {/* Boot Animation */}
      <AnimatePresence>
        {showBoot && (
          <motion.div
            className="fixed inset-0 z-70 flex flex-col items-center justify-center bg-background"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={systemicTransition}
          >
            {/* Terminal window */}
            <motion.div
              className={`w-full max-w-lg border border-primary/30 bg-background text-foreground p-6 font-sf-mono relative overflow-hidden ${bootGlitch ? "animate-systemic-glitch" : ""}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{
                height: { ...systemicTransition, duration: 0.2 },
                opacity: systemicTransition,
              }}
            >
              {/* Header */}
              <div className="border-b border-primary/20 pb-2 mb-4 flex justify-between items-center">
                <div className="text-xs">TERMINAL ACCESS</div>
                <div className="text-xs">
                  ID: {bootSequencePrefix[bootStage] || "SYS"}-BOOT-{Math.floor(Math.random() * 1000)}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div className="h-40 flex flex-col justify-center">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <SeveranceLogo size={60} glitch={bootGlitch} />
                    </div>
                    <div className="text-sm mb-2 text-primary/70">PORTFOLIO BOOT SEQUENCE</div>
                    <div className="text-lg">{bootText}</div>
                    <div className="h-0.5 bg-primary/30 mt-4 relative">
                      <div
                        className="absolute top-0 left-0 h-full bg-primary/50"
                        style={{
                          width: `${(bootStage / bootSequence.length) * 100}%`,
                          transition: "width 0.1s linear", // Linear, abrupt progress bar
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-primary/20 pt-2 mt-4 flex justify-between items-center text-xs">
                <div>SECURITY PROTOCOL: ACTIVE</div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-mechanical-pulse"></div>
                  <span>SYSTEM ONLINE</span>
                </div>
              </div>

              {/* Scan lines overlay */}
              {bootScanLines && <div className="absolute inset-0 bg-scan-lines opacity-30 pointer-events-none"></div>}
            </motion.div>

            {/* Background scan lines */}
            <div className="absolute inset-0 bg-scan-lines opacity-20 pointer-events-none"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with fade-in */}
      <AnimatePresence>
        {showHeader && (
          <motion.div
            className="fixed top-0 left-0 right-0 z-60"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <Header />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer with fade-in */}
      <AnimatePresence>
        {showFooter && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content with staggered animations */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="flex items-center justify-center min-h-[calc(100vh)] md:min-h-[calc(100vh)] px-4 md:px-0 -translate-y-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="w-full max-w-full px-0 py-4 md:px-4 md:py-16 lg:py-24 text-center relative">
              {/* Eerie decorative elements */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <motion.div
                  className="absolute top-1/4 left-4 md:left-8 h-px w-8 md:w-16 bg-primary/20"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                ></motion.div>
                <motion.div
                  className="absolute bottom-1/4 right-4 md:right-8 h-px w-8 md:w-16 bg-primary/20"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                ></motion.div>
                <div className="absolute inset-0 bg-scan-lines opacity-10"></div>
              </motion.div>

              {/* Terminal-style ID */}
              <motion.h1
                className="text-3xl md:text-4xl lg:text-6xl tracking-tight mb-2 relative font-black"
                initial={{ opacity: 0, letterSpacing: "0.08em" }}
                animate={{ opacity: 1, letterSpacing: "0.03em" }}
                transition={{
                  opacity: { delay: 0.6, duration: 0.8 },
                  letterSpacing: {
                    delay: 0.6,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "mirror",
                    duration: 6,
                    ease: "easeInOut",
                  },
                }}
              >
                RUSHIR BHAVSAR
                <motion.div
                  className="absolute -top-1 left-0 w-full h-px bg-primary/20"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                ></motion.div>
                <motion.div
                  className="absolute -bottom-1 left-0 w-full h-px bg-primary/20"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                ></motion.div>
              </motion.h1>

              {/* Updates Banner - New Component */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mb-4"
              >
                <UpdatesBanner />
              </motion.div>

              <motion.p
                className="text-base md:text-lg lg:text-xl font-sf-mono text-primary/70 whitespace-nowrap mx-auto mb-8 md:mb-12"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    delay: 0.8,
                    ease: [0.4, 0, 0.2, 1],
                  },
                }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: {
                      duration: 0.3,
                      delay: 0.9,
                    },
                  }}
                >
                  DATA SCIENTIST
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: {
                      duration: 0.3,
                      delay: 1.1,
                    },
                  }}
                >
                  {" • "}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: {
                      duration: 0.3,
                      delay: 1.3,
                    },
                  }}
                >
                  AI ENGINEER
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: {
                      duration: 0.3,
                      delay: 1.5,
                    },
                  }}
                >
                  {" • "}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: {
                      duration: 0.3,
                      delay: 1.7,
                    },
                  }}
                >
                  ML RESEARCHER
                </motion.span>
              </motion.p>

              {/* Mobile-optimized button container */}
              <motion.div
                className="flex flex-row gap-2 sm:gap-4 justify-center mb-8 md:mb-16 w-full max-w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <Button
                  className="flex-1 sm:flex-none group rounded-none border border-primary/20 bg-transparent text-primary hover:bg-primary/5 font-black text-xs sm:text-sm px-2 sm:px-4"
                  onClick={() => navigateTo("/about")}
                >
                  EXPLORE
                  <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                  className="w-auto sm:flex-none group rounded-none border border-primary/20 bg-transparent text-primary hover:bg-primary/5 font-black px-2 sm:px-4"
                  asChild
                >
                  <Link href="https://linkedin.com/in/rushir-bhavsar/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-3 w-3 sm:h-4 sm:w-4 text-blue-700" />
                    <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform hidden sm:inline-block" />
                  </Link>
                </Button>

                <Button
                  className="w-auto sm:flex-none group rounded-none border border-primary/20 bg-transparent text-primary hover:bg-primary/5 font-black px-2 sm:px-4"
                  asChild
                >
                  <Link href="https://github.com/rushirbhavsar" target="_blank" rel="noopener noreferrer">
                    <Github className="h-3 w-3 sm:h-4 sm:w-4 text-purple-800" />
                    <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform hidden sm:inline-block" />
                  </Link>
                </Button>

                <Button
                  className="flex-1 sm:flex-none group rounded-none border border-primary/20 bg-transparent text-primary hover:bg-primary/5 font-black text-xs sm:text-sm px-2 sm:px-4"
                  onClick={() => navigateTo("/contact")}
                >
                  CONTACT
                  <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>

              {/* Status indicators */}
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-2xl mx-auto text-xs font-sf-mono text-primary/40"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.8 }}
              >
                <div className="border border-primary/10 p-2 text-center">
                  <div className="text-primary/30 mb-1">PROJECTS</div>
                  <div>15+ COMPLETED</div>
                </div>
                <div className="border border-primary/10 p-2 text-center">
                  <div className="text-primary/30 mb-1">PUBLICATIONS</div>
                  <div>3+ RESEARCH PAPERS</div>
                </div>
                <div className="border border-primary/10 p-2 text-center">
                  <div className="text-primary/30 mb-1">EXPERIENCE</div>
                  <div className="flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-[blink_0.5s_ease-in-out_infinite]"></div>
                    2+ YEARS
                  </div>
                </div>
                <div className="border border-primary/10 p-2 text-center">
                  <div className="text-primary/30 mb-1">SPECIALIZATION</div>
                  <div>LLM • CV • MLOps</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
