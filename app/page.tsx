"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Github, Linkedin, FileText, MapPin, Mail, ChevronLeft, ChevronRight } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { useNavigation } from "@/contexts/navigation-context"
import { UpdatesBanner } from "@/components/features/updates/updates-banner"
import { ResumeModal } from "@/components/features/resume/resume-modal"
import Image from "next/image"
import Link from "next/link"
import { projects } from "@/app/projects/data"

const specializations = [
  {
    items: [
      "Machine Learning",
      "Deep Learning",
      "Computer Vision",
      "NLP",
      "LLMs",
      "Generative AI",
      "Neural Networks",
      "Transformers",
      "MLOps",
      "RL",
    ],
    speed: 30,
    reverse: false,
  },
  {
    items: [
      "PyTorch",
      "TensorFlow",
      "JAX",
      "Hugging Face",
      "LangChain",
      "DeepSpeed",
      "Ray",
      "vLLM",
      "LoRA/QLoRA",
      "CUDA",
    ],
    speed: 35,
    reverse: true,
  },
  {
    items: [
      "AWS SageMaker",
      "Apache Spark",
      "Vector DBs",
      "Kubernetes",
      "Docker",
      "FastAPI",
      "PostgreSQL",
      "MLFlow",
      "Databricks",
      "Redis",
    ],
    speed: 28,
    reverse: false,
  },
]

const stats = [
  { label: "PROJECTS", value: "15+" },
  { label: "PUBLICATIONS", value: "3+" },
  { label: "EXPERIENCE", value: "2+ YRS" },
]

const quickLinks = [
  { label: "PROJECTS", path: "/projects" },
  { label: "EXPERIENCE", path: "/experience" },
  { label: "PUBLICATIONS", path: "/publications" },
]

interface MarqueeRowProps {
  items: string[]
  speed: number
  reverse: boolean
}

function MarqueeRow({ items, speed, reverse }: MarqueeRowProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const centerX = rect.width / 2
    const direction = x < centerX ? -1 : 1
    const intensity = Math.abs(x - centerX) / centerX
    const finalDirection = reverse ? -direction : direction
    setOffset(finalDirection * intensity * 30)
  }

  return (
    <div
      ref={ref}
      className="py-2 relative overflow-hidden cursor-pointer border-t border-primary/10 first:border-t-0"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOffset(0)}
    >
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <div className="overflow-hidden">
        <div
          className={`flex items-center whitespace-nowrap ${reverse ? "animate-[marqueeReverse_var(--speed)_linear_infinite]" : "animate-[marquee_var(--speed)_linear_infinite]"} hover:[animation-duration:calc(var(--speed)*2)]`}
          style={
            {
              "--speed": `${speed}s`,
              transform: `translateX(${offset}px)`,
              transition: "transform 0.3s ease-out",
            } as React.CSSProperties
          }
        >
          {[...items, ...items].map((item, idx) => (
            <span key={idx} className="flex items-center shrink-0">
              <span className="font-sf-mono text-primary/70 px-3 uppercase tracking-wider text-base">{item}</span>
              <span className="w-1 h-1 rounded-full bg-primary/30 shrink-0" />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const { navigateTo } = useNavigation()
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0)

  const featuredProjects = projects.filter((p) => p.feature)

  const goToNextFeatured = useCallback(() => {
    setCurrentFeaturedIndex((prev) => (prev + 1) % featuredProjects.length)
  }, [featuredProjects.length])

  const goToPrevFeatured = useCallback(() => {
    setCurrentFeaturedIndex((prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length)
  }, [featuredProjects.length])

  useEffect(() => {
    if (featuredProjects.length <= 1) return
    const interval = setInterval(goToNextFeatured, 5000) // Increased to 5 seconds
    return () => clearInterval(interval)
  }, [featuredProjects.length, goToNextFeatured])

  const currentFeatured = featuredProjects[currentFeaturedIndex]

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
        <UpdatesBanner />
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
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </motion.div>

            {/* About Block */}
            <motion.div
              className="border border-primary/20 bg-background flex-1 min-w-0 flex flex-col"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="border-b border-primary/20 px-3 py-1.5 bg-primary/5">
                <div className="flex items-center justify-between">
                  <h3 className="font-sf-mono font-bold text-primary tracking-tighter text-base">ABOUT</h3>
                  <span className="font-sf-mono text-primary/30 text-base">[01]</span>
                </div>
              </div>
              <div className="px-3 py-2 flex-1 flex flex-col justify-between overflow-hidden">
                <div className="py-3 px-2">
                  <p className="text-primary/70 leading-relaxed font-mono tracking-tight text-[9px] md:text-base">
                    Data Scientist and AI Engineer specializing in{" "}
                    <span className="text-primary font-medium">machine learning</span>,{" "}
                    <span className="text-primary font-medium">deep learning</span>, and{" "}
                    <span className="text-primary font-medium">AI systems development</span>.
                  </p>
                  <p className="text-primary/60 leading-relaxed font-mono tracking-tight mt-2 sm:text-sm hidden md:block">
                    Experience across healthcare, astronomy, and enterprise AI domains.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-2 border-t border-primary/10">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href="https://github.com/rushirb2001"
                      target="_blank"
                      className="w-7 h-7 flex items-center justify-center border border-primary/20 bg-primary text-primary-foreground transition-all group"
                    >
                      <Github className="h-3.5 w-3.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                    <Link
                      href="https://linkedin.com/in/rushir-bhavsar/"
                      target="_blank"
                      className="w-7 h-7 flex items-center justify-center border border-primary/20 bg-primary text-primary-foreground transition-all group"
                    >
                      <Linkedin className="h-3.5 w-3.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                    <Link
                      href="mailto:rushirbhavsar@gmail.com"
                      className="w-7 h-7 flex items-center justify-center border border-primary/20 bg-primary text-primary-foreground transition-all group hidden md:block"
                    >
                      <Mail className="h-3.5 w-3.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                    <span className="flex items-center font-sf-mono text-primary/40 ml-2 text-sm hidden md:block">
                      <MapPin className="h-2.5 w-2.5 mr-0.5" />
                      PHOENIX, AZ
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      className="h-7 px-2 border border-primary/20 text-base font-sf-mono bg-primary text-primary-foreground transition-all group rounded-none"
                      onClick={() => setIsResumeModalOpen(true)}
                    >
                      <FileText className="h-3 w-3 mr-1 group-hover:-translate-y-0.5 transition-transform" />
                      RESUME
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-7 px-2 border border-primary/20 text-base font-sf-mono bg-primary text-primary-foreground transition-all group rounded-none"
                      onClick={() => navigateTo("/contact")}
                    >
                      CONTACT
                      <ArrowRight className="h-2.5 w-2.5 ml-1 group-hover:translate-x-1 transition-transform" />
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
              className="border border-primary/20 bg-background md:w-[180px] lg:w-[200px] shrink-0 hidden md:block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <div className="border-b border-primary/20 px-3 py-1.5 bg-primary/5">
                <div className="flex items-center justify-between">
                  <h3 className="font-sf-mono font-bold text-primary tracking-tighter text-base">METRICS</h3>
                  <span className="font-sf-mono text-primary/30 text-base">[02]</span>
                </div>
              </div>
              <div className="p-2">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 border-b border-primary/5 last:border-b-0"
                  >
                    <span className="font-sf-mono text-primary/40 uppercase text-base">{stat.label}</span>
                    <span className="font-sf-mono font-bold text-primary text-base">{stat.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Specializations Block */}
            <motion.div
              className="border border-primary/20 bg-background flex-1 min-w-0 overflow-hidden hidden md:block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="border-b border-primary/20 px-3 py-1.5 bg-primary/5">
                <div className="flex items-center justify-between">
                  <h3 className="font-sf-mono font-bold text-primary tracking-tighter text-base">SPECIALIZATIONS</h3>
                  <span className="font-sf-mono text-primary/30 text-base">[03]</span>
                </div>
              </div>
              {specializations.map((row, idx) => (
                <MarqueeRow key={idx} items={row.items} speed={row.speed} reverse={row.reverse} />
              ))}
            </motion.div>
          </div>

          {/* Bottom Section: Featured Project + Quick Actions */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch min-w-0">
            {/* Featured Project */}
            <motion.div
              className="border border-primary/20 bg-background flex-1 min-w-0 flex flex-col hidden md:block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="border-b border-primary/20 px-3 py-1.5 bg-primary/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-sf-mono font-bold text-primary tracking-tighter text-base">FEATURED</h3>
                    {featuredProjects.length > 1 && (
                      <span className="text-[8px] font-sf-mono text-primary/30">
                        {currentFeaturedIndex + 1}/{featuredProjects.length}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {featuredProjects.length > 1 && (
                      <button
                        onClick={goToPrevFeatured}
                        className="w-5 h-5 flex items-center justify-center border border-primary/20 bg-primary text-primary-foreground transition-all hover:w-7"
                      >
                        <ChevronLeft className="h-3 w-3" />
                      </button>
                    )}
                    <Button
                      variant="ghost"
                      className="h-5 px-2 border border-primary/20 text-base font-sf-mono bg-primary text-primary-foreground transition-all group rounded-none"
                      onClick={() => navigateTo("/projects")}
                    >
                      ALL
                      <ArrowRight className="h-2.5 w-2.5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    {featuredProjects.length > 1 && (
                      <button
                        onClick={goToNextFeatured}
                        className="w-5 h-5 flex items-center justify-center border border-primary/20 bg-primary text-primary-foreground transition-all hover:w-7"
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
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <h4 className="font-sf-mono font-bold text-primary mb-1 truncate text-xl">
                          {currentFeatured?.title}
                        </h4>
                        <p className="font-mono text-primary/60 line-clamp-2 text-sm">{currentFeatured?.description}</p>
                      </div>
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
                          <span className="text-[8px] font-sf-mono text-primary/30">
                            +{currentFeatured.technologies.length - 3}
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
                  <h3 className="font-sf-mono font-bold text-primary tracking-tighter text-base">EXPLORE</h3>
                  <span className="font-sf-mono text-primary/30 text-base">[05]</span>
                </div>
              </div>
              <div className="p-2 flex flex-col gap-1.5">
                {quickLinks.map((item, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    className="h-7 w-full justify-between text-base font-sf-mono border border-primary/20 bg-primary text-primary-foreground transition-all group rounded-none"
                    onClick={() => navigateTo(item.path)}
                  >
                    {item.label}
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1.5 transition-transform" />
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
