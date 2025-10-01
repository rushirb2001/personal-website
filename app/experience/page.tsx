"use client"

import { PageLayout } from "@/components/layout/page-layout"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, MapPin, Clock, TrendingUp, TrendingDown, Terminal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Metric {
  label: string
  value: string
  isIncrease: boolean // true = up arrow, false = down arrow
}

interface Experience {
  title: string
  company: string
  location: string
  period: string
  id: string
  assignmentId: string
  status: "COMPLETED" | "ACTIVE" | "FLAGGED"
  description: string
  responsibilities: string[]
  metrics: Metric[] // Top 3 metrics to display
}

export default function ExperiencePage() {
  const experiences: Experience[] = [
    {
      title: "GENAI ENGINEERING INTERN",
      company: "TALIN LABS INC",
      location: "REMOTE",
      period: "MAY 2024 - SEP 2024",
      id: "EXP-9I-783",
      assignmentId: "TLABS-2024-05",
      status: "COMPLETED",
      description:
        "Developed and deployed AI pipelines and systems for enterprise applications, focusing on reliability, scalability, and performance optimization.",
      responsibilities: [
        "Increased system reliability by 42% and data accessibility by 63% by deploying AI pipelines on AWS & Azure using Docker containers orchestrated by Kubernetes",
        "Enhanced Custom AI Chatbot deployment efficiency by implementing Transformer-based models with OpenAI API and Mistral Big within the LangChain framework",
        "Accelerated supply-chain query handling by 12%, achieving sub-second latencies and an 86% increase in data throughput by applying Retrieval-Augmented Generation (RAG) techniques",
      ],
      metrics: [
        { label: "RELIABILITY", value: "42%", isIncrease: true },
        { label: "ACCESSIBILITY", value: "63%", isIncrease: true },
        { label: "THROUGHPUT", value: "86%", isIncrease: true },
      ],
    },
    {
      title: "AI RESEARCH INTERN",
      company: "GIOSTAR.AI",
      location: "PHOENIX, AZ",
      period: "NOV 2023 - MAY 2024",
      id: "EXP-1J-892",
      assignmentId: "GIO-2023-11",
      status: "COMPLETED",
      description:
        "Conducted research and development in AI applications for healthcare, focusing on EEG processing and medical imaging analysis.",
      responsibilities: [
        "Optimized EEG processing in the PyData Stack by applying time-frequency analysis, reducing latency by 25% and enabling real-time thought-controlled smartphone usage",
        "Incorporated artifact detection algorithms in PyTorch TFT & RCNN models and automated it via Jenkins CI/CD for Epilepsy Detection, exceeding 90% detection accuracy",
        "Built Vision Transformer & U-Net models in ExecuTorch with MONAI for AWS EC2 deployment, improving detection/classification accuracy by 20%",
      ],
      metrics: [
        { label: "LATENCY", value: "25%", isIncrease: false },
        { label: "ACCURACY", value: "90%", isIncrease: true },
        { label: "PERFORMANCE", value: "20%", isIncrease: true },
      ],
    },
    {
      title: "AI/SOW ENGINEER",
      company: "NIRMA UNIVERSITY",
      location: "AHMEDABAD, INDIA",
      period: "AUG 2022 - AUG 2023",
      id: "EXP-2K-901",
      assignmentId: "NU-2022-08",
      status: "COMPLETED",
      description:
        "Developed and optimized computer vision models for license plate detection and recognition, focusing on accuracy and performance improvements.",
      responsibilities: [
        "Aggregated and annotated 10,000+ license plate images using custom scripting and the TensorFlow Object Detection API, boosting OCR model accuracy by 18%",
        "Engineered an OCR Deep Learning Model and an Ensemble Learning Model for 480p and noisy 1080p images, achieving 86% letter detection efficacy",
        "Optimized YOLOv5 and Localized Object Tracking (LOT) for edge devices, cutting detection latency by 13% and raising detection accuracy by 22%",
      ],
      metrics: [
        { label: "ACCURACY", value: "18%", isIncrease: true },
        { label: "EFFICACY", value: "86%", isIncrease: true },
        { label: "LATENCY", value: "13%", isIncrease: false },
      ],
    },
  ]

  const [currentPage, setCurrentPage] = useState(0)
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const itemsPerPage = typeof window !== "undefined" && window?.innerWidth < 768 ? 3 : 3
  const totalPages = Math.ceil(experiences.length / itemsPerPage)

  const getCurrentExperiences = () => {
    const start = currentPage * itemsPerPage
    return experiences.slice(start, start + itemsPerPage)
  }

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const openModal = (exp: Experience) => {
    setSelectedExp(exp)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedExp(null)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Extract keywords from responsibilities
  const extractKeywords = (responsibilities: string[]) => {
    const allText = responsibilities.join(" ").toLowerCase()
    const keywords: string[] = []

    // Tech/Tools
    if (allText.includes("aws") || allText.includes("azure") || allText.includes("cloud")) keywords.push("CLOUD")
    if (allText.includes("docker") || allText.includes("kubernetes") || allText.includes("k8s"))
      keywords.push("CONTAINERS")
    if (allText.includes("pytorch") || allText.includes("tensorflow") || allText.includes("ml")) keywords.push("ML/AI")
    if (allText.includes("api") || allText.includes("rest")) keywords.push("API")
    if (allText.includes("ci/cd") || allText.includes("jenkins") || allText.includes("pipeline"))
      keywords.push("DEVOPS")

    // Domains
    if (allText.includes("vision") || allText.includes("image") || allText.includes("ocr"))
      keywords.push("COMPUTER VISION")
    if (allText.includes("nlp") || allText.includes("chatbot") || allText.includes("language")) keywords.push("NLP")
    if (allText.includes("healthcare") || allText.includes("medical") || allText.includes("eeg"))
      keywords.push("HEALTHCARE")

    // Skills
    if (allText.includes("deploy") || allText.includes("production")) keywords.push("DEPLOYMENT")
    if (allText.includes("optimize") || allText.includes("performance")) keywords.push("OPTIMIZATION")
    if (allText.includes("automat")) keywords.push("AUTOMATION")

    return keywords.slice(0, 4) // Limit to 4 keywords
  }

  return (
    <PageLayout title="EXPERIENCE" subtitle="CORPORATE INDUSTRY WORK">
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-3 pb-2">
          <div className="text-xs font-sf-mono flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-2"></div>
            <span>ROLES</span>
          </div>
          <div className="text-xs font-sf-mono">
            SHOWING {currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage, experiences.length)}{" "}
            POSITION
            {Math.min((currentPage + 1) * itemsPerPage, experiences.length) - currentPage * itemsPerPage !== 1
              ? "S"
              : ""}{" "}
            OF {experiences.length} ROLE{experiences.length !== 1 ? "S" : ""}
          </div>
        </div>
        <div className="border-b border-primary/20 mb-3"></div>

        <div className="flex-1 space-y-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 my-3"
            >
              {getCurrentExperiences().map((exp) => {
                return (
                  <div
                    key={exp.id}
                    onClick={() => openModal(exp)}
                    className="border border-primary/20 hover:border-primary/50 bg-primary/5 hover:bg-primary/10 transition-all duration-200 cursor-pointer group p-3"
                  >
                    {/* Header Row */}
                    <div className="space-y-1 mb-2">
                      {/* First Line: Position | Company, Location, Time */}
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-sm md:text-base font-medium leading-tight w-[40%] sm:w-auto">
                          {exp.title}
                        </h3>
                        <div className="hidden sm:flex items-center gap-3 text-xs text-primary/60 font-sf-mono flex-shrink-0">
                          <span>{exp.company}</span>
                          <span className="text-primary/40">|</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {exp.location}
                          </span>
                          <span className="text-primary/40">|</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {exp.period}
                          </span>
                        </div>
                        <div className="flex sm:hidden flex-col gap-1 text-xs text-primary/60 font-sf-mono w-[60%] text-right">
                          <span className="flex items-center gap-1 justify-end">
                            {exp.company}
                            <MapPin className="h-3 w-3" />
                            {exp.location}
                          </span>
                          <span className="flex items-center gap-1 justify-end">
                            <Clock className="h-3 w-3" />
                            {exp.period}
                          </span>
                        </div>
                      </div>

                      {/* Second Line: Metrics */}
                      <div className="hidden sm:flex gap-1.5">
                        {exp.metrics.map((metric, i) => (
                          <div
                            key={i}
                            className="text-xs font-sf-mono bg-primary/10 border border-primary/20 px-2 py-0.5 flex items-center gap-1.5 whitespace-nowrap"
                          >
                            <span className="text-primary/60">{metric.label}</span>
                            {metric.isIncrease ? (
                              <TrendingUp className="h-3 w-3 text-green-500" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-500" />
                            )}
                            <span className="font-medium">{metric.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-primary/70 mb-2 leading-relaxed">{exp.description}</p>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-primary/10 gap-2">
                      <div className="flex gap-1.5 min-w-0 flex-1">
                        <div className="flex gap-1.5 flex-wrap max-h-[24px] overflow-hidden">
                          {extractKeywords(exp.responsibilities).map((keyword, idx) => (
                            <span
                              key={idx}
                              className="text-xs font-sf-mono bg-primary/5 border border-primary/15 text-primary/60 px-1.5 py-0.5 whitespace-nowrap"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-primary/50 group-hover:text-primary/70 transition-colors flex-shrink-0 whitespace-nowrap ml-2">
                        VIEW FULL DETAILS →
                      </span>
                    </div>
                  </div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-primary/20">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              className={`flex items-center text-xs font-sf-mono px-2 py-1 border border-primary/30 ${
                currentPage === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-primary/10 hover:border-primary/50 cursor-pointer"
              }`}
            >
              <ChevronLeft className="h-3 w-3 mr-1" />
              PREV
            </button>

            <div className="text-xs font-sf-mono">
              {Array.from({ length: totalPages }).map((_, i) => (
                <span
                  key={i}
                  className={`inline-block w-2 h-2 mx-1 border border-primary/30 ${
                    i === currentPage ? "bg-primary/70" : "bg-primary/20"
                  }`}
                ></span>
              ))}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages - 1}
              className={`flex items-center text-xs font-sf-mono px-2 py-1 border border-primary/30 ${
                currentPage === totalPages - 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-primary/10 hover:border-primary/50 cursor-pointer"
              }`}
            >
              NEXT
              <ChevronRight className="h-3 w-3 ml-1" />
            </button>
          </div>
        )}
      </div>

      {/* Full Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedExp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-[95vw] sm:max-w-md lg:max-w-3xl max-h-[90vh] overflow-y-auto bg-background dark:bg-eerie-black border border-primary/30 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-primary/5 px-4 py-3 flex justify-between items-center border-b border-primary/30">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary/70" />
                  <span className="text-sm font-sf-mono text-primary/70">FULL EXPERIENCE RECORD</span>
                </div>
                <button
                  onClick={closeModal}
                  className="text-primary/70 hover:text-primary transition-colors text-xs font-sf-mono"
                >
                  [ ESC ]
                </button>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 md:gap-6">
                  {/* Main content */}
                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <div className="text-xs font-sf-mono text-primary/50 mb-1">POSITION:</div>
                      <h2 className="text-base md:text-lg font-medium">{selectedExp.title}</h2>
                    </div>

                    <div>
                      <div className="text-xs font-sf-mono text-primary/50 mb-1">KEY METRICS:</div>
                      <div className="flex gap-2 flex-wrap">
                        {selectedExp.metrics.map((metric, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-sf-mono bg-primary/5 border border-primary/20 text-primary/70 px-2 py-0.5 flex items-center gap-1"
                          >
                            {metric.label}
                            {metric.isIncrease ? (
                              <TrendingUp className="h-3 w-3 text-green-500" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-500" />
                            )}
                            {metric.value}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-sf-mono text-primary/50 mb-1">ACHIEVEMENTS & RESPONSIBILITIES:</div>
                      <div className="space-y-2 md:space-y-3 mt-2 md:mt-3">
                        {selectedExp.responsibilities.map((resp, i) => (
                          <div key={i} className="flex gap-3 group">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 border border-primary/30 bg-primary/5 flex items-center justify-center text-xs font-sf-mono text-primary/70 flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                              {i + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-xs sm:text-sm leading-relaxed text-primary/90">{resp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Metadata sidebar - hidden on mobile, visible on desktop */}
                  <div className="hidden lg:block lg:border-l lg:border-primary/20 lg:pl-6 space-y-3 md:space-y-4">
                    <div>
                      <div className="text-xs font-sf-mono text-primary/50 mb-1">ORGANIZATION:</div>
                      <p className="text-xs font-sf-mono">{selectedExp.company}</p>
                    </div>

                    <div>
                      <div className="text-xs font-sf-mono text-primary/50 mb-1">LOCATION:</div>
                      <p className="text-xs font-sf-mono flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {selectedExp.location}
                      </p>
                    </div>

                    <div>
                      <div className="text-xs font-sf-mono text-primary/50 mb-1">DURATION:</div>
                      <p className="text-xs font-sf-mono flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {selectedExp.period}
                      </p>
                    </div>

                    <div>
                      <div className="text-xs font-sf-mono text-primary/50 mb-1">STATUS:</div>
                      <p
                        className={`text-xs font-sf-mono ${selectedExp.status === "ACTIVE" ? "text-green-500" : selectedExp.status === "COMPLETED" ? "text-green-500" : "text-primary/70"}`}
                      >
                        {selectedExp.status}
                      </p>
                    </div>

                    <div className="border-t border-primary/20"></div>

                    <div>
                      <div className="text-xs font-sf-mono text-primary/50 mb-1">OVERVIEW:</div>
                      <p className="text-xs font-sf-mono leading-relaxed border-l-2 border-primary/20 pl-3 py-1">
                        {selectedExp.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-primary/20 p-4 bg-primary/5 flex justify-between items-center">
                <div className="text-xs font-sf-mono text-primary/50">CORPORATE INDUSTRY EXPERIENCE</div>
                <div className="text-xs font-sf-mono text-primary/50">ASSIGNMENT: {selectedExp.assignmentId}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  )
}
