"use client"

import type React from "react"

import { PageLayout } from "@/components/layout/page-layout"
import { motion } from "framer-motion"
import { ArrowRight, Github, Linkedin, FileText, MapPin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigation } from "@/contexts/navigation-context"
import { useState, useRef } from "react"
import { ResumeModal } from "@/components/features/resume/resume-modal"
import Image from "next/image"
import Link from "next/link"

const specializationsRow1 = [
  "Machine Learning",
  "Deep Learning",
  "Computer Vision",
  "Natural Language Processing",
  "Large Language Models",
  "MLOps",
  "Neural Networks",
  "Transformers",
  "Generative AI",
  "Reinforcement Learning",
]

const specializationsRow2 = [
  "PyTorch",
  "TensorFlow",
  "Distributed Training",
  "Model Optimization",
  "Data Engineering",
  "Cloud ML",
  "Feature Engineering",
  "Time Series Analysis",
  "RAG Systems",
  "Diffusion Models",
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
  { label: "EXPERIENCE", value: "2+ YRS", hasIndicator: true },
]

export default function HomeSplitPage() {
  const { navigateTo } = useNavigation()
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)

  const marquee1Ref = useRef<HTMLDivElement>(null)
  const marquee2Ref = useRef<HTMLDivElement>(null)
  const [marquee1Offset, setMarquee1Offset] = useState(0)
  const [marquee2Offset, setMarquee2Offset] = useState(0)

  const handleMarqueeHover = (
    e: React.MouseEvent<HTMLDivElement>,
    ref: React.RefObject<HTMLDivElement>,
    setOffset: React.Dispatch<React.SetStateAction<number>>,
    isReverse: boolean,
  ) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const centerX = rect.width / 2
    const direction = x < centerX ? -1 : 1
    const intensity = Math.abs(x - centerX) / centerX
    // Reverse marquee moves opposite
    const finalDirection = isReverse ? -direction : direction
    setOffset(finalDirection * intensity * 30)
  }

  const handleMarqueeLeave = (setOffset: React.Dispatch<React.SetStateAction<number>>) => {
    setOffset(0)
  }

  return (
    <>
      <PageLayout title="RUSHIR BHAVSAR" subtitle="DATA SCIENTIST • AI ENGINEER • ML RESEARCHER">
        <div className="flex flex-col gap-3 h-full min-w-0 overflow-hidden">
          {/* Top Section: Photo + About */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch min-w-0">
            {/* Photo Block */}
            <motion.div
              className="border border-primary/20 bg-background p-2 md:w-[180px] lg:w-[200px] shrink-0"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative w-full h-full min-h-[160px]">
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

            {/* About Block - Added min-w-0 to prevent text overflow */}
            <motion.div
              className="border border-primary/20 bg-background flex-1 min-w-0 flex flex-col"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="border-b border-primary/20 px-3 py-1.5 bg-primary/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-sf-mono font-bold text-primary tracking-tighter">ABOUT</h3>
                  <span className="text-[9px] font-sf-mono text-primary/30">[01]</span>
                </div>
              </div>
              <div className="px-3 py-2 flex-1 flex flex-col justify-between overflow-hidden">
                <p className="text-[10px] sm:text-xs text-primary/70 leading-relaxed font-mono tracking-tight text-justify py-4 px-3.5">
                  Data Scientist and AI Engineer specializing in machine learning, deep learning, and AI systems
                  development. Creating innovative solutions using cutting-edge AI technologies with experience across
                  healthcare, astronomy, and enterprise AI domains.
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-3 px-3.5 py-2">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href="https://github.com/rushirb2001"
                      target="_blank"
                      className="w-7 h-7 flex items-center justify-center border border-primary/20 hover:bg-primary hover:text-background transition-colors"
                    >
                      <Github className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href="https://linkedin.com/in/rushir-bhavsar/"
                      target="_blank"
                      className="w-7 h-7 flex items-center justify-center border border-primary/20 hover:bg-primary hover:text-background transition-colors"
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href="mailto:rushirbhavsar@gmail.com"
                      className="w-7 h-7 flex items-center justify-center border border-primary/20 hover:bg-primary hover:text-background transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </Link>
                    <div className="flex items-center text-[8px] font-sf-mono text-primary/50 ml-2">
                      <MapPin className="h-2.5 w-2.5 mr-0.5" />
                      NEW YORK CITY, USA
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      className="h-7 px-2 border border-primary/20 text-[9px] font-sf-mono bg-transparent hover:bg-primary hover:text-background rounded-none transition-colors"
                      onClick={() => setIsResumeModalOpen(true)}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      RESUME
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-7 px-2 border border-primary/20 text-[9px] font-sf-mono bg-transparent hover:bg-primary hover:text-background rounded-none transition-colors"
                      onClick={() => navigateTo("/contact")}
                    >
                      CONTACT
                      <ArrowRight className="h-2.5 w-2.5 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Middle Section: Stats + Specializations */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch min-w-0">
            {/* Stats Block */}
            <motion.div
              className="border border-primary/20 bg-background md:w-[180px] lg:w-[200px] shrink-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <div className="border-b border-primary/20 px-3 py-1.5 bg-primary/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-sf-mono font-bold text-primary tracking-tighter">METRICS</h3>
                  <span className="text-[9px] font-sf-mono text-primary/30">[02]</span>
                </div>
              </div>
              <div className="p-2">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1.5 border-b border-primary/5 last:border-b-0"
                  >
                    <span className="text-[9px] font-sf-mono text-primary/40 uppercase">{stat.label}</span>
                    <span className="text-[10px] font-sf-mono font-bold text-primary flex items-center">
                      {stat.hasIndicator && (
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1 animate-[blink_0.5s_ease-in-out_infinite]" />
                      )}
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="border border-primary/20 bg-background flex-1 min-w-0 overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="border-b border-primary/20 px-3 py-1.5 bg-primary/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-sf-mono font-bold text-primary tracking-tighter">SPECIALIZATIONS</h3>
                  <span className="text-[9px] font-sf-mono text-primary/30">[03]</span>
                </div>
              </div>

              {/* First Marquee - Left to Right */}
              <div
                ref={marquee1Ref}
                className="py-2 relative overflow-hidden cursor-pointer"
                onMouseMove={(e) => handleMarqueeHover(e, marquee1Ref, setMarquee1Offset, false)}
                onMouseLeave={() => handleMarqueeLeave(setMarquee1Offset)}
              >
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                <div className="overflow-hidden">
                  <div
                    className="flex items-center whitespace-nowrap animate-[marquee_30s_linear_infinite] hover:[animation-duration:60s]"
                    style={{ transform: `translateX(${marquee1Offset}px)`, transition: "transform 0.3s ease-out" }}
                  >
                    {[...specializationsRow1, ...specializationsRow1].map((item, idx) => (
                      <span key={idx} className="flex items-center shrink-0">
                        <span className="text-[10px] font-sf-mono text-primary/70 px-3 uppercase tracking-wider">
                          {item}
                        </span>
                        <span
                          className="w-1 h-1 rounded-full bg-green-500/60 shrink-0 animate-[blink_1.5s_ease-in-out_infinite]"
                          style={{ animationDelay: `${(idx % 5) * 0.3}s` }}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Second Marquee - Right to Left (Reverse) */}
              <div
                ref={marquee2Ref}
                className="py-2 relative overflow-hidden cursor-pointer border-t border-primary/10"
                onMouseMove={(e) => handleMarqueeHover(e, marquee2Ref, setMarquee2Offset, true)}
                onMouseLeave={() => handleMarqueeLeave(setMarquee2Offset)}
              >
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                <div className="overflow-hidden">
                  <div
                    className="flex items-center whitespace-nowrap animate-[marqueeReverse_35s_linear_infinite] hover:[animation-duration:70s]"
                    style={{ transform: `translateX(${marquee2Offset}px)`, transition: "transform 0.3s ease-out" }}
                  >
                    {[...specializationsRow2, ...specializationsRow2].map((item, idx) => (
                      <span key={idx} className="flex items-center shrink-0">
                        <span className="text-[10px] font-sf-mono text-primary/70 px-3 uppercase tracking-wider">
                          {item}
                        </span>
                        <span
                          className="w-1 h-1 rounded-full bg-green-500/60 shrink-0 animate-[blink_1.5s_ease-in-out_infinite]"
                          style={{ animationDelay: `${(idx % 5) * 0.3}s` }}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Section: Featured Project + Quick Actions */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch min-w-0">
            {/* Featured Project Tile */}
            <motion.div
              className="border border-primary/20 bg-background flex-1 min-w-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="border-b border-primary/20 px-3 py-1.5 bg-primary/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-sf-mono font-bold text-primary tracking-tighter">FEATURED PROJECT</h3>
                  <span className="text-[9px] font-sf-mono text-primary/30">[04]</span>
                </div>
              </div>
              <div className="p-3">
                <h4 className="text-sm font-sf-mono font-bold text-primary mb-1">{featuredProject.title}</h4>
                <p className="text-[10px] font-mono text-primary/60 mb-2">{featuredProject.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
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

            {/* Quick Actions */}
            <motion.div
              className="border border-primary/20 bg-background md:w-[180px] lg:w-[200px] shrink-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.35 }}
            >
              <div className="border-b border-primary/20 px-3 py-1.5 bg-primary/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-sf-mono font-bold text-primary tracking-tighter">EXPLORE</h3>
                  <span className="text-[9px] font-sf-mono text-primary/30">[05]</span>
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
        </div>
      </PageLayout>
      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </>
  )
}
