"use client"

import { PageLayout } from "@/components/layout/page-layout"
import { motion } from "framer-motion"
import { ArrowRight, MapPin, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigation } from "@/contexts/navigation-context"
import { useState, useEffect } from "react"
import Image from "next/image"

const specializations = [
  { label: "LLM/RAG", desc: "Large Language Models & Retrieval-Augmented Generation" },
  { label: "CV", desc: "Computer Vision & Image Processing" },
  { label: "MLOps", desc: "ML Infrastructure & Deployment" },
  { label: "GenAI", desc: "Generative AI & Diffusion Models" },
]

const featuredProject = {
  id: "proj_ml_pipeline_003",
  title: "Machine Learning Pipeline for Image Classification",
  description: "End-to-end ML pipeline for training and deploying image models",
  tags: ["Python", "PyTorch", "Docker", "FastAPI", "AWS"],
  isStarred: true,
}

const stats = [
  { label: "PROJECTS", value: "15+" },
  { label: "PUBLICATIONS", value: "3+" },
  { label: "EXPERIENCE", value: "2+", suffix: "YRS", hasIndicator: true },
]

export default function HomeSplitPage() {
  const { navigateTo } = useNavigation()
  const [activeSpec, setActiveSpec] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSpec((prev) => (prev + 1) % specializations.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleFeaturedProjectClick = () => {
    sessionStorage.setItem("openProjectId", featuredProject.id)
    navigateTo("/projects")
  }

  return (
    <PageLayout title="RUSHIR BHAVSAR" subtitle="DATA SCIENTIST • AI ENGINEER • ML RESEARCHER" showSocialLinks={true}>
      <div className="flex flex-col gap-3 h-full">
        <motion.div
          className="border border-primary/20 bg-background"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-3 divide-x divide-primary/20">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-3 sm:p-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  {stat.hasIndicator && (
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-[blink_0.5s_ease-in-out_infinite]" />
                  )}
                  <span className="text-xl sm:text-2xl md:text-3xl font-sf-mono font-bold text-primary tracking-tight">
                    {stat.value}
                  </span>
                  {stat.suffix && (
                    <span className="text-xs sm:text-sm font-sf-mono text-primary/50 self-end mb-1">{stat.suffix}</span>
                  )}
                </div>
                <span className="text-[9px] sm:text-[10px] font-sf-mono text-primary/40 uppercase tracking-widest">
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
            <div className="flex items-center justify-center mt-2 pt-2 border-t border-primary/10 text-[9px] font-sf-mono text-primary/50">
              <MapPin className="h-3 w-3 mr-1" />
              NEW YORK, NY
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
              <p className="text-[10px] sm:text-xs font-mono text-primary/70 leading-relaxed mb-3">
                Data Scientist and AI Engineer specializing in machine learning, deep learning, and AI systems
                development. Creating innovative solutions using cutting-edge AI technologies with experience across
                healthcare, astronomy, and enterprise AI domains.
              </p>

              <div className="border-t border-primary/10 pt-2 mt-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[8px] font-sf-mono text-primary/40 uppercase tracking-wider">
                    SPECIALIZATIONS
                  </span>
                  <div className="flex gap-1">
                    {specializations.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSpec(idx)}
                        className={`w-1.5 h-1.5 transition-colors ${
                          activeSpec === idx ? "bg-primary" : "bg-primary/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <motion.div
                  key={activeSpec}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xs font-sf-mono font-bold text-primary">
                    {specializations[activeSpec].label}
                  </span>
                  <span className="text-[9px] font-mono text-primary/50">— {specializations[activeSpec].desc}</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section: Featured Project + Quick Actions */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch">
          <motion.div
            className="border border-primary/20 bg-background flex-1 cursor-pointer hover:border-primary/40 transition-colors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={handleFeaturedProjectClick}
          >
            <div className="border-b border-primary/20 px-3 py-1.5 bg-primary/5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-sf-mono font-bold tracking-widest text-primary">PROJECT</h3>
                <span className="text-[9px] font-sf-mono text-primary/30">[02]</span>
              </div>
            </div>
            <div className="p-3 relative">
              <div className="absolute bottom-3 left-3">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500/30" />
              </div>

              <h4 className="text-sm font-sf-mono font-bold text-primary mb-1 pr-8">{featuredProject.title}</h4>
              <p className="text-[10px] font-mono text-primary/60 mb-2">{featuredProject.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">
                  {featuredProject.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 text-[8px] font-sf-mono border border-primary/20 text-primary/60"
                    >
                      {tag}
                    </span>
                  ))}
                  {featuredProject.tags.length > 3 && (
                    <span className="px-1.5 py-0.5 text-[8px] font-sf-mono text-primary/40">
                      +{featuredProject.tags.length - 3}
                    </span>
                  )}
                </div>
                <ArrowRight className="h-4 w-4 text-primary/40" />
              </div>
            </div>
          </motion.div>

          {/* Quick Actions - Explore */}
          <motion.div
            className="border border-primary/20 bg-background md:w-[160px] lg:w-[180px] shrink-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
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
                { label: "SKILLS", path: "/skills" },
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
          transition={{ duration: 0.2, delay: 0.3 }}
        >
          <div className="flex gap-3 text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider">
            <span>STATUS: AVAILABLE</span>
            <span className="text-primary/20">/</span>
            <span>SEEKING: ML/AI ROLES</span>
          </div>
          <div className="text-[9px] font-sf-mono text-primary/30">LAST.UPDATED: 2025</div>
        </motion.div>
      </div>
    </PageLayout>
  )
}
