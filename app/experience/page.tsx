"use client"

import { PageLayout } from "@/components/layout/page-layout"
import { useState, useEffect } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"
import { experiences, ITEMS_PER_PAGE, type Experience } from "./data"

const categories = ["All", "Internship", "Full-Time"]
const mobileLabels: Record<string, string> = {
  All: "ALL",
  Internship: "INTERN",
  "Full-Time": "FT",
}

function getCategory(exp: Experience): string {
  if (exp.title.toLowerCase().includes("intern")) return "Internship"
  return "Full-Time"
}

export default function ExperiencePage() {
  const [selectedExp, setSelectedExp] = useState<number | null>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [startIndex, setStartIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const filteredExperiences =
    selectedCategory === "All" ? experiences : experiences.filter((exp) => getCategory(exp) === selectedCategory)

  const visibleExperiences = filteredExperiences.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  const canShowPrevious = startIndex > 0
  const canShowNext = startIndex + ITEMS_PER_PAGE < filteredExperiences.length
  const showPaginationControls = filteredExperiences.length > ITEMS_PER_PAGE

  useEffect(() => {
    setStartIndex(0)
    setSelectedExp(null)
  }, [selectedCategory])

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
        <div className="flex gap-2 mb-3">
          {/* Category Dropdown */}
          <div className={`border border-primary/20 ${showPaginationControls ? "flex-[6]" : "w-full"}`}>
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full flex items-center justify-between px-3 py-2 bg-primary/5 hover:bg-primary/10 transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                <span className="font-sf-mono text-primary/60 text-sm">FILTER</span>
                <span className="text-primary/20">|</span>
                <span className="font-sf-mono text-primary text-sm">
                  SHOWING '
                  {isMobile
                    ? mobileLabels[selectedCategory] || selectedCategory.toUpperCase()
                    : selectedCategory.toUpperCase()}
                  '
                </span>
              </div>
              <motion.div animate={{ rotate: isCategoryOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-3 h-3 text-primary/50" />
              </motion.div>
            </button>
            <AnimatePresence>
              {isCategoryOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t border-primary/10"
                >
                  <div className="p-3">
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category)
                            setIsCategoryOpen(false)
                          }}
                          className={`px-2 py-1 text-[9px] font-sf-mono border transition-colors duration-200 ${
                            selectedCategory === category
                              ? "bg-primary text-background border-primary"
                              : "bg-primary text-background border-primary/40 hover:bg-primary/90"
                          }`}
                        >
                          <span className="hidden md:inline text-sm">{category.toUpperCase()}</span>
                          <span className="md:hidden">{mobileLabels[category] || category.toUpperCase()}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pagination Controls - Only show when needed */}
          {showPaginationControls && (
            <div className="flex-[4] flex items-start gap-2">
              <button
                onClick={() => {
                  setSelectedExp(null)
                  setStartIndex((prev) => Math.max(0, prev - ITEMS_PER_PAGE))
                }}
                disabled={!canShowPrevious}
                className={`flex-1 h-[42px] border flex items-center justify-center transition-all duration-150 ${
                  canShowPrevious
                    ? "bg-primary text-background border-primary/40 hover:bg-primary/90"
                    : "border-primary/10 text-primary/10 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setSelectedExp(null)
                  setStartIndex((prev) => prev + ITEMS_PER_PAGE)
                }}
                disabled={!canShowNext}
                className={`flex-1 h-[42px] border flex items-center justify-center transition-all duration-150 ${
                  canShowNext
                    ? "bg-primary text-background border-primary/40 hover:bg-primary/90"
                    : "border-primary/10 text-primary/10 cursor-not-allowed"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Table Header - Desktop Only */}
        <div className="hidden md:grid grid-cols-[2fr_1.5fr_1.2fr_1fr_40px] gap-2 px-3 py-2 border-b border-primary/30 font-sf-mono text-primary/50 uppercase tracking-wider text-sm">
          <span>POSITION</span>
          <span>COMPANY</span>
          <span>PERIOD</span>
          <span>LOCATION</span>
          <span></span>
        </div>

        {/* Experience List */}
        <div className="min-h-[300px] md:min-h-[300px]">
        {visibleExperiences.map((exp, index) => {
          const actualIndex = filteredExperiences.indexOf(exp)

          return (
            <motion.div
              key={`${exp.company}-${exp.title}`}
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
                  <span className="font-sf-mono font-medium text-lg tracking-tighter">{exp.title}</span>
                  <span
                    className={`font-sf-mono text-base tracking-tighter ${selectedExp === actualIndex ? "text-background/70" : "text-primary/60"}`}
                  >
                    {exp.company}
                  </span>
                  <span
                    className={`font-sf-mono text-base ${selectedExp === actualIndex ? "text-background/70" : "text-primary/50"}`}
                  >
                    {exp.period}
                  </span>
                  <span
                    className={`font-sf-mono text-sm ${selectedExp === actualIndex ? "text-background/70" : "text-primary/50"}`}
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
                        ? "bg-background border-background/30 text-primary hover:bg-background/90"
                        : "bg-primary border-primary/40 text-background hover:bg-primary/90"
                    }`}
                  >
                    <motion.div
                      animate={{ rotate: selectedExp === actualIndex ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {selectedExp === actualIndex ? <X className="w-5 h-5" /> : <ChevronDown className="h-5 w-5" />}
                    </motion.div>
                  </button>
                </div>

                {/* Mobile Row */}
                <div className="md:hidden px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-sf-mono font-medium text-base">{exp.title}</h3>
                      <p
                        className={`font-sf-mono tracking-tighter text-sm ${selectedExp === actualIndex ? "text-background/60" : "text-primary/50"}`}
                      >
                        {exp.company} • {exp.location} • {exp.period}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedExp(selectedExp === actualIndex ? null : actualIndex)
                      }}
                      className={`flex items-center justify-center w-7 h-7 border flex-shrink-0 transition-all duration-200 ${
                        selectedExp === actualIndex
                          ? "bg-background border-background/30 text-primary hover:bg-background/90"
                          : "bg-primary border-primary/40 text-background hover:bg-primary/90"
                      }`}
                    >
                      <motion.div
                        animate={{ rotate: selectedExp === actualIndex ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {selectedExp === actualIndex ? <X className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </motion.div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Expandable Details */}
              <AnimatePresence>
                {selectedExp === actualIndex && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-primary/5 p-3 md:p-6 px-3 py-3">
                      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] md:gap-6">
                        {/* Left: Responsibilities */}
                        <div>
                          <span className="font-sf-mono text-primary/40 uppercase tracking-wider text-sm">
                            KEY ACHIEVEMENTS
                          </span>
                          <div className="space-y-2 mt-2">
                            {exp.responsibilities.map((resp, idx) => (
                              <div key={idx} className="flex gap-2">
                                <div className="w-4 h-4 border border-primary/20 bg-primary/5 flex items-center justify-center text-[9px] font-sf-mono text-primary/50 flex-shrink-0">
                                  {idx + 1}
                                </div>
                                <p className="font-sf-mono text-primary/70 leading-relaxed text-xs tracking-wide">
                                  {resp}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Right: Skills */}
                        <div className="md:border-l md:border-primary/10 md:pl-6">
                          <span className="font-sf-mono text-primary/40 uppercase tracking-wider text-sm">
                            TECH STACK
                          </span>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {exp.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 font-sf-mono border border-primary/20 bg-primary/5 hover:bg-primary hover:text-background transition-colors text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>

                          {/* Overview - Desktop Only */}
                          <div className="hidden md:block mt-4 pt-4 border-t border-primary/10">
                            <span className="font-sf-mono text-primary/40 uppercase tracking-wider text-sm">
                              OVERVIEW
                            </span>
                            <p className="font-sf-mono text-primary/60 mt-2 leading-relaxed text-xs">
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
        </div>
        {/* Footer Stats */}
        <motion.div
          className="flex items-center justify-between border-t border-primary/20 pt-3 mt-4 px-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3 }}
        >
          <div className="flex flex-wrap gap-1 sm:gap-2 md:gap-4 text-[9px] sm:text-[10px] font-sf-mono text-primary/40 uppercase tracking-wider">
            <span className="text-xs tracking-tighter">
              {experiences.length} {isMobile ? "ROLES" : "POSITIONS"}
            </span>
            <span className="text-primary/20">/</span>
            <span className="text-xs tracking-tighter">
              {filteredExperiences.length} {isMobile ? "SHOWN" : "FILTERED"}
            </span>
          </div>
          {showPaginationControls && (
            <span className="sm:text-[10px] font-sf-mono text-primary/30 font-semibold text-xs tracking-tighter">
              {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredExperiences.length)} OF{" "}
              {filteredExperiences.length}
            </span>
          )}
          {!showPaginationControls && (
            <div className="text-[9px] sm:text-[10px] font-sf-mono text-primary/30">
              <span className="text-sm">LAST.UPDATED: 2025</span>
            </div>
          )}
        </motion.div>
      </div>
    </PageLayout>
  )
}
