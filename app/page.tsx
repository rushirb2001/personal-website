"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PageLayout } from "@/components/layout/page-layout"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Github, Linkedin, FileText, MapPin, Mail, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigation } from "@/contexts/navigation-context"
import { useState, useRef, useEffect, useCallback } from "react"
import { UpdatesBanner } from "@/components/features/updates/updates-banner"
import { ResumeModal } from "@/components/features/resume/resume-modal"
import Image from "next/image"
import Link from "next/link"
import { projects } from "@/app/projects/data"

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

const specializationsRow3 = [
  "Hugging Face",
  "LangChain",
  "Vector Databases",
  "AWS SageMaker",
  "Kubernetes",
  "Docker",
  "FastAPI",
  "Prompt Engineering",
  "CUDA",
  "Model Serving",
]

const stats = [
  { label: "PROJECTS", value: "15+" },
  { label: "PUBLICATIONS", value: "3+" },
  { label: "EXPERIENCE", value: "2+ YRS", hasIndicator: true },
]

const systemicTransition = {
  duration: 0.25,
  ease: [0.5, 0, 1, 1],
}

export default function Home() {

  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)

  const { navigateTo } = useNavigation()
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)

  const featuredProjects = projects.filter((p) => p.feature)
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0)

  const marquee1Ref = useRef<HTMLDivElement>(null)
  const marquee2Ref = useRef<HTMLDivElement>(null)
  const marquee3Ref = useRef<HTMLDivElement>(null)
  const [marquee1Offset, setMarquee1Offset] = useState(0)
  const [marquee2Offset, setMarquee2Offset] = useState(0)
  const [marquee3Offset, setMarquee3Offset] = useState(0)

  const goToNextFeatured = useCallback(() => {
    setCurrentFeaturedIndex((prev) => (prev + 1) % featuredProjects.length)
  }, [featuredProjects.length])

  const goToPrevFeatured = useCallback(() => {
    setCurrentFeaturedIndex((prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length)
  }, [featuredProjects.length])

  useEffect(() => {
    if (featuredProjects.length <= 1) return
    const interval = setInterval(goToNextFeatured, 3000)
    return () => clearInterval(interval)
  }, [featuredProjects.length, goToNextFeatured])

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
    const finalDirection = isReverse ? -direction : direction
    setOffset(finalDirection * intensity * 30)
  }

  const handleMarqueeLeave = (setOffset: React.Dispatch<React.SetStateAction<number>>) => {
    setOffset(0)
  }

  const currentFeatured = featuredProjects[currentFeaturedIndex]

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
                      className="w-7 h-7 flex items-center justify-center border border-primary/20 hover:bg-[#6B21A8] hover:border-[#6B21A8] hover:text-white transition-colors"
                    >
                      <Github className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href="https://linkedin.com/in/rushir-bhavsar/"
                      target="_blank"
                      className="w-7 h-7 flex items-center justify-center border border-primary/20 hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white transition-colors"
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
                      className="h-7 px-2 border border-primary/20 text-[9px] font-sf-mono bg-transparent hover:bg-primary hover:text-background transition-colors rounded-none"
                      onClick={() => setIsResumeModalOpen(true)}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      RESUME
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-7 px-2 border border-primary/20 text-[9px] font-sf-mono bg-transparent hover:bg-primary hover:text-background transition-colors rounded-none"
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

              <div
                ref={marquee3Ref}
                className="py-2 relative overflow-hidden cursor-pointer border-t border-primary/10"
                onMouseMove={(e) => handleMarqueeHover(e, marquee3Ref, setMarquee3Offset, false)}
                onMouseLeave={() => handleMarqueeLeave(setMarquee3Offset)}
              >
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                <div className="overflow-hidden">
                  <div
                    className="flex items-center whitespace-nowrap animate-[marquee_25s_linear_infinite] hover:[animation-duration:50s]"
                    style={{ transform: `translateX(${marquee3Offset}px)`, transition: "transform 0.3s ease-out" }}
                  >
                    {[...specializationsRow3, ...specializationsRow3].map((item, idx) => (
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
              className="border border-primary/20 bg-background flex-1 min-w-0 flex flex-col"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="border-b border-primary/20 px-3 py-1.5 bg-primary/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-sf-mono font-bold text-primary tracking-tighter">FEATURED PROJECT</h3>
                    {featuredProjects.length > 1 && (
                      <div className="flex gap-1">
                        {featuredProjects.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentFeaturedIndex(idx)}
                            className={`w-1 h-1 rounded-full transition-colors ${
                              idx === currentFeaturedIndex ? "bg-primary" : "bg-primary/20 hover:bg-primary/40"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {featuredProjects.length > 1 && (
                      <button
                        onClick={goToPrevFeatured}
                        className="w-5 h-5 flex items-center justify-center border border-primary/20 hover:bg-primary hover:text-background transition-colors"
                      >
                        <ChevronLeft className="h-3 w-3" />
                      </button>
                    )}
                    <Button
                      variant="ghost"
                      className="h-5 px-2 border border-primary/20 text-[8px] font-sf-mono bg-transparent hover:bg-primary hover:text-background rounded-none transition-colors"
                      onClick={() => navigateTo("/projects")}
                    >
                      VIEW ALL
                      <ArrowRight className="h-2.5 w-2.5 ml-1" />
                    </Button>
                    {featuredProjects.length > 1 && (
                      <button
                        onClick={goToNextFeatured}
                        className="w-5 h-5 flex items-center justify-center border border-primary/20 hover:bg-primary hover:text-background transition-colors"
                      >
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-3 flex-1 flex relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFeatured?.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 flex"
                  >
                    <div className="flex gap-3 w-full">
                      {/* Left: Title + Description */}
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <h4 className="text-sm font-sf-mono font-bold text-primary mb-1 truncate">
                          {currentFeatured?.title}
                        </h4>
                        <p className="text-[10px] font-mono text-primary/60 line-clamp-2">
                          {currentFeatured?.description}
                        </p>
                      </div>
                      {/* Right: Technologies stacked vertically */}
                      <div className="flex flex-col gap-1 items-end justify-center shrink-0">
                        {currentFeatured?.technologies.slice(0, 3).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 text-[8px] font-sf-mono border border-primary/20 text-primary/60 whitespace-nowrap"
                          >
                            {tech}
                          </span>
                        ))}
                        {currentFeatured?.technologies && currentFeatured.technologies.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[8px] font-sf-mono text-primary/40">
                            +{currentFeatured.technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
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
              <div className="p-2 flex flex-col gap-1.5 ">
                {[
                  { label: "PROJECTS", path: "/projects" },
                  { label: "EXPERIENCE", path: "/experience" },
                  { label: "PUBLICATIONS", path: "/publications" },
                ].map((item, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    className="h-7 w-full justify-between text-[10px] font-sf-mono border border-primary/20 hover:bg-primary hover:text-background rounded-none transition-colors group animate-arrow-push-1"
                    onClick={() => navigateTo(item.path)}
                  >
                    {item.label}
                    <ArrowRight
                      className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300"
                      style={{
                        animation: `arrow-push 1.5s ease-in-out infinite`,
                        animationDelay: `${idx * 150}ms`,
                      }}
                    />
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
