"use client"

import { Mail, Linkedin, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigation } from "@/contexts/navigation-context"
import { useEffect, useState, useRef } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SeveranceLogo } from "@/components/ui/severance-logo"
import Image from "next/image"
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

  // Typewriter effect for role
  const [roleText, setRoleText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const fullRole = "Data Scientist"

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
      const hasBooted = localStorage.getItem("portfolio-system-booted")
      if (hasBooted === "true") {
        setShowBoot(false)
        setShowHeader(true)
        setShowFooter(true)
        setShowContent(true)
      } else {
        localStorage.setItem("portfolio-system-booted", "true")
      }
    }

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

          if (Math.random() > 0.5) {
            setTimeout(() => {
              setBootGlitch(true)
              setTimeout(() => setBootGlitch(false), 100)
            }, 200)
          }

          animationRef.current = setTimeout(() => {
            setBootStage((prev) => prev + 1)
          }, 100)
        }
      }, 40)

      return () => {
        if (typeIntervalRef.current) clearInterval(typeIntervalRef.current)
        if (animationRef.current) clearTimeout(animationRef.current)
      }
    } else {
      animationRef.current = setTimeout(() => {
        setBootScanLines(true)

        animationRef.current = setTimeout(() => {
          setShowBoot(false)

          animationRef.current = setTimeout(() => {
            setShowHeader(true)
            setShowFooter(true)

            animationRef.current = setTimeout(() => {
              setShowContent(true)
            }, 300)
          }, 200)
        }, 600)
      }, 600)
    }
  }, [bootStage, showBoot])

  useEffect(() => {
    if (!showContent) return

    let charIndex = 0
    const typeInterval = setInterval(() => {
      if (charIndex < fullRole.length) {
        setRoleText(fullRole.slice(0, charIndex + 1))
        charIndex++
      } else {
        clearInterval(typeInterval)
      }
    }, 100)

    // Cursor blink
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)

    return () => {
      clearInterval(typeInterval)
      clearInterval(cursorInterval)
    }
  }, [showContent])

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
            <motion.div
              className={`w-full max-w-lg border border-primary/30 bg-background text-foreground p-6 font-sf-mono relative overflow-hidden ${bootGlitch ? "animate-systemic-glitch" : ""}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{
                height: { ...systemicTransition, duration: 0.2 },
                opacity: systemicTransition,
              }}
            >
              <div className="border-b border-primary/20 pb-2 mb-4 flex justify-between items-center">
                <div className="text-xs">TERMINAL ACCESS</div>
                <div className="text-xs">
                  ID: {bootSequencePrefix[bootStage] || "SYS"}-BOOT-{Math.floor(Math.random() * 1000)}
                </div>
              </div>

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
                          transition: "width 0.1s linear",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-primary/20 pt-2 mt-4 flex justify-between items-center text-xs">
                <div>SECURITY PROTOCOL: ACTIVE</div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-mechanical-pulse"></div>
                  <span>SYSTEM ONLINE</span>
                </div>
              </div>

              {bootScanLines && <div className="absolute inset-0 bg-scan-lines opacity-30 pointer-events-none"></div>}
            </motion.div>

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

      <AnimatePresence>
        {showContent && (
          <motion.div
            className="flex items-center justify-center min-h-screen px-4 md:px-8 lg:px-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="w-full max-w-7xl py-20 md:py-24 relative">
              {/* Eerie decorative elements */}
              <motion.div
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <motion.div
                  className="absolute top-1/4 left-0 h-px w-16 bg-primary/20"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                ></motion.div>
                <motion.div
                  className="absolute bottom-1/4 right-0 h-px w-16 bg-primary/20"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                ></motion.div>
                <div className="absolute inset-0 bg-scan-lines opacity-10"></div>
              </motion.div>

              {/* Two-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                {/* Left column - Text content */}
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  {/* Greeting */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <h2 className="text-2xl md:text-3xl font-medium mb-2">Hi, I am</h2>
                  </motion.div>

                  {/* Name with gradient effect */}
                  <motion.h1
                    className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight relative"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 bg-clip-text text-transparent">
                      Rushir Bhavsar
                    </span>
                    <motion.div
                      className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-purple-600/50 via-violet-600/50 to-transparent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                    ></motion.div>
                  </motion.h1>

                  {/* Role with typewriter effect */}
                  <motion.div
                    className="text-xl md:text-2xl font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <span>I am a </span>
                    <span className="text-purple-600 font-bold">
                      {roleText}
                      {showCursor && <span className="animate-[blink_0.5s_ease-in-out_infinite]">|</span>}
                    </span>
                  </motion.div>

                  {/* Description */}
                  <motion.p
                    className="text-base md:text-lg leading-relaxed max-w-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0, duration: 0.8 }}
                  >
                    I specialize in machine learning, big data analytics, and AI-driven solutions across finance,
                    retail, and customer analytics. Skilled in developing scalable models and leveraging predictive
                    analytics to optimize decision-making and drive business impact.
                  </motion.p>

                  {/* Social icons */}
                  <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                  >
                    <Link
                      href="mailto:rushir.bhavsar@example.com"
                      className="p-3 border border-primary/20 hover:bg-primary/5 transition-colors"
                    >
                      <Mail className="h-5 w-5" />
                    </Link>
                    <Link
                      href="https://linkedin.com/in/rushir-bhavsar/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 border border-primary/20 hover:bg-primary/5 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </Link>
                    <Link
                      href="https://github.com/rushirbhavsar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 border border-primary/20 hover:bg-primary/5 transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </Link>
                  </motion.div>

                  {/* Resume button */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                  >
                    <Button
                      className="rounded-none border border-primary/20 bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-6 text-base"
                      asChild
                    >
                      <Link href="/resume.pdf" target="_blank">
                        Resume
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Right column - Profile image */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <div className="relative border border-primary/20 p-2 bg-secondary/10">
                    <Image
                      src="/images/personal_photo.png"
                      alt="Rushir Bhavsar"
                      width={600}
                      height={600}
                      className="w-full h-auto"
                      priority
                    />
                    {/* Decorative corner elements */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-600"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-600"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-600"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-600"></div>
                  </div>

                  {/* Status indicator */}
                  <motion.div
                    className="absolute -bottom-4 -right-4 border border-primary/20 bg-background px-4 py-2 font-sf-mono text-xs"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6, duration: 0.6 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-mechanical-pulse"></div>
                      <span className="text-primary/70">ACTIVE • 2+ YEARS EXP</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Bottom stats grid */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.8 }}
              >
                <div className="border border-primary/10 p-4 text-center font-sf-mono">
                  <div className="text-xs text-primary/30 mb-1">PROJECTS</div>
                  <div className="text-sm">15+ COMPLETED</div>
                </div>
                <div className="border border-primary/10 p-4 text-center font-sf-mono">
                  <div className="text-xs text-primary/30 mb-1">PUBLICATIONS</div>
                  <div className="text-sm">3+ RESEARCH</div>
                </div>
                <div className="border border-primary/10 p-4 text-center font-sf-mono">
                  <div className="text-xs text-primary/30 mb-1">EXPERIENCE</div>
                  <div className="text-sm">2+ YEARS</div>
                </div>
                <div className="border border-primary/10 p-4 text-center font-sf-mono">
                  <div className="text-xs text-primary/30 mb-1">SPECIALIZATION</div>
                  <div className="text-sm">LLM • CV • MLOps</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
