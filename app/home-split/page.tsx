"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Github, Linkedin, FileText, MapPin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigation } from "@/contexts/navigation-context"
import { useState, useEffect } from "react"
import { ResumeModal } from "@/components/features/resume/resume-modal"
import Image from "next/image"
import Link from "next/link"

const specializations = [
  { label: "LLM/RAG", desc: "Large Language Models & Retrieval-Augmented Generation" },
  { label: "CV", desc: "Computer Vision & Image Processing" },
  { label: "MLOps", desc: "ML Infrastructure & Deployment" },
  { label: "GenAI", desc: "Generative AI & Diffusion Models" },
]

const featuredProject = {
  title: "AI-Powered Healthcare Diagnostics",
  description: "Transformer-based model for early disease detection achieving 94% accuracy",
  tags: ["PyTorch", "Transformers", "AWS"],
  link: "/projects",
}

const stats = [
  { label: "PROJECTS", value: "15+" },
  { label: "PUBLICATIONS", value: "3+" },
  { label: "EXPERIENCE", value: "2+", sublabel: "YRS", hasIndicator: true },
]

export default function HomeSplitPage() {
  const { navigateTo } = useNavigation()
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)
  const [activeSpecIndex, setActiveSpecIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSpecIndex((prev) => (prev + 1) % specializations.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-[1fr_2fr] gap-3 sm:gap-4 md:gap-6 lg:gap-8 py-3 sm:py-4 md:py-6 lg:py-8 px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* LEFT SIDE - Sticky Identity */}
        <div className="md:sticky md:top-20 lg:top-24 self-start flex flex-col justify-center md:h-auto lg:h-[calc(100vh-12rem)] md:mb-4 lg:mb-0">
          {/* Title */}
          <h1 className="relative pb-2 text-lg sm:text-xl md:text-xl lg:text-2xl font-medium tracking-tight uppercase before:content-[''] before:absolute before:top-0 before:left-0 before:w-20 sm:before:w-24 md:before:w-28 lg:before:w-32 before:h-0.5 before:bg-primary/70">
            RUSHIR BHAVSAR
          </h1>
          <p className="text-[10px] sm:text-xs md:text-xs lg:text-sm text-primary/70 font-sf-mono tracking-wide">
            DATA SCIENTIST • AI ENGINEER • ML RESEARCHER
          </p>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-primary/10">
            <Link
              href="https://github.com/rushirb2001"
              target="_blank"
              className="w-8 h-8 flex items-center justify-center border border-primary/20 hover:bg-primary hover:text-background transition-colors"
            >
              <Github className="h-4 w-4" />
            </Link>
            <Link
              href="https://linkedin.com/in/rushir-bhavsar/"
              target="_blank"
              className="w-8 h-8 flex items-center justify-center border border-primary/20 hover:bg-primary hover:text-background transition-colors"
            >
              <Linkedin className="h-4 w-4" />
            </Link>
            <Link
              href="mailto:rushirbhavsar@gmail.com"
              className="w-8 h-8 flex items-center justify-center border border-primary/20 hover:bg-primary hover:text-background transition-colors"
            >
              <Mail className="h-4 w-4" />
            </Link>
            <Button
              variant="ghost"
              className="h-8 px-2 border border-primary/20 text-[10px] font-sf-mono bg-transparent hover:bg-primary hover:text-background rounded-none transition-colors"
              onClick={() => setIsResumeModalOpen(true)}
            >
              <FileText className="h-3.5 w-3.5 mr-1" />
              RESUME
            </Button>
            <Button
              variant="ghost"
              className="h-8 px-2 border border-primary/20 text-[10px] font-sf-mono bg-transparent hover:bg-primary hover:text-background rounded-none transition-colors"
              onClick={() => navigateTo("/contact")}
            >
              CONTACT
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>

          <div className="flex items-center text-[10px] font-sf-mono text-primary/50 mt-3">
            <MapPin className="h-3 w-3 mr-1" />
            NEW YORK CITY, USA
          </div>
        </div>

        {/* RIGHT SIDE - Content */}
        <div className="w-full max-w-full flex flex-col justify-start">
          <div className="flex flex-col gap-3 h-full pt-2 sm:pt-3 md:pt-4 lg:pt-0">
            <motion.div
              className="border border-primary/20 bg-background"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-3 divide-x divide-primary/20">
                {stats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-center py-4 px-2">
                    <div className="flex items-center">
                      {stat.hasIndicator && (
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-[blink_0.5s_ease-in-out_infinite]" />
                      )}
                      <span className="text-2xl sm:text-3xl md:text-4xl font-sf-mono font-bold text-primary tracking-tighter">
                        {stat.value}
                      </span>
                      {stat.sublabel && (
                        <span className="text-xs font-sf-mono text-primary/50 ml-1 self-end mb-1">{stat.sublabel}</span>
                      )}
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-sf-mono text-primary/40 uppercase tracking-wider mt-1">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Photo + About with Specializations Carousel */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch">
              {/* Photo Block */}
              <motion.div
                className="border border-primary/20 bg-background p-2 md:w-[160px] lg:w-[180px] shrink-0"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="relative aspect-square w-full">
                  <Image
                    src="/images/design-mode/new_personal_photo(1).png"
                    alt="Profile"
                    fill
                    className="object-cover grayscale"
                  />
                  <div className="absolute top-2 right-2 bg-background/90 border border-primary/30 px-1.5 py-0.5 text-[8px] font-sf-mono">
                    VERIFIED
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="border border-primary/20 bg-background flex-1 flex flex-col"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                <div className="border-b border-primary/20 px-3 py-1.5 bg-primary/5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-sf-mono font-bold tracking-widest text-primary">ABOUT</h3>
                    <span className="text-[9px] font-sf-mono text-primary/30">[01]</span>
                  </div>
                </div>
                <div className="px-3 py-2 flex-1 flex flex-col">
                  <p className="text-[10px] sm:text-xs font-mono text-primary/70 leading-relaxed">
                    Data Scientist and AI Engineer specializing in machine learning, deep learning, and AI systems
                    development. Creating innovative solutions using cutting-edge AI technologies with experience across
                    healthcare, astronomy, and enterprise AI domains.
                  </p>

                  <div className="mt-3 pt-3 border-t border-primary/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider">
                        SPECIALIZATIONS
                      </span>
                      <div className="flex gap-1">
                        {specializations.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveSpecIndex(idx)}
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${
                              activeSpecIndex === idx ? "bg-primary" : "bg-primary/20"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="relative h-12 overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeSpecIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="border border-primary/20 p-2 bg-primary/5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-sf-mono font-bold text-primary">
                              {specializations[activeSpecIndex].label}
                            </span>
                            <span className="text-[8px] font-mono text-primary/50">
                              {String(activeSpecIndex + 1).padStart(2, "0")}/
                              {String(specializations.length).padStart(2, "0")}
                            </span>
                          </div>
                          <p className="text-[9px] font-mono text-primary/60 mt-0.5">
                            {specializations[activeSpecIndex].desc}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Bottom Section: Featured Project + Quick Actions */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch">
              {/* Featured Project Tile */}
              <motion.div
                className="border border-primary/20 bg-background flex-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                <div className="border-b border-primary/20 px-3 py-1.5 bg-primary/5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-sf-mono font-bold tracking-widest text-primary">FEATURED PROJECT</h3>
                    <span className="text-[9px] font-sf-mono text-primary/30">[02]</span>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-sf-mono font-bold text-primary mb-1">{featuredProject.title}</h4>
                  <p className="text-[10px] font-mono text-primary/60 mb-2">{featuredProject.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {featuredProject.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 text-[8px] font-sf-mono border border-primary/20 text-primary/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      className="h-6 px-2 text-[9px] font-sf-mono border border-primary/20 hover:bg-primary hover:text-background rounded-none"
                      onClick={() => navigateTo(featuredProject.link)}
                    >
                      VIEW ALL
                      <ArrowRight className="h-2.5 w-2.5 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions - UNCHANGED */}
              <motion.div
                className="border border-primary/20 bg-background md:w-[160px] lg:w-[180px] shrink-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="border-b border-primary/20 px-3 py-1.5 bg-primary/5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-sf-mono font-bold tracking-widest text-primary">EXPLORE</h3>
                    <span className="text-[9px] font-sf-mono text-primary/30">[03]</span>
                  </div>
                </div>
                <div className="p-2 flex flex-col gap-1.5">
                  {[
                    { label: "PROJECTS", path: "/projects" },
                    { label: "EXPERIENCE", path: "/experience" },
                    { label: "PUBLICATIONS", path: "/publications" },
                  ].map((item, idx) => (
                    <Button
                      key={idx}
                      variant="ghost"
                      className="h-7 w-full justify-between text-[10px] font-sf-mono border border-primary/20 hover:bg-primary hover:text-background rounded-none transition-colors"
                      onClick={() => navigateTo(item.path)}
                    >
                      {item.label}
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <motion.div
              className="flex items-center justify-between border-t border-primary/20 pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.35 }}
            >
              <div className="flex gap-3 text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider">
                <span>STATUS: AVAILABLE</span>
                <span className="text-primary/20">/</span>
                <span>SEEKING: ML/AI ROLES</span>
              </div>
              <div className="text-[9px] font-sf-mono text-primary/30">LAST.UPDATED: 2025</div>
            </motion.div>
          </div>
        </div>
      </div>
      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </>
  )
}
