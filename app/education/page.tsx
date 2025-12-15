"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { AcademicRecordModal } from "@/components/features/education/academic-record-modal"
import { Lock, CheckCircle, Clock } from "lucide-react"

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
      <div className="flex flex-col">
        <div className="w-full max-w-2xl">
          <div className="mb-6 border-b-2 border-primary pb-3 flex justify-between items-end">
            <div className="flex items-baseline gap-4">
              <span className="text-2xl font-sf-mono font-bold text-primary/20">[02]</span>
              <div className="text-xs font-sf-mono uppercase tracking-widest">UNIVERSITY ACADEMICS</div>
            </div>
            <div className="text-[10px] font-sf-mono flex items-center gap-1 border border-primary/40 px-2 py-1">
              <Lock className="h-3 w-3" />
              <span>VERIFIED</span>
            </div>
          </div>

          <div className="space-y-4">
            {education.map((edu, index) => (
              <div
                key={index}
                onClick={() => handleOpenRecord(index)}
                className="border-2 border-primary/40 hover:border-primary bg-transparent hover:bg-primary/5 transition-all duration-150 cursor-pointer group"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-primary/20">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-sf-mono font-bold text-primary/30">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="flex items-center text-[10px] font-sf-mono text-primary/60 uppercase tracking-wider">
                        <MapPin className="mr-1 h-3 w-3" />
                        {edu.id}
                      </div>
                    </div>
                    <div className="flex items-center">
                      {edu.status === "GRADUATED" ? (
                        <div className="flex items-center gap-1 text-[10px] font-sf-mono uppercase tracking-wider bg-primary text-background px-2 py-0.5">
                          <CheckCircle className="h-3 w-3" />
                          <span>{edu.status}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[10px] font-sf-mono uppercase tracking-wider border border-primary/40 px-2 py-0.5">
                          <Clock className="h-3 w-3" />
                          <span>{edu.status}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_auto] gap-6">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wide mb-2">{edu.institution}</h3>
                      <p className="text-xs font-sf-mono text-primary/80 uppercase tracking-wider">{edu.degree}</p>
                      <p className="text-[10px] font-sf-mono text-primary/50 mt-2 tracking-widest">{edu.period}</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-14 h-14 border-2 border-primary/60 flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all duration-150">
                        <span className="text-xl font-sf-mono font-bold">{index === 0 ? "MS" : "BS"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-primary/20 flex justify-between items-center">
                    <div className="text-[10px] font-sf-mono text-primary/50 uppercase tracking-wider max-w-[60%]">
                      {edu.field}
                    </div>
                    <div className="text-[10px] font-sf-mono uppercase tracking-wider group-hover:text-primary transition-colors flex items-center gap-1">
                      <span>VIEW RECORD</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-3 border-t-2 border-primary/30 flex justify-between text-[10px] text-primary/40 font-sf-mono uppercase tracking-widest">
            <span>TOTAL RECORDS: {education.length}</span>
            <span>LAST UPDATED: 05/01/2025</span>
          </div>
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
