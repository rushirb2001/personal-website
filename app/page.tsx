"use client"

import { ArrowRight, Linkedin, Github, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigation } from "@/contexts/navigation-context"
import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
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

  const [showHeader] = useState(true)
  const [showFooter] = useState(true)
  const [showContent] = useState(true)

  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)

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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
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
            className="fixed top-[60px] bottom-[60px] left-0 right-0 flex items-center justify-center px-4 md:px-8 bg-scan-lines overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Mobile Layout - Fixed vertical structure */}
            <div className="lg:hidden w-full h-full flex flex-col justify-center items-center gap-4 relative px-6 pl-0 pr-0 pt-0">
              {/* Name Effect - shifted down */}
              <motion.div
                className="relative text-center w-full mt-8"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <motion.h1
                  className="tracking-tight mb-2 relative font-black text-4xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    opacity: { delay: 0.3, duration: 0.8 },
                  }}
                >
                  RUSHIR BHAVSAR
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
                      delay: 0.5,
                      ease: [0.4, 0, 0.2, 1],
                    },
                  }}
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.6 } }}
                  >
                    DATA SCIENTIST
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.7 } }}
                  >
                    {" • "}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.8 } }}
                  >
                    AI ENGINEER
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.9 } }}
                  >
                    {" • "}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.3, delay: 1.0 } }}
                  >
                    ML RESEARCHER
                  </motion.span>
                </motion.p>
              </motion.div>

              {/* Dynamic Photo */}
              <motion.div
                className="relative w-full max-w-[200px]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <div className="relative border border-primary/20 bg-secondary/20 p-2">
                  <Image
                    src="/images/personal_photo.png"
                    alt="Profile"
                    width={400}
                    height={400}
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
                transition={{ delay: 0.6, duration: 0.8 }}
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
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                {/* Left half - GitHub and LinkedIn split 50-50 */}
                <div className="flex-1 flex gap-2">
                  <Link
                    href="https://github.com/rushirb2001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 flex items-center justify-center rounded-none group"
                  >
                    <Github className="h-8 w-8 stroke-[2.5] text-purple-800 fill-purple-800/0 group-hover:fill-purple-800/100 group-hover:scale-115 transition-all duration-300 ease-out" />
                  </Link>
                  <Link
                    href="https://linkedin.com/in/rushir-bhavsar/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 flex items-center justify-center rounded-none group"
                  >
                    <Linkedin className="h-8 w-8 stroke-[2.5] text-blue-700 fill-blue-700/0 group-hover:fill-blue-700/100 group-hover:scale-115 transition-all duration-300 ease-out" />
                  </Link>
                </div>

                {/* Right half - Resume button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Button
                    variant="ghost"
                    className="flex-1 group rounded-sm border border-primary/20 text-sm font-sf-mono bg-primary/5 hover:bg-primary/15 font-normal tracking-wide transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-primary/10"
                    onClick={() => setIsResumeModalOpen(true)}
                  >
                    <span className="flex items-center justify-center gap-3">
                      <span className="relative">
                        <FileText className="h-7 w-7 stroke-[1.5] text-primary/70 fill-primary/0 group-hover:fill-primary/20 group-hover:text-primary group-hover:scale-110 transition-all duration-300 ease-out" />
                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </span>
                      <span className="text-primary/80 group-hover:text-primary font-medium tracking-wider transition-colors duration-300">
                        VIEW RESUME
                      </span>
                      <ArrowRight className="h-4 w-4 text-primary/60 group-hover:translate-x-1.5 group-hover:text-primary transition-all duration-300" />
                    </span>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Stats Section */}
              <motion.div
                className="w-full grid grid-cols-2 gap-2 text-[10px] font-sf-mono text-primary/40"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
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

            <div className="hidden lg:block w-full max-w-7xl p-2">
              <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 py-16">
                {/* Left column - Profile Photo */}
                <motion.div
                  className="relative p-2 flex items-start"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  {/* Profile Image */}
                  <div className="relative border border-primary/20 bg-secondary/20 p-2 w-full max-w-[350px]">
                    <Image
                      src="/images/design-mode/new_personal_photo(1).png"
                      alt="Profile"
                      width={400}
                      height={400}
                      className="w-full grayscale"
                    />
                    <div className="absolute top-2 right-2 bg-background/80 border border-primary/30 px-2 py-1 text-[10px] font-sf-mono">
                      VERIFIED
                    </div>
                  </div>
                </motion.div>

                {/* Right column - Content */}
                <div className="p-2">
                  <motion.div
                    className="relative py-5"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      {/* Title - left aligned */}
                      <motion.h1
                        className="relative font-black tracking-widest text-6xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          opacity: { delay: 0.3, duration: 0.8 },
                        }}
                      >
                        RUSHIR BHAVSAR
                      </motion.h1>

                      <div className="flex gap-2">
                        <Link
                          href="https://github.com/rushirb2001"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-14 h-14 flex items-center justify-center rounded-none group"
                        >
                          <Github className="h-8 w-8 stroke-[2.5] text-purple-800 fill-purple-800/0 group-hover:fill-purple-800/100 group-hover:scale-115 transition-all duration-300 ease-out" />
                        </Link>
                        <Link
                          href="https://linkedin.com/in/rushir-bhavsar/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-14 h-14 flex items-center justify-center rounded-none group"
                        >
                          <Linkedin className="h-8 w-8 stroke-[2.5] text-blue-700 fill-blue-700/0 group-hover:fill-blue-700/100 group-hover:scale-115 transition-all duration-300 ease-out" />
                        </Link>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      {/* Role titles - left aligned */}
                      <motion.p
                        className="text-base md:text-lg font-sf-mono text-primary/70"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: 0.8,
                            delay: 0.5,
                            ease: [0.4, 0, 0.2, 1],
                          },
                        }}
                      >
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.6 } }}
                        >
                          DATA SCIENTIST
                        </motion.span>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.7 } }}
                        >
                          {" • "}
                        </motion.span>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.8 } }}
                        >
                          AI ENGINEER
                        </motion.span>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.9 } }}
                        >
                          {" • "}
                        </motion.span>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, transition: { duration: 0.3, delay: 1.0 } }}
                        >
                          ML RESEARCHER
                        </motion.span>
                      </motion.p>

                      <Button
                        variant="ghost"
                        className="border border-primary/20 text-sm font-sf-mono group bg-primary/5 hover:bg-primary/15 font-normal tracking-wide transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-primary/10 rounded-none shadow-none"
                        onClick={() => setIsResumeModalOpen(true)}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <span className="relative">
                            <FileText className="h-7 w-7 stroke-[1.5] text-primary/70 fill-primary/0 group-hover:fill-primary/20 group-hover:text-primary group-hover:scale-110 transition-all duration-300 ease-out" />
                            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </span>
                          <span className="text-primary/80 group-hover:text-primary font-medium transition-colors duration-300 tracking-tighter">
                            VIEW RESUME
                          </span>
                          <ArrowRight className="h-4 w-4 text-primary/60 group-hover:translate-x-1.5 group-hover:text-primary transition-all duration-300" />
                        </span>
                      </Button>
                    </div>

                    {/* Description */}
                    <motion.div
                      className="mb-6 text-sm leading-relaxed text-left"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                    >
                      <p className="font-mono">
                        Data Scientist and AI Engineer specializing in machine learning, deep learning, and AI systems
                        development. Creating innovative solutions using cutting-edge AI technologies with experience
                        across healthcare, astronomy, and enterprise AI domains. Expertise in transformer-based models,
                        retrieval-augmented generation, and production AI system optimization.
                      </p>
                    </motion.div>

                    <motion.div
                      className="grid grid-cols-4 gap-2 text-xs font-sf-mono text-primary/40 mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.75, duration: 0.8 }}
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

                    <motion.div
                      className="hidden flex-wrap gap-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                    >
                      <Button
                        className="group rounded-none border border-primary/20 bg-transparent text-primary hover:bg-primary/10 font-black text-sm px-4"
                        onClick={() => navigateTo("/projects")}
                      >
                        EXPLORE
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </>
  )
}
