"use client"

// Update imports to match new file structure
import { PageLayout } from "@/components/layout/page-layout"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, AlertCircle, Terminal, Clock, MapPin } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Define the experience type
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
}

export default function ExperiencePage() {
  // Experience data
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
    },
  ]

  // State for pagination and modal
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)

  // Calculate total pages - show fewer items per page on mobile
  const itemsPerPage = window?.innerWidth < 768 ? 3 : 3
  const totalPages = Math.ceil(experiences.length / itemsPerPage)

  // Get current experiences
  const getCurrentExperiences = () => {
    const start = currentPage * itemsPerPage
    return experiences.slice(start, start + itemsPerPage)
  }

  // Navigation handlers
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

  // Modal handlers
  const openModal = (exp: Experience) => {
    setSelectedExp(exp)
    setIsModalOpen(true)
    setTerminalLines([])
    setIsTyping(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedExp(null)
  }

  // Terminal typing effect
  useEffect(() => {
    if (!isTyping || !selectedExp) return

    const lines = [
      `> ACCESSING PERSONNEL ACTIVITY LOG`,
      `> LOG ID: ${selectedExp.id}`,
      `> ASSIGNMENT ID: ${selectedExp.assignmentId}`,
      `> STATUS: ${selectedExp.status}`,
      `> `,
      `> SUBJECT: ${selectedExp.title}`,
      `> ORGANIZATION: ${selectedExp.company}`,
      `> LOCATION: ${selectedExp.location}`,
      `> TIMEFRAME: ${selectedExp.period}`,
      `> `,
      `> DESCRIPTION:`,
      `> ${selectedExp.description}`,
      `> `,
      `> RESPONSIBILITIES:`,
      ...selectedExp.responsibilities.map((r, i) => `> ${i + 1}. ${r}`),
      `> `,
      `> END OF LOG ${selectedExp.id}`,
      `> PRESS ESC TO CLOSE`,
    ]

    let currentLineIndex = 0
    let currentCharIndex = 0
    let currentLine = ""
    const typingInterval = setInterval(() => {
      if (currentLineIndex >= lines.length) {
        clearInterval(typingInterval)
        setIsTyping(false)
        return
      }

      if (currentCharIndex < lines[currentLineIndex].length) {
        currentLine += lines[currentLineIndex][currentCharIndex]
        setTerminalLines((prev) => {
          const newLines = [...prev]
          newLines[currentLineIndex] = currentLine
          return newLines
        })
        currentCharIndex++
      } else {
        currentLineIndex++
        currentCharIndex = 0
        currentLine = ""
      }
    }, 10)

    return () => clearInterval(typingInterval)
  }, [isTyping, selectedExp])

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <PageLayout title="EXPERIENCE" subtitle="CORPORATE INDUSTRY WORK">
      <div className="h-full flex flex-col">
        {/* Status bar */}
        <div className="flex justify-between items-center mb-4 md:mb-6 border-b border-primary/20 pb-2">
          <div className="text-xs font-sf-mono flex items-center">
            <div className="w-2 h-2 bg-green-500 animate-pulse mr-2"></div>
            <span>SYSTEM ACTIVE</span>
          </div>
          <div className="text-xs font-sf-mono">
            DISPLAYING LOGS {currentPage * itemsPerPage + 1}-
            {Math.min((currentPage + 1) * itemsPerPage, experiences.length)} OF {experiences.length}
          </div>
        </div>

        {/* Experience logs */}
        <div className="flex-1 space-y-4 md:space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 md:space-y-6"
            >
              {getCurrentExperiences().map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => openModal(exp)}
                  className="border border-primary/30 hover:border-primary/60 bg-primary/5 hover:bg-primary/10 transition-all duration-300 cursor-pointer group"
                >
                  <div className="p-3 relative grid grid-cols-[auto_1fr_auto] gap-x-2 md:gap-x-3 gap-y-1.5">
                    {/* Left column - ID and status */}
                    <div className="flex flex-col justify-between h-full">
                      <div className="flex items-center">
                        <Terminal className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                        <span className="text-xs font-sf-mono text-primary/70">{exp.id}</span>
                      </div>
                      <div className="mt-auto">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            exp.status === "ACTIVE"
                              ? "bg-green-500 animate-pulse"
                              : exp.status === "FLAGGED"
                                ? "bg-red-500 animate-pulse"
                                : "bg-blue-500"
                          }`}
                        ></div>
                      </div>
                    </div>

                    {/* Middle column - Main content */}
                    <div>
                      <h3 className="text-sm md:text-base font-medium">{exp.title}</h3>
                      <div className="text-xs md:text-sm font-sf-mono text-primary/70">{exp.company}</div>
                      <div className="flex flex-wrap items-center text-xs text-primary/60 space-x-3 mt-1">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{exp.location}</span>
                        </div>
                        <div className="flex items-center mt-1 md:mt-0">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{exp.period}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right column - View button */}
                    <div className="flex flex-col items-end justify-between h-full">
                      <div className="text-xs font-sf-mono text-primary/50">{exp.status}</div>
                      <div className="text-xs font-sf-mono text-primary/50 group-hover:text-primary/80 transition-colors flex items-center mt-auto">
                        <span className="mr-1 tracking-tighter hidden md:inline">ACCESS</span>
                        <AlertCircle className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 md:mt-6 pt-4 border-t border-primary/20">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              className={`flex items-center text-xs font-sf-mono px-2 md:px-3 py-1.5 border border-primary/30 ${
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
                  className={`inline-block w-2 h-2 mx-1 rounded-full ${
                    i === currentPage ? "bg-primary/70" : "bg-primary/20"
                  }`}
                ></span>
              ))}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages - 1}
              className={`flex items-center text-xs font-sf-mono px-2 md:px-3 py-1.5 border border-primary/30 ${
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

      {/* Terminal-style modal */}
      <AnimatePresence>
        {isModalOpen && selectedExp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 md:p-0"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-3xl bg-black border border-primary/30 shadow-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Terminal header */}
              <div className="dark:bg-primary/10 bg-white px-3 md:px-4 py-2 flex justify-between items-center border-b border-primary/30">
                <div className="flex items-center">
                  <Terminal className="h-4 w-4 mr-2 text-primary/70 dark:text-primary/70" />
                  <span className="text-xs md:text-sm font-sf-mono text-primary/70 dark:text-primary/70 truncate">
                    PERSONNEL_ACTIVITY_LOG_{selectedExp.id}
                  </span>
                </div>
                <button
                  onClick={closeModal}
                  className="text-primary/70 hover:text-primary dark:text-primary/70 dark:hover:text-primary transition-colors"
                  aria-label="Close"
                >
                  <span className="text-xs font-sf-mono">[ CLOSE ]</span>
                </button>
              </div>

              {/* Terminal content */}
              <div className="bg-black p-3 md:p-4 font-sf-mono text-green-500 h-[60vh] md:h-[70vh] overflow-y-auto">
                <div className="whitespace-pre-wrap text-xs md:text-sm">
                  {terminalLines.map((line, i) => (
                    <div key={i} className="mb-1">
                      {line}
                    </div>
                  ))}
                  {isTyping && <span className="animate-pulse">▋</span>}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  )
}
