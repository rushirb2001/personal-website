"use client"

import { ArrowRight, Linkedin, Github, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useNavigation } from "@/contexts/navigation-context"
import { useState } from "react"
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

  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 z-60"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <Header />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
        <UpdatesBanner />
      </motion.div>

      <motion.div
        className="fixed bottom-0 left-0 right-0 z-60"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <Footer />
      </motion.div>

      <motion.div
        className="fixed top-[60px] bottom-[60px] left-0 right-0 flex items-center justify-center px-4 md:px-8 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Mobile Layout - Fixed vertical structure */}
        <div className="md:hidden w-full h-full flex flex-col justify-between items-center px-4 py-6">
          {/* Title & Subtitle */}
          <motion.div
            className="text-center w-full"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="font-black tracking-tight mb-2 w-full text-6xl mt-4">RUSHIR BHAVSAR</h1>
            <p className="font-sf-mono text-primary/70 w-full tracking-widest text-lg">
              DATA SCIENTIST • AI ENGINEER • ML RESEARCHER •
            </p>
          </motion.div>

          {/* Photo - 75% width, square, centered */}
          <motion.div
            className="relative w-[75%] aspect-square"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Styled photo like desktop with border, padding, and VERIFIED badge */}
            <div className="relative border border-primary/20 bg-secondary/20 p-2 w-full h-full">
              <Image
                src="/images/design-mode/new_personal_photo(1).png"
                alt="Profile"
                fill
                className="object-cover grayscale"
              />
              <div className="absolute top-3 right-3 bg-background/80 border border-primary/30 px-2 py-1 font-sf-mono font-extrabold text-xs">
                VERIFIED
              </div>
            </div>
          </motion.div>

          {/* GitHub, LinkedIn, View Resume */}
          <motion.div
            className="flex items-center justify-center gap-3 w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Link
              href="https://github.com/rushirb2001"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center border border-primary/20 group hover:bg-primary/10 transition-colors"
            >
              <Github className="h-5 w-5 stroke-[2] text-purple-800 group-hover:scale-110 transition-transform" />
            </Link>
            <Link
              href="https://linkedin.com/in/rushir-bhavsar/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center border border-primary/20 group hover:bg-primary/10 transition-colors"
            >
              <Linkedin className="h-5 w-5 stroke-[2] text-blue-700 group-hover:scale-110 transition-transform" />
            </Link>
            <Button
              variant="ghost"
              className="h-12 px-4 border border-primary/20 font-sf-mono bg-primary/5 hover:bg-primary/10 rounded-none font-semibold text-base"
              onClick={() => setIsResumeModalOpen(true)}
            >
              <FileText className="h-4 w-4 mr-2" />
              VIEW RESUME
            </Button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            className="flex items-center justify-center gap-2 text-[10px] font-sf-mono w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="flex-1 flex flex-col items-center justify-center border border-primary/20 px-2 py-3">
              <span className="text-primary/40 mb-1 text-sm font-bold">PROJECTS</span>
              <span className="text-sm font-thin">15+</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center border border-primary/20 px-2 py-3">
              <span className="text-primary/40 mb-1 text-sm font-bold">PUBLICATIONS</span>
              <span className="text-sm font-thin">3+</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center border border-primary/20 px-2 py-3">
              <span className="text-primary/40 mb-1 text-sm font-bold">EXPERIENCE</span>
              <span className="text-sm flex items-center font-thin">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-[blink_0.5s_ease-in-out_infinite]"></span>
                2+ YRS
              </span>
            </div>
          </motion.div>

          {/* Contact (left) | Explore (right) */}
          <motion.div
            className="flex gap-2 w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Button
              className="flex-1 group rounded-none border border-primary/20 bg-transparent text-primary hover:bg-primary/10 h-12 text-base font-black tracking-normal"
              onClick={() => navigateTo("/contact")}
            >
              CONTACT
              <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              className="flex-1 group rounded-none border border-primary/20 bg-transparent text-primary hover:bg-primary/10 font-black h-12 text-base"
              onClick={() => navigateTo("/projects")}
            >
              EXPLORE
              <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>

        {/* Desktop & Tablet Layout */}
        <div className="hidden md:block w-full max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-8 py-16">
            {/* Left column - Profile Photo */}
            <motion.div
              className="relative flex items-stretch"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {/* Profile Image */}
              <div className="relative border border-primary/20 bg-secondary/20 p-2 w-full max-w-[300px] md:max-w-[300px] lg:max-w-[350px] aspect-square">
                <Image
                  src="/images/design-mode/new_personal_photo(1).png"
                  alt="Profile"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover grayscale"
                />
                <div className="absolute top-2 right-2 bg-background/80 border border-primary/30 px-2 py-1 text-[10px] font-sf-mono">
                  VERIFIED
                </div>
              </div>
            </motion.div>

            {/* Right column - Content */}
            <div>
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <div className="border border-primary/20 p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    {/* Title - left aligned */}
                    <motion.h1
                      className="relative font-black tracking-widest text-4xl lg:text-6xl"
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
                        className="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-none group"
                      >
                        <Github className="h-6 w-6 lg:h-8 lg:w-8 stroke-[2.5] text-purple-800 fill-purple-800/0 group-hover:fill-purple-800/100 group-hover:scale-115 transition-all duration-300 ease-out" />
                      </Link>
                      <Link
                        href="https://linkedin.com/in/rushir-bhavsar/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-none group"
                      >
                        <Linkedin className="h-6 w-6 lg:h-8 lg:w-8 stroke-[2.5] text-blue-700 fill-blue-700/0 group-hover:fill-blue-700/100 group-hover:scale-115 transition-all duration-300 ease-out" />
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Role titles - left aligned */}
                    <motion.p
                      className="text-sm lg:text-lg font-sf-mono text-primary/70"
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
                      className="border border-primary/20 text-xs lg:text-sm font-sf-mono group bg-primary/5 hover:bg-primary/15 font-normal tracking-wide transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-primary/10 rounded-none shadow-none"
                      onClick={() => setIsResumeModalOpen(true)}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span className="relative">
                          <FileText className="h-5 w-5 lg:h-7 lg:w-7 stroke-[1.5] text-primary/70 fill-primary/0 group-hover:fill-primary/20 group-hover:text-primary group-hover:scale-110 transition-all duration-300 ease-out" />
                          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </span>
                        <span className="text-primary/80 group-hover:text-primary font-medium transition-colors duration-300 tracking-tighter">
                          VIEW RESUME
                        </span>
                        <ArrowRight className="h-3 w-3 lg:h-4 lg:w-4 text-primary/60 group-hover:translate-x-1.5 group-hover:text-primary transition-all duration-300" />
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Description */}
                <motion.div
                  className="mb-6 text-xs lg:text-sm leading-relaxed text-left border border-primary/20 p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  <p className="font-mono">
                    Data Scientist and AI Engineer specializing in machine learning, deep learning, and AI systems
                    development. Creating innovative solutions using cutting-edge AI technologies with experience across
                    healthcare, astronomy, and enterprise AI domains. Expertise in transformer-based models,
                    retrieval-augmented generation, and scalable ML pipelines.
                  </p>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                  className="grid grid-cols-4 gap-2 text-[10px] lg:text-xs font-sf-mono text-primary/40 mb-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75, duration: 0.8 }}
                >
                  <div className="border border-primary/20 p-2 lg:p-3 text-center hover:border-primary/40 transition-colors">
                    <div className="text-primary/30 mb-1 font-mono">PROJECTS</div>
                    <div className="font-bold">15+ COMPLETED</div>
                  </div>
                  <div className="border border-primary/20 p-2 lg:p-3 text-center hover:border-primary/40 transition-colors">
                    <div className="text-primary/30 mb-1">PUBLICATIONS</div>
                    <div className="font-bold">3+ RESEARCH PAPERS</div>
                  </div>
                  <div className="border border-primary/20 p-2 lg:p-3 text-center hover:border-primary/40 transition-colors">
                    <div className="text-primary/30 mb-1">EXPERIENCE</div>
                    <div className="flex items-center justify-center font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-[blink_0.5s_ease-in-out_infinite]"></div>
                      2+ YEARS
                    </div>
                  </div>
                  <div className="border border-primary/20 p-2 lg:p-3 text-center hover:border-primary/40 transition-colors">
                    <div className="text-primary/30 mb-1">SPECIALIZATION</div>
                    <div className="font-bold">LLM • CV • MLOps</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </>
  )
}
