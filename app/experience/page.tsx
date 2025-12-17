"use client"

import { PageLayout } from "@/components/layout/page-layout"
import { useState } from "react"
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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [startIndex, setStartIndex] = useState(0)
  const ITEMS_PER_PAGE = 5
  const isMobile = useMediaQuery("(max-width: 768px)")

  const experiences: Experience[] = [
    {
      title: "GENAI ENGINEERING INTERN",
      company: "TALIN LABS INC",
      location: "REMOTE",
      period: "MAY 2024 - SEP 2024",
      description:
        "Developed and deployed AI pipelines and systems for enterprise applications, focusing on reliability, scalability, and performance optimization.",
      responsibilities: [
        "Increased system reliability by 42% and data accessibility by 63% by deploying AI pipelines on AWS & Azure using Docker containers orchestrated by Kubernetes",
        "Enhanced Custom AI Chatbot deployment efficiency by implementing Transformer-based models with OpenAI API and Mistral Big within the LangChain framework",
        "Accelerated supply-chain query handling by 12%, achieving sub-second latencies and an 86% increase in data throughput by applying Retrieval-Augmented Generation (RAG) techniques",
      ],
      skills: ["AWS", "AZURE", "DOCKER", "KUBERNETES", "LANGCHAIN", "RAG"],
    },
    {
      title: "AI RESEARCH INTERN",
      company: "GIOSTAR.AI",
      location: "PHOENIX, AZ",
      period: "NOV 2023 - MAY 2024",
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
      period: "AUG 2022 - AUG 2023",
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

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  // Reset expanded state when paginating
  const handlePrevious = () => {
    setExpandedIndex(null)
    setStartIndex((prev) => Math.max(0, prev - ITEMS_PER_PAGE))
  }

  const handleNext = () => {
    setExpandedIndex(null)
    setStartIndex((prev) => prev + ITEMS_PER_PAGE)
  }

  return (
    <PageLayout title="EXPERIENCE" subtitle="WORK HISTORY">
      <div className="space-y-3 max-w-3xl mx-auto">
        {/* Pagination Controls */}
        {showPaginationControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col md:flex-row items-center justify-center gap-2 py-3 mb-2"
          >
            <div className="flex items-center gap-2 w-full md:w-auto justify-center">
              <button
                onClick={handlePrevious}
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
                onClick={handleNext}
                disabled={!canShowNext}
                className={`px-3 md:px-4 py-1.5 text-[10px] font-sf-mono uppercase tracking-wider border transition-all duration-150 flex-1 md:flex-none md:w-32 ${
                  canShowNext
                    ? "border-primary/30 text-primary/70 hover:bg-primary/10 hover:border-primary/50"
                    : "border-primary/10 text-primary/20 cursor-not-allowed opacity-0 pointer-events-none"
                }`}
              >
                NEXT →
              </button>
            </div>
            <span className="text-[9px] font-sf-mono text-primary/40 md:px-2">
              {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, experiences.length)} OF {experiences.length}
            </span>
          </motion.div>
        )}

        {/* Experience List */}
        {visibleExperiences.map((exp, index) => {
          const actualIndex = startIndex + index

          return (
            <motion.div
              key={actualIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              className="border border-primary/20 bg-background"
            >
              {/* Header */}
              <div className="border-b border-primary/20 px-3 py-2 bg-primary/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sf-mono font-bold tracking-widest">{exp.company}</span>
                  <span className="text-[10px] font-sf-mono text-primary/30">[{String(actualIndex + 1).padStart(2, "0")}]</span>
                </div>
              </div>

              {/* Main Content - Clickable */}
              <div
                onClick={() => toggleExpand(actualIndex)}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  expandedIndex === actualIndex 
                    ? "bg-primary text-background" 
                    : "hover:bg-primary/5"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-sf-mono font-medium mb-2">{exp.title}</h3>
                    <p className={`text-xs font-sf-mono mb-3 ${expandedIndex === actualIndex ? "text-background/70" : "text-primary/60"}`}>
                      {exp.description}
                    </p>
                    
                    <div className={`flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-sf-mono ${expandedIndex === actualIndex ? "text-background/60" : "text-primary/50"}`}>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {exp.period}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  <button
                    className={`flex items-center justify-center w-8 h-8 border transition-all duration-200 ${
                      expandedIndex === actualIndex
                        ? "border-background/30 hover:bg-background/20"
                        : "border-primary/20 hover:border-primary/40"
                    }`}
                  >
                    <motion.div
                      animate={{ rotate: expandedIndex === actualIndex ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {expandedIndex === actualIndex ? (
                        <X className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </motion.div>
                  </button>
                </div>
              </div>

              {/* Expandable Details */}
              <AnimatePresence>
                {expandedIndex === actualIndex && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-2 border-t border-primary/10 space-y-4">
                      {/* Responsibilities */}
                      <div>
                        <span className="text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider">
                          KEY ACHIEVEMENTS
                        </span>
                        <div className="space-y-2 mt-2">
                          {exp.responsibilities.map((resp, idx) => (
                            <div key={idx} className="flex gap-3">
                              <div className="w-5 h-5 border border-primary/20 bg-primary/5 flex items-center justify-center text-[10px] font-sf-mono text-primary/50 flex-shrink-0">
                                {idx + 1}
                              </div>
                              <p className="text-xs font-sf-mono text-primary/70 leading-relaxed">{resp}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Skills */}
                      <div>
                        <span className="text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider">
                          TECHNOLOGIES USED
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {exp.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-[10px] font-sf-mono border border-primary/20 bg-primary/5 hover:bg-primary hover:text-background transition-colors"
                            >
                              {skill}
                            </span>
                          ))}
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.4 }}
          className="flex items-center justify-between border-t border-primary/20 pt-3"
        >
          <div className="flex gap-1 sm:gap-2 text-[9px] sm:text-[10px] font-sf-mono text-primary/40 uppercase tracking-wider">
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
