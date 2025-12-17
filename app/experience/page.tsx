"use client"

import { PageLayout } from "@/components/layout/page-layout"
import { useState, useEffect } from "react"
import { MapPin, Calendar, ChevronDown, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"

interface Experience {
  title: string
  company: string
  location: string
  period: string
  description: string
  responsibilities: string[]
  skills: string[]
}

export default function ExperiencePage() {
  const [selectedExp, setSelectedExp] = useState<number | null>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [startIndex, setStartIndex] = useState(0)
  const ITEMS_PER_PAGE = 5
  const isMobile = useMediaQuery("(max-width: 768px)")

  const experiences: Experience[] = [
    {
      title: "GENAI ENGINEERING INTERN",
      company: "TALIN LABS INC",
      location: "REMOTE",
      period: "MAY'24 - SEP'24",
      description:
        "Developed and deployed AI pipelines and systems for enterprise applications, focusing on reliability, scalability, and performance optimization.",
      responsibilities: [
        "Increased system reliability by 42% and data accessibility by 63% by deploying AI pipelines on AWS & Azure using Docker containers orchestrated by Kubernetes",
        "Enhanced Custom AI Chatbot deployment efficiency by implementing Transformer-based models with OpenAI API and Mistral Big within the LangChain framework",
        "Accelerated supply-chain query handling by 12%, achieving sub-second latencies and an 86% increase in data throughput by applying Retrieval-Augmented Generation (RAG) techniques",
      ],
      skills: ["AWS", "AZURE", "DOCKER", "LANGCHAIN", "RAG"],
    },
    {
      title: "AI RESEARCH INTERN",
      company: "GIOSTAR.AI",
      location: "PHOENIX, AZ",
      period: "NOV'23 - MAY'24",
      description:
        "Conducted research and development in AI applications for healthcare, focusing on EEG processing and medical imaging analysis.",
      responsibilities: [
        "Optimized EEG processing in the PyData Stack by applying time-frequency analysis, reducing latency by 25% and enabling real-time thought-controlled smartphone usage",
        "Incorporated artifact detection algorithms in PyTorch TFT & RCNN models and automated it via Jenkins CI/CD for Epilepsy Detection, exceeding 90% detection accuracy",
        "Built Vision Transformer & U-Net models in ExecuTorch with MONAI for AWS EC2 deployment, improving detection/classification accuracy by 20%",
      ],
      skills: ["PYTORCH", "JENKINS", "AWS EC2", "MONAI", "VISION TRANSFORMERS"],
    },
    {
      title: "AI/ML ENGINEER",
      company: "NIRMA UNIVERSITY",
      location: "AHMEDABAD, INDIA",
      period: "AUG'22 - AUG'23",
      description:
        "Developed and optimized computer vision models for license plate detection and recognition, focusing on accuracy and performance improvements.",
      responsibilities: [
        "Aggregated and annotated 10,000+ license plate images using custom scripting and the TensorFlow Object Detection API, boosting OCR model accuracy by 18%",
        "Engineered an OCR Deep Learning Model and an Ensemble Learning Model for 480p and noisy 1080p images, achieving 86% letter detection efficacy",
        "Optimized YOLOv5 and Localized Object Tracking (LOT) for edge devices, cutting detection latency by 13% and raising detection accuracy by 22%",
      ],
      skills: ["TENSORFLOW", "YOLOV5", "OCR", "EDGE DEPLOYMENT"],
    },
  ]

  const visibleExperiences = experiences.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  const canShowPrevious = startIndex > 0
  const canShowNext = startIndex + ITEMS_PER_PAGE < experiences.length
  const showPaginationControls = experiences.length > ITEMS_PER_PAGE

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && selectedExp !== null) {
        setSelectedExp(null)
      }
    }
    document.addEventListener("keydown", handleEscKey)
    return () => document.removeEventListener("keydown", handleEscKey)
  }, [selectedExp])

  return (
    <PageLayout title="EXPERIENCE" subtitle="WORK HISTORY">
      <div className="space-y-0">
        {/* Pagination Controls */}
        {showPaginationControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col md:flex-row items-center justify-center gap-2 py-3 mb-2"
          >
            <div className="flex items-center gap-2 w-full md:w-auto justify-center">
              <button
                onClick={() => {
                  setSelectedExp(null)
                  setStartIndex((prev) => Math.max(0, prev - ITEMS_PER_PAGE))
                }}
                disabled={!canShowPrevious}
                className={`px-3 md:px-4 py-1.5 text-[10px] font-sf-mono uppercase tracking-wider border transition-all duration-150 flex-1 md:flex-none md:w-32 ${
                  canShowPrevious
                    ? "border-primary/30 text-primary/70 hover:bg-primary/10 hover:border-primary/50"
                    : "border-primary/10 text-primary/20 cursor-not-allowed opacity-0 pointer-events-none"
                }`}
              >
                ← PREVIOUS
              </button>
              <button
                onClick={() => {
                  setSelectedExp(null)
                  setStartIndex((prev) => prev + ITEMS_PER_PAGE)
                }}
                disabled={!canShowNext}
                className={`px-3 md:px-4 py-1.5 text-[10px] font-sf-mono uppercase tracking-wider border transition-all duration-150 flex-1 md:flex-none md:w-32 ${
                  canShowNext
                    ? "border-primary/30 text-primary/70 hover:bg-primary/10 hover:border-primary/50"
                    : "border-primary/10 text-primary/20 cursor-not-allowed opacity-0 pointer-events-none"
                }`}
              >
                {"NEXT →"}
              </button>
            </div>
            <span className="text-[9px] font-sf-mono text-primary/40 md:px-2">
              {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, experiences.length)} OF {experiences.length}
            </span>
          </motion.div>
        )}

        {/* Table Header - Desktop Only */}
        <div className="hidden md:grid grid-cols-[2fr_1.5fr_1.2fr_1fr_40px] gap-2 px-3 py-2 border-b border-primary/30 text-[10px] font-sf-mono text-primary/50 uppercase tracking-wider">
          <span>POSITION</span>
          <span>COMPANY</span>
          <span>PERIOD</span>
          <span>LOCATION</span>
          <span></span>
        </div>

        {/* Experience List */}
        {visibleExperiences.map((exp, index) => {
            const actualIndex = startIndex + index

            return (
              <motion.div
                key={actualIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: index * 0.05 }}
                className="border-b border-primary/10"
              >
                {/* Clickable Row */}
                <div
                  onClick={() => setSelectedExp(selectedExp === actualIndex ? null : actualIndex)}
                  onMouseEnter={() => setHoveredId(actualIndex)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`cursor-pointer transition-all duration-150 ${
                    selectedExp === actualIndex
                      ? hoveredId === actualIndex
                        ? "bg-primary/90 text-background"
                        : "bg-primary text-background"
                      : hoveredId === actualIndex
                        ? "bg-primary/10"
                        : ""
                  }`}
                >
                  {/* Desktop Row */}
                  <div className="hidden md:grid grid-cols-[2fr_1.5fr_1.2fr_1fr_40px] gap-2 px-3 py-3 items-center">
                    <span className="text-xs font-sf-mono font-medium">{exp.title}</span>
                    <span
                      className={`text-xs font-sf-mono ${selectedExp === actualIndex ? "text-background/70" : "text-primary/60"}`}
                    >
                      {exp.company}
                    </span>
                    <span
                      className={`text-xs font-sf-mono ${selectedExp === actualIndex ? "text-background/70" : "text-primary/50"}`}
                    >
                      {exp.period}
                    </span>
                    <span
                      className={`text-xs font-sf-mono ${selectedExp === actualIndex ? "text-background/70" : "text-primary/50"}`}
                    >
                      {exp.location}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedExp(selectedExp === actualIndex ? null : actualIndex)
                      }}
                      className={`flex items-center justify-center w-8 h-8 border transition-all duration-200 ${
                        selectedExp === actualIndex
                          ? "border-background/30 hover:bg-background/20"
                          : "border-primary/20 hover:bg-primary/10 hover:border-primary/40"
                      }`}
                    >
                      <motion.div
                        animate={{ rotate: selectedExp === actualIndex ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {selectedExp === actualIndex ? (
                          <X className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </motion.div>
                    </button>
                  </div>

                  {/* Mobile Row */}
                  <div className="md:hidden px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[11px] font-sf-mono font-medium">{exp.title}</h3>
                        <p className={`text-[10px] font-sf-mono ${selectedExp === actualIndex ? "text-background/60" : "text-primary/50"}`}>
                          {exp.company} • {exp.location} • {exp.period}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedExp(selectedExp === actualIndex ? null : actualIndex)
                        }}
                        className={`flex items-center justify-center w-7 h-7 border flex-shrink-0 ${
                          selectedExp === actualIndex ? "border-background/30" : "border-primary/20"
                        }`}
                      >
                        <motion.div
                          animate={{ rotate: selectedExp === actualIndex ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {selectedExp === actualIndex ? (
                            <X className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </motion.div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expandable Details - OUTSIDE the black clickable row */}
                <AnimatePresence>
                  {selectedExp === actualIndex && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-primary/5 p-3 md:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 md:gap-6">
                          {/* Left: Responsibilities */}
                          <div>
                            <span className="text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider">
                              KEY ACHIEVEMENTS
                            </span>
                            <div className="space-y-2 mt-2">
                              {exp.responsibilities.map((resp, idx) => (
                                <div key={idx} className="flex gap-2">
                                  <div className="w-4 h-4 border border-primary/20 bg-primary/5 flex items-center justify-center text-[9px] font-sf-mono text-primary/50 flex-shrink-0">
                                    {idx + 1}
                                  </div>
                                  <p className="text-[10px] md:text-xs font-sf-mono text-primary/70 leading-relaxed">{resp}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Right: Skills */}
                          <div className="md:border-l md:border-primary/10 md:pl-6">
                            <span className="text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider">
                              TECH STACK
                            </span>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {exp.skills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-1.5 py-0.5 text-[9px] font-sf-mono border border-primary/20 bg-primary/5 hover:bg-primary hover:text-background transition-colors"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>

                            {/* Overview - Desktop Only */}
                            <div className="hidden md:block mt-4 pt-4 border-t border-primary/10">
                              <span className="text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider">
                                OVERVIEW
                              </span>
                              <p className="text-[11px] font-sf-mono text-primary/60 mt-2 leading-relaxed">
                                {exp.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}

        {/* Footer Stats */}
        <motion.div
          className="flex items-center justify-between border-t border-primary/20 pt-3 mt-4 px-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3 }}
        >
          <div className="flex flex-wrap gap-1 sm:gap-2 md:gap-4 text-[9px] sm:text-[10px] font-sf-mono text-primary/40 uppercase tracking-wider">
            <span>{experiences.length} {isMobile ? "ROLES" : "POSITIONS"}</span>
            <span className="text-primary/20">/</span>
            <span>{experiences.length} {isMobile ? "CO" : "COMPANIES"}</span>
            <span className="text-primary/20">/</span>
            <span>2022-24</span>
          </div>
          <div className="text-[9px] sm:text-[10px] font-sf-mono text-primary/30">LAST.UPDATED: 2025</div>
        </motion.div>
      </div>
    </PageLayout>
  )
}
