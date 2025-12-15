"use client"

import { useState } from "react"
import { MapPin, Clock } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { AcademicRecordModal } from "@/components/features/education/academic-record-modal"

export default function EducationPage() {
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null)

  const education = [
    {
      degree: "MASTER OF SCIENCE",
      field: "DATA SCIENCE, ANALYTICS AND ENGINEERING",
      institution: "ARIZONA STATE UNIVERSITY",
      period: "AUG 2023 - JUN 2025",
      id: "UNITED STATES",
      description:
        "Pursuing advanced studies in data science and AI, focusing on machine learning techniques, data mining, and statistical analysis.",
      courses: [
        { name: "Artificial Intelligence" },
        { name: "Data Mining" },
        { name: "Convex Optimisation" },
        { name: "Statistical Machine Learning" },
      ],
      location: "ARIZONA, USA",
      status: "GRADUATED",
      validationId: "VLD-" + Math.floor(Math.random() * 10000),
      indexCode: "AC-" + Math.floor(Math.random() * 1000) + "-" + "110",
    },
    {
      degree: "BACHELOR OF SCIENCE",
      field: "COMPUTER SCIENCE",
      institution: "INSTITUTE OF TECHNOLOGY, NIRMA UNIVERSITY",
      period: "JUL 2019 - JUN 2023",
      id: "INDIA",
      description: "Completed undergraduate studies in computer science with a focus on AI and machine learning.",
      courses: [
        { name: "Deep Learning" },
        { name: "Machine Learning" },
        { name: "Natural Language Processing" },
        { name: "Scientific Computing" },
      ],
      location: "AHMEDABAD, INDIA",
      status: "GRADUATED",
      validationId: "VLD-" + Math.floor(Math.random() * 10000),
      indexCode: "AC-" + Math.floor(Math.random() * 1000) + "-" + "219",
    },
  ]

  const handleOpenRecord = (index: number) => {
    setSelectedRecord(index)
  }

  const handleCloseRecord = () => {
    setSelectedRecord(null)
  }

  return (
    <PageLayout title="EDUCATION" subtitle="ACADEMIC BACKGROUND">
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-3 pb-2">
          <div className="text-xs font-sf-mono flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-2"></div>
            <span>DEGREES</span>
          </div>
          <div className="text-xs font-sf-mono">
            SHOWING {education.length} RECORD{education.length !== 1 ? "S" : ""}
          </div>
        </div>
        <div className="border-b border-primary/20 mb-3"></div>

        <div className="flex-1 space-y-3">
          {education.map((edu, index) => (
            <div
              key={index}
              onClick={() => handleOpenRecord(index)}
              className="border border-primary/20 hover:border-primary/50 bg-primary/5 hover:bg-primary/10 transition-all duration-200 cursor-pointer group p-3"
            >
              {/* Header Row */}
              <div className="space-y-1 mb-2">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-sm md:text-base font-medium leading-tight">{edu.institution}</h3>
                  <div className="hidden sm:flex items-center gap-3 text-xs text-primary/60 font-sf-mono flex-shrink-0">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {edu.id}
                    </span>
                    <span className="text-primary/40">|</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {edu.period}
                    </span>
                  </div>
                  <div className="flex sm:hidden flex-col gap-1 text-xs text-primary/60 font-sf-mono text-right">
                    <span className="flex items-center gap-1 justify-end">
                      <MapPin className="h-3 w-3" />
                      {edu.id}
                    </span>
                    <span className="flex items-center gap-1 justify-end">
                      <Clock className="h-3 w-3" />
                      {edu.period}
                    </span>
                  </div>
                </div>

                {/* Degree badges */}
                <div className="flex gap-1.5 flex-wrap">
                  <span className="text-xs font-sf-mono bg-primary/10 border border-primary/20 px-2 py-0.5">
                    {edu.degree}
                  </span>
                  <span
                    className={`text-xs font-sf-mono px-2 py-0.5 ${
                      edu.status === "GRADUATED"
                        ? "bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400"
                        : "bg-primary/5 border border-primary/20"
                    }`}
                  >
                    {edu.status}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-primary/70 mb-2 leading-relaxed">{edu.description}</p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-primary/10 gap-2">
                <div className="flex gap-1.5 min-w-0 flex-1">
                  <div className="flex gap-1.5 flex-wrap max-h-[24px] overflow-hidden">
                    <span className="text-xs font-sf-mono bg-primary/5 border border-primary/15 text-primary/60 px-1.5 py-0.5 whitespace-nowrap">
                      {edu.field}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-primary/50 group-hover:text-primary/70 transition-colors flex-shrink-0 whitespace-nowrap ml-2">
                  VIEW FULL DETAILS →
                </span>
              </div>
            </div>
          ))}
        </div>

        {selectedRecord !== null && (
          <AcademicRecordModal
            isOpen={selectedRecord !== null}
            onClose={handleCloseRecord}
            record={education[selectedRecord]}
          />
        )}
      </div>
    </PageLayout>
  )
}
