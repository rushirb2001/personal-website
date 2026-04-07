"use client"

import { useState } from "react"
import { PageLayout } from "@/components/layout/page-layout"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, X, MapPin, Calendar, BookOpen } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function EducationPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const education = [
    {
      degree: "MASTER OF SCIENCE",
      field: "DATA SCIENCE, ANALYTICS AND ENGINEERING",
      institution: "ARIZONA STATE UNIVERSITY",
      period: "AUG 2023 - JUN 2025",
      location: "ARIZONA, USA",
      status: "GRADUATED",
      gpa: "3.8/4.0",
      courses: [
        "Data Mining", 
        "Statistical Machine Learning",
        "Convex Optimisation",
        "Data Visualization",
        "Artificial Intelligence",
        "Knowledge Representation",
      ],
    },
    {
      degree: "BACHELOR OF TECHNOLOGY",
      field: "COMPUTER SCIENCE AND ENGINEERING",
      institution: "INSTITUTE OF TECHNOLOGY, NIRMA UNIVERSITY",
      period: "JUL 2019 - JUN 2023",
      location: "AHMEDABAD, INDIA",
      status: "GRADUATED",
      gpa: "3.5/4.0",
      courses: [
        "Deep Learning",
        "Machine Learning",
        "Natural Language Processing",
        "Scientific Computing",
        "Ethical Hacking",
        "Database Management Systems",
      ],
    },
  ]

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <PageLayout title="EDUCATION" subtitle="DEGREES & COURSEWORK">
      <div className="space-y-3 max-w-3xl mx-auto">
        {education.map((edu, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
            className="border border-primary/20 bg-background"
          >
            {/* Header */}
            <div className="border-b border-primary/20 px-3 py-2 bg-primary/5">
              <div className="flex items-center justify-between">
                <span className="font-sf-mono font-bold tracking-widest text-base">{edu.degree}</span>
                <span className="font-sf-mono text-primary/30 text-base">[{String(index + 1).padStart(2, "0")}]</span>
              </div>
            </div>

            {/* Main Content - Clickable */}
            <div
              onClick={() => toggleExpand(index)}
              className={`p-4 cursor-pointer transition-all duration-200 ${
                expandedIndex === index 
                  ? "bg-primary text-background" 
                  : "hover:bg-primary/5"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-sf-mono font-medium mb-2 text-base">{edu.field}</h3>
                  <p className={`font-sf-mono mb-3 text-sm ${expandedIndex === index ? "text-background/70" : "text-primary/60"}`}>
                    {edu.institution}
                  </p>
                  
                  <div className={`flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-sf-mono ${expandedIndex === index ? "text-background/60" : "text-primary/50"}`}>
                    <span className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {edu.period}
                    </span>
                    <span className="flex items-center gap-1 text-sm tracking-tighter">
                      <MapPin className="h-3 w-3" />
                      {edu.location}
                    </span>
                  </div>
                </div>

                <button
                  className={`flex items-center justify-center w-8 h-8 border transition-all duration-200 ${
                    expandedIndex === index
                      ? "bg-background text-primary border-background/30 hover:bg-background/90"
                      : "bg-primary text-background border-primary/40 hover:bg-primary/90"
                  }`}
                >
                  <motion.div
                    animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {expandedIndex === index ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </motion.div>
                </button>
              </div>
            </div>

            {/* Expandable Coursework */}
            <AnimatePresence>
              {expandedIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-2 border-t border-primary/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-sf-mono text-primary/40 uppercase tracking-wider text-xs">
                        KEY COURSEWORK
                      </span>
                      {edu.gpa && (
                        <span className="font-sf-mono text-primary/40 uppercase tracking-wider font-black text-xs">
                          GPA: {edu.gpa}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {edu.courses.map((course, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 font-sf-mono border border-primary/20 bg-primary/5 hover:bg-primary hover:text-background transition-colors text-xs tracking-wider"
                        >
                          {course.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {/* Footer Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3 }}
          className="flex items-center justify-between border-t border-primary/20 pt-3"
        >
          <div className="flex gap-1 sm:gap-2 text-[9px] sm:text-[10px] font-sf-mono text-primary/40 uppercase tracking-wider">
            <span className="text-xs tracking-tighter">2 {isMobile ? "DEG" : "DEGREES"}</span>
            <span className="text-primary/20">/</span>
            <span className="tracking-tighter text-xs">2 {isMobile ? "INST" : "INSTITUTIONS"}</span>
            <span className="text-primary/20">/</span>
            <span className="text-xs tracking-tighter">2019-25</span>
          </div>
          <div className="font-sf-mono text-primary/30 text-sm">LAST.UPDATED: 2025</div>
        </motion.div>
      </div>
    </PageLayout>
  )
}
