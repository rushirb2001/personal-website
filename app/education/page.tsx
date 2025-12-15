"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { AcademicRecordModal } from "@/components/features/education/academic-record-modal"
import { FileText, Lock, CheckCircle, Clock } from "lucide-react"

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
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
        <div className="w-full max-w-2xl mx-auto">
          {/* Section header */}
          <div className="mb-4 md:mb-6 border-b border-primary/20 pb-2 flex justify-between items-center">
            <div className="text-xs font-sf-mono flex items-center">
              <FileText className="h-3.5 w-3.5 mr-2 text-primary/70" />
              <span>UNIVERSITY ACADEMICS </span>
            </div>
            <div className="text-xs font-sf-mono flex items-center">
              <Lock className="h-3.5 w-3.5 mr-2 text-primary/70" />
              <span>VERIFIED</span>
            </div>
          </div>

          {/* File records */}
          <div className="space-y-4 md:space-y-6">
            {education.map((edu, index) => (
              <div
                key={index}
                onClick={() => handleOpenRecord(index)}
                className="border border-primary/30 hover:border-primary/60 bg-primary/5 hover:bg-primary/10 transition-all duration-300 cursor-pointer group"
              >
                <div className="p-4 relative">
                  {/* File ID and status */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex justify-between text-xs font-sf-mono text-primary/70"><MapPin className="mr-2 h-4 w-4 align" />{edu.id}</div>
                    <div className="flex items-center">
                      {edu.status === "GRADUATED" ? (
                        <>
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                          <span className="text-xs font-sf-mono text-green-500">{edu.status}</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-3.5 w-3.5 mr-1.5 text-yellow-500" />
                          <span className="text-xs font-sf-mono text-yellow-500">{edu.status}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Main content */}
                  <div className="grid grid-cols-[1fr_auto] gap-4">
                    <div>
                      <h3 className="text-base font-medium mb-1">{edu.institution}</h3>
                      <p className="text-sm font-sf-mono text-primary/70">{edu.degree}</p>
                      <p className="text-xs font-sf-mono text-primary/50 mt-1">{edu.period}</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-16 h-16 border border-primary/20 flex items-center justify-center bg-secondary/30 dark:bg-eerie-darkgray/30 group-hover:bg-secondary/50 dark:group-hover:bg-eerie-darkgray/50 transition-colors">
                        <div className="text-2xl font-sf-mono text-primary/40 group-hover:text-primary/60 transition-colors">
                          {index === 0 ? "MS" : "BS"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-3 pt-2 border-t border-primary/10 flex justify-between items-center">
                    <div className="text-xs font-sf-mono text-primary/50">{edu.field}</div>
                    <div className="text-xs font-sf-mono text-primary/50 group-hover:text-primary/70 transition-colors flex items-center">
                      <span className="mr-1">VIEW COMPLETE RECORD</span>
                      <FileText className="h-3 w-3" />
                    </div>
                  </div>

                  {/* Hover effects */}
                  <div className="absolute inset-0 bg-scan-lines opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Section footer */}
          <div className="mt-6 pt-2 border-t border-primary/20 text-xs text-primary/30 font-sf-mono text-center">
            ACADEMICS • LAST UPDATED: 05/01/2025
          </div>
        </div>

        {/* Updated Modal */}
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
