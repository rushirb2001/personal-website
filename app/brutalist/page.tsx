"use client"

import { ArrowRight, Linkedin, Github, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useNavigation } from "@/contexts/navigation-context"
import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ResumeModal } from "@/components/features/resume/resume-modal"
import Link from "next/link"
import Image from "next/image"

export default function BrutalistHome() {
  const { navigateTo } = useNavigation()
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)

  return (
    <>
      <Header />
      <Footer />

      <div className="fixed top-[60px] bottom-[60px] left-0 right-0 flex items-center justify-center px-4 md:px-8 overflow-hidden">
        {/* Mobile Layout */}
        <div className="md:hidden w-full h-full flex flex-col justify-between items-start px-2 py-4">
          {/* Index marker */}
          <motion.div
            className="font-sf-mono text-[10px] text-primary/30 tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            [00] — HOME
          </motion.div>

          {/* Title block */}
          <motion.div
            className="w-full border-l-4 border-primary pl-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h1 className="font-black tracking-tighter text-5xl leading-none">
              RUSHIR
              <br />
              BHAVSAR
            </h1>
            <div className="h-[2px] w-full bg-primary/20 my-3" />
            <p className="font-sf-mono text-[10px] tracking-[0.3em] text-primary/50">
              DATA SCIENTIST / AI ENGINEER / ML RESEARCHER
            </p>
          </motion.div>

          {/* Photo */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="relative w-full aspect-[4/3] border-2 border-primary">
              <Image
                src="/images/design-mode/new_personal_photo(1).png"
                alt="Profile"
                fill
                className="object-cover grayscale contrast-125"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-primary text-background px-3 py-2 font-sf-mono text-[10px] flex justify-between">
                <span>STATUS: AVAILABLE</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 animate-pulse" />
                  VERIFIED
                </span>
              </div>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="w-full grid grid-cols-3 border-2 border-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <div className="p-3 border-r-2 border-primary text-center">
              <div className="font-black text-2xl">15+</div>
              <div className="font-sf-mono text-[8px] tracking-widest text-primary/50">PROJECTS</div>
            </div>
            <div className="p-3 border-r-2 border-primary text-center">
              <div className="font-black text-2xl">3+</div>
              <div className="font-sf-mono text-[8px] tracking-widest text-primary/50">PAPERS</div>
            </div>
            <div className="p-3 text-center">
              <div className="font-black text-2xl">2+</div>
              <div className="font-sf-mono text-[8px] tracking-widest text-primary/50">YRS EXP</div>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            className="w-full flex gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <Button
              className="flex-1 h-14 rounded-none bg-primary text-background hover:bg-primary/90 font-black text-sm tracking-wider"
              onClick={() => navigateTo("/projects")}
            >
              EXPLORE
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              className="flex-1 h-14 rounded-none bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-background font-black text-sm tracking-wider transition-colors"
              onClick={() => navigateTo("/contact")}
            >
              CONTACT
            </Button>
          </motion.div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block w-full max-w-6xl">
          <div className="grid grid-cols-[1fr_1.5fr] gap-0">
            {/* Left Column - Photo & Identity */}
            <motion.div
              className="border-2 border-primary"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header bar */}
              <div className="bg-primary text-background px-4 py-2 font-sf-mono text-xs flex justify-between items-center">
                <span>[00] IDENTITY</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 animate-pulse" />
                  AVAILABLE
                </span>
              </div>

              {/* Photo */}
              <div className="relative aspect-square">
                <Image
                  src="/images/design-mode/new_personal_photo(1).png"
                  alt="Profile"
                  fill
                  className="object-cover grayscale contrast-125"
                />
              </div>

              {/* Name block */}
              <div className="border-t-2 border-primary p-4">
                <h1 className="font-black text-4xl lg:text-5xl tracking-tighter leading-none mb-2">
                  RUSHIR
                  <br />
                  BHAVSAR
                </h1>
                <div className="h-[3px] w-24 bg-primary mb-3" />
                <p className="font-sf-mono text-[10px] lg:text-xs tracking-[0.2em] text-primary/60">
                  DATA SCIENTIST
                  <br />
                  AI ENGINEER
                  <br />
                  ML RESEARCHER
                </p>
              </div>

              {/* Social links */}
              <div className="border-t-2 border-primary flex">
                <Link
                  href="https://github.com/rushirb2001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 p-4 flex items-center justify-center gap-2 border-r-2 border-primary hover:bg-primary hover:text-background transition-colors group"
                >
                  <Github className="h-5 w-5" />
                  <span className="font-sf-mono text-xs tracking-wider">GITHUB</span>
                </Link>
                <Link
                  href="https://linkedin.com/in/rushir-bhavsar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 p-4 flex items-center justify-center gap-2 hover:bg-primary hover:text-background transition-colors group"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="font-sf-mono text-xs tracking-wider">LINKEDIN</span>
                </Link>
              </div>
            </motion.div>

            {/* Right Column - Content */}
            <motion.div
              className="border-2 border-l-0 border-primary flex flex-col"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Stats row */}
              <div className="grid grid-cols-4 border-b-2 border-primary">
                <div className="p-4 lg:p-6 border-r-2 border-primary text-center">
                  <div className="font-black text-3xl lg:text-4xl">15+</div>
                  <div className="font-sf-mono text-[9px] lg:text-[10px] tracking-widest text-primary/50 mt-1">
                    PROJECTS
                  </div>
                </div>
                <div className="p-4 lg:p-6 border-r-2 border-primary text-center">
                  <div className="font-black text-3xl lg:text-4xl">3+</div>
                  <div className="font-sf-mono text-[9px] lg:text-[10px] tracking-widest text-primary/50 mt-1">
                    PUBLICATIONS
                  </div>
                </div>
                <div className="p-4 lg:p-6 border-r-2 border-primary text-center">
                  <div className="font-black text-3xl lg:text-4xl">2+</div>
                  <div className="font-sf-mono text-[9px] lg:text-[10px] tracking-widest text-primary/50 mt-1">
                    YRS EXPERIENCE
                  </div>
                </div>
                <div className="p-4 lg:p-6 text-center">
                  <div className="font-black text-3xl lg:text-4xl">∞</div>
                  <div className="font-sf-mono text-[9px] lg:text-[10px] tracking-widest text-primary/50 mt-1">
                    CURIOSITY
                  </div>
                </div>
              </div>

              {/* Description block */}
              <div className="flex-1 p-6 lg:p-8 border-b-2 border-primary">
                <div className="font-sf-mono text-[10px] text-primary/40 mb-4 tracking-widest">[01] ABOUT</div>
                <p className="font-mono text-sm lg:text-base leading-relaxed text-primary/80">
                  Data Scientist and AI Engineer specializing in machine learning, deep learning, and AI systems
                  development. Creating innovative solutions using cutting-edge AI technologies with experience across
                  healthcare, astronomy, and enterprise AI domains.
                </p>
                <div className="h-[2px] w-full bg-primary/10 my-6" />
                <p className="font-mono text-sm lg:text-base leading-relaxed text-primary/80">
                  Expertise in transformer-based models, retrieval-augmented generation, and scalable ML pipelines.
                </p>
              </div>

              {/* Specializations */}
              <div className="p-6 lg:p-8 border-b-2 border-primary">
                <div className="font-sf-mono text-[10px] text-primary/40 mb-4 tracking-widest">[02] SPECIALIZATION</div>
                <div className="flex flex-wrap gap-2">
                  {["LLM", "COMPUTER VISION", "MLOps", "RAG", "TRANSFORMERS", "DEEP LEARNING"].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-2 border-2 border-primary font-sf-mono text-xs tracking-wider hover:bg-primary hover:text-background transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2">
                <Button
                  className="h-16 lg:h-20 rounded-none bg-primary text-background hover:bg-primary/90 font-black text-base lg:text-lg tracking-wider border-r border-primary/50"
                  onClick={() => navigateTo("/projects")}
                >
                  EXPLORE WORK
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
                <button
                  className="h-16 lg:h-20 bg-transparent text-primary hover:bg-primary hover:text-background font-black text-base lg:text-lg tracking-wider transition-colors flex items-center justify-center gap-2"
                  onClick={() => setIsResumeModalOpen(true)}
                >
                  <FileText className="h-5 w-5" />
                  VIEW RESUME
                </button>
              </div>
            </motion.div>
          </div>

          {/* Bottom bar */}
          <motion.div
            className="border-2 border-t-0 border-primary bg-primary/5 px-6 py-3 flex justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="font-sf-mono text-[10px] text-primary/40 tracking-widest">LAST UPDATED: DEC 2025</div>
            <div className="font-sf-mono text-[10px] text-primary/40 tracking-widest">
              DESIGNED WITH MINIMAL BRUTALISM
            </div>
            <Button
              variant="ghost"
              className="rounded-none font-sf-mono text-[10px] tracking-wider h-auto py-1 px-3 hover:bg-primary hover:text-background"
              onClick={() => navigateTo("/contact")}
            >
              GET IN TOUCH →
            </Button>
          </motion.div>
        </div>
      </div>

      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </>
  )
}
