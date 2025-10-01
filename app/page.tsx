"use client"

import { ArrowRight, Linkedin, Github, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigation } from "@/contexts/navigation-context"
import { useEffect, useState, useRef } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SeveranceLogo } from "@/components/ui/severance-logo"
import { UpdatesBanner } from "@/components/features/updates/updates-banner"
import { ResumeModal } from "@/components/features/resume/resume-modal"
import Link from "next/link"
import Image from "next/image"

const systemicTransition = {
  duration: 0.25,
  ease: [0.5, 0, 1, 1],
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

  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)

  // Animation refs
  const animationRef = useRef<NodeJS.Timeout | null>(null)
  const typeIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const bootSequence = [
    "INITIALIZING PORTFOLIO SYSTEM...",
    "ESTABLISHING SECURE CONNECTION...",
    "VERIFYING USER IDENTITY...",
    "ACCESSING PERSONNEL FILE...",
    "LOADING PROFILE DATA...",
    "AUTHORIZATION GRANTED",
    "DISPLAYING PORTFOLIO",
  ]

  const bootSequencePrefix = ["SPI", "ESP", "VID", "ACF", "LPD", "AUT", "DSP"]

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

  // Preload critical pages
  useEffect(() => {
    const preloadPages = async () => {
      const paths = ["/projects", "/skills", "/experience"]

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

      <AnimatePresence>
        {showContent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.5 }}>
            <UpdatesBanner />
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
            className="flex items-center justify-center min-h-[calc(100vh)] px-4 md:px-8 -translate-y-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Mobile Layout - Fixed vertical structure */}
            <div className="lg:hidden w-full h-[calc(100vh-10rem)] overflow-hidden flex flex-col justify-center items-center gap-4 relative px-6 pl-0 pr-0 pt-0">
              {/* Name Effect - shifted down */}
              <motion.div
                className="relative text-center w-full mt-8"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <motion.h1
                  className="text-3xl tracking-tight mb-2 relative font-black"
                  initial={{ opacity: 0, letterSpacing: "0.08em" }}
                  animate={{ opacity: 1, letterSpacing: "0.03em" }}
                  transition={{
                    opacity: { delay: 0.7, duration: 0.8 },
                    letterSpacing: {
                      delay: 0.7,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "mirror",
                      duration: 6,
                      ease: "easeInOut",
                    },
                  }}
                >
                  RUSHIR BHAVSAR
                  <motion.div
                    className="absolute -top-1 left-0 w-full h-px bg-primary/30"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  ></motion.div>
                  <motion.div
                    className="absolute -bottom-1 left-0 w-full h-px bg-primary/30"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  ></motion.div>
                </motion.h1>

                {/* Position/Roles */}
                <motion.p
                  className="text-xs font-sf-mono text-primary/70 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.8,
                      delay: 0.9,
                      ease: [0.4, 0, 0.2, 1],
                    },
                  }}
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.3, delay: 1.0 } }}
                  >
                    DATA SCIENTIST
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.3, delay: 1.2 } }}
                  >
                    {" • "}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.3, delay: 1.4 } }}
                  >
                    AI ENGINEER
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.3, delay: 1.6 } }}
                  >
                    {" • "}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.3, delay: 1.8 } }}
                  >
                    ML RESEARCHER
                  </motion.span>
                </motion.p>
              </motion.div>

              {/* Dynamic Photo */}
              <motion.div
                className="relative w-full max-w-[240px]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <div className="relative border border-primary/20 bg-secondary/20 p-1">
                  <Image
                    src="/images/personal_photo.png"
                    alt="Profile"
                    width={300}
                    height={300}
                    className="w-full grayscale"
                  />
                  <div className="absolute top-2 right-2 bg-background/80 border border-primary/30 px-2 py-1 text-[10px] font-sf-mono">
                    VERIFIED
                  </div>
                </div>
              </motion.div>

              {/* EXPLORE | CONTACT Buttons */}
              <motion.div
                className="flex gap-2 w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.8 }}
              >
                <Button
                  className="flex-1 group rounded-none border border-primary/20 bg-transparent text-primary hover:bg-primary/10 font-black text-xs py-2"
                  onClick={() => navigateTo("/projects")}
                >
                  EXPLORE
                  <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  className="flex-1 group rounded-none border border-primary/20 bg-transparent text-primary hover:bg-primary/10 font-black text-xs py-2"
                  onClick={() => navigateTo("/contact")}
                >
                  CONTACT
                  <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>

              {/* GitHub, LinkedIn (left half) | Resume (right half) */}
              <motion.div
                className="flex gap-2 w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                {/* Left half - GitHub and LinkedIn split 50-50 */}
                <div className="flex-1 flex gap-2">
                  <Button
                    className="flex-1 group rounded-none border border-primary/20 bg-transparent text-primary hover:bg-primary/10 font-black p-2"
                    asChild
                  >
                    <Link href="https://github.com/rushirbhavsar" target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 text-purple-800" />
                    </Link>
                  </Button>
                  <Button
                    className="flex-1 group rounded-none border border-primary/20 bg-transparent text-primary hover:bg-primary/10 font-black p-2"
                    asChild
                  >
                    <Link href="https://linkedin.com/in/rushir-bhavsar/" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4 text-blue-700" />
                    </Link>
                  </Button>
                </div>

                {/* Right half - Resume button */}
                <Button
                  className="flex-1 group rounded-none border border-primary/20 bg-transparent text-primary hover:bg-primary/10 font-black text-xs py-2"
                  onClick={() => setIsResumeModalOpen(true)}
                >
                  <FileText className="h-3 w-3 mr-1" />
                  RESUME
                </Button>
              </motion.div>

              {/* Stats Section */}
              <motion.div
                className="w-full grid grid-cols-2 gap-2 text-[10px] font-sf-mono text-primary/40"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <div className="border border-primary/20 p-2 text-center hover:border-primary/40 transition-colors">
                  <div className="text-primary/30 mb-1 font-mono">PROJECTS</div>
                  <div className="font-bold">15+ COMPLETED</div>
                </div>
                <div className="border border-primary/20 p-2 text-center hover:border-primary/40 transition-colors">
                  <div className="text-primary/30 mb-1">PUBLICATIONS</div>
                  <div className="font-bold">3+ RESEARCH PAPERS</div>
                </div>
                <div className="border border-primary/20 p-2 text-center hover:border-primary/40 transition-colors">
                  <div className="text-primary/30 mb-1">EXPERIENCE</div>
                  <div className="flex items-center justify-center font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-[blink_0.5s_ease-in-out_infinite]"></div>
                    2+ YEARS
                  </div>
                </div>
                <div className="border border-primary/20 p-2 text-center hover:border-primary/40 transition-colors">
                  <div className="text-primary/30 mb-1">SPECIALIZATION</div>
                  <div className="font-bold">LLM • CV • MLOps</div>
                </div>
              </motion.div>
            </div>

            {/* Desktop Layout - Original grid layout */}
            <div className="hidden lg:block w-full max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 py-16">
                {/* Left Column - Name, Description, Buttons */}
                <div className="px-6 md:px-5">
                  <motion.div
                    className="relative text-center py-5"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    {/* Terminal-style ID */}
                    <motion.h1
                      className="text-4xl md:text-5xl lg:text-6xl tracking-tight mb-3 relative font-black"
                      initial={{ opacity: 0, letterSpacing: "0.08em" }}
                      animate={{ opacity: 1, letterSpacing: "0.03em" }}
                      transition={{
                        opacity: { delay: 0.7, duration: 0.8 },
                        letterSpacing: {
                          delay: 0.7,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "mirror",
                          duration: 6,
                          ease: "easeInOut",
                        },
                      }}
                    >
                      RUSHIR BHAVSAR
                      <motion.div
                        className="absolute -top-1 left-0 w-full h-px bg-primary/30"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                      ></motion.div>
                      <motion.div
                        className="absolute -bottom-1 left-0 w-full h-px bg-primary/30"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                      ></motion.div>
                    </motion.h1>

                    {/* Role titles */}
                    <motion.p
                      className="text-base md:text-lg font-sf-mono text-primary/70 mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.8,
                          delay: 0.9,
                          ease: [0.4, 0, 0.2, 1],
                        },
                      }}
                    >
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.3, delay: 1.0 } }}
                      >
                        DATA SCIENTIST
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.3, delay: 1.2 } }}
                      >
                        {" • "}
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.3, delay: 1.4 } }}
                      >
                        AI ENGINEER
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.3, delay: 1.6 } }}
                      >
                        {" • "}
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.3, delay: 1.8 } }}
                      >
                        ML RESEARCHER
                      </motion.span>
                    </motion.p>

                    <motion.div
                      className="mb-6 text-sm leading-relaxed text-justify"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1, duration: 0.8 }}
                    >
                      <p className="font-mono px-28">
                        Data Scientist and AI Engineer specializing in machine learning, deep learning, and AI systems
                        development. Creating innovative solutions using cutting-edge AI technologies with experience
                        across healthcare, astronomy, and enterprise AI domains. Expertise in transformer-based models,
                        retrieval-augmented generation, and production AI system optimization.
                      </p>
                    </motion.div>

                    <motion.div
                      className="flex flex-wrap gap-3 justify-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2, duration: 0.8 }}
                    >
                      <Button
                        className="group rounded-none border border-primary/20 bg-transparent text-primary hover:bg-primary/10 font-black text-sm px-4"
                        onClick={() => navigateTo("/projects")}
                      >
                        EXPLORE
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>

                      <Button
                        className="group rounded-none border border-primary/20 bg-transparent text-primary hover:bg-primary/10 font-black px-4"
                        asChild
                      >
                        <Link href="https://linkedin.com/in/rushir-bhavsar/" target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4 text-blue-700" />
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>

                      <Button
                        className="group rounded-none border border-primary/20 bg-transparent text-primary hover:bg-primary/10 font-black px-4"
                        asChild
                      >
                        <Link href="https://github.com/rushirbhavsar" target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 text-purple-800" />
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>

                      <Button
                        className="group rounded-none border border-primary/20 bg-transparent text-primary hover:bg-primary/10 font-black text-sm px-4"
                        onClick={() => navigateTo("/contact")}
                      >
                        CONTACT
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Right Column - Profile Image and Resume */}
                <motion.div
                  className="relative px-6 md:px-5 py-4"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  {/* Profile Image */}
                  <div className="relative border border-primary/20 bg-secondary/20 p-1 mb-4">
                    <Image
                      src="/images/personal_photo.png"
                      alt="Profile"
                      width={300}
                      height={300}
                      className="w-full grayscale"
                    />
                    <div className="absolute top-2 right-2 bg-background/80 border border-primary/30 px-2 py-1 text-[10px] font-sf-mono">
                      VERIFIED
                    </div>
                  </div>

                  {/* Resume Button */}
                  <Button
                    variant="outline"
                    className="w-full rounded-none border-primary/20 text-xs font-sf-mono group bg-transparent hover:bg-primary/10"
                    onClick={() => setIsResumeModalOpen(true)}
                  >
                    <span className="group-hover:tracking-widest transition-all duration-500 flex items-center">
                      <FileText className="h-3 w-3 mr-2" />
                      VIEW RESUME
                    </span>
                  </Button>
                </motion.div>
              </div>

              {/* Stats Section - Below the grid */}
              <motion.div
                className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-sf-mono text-primary/40 mt-6 py-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.8 }}
              >
                <div className="border border-primary/20 p-3 text-center hover:border-primary/40 transition-colors">
                  <div className="text-primary/30 mb-1 font-mono">PROJECTS</div>
                  <div className="font-bold">15+ COMPLETED</div>
                </div>
                <div className="border border-primary/20 p-3 text-center hover:border-primary/40 transition-colors">
                  <div className="text-primary/30 mb-1">PUBLICATIONS</div>
                  <div className="font-bold">3+ RESEARCH PAPERS</div>
                </div>
                <div className="border border-primary/20 p-3 text-center hover:border-primary/40 transition-colors">
                  <div className="text-primary/30 mb-1">EXPERIENCE</div>
                  <div className="flex items-center justify-center font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-[blink_0.5s_ease-in-out_infinite]"></div>
                    2+ YEARS
                  </div>
                </div>
                <div className="border border-primary/20 p-3 text-center hover:border-primary/40 transition-colors">
                  <div className="text-primary/30 mb-1">SPECIALIZATION</div>
                  <div className="font-bold">LLM • CV • MLOps</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </>
  )
}
