"use client"

import { useState } from "react"
import { PageLayout } from "@/components/layout/page-layout"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, X, MapPin, Calendar, BookOpen } from "lucide-react"

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
        "Artificial Intelligence",
        "Data Mining", 
        "Convex Optimisation",
        "Statistical Machine Learning",
        "Knowledge Representation",
        "Data Visualization",
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
        "Data Structures & Algorithms",
        "Database Management Systems",
      ],
    },
  ]

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

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
                <span className="text-xs font-sf-mono font-bold tracking-widest">{edu.degree}</span>
                <span className="text-[10px] font-sf-mono text-primary/30">[{String(index + 1).padStart(2, "0")}]</span>
              </div>
            </div>

            {/* Main Content - Clickable */}
            <div
              onClick={() => toggleExpand(index)}
              className={`p-4 cursor-pointer transition-colors ${
                expandedIndex === index ? "bg-primary/5" : "hover:bg-primary/5"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-sf-mono font-medium mb-2">{edu.institution}</h3>
                  <p className="text-xs font-sf-mono text-primary/60 mb-3">{edu.field}</p>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-sf-mono text-primary/50">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {edu.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {edu.location}
                    </span>
                    {edu.gpa && (
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        GPA: {edu.gpa}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  className={`flex items-center justify-center w-8 h-8 border transition-all duration-200 ${
                    expandedIndex === index
                      ? "border-primary/40 bg-primary/10"
                      : "border-primary/20 hover:border-primary/40"
                  }`}
                >
                  <motion.div
                    animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {expandedIndex === index ? (
                      <X className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
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
                    <span className="text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider">
                      KEY COURSEWORK
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {edu.courses.map((course, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-[10px] font-sf-mono border border-primary/20 bg-primary/5 hover:bg-primary hover:text-background transition-colors"
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
          <div className="flex gap-2 text-[10px] font-sf-mono text-primary/40 uppercase tracking-wider">
            <span>2 DEGREES</span>
            <span className="text-primary/20">/</span>
            <span>2 INSTITUTIONS</span>
            <span className="text-primary/20">/</span>
            <span>2019-2025</span>
          </div>
          <div className="text-[10px] font-sf-mono text-primary/30">LAST.UPDATED: 2025</div>
        </motion.div>
      </div>
    </PageLayout>
  )
}
