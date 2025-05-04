"use client"

import { useEffect } from "react"
import { FileText } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Course {
  name: string
}

interface EducationRecord {
  degree: string
  field: string
  institution: string
  period: string
  id: string
  description: string
  courses: Course[]
  location: string
  status: string
  validationId: string
  indexCode: string
}

interface AcademicRecordModalProps {
  isOpen: boolean
  onClose: () => void
  record: EducationRecord
}

export function AcademicRecordModal({ isOpen, onClose, record }: AcademicRecordModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-3"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[95%] md:max-w-3xl mx-auto bg-background dark:bg-eerie-black border border-primary/30 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="dark:bg-primary/10 bg-white px-3 md:px-4 py-2 md:py-3 flex justify-between items-center border-b border-primary/30">
              <div className="flex items-center">
                <FileText className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-primary/70" />
                <span className="text-xs md:text-sm font-sf-mono text-primary/70 truncate">
                  ACADEMIC RECORD [ {record.id} ]
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-primary/70 hover:text-primary transition-colors font-sf-mono text-xs"
                aria-label="Close"
              >
                [ CLOSE ]
              </button>
            </div>

            {/* Content */}
            <div className="p-3 md:p-6 font-sf-mono">
              <div className="space-y-3 md:space-y-4">
                {/* Main record data - Two column layout */}
                <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-x-6 gap-y-3 md:gap-y-4">
                  {/* Left column - Degree, Field of Study, Institution */}
                  <div className="space-y-3 md:space-y-4">
                    <div className="border-b border-primary/10 pb-2">
                      <div className="text-[10px] md:text-xs text-primary/50 mb-1">DEGREE:</div>
                      <div className="text-sm md:text-base">{record.degree}</div>
                    </div>

                    <div className="border-b border-primary/10 pb-2">
                      <div className="text-[10px] md:text-xs text-primary/50 mb-1">FIELD OF STUDY:</div>
                      <div className="text-sm md:text-base">{record.field}</div>
                    </div>

                    <div className="border-b border-primary/10 pb-2">
                      <div className="text-[10px] md:text-xs text-primary/50 mb-1">INSTITUTION:</div>
                      <div className="text-sm md:text-base">{record.institution}</div>
                    </div>
                  </div>

                  {/* Right column - Timeframe, Location, Status */}
                  <div className="space-y-3 md:space-y-4">
                    <div className="border-b border-primary/10 pb-2">
                      <div className="text-[10px] md:text-xs text-primary/50 mb-1">TIMEFRAME:</div>
                      <div className="text-xs md:text-sm">{record.period}</div>
                    </div>

                    <div className="border-b border-primary/10 pb-2">
                      <div className="text-[10px] md:text-xs text-primary/50 mb-1">LOCATION:</div>
                      <div className="text-xs md:text-sm">{record.location || "UNDISCLOSED"}</div>
                    </div>

                    <div className="border-b border-primary/10 pb-2">
                      <div className="text-[10px] md:text-xs text-primary/50 mb-1">STATUS:</div>
                      <div className="text-xs md:text-sm text-green-500">{record.status || "VALIDATED"}</div>
                    </div>
                  </div>

                  {/* Courses section - spans both columns */}
                  <div className="border-b border-primary/10 pb-2 md:col-span-2">
                    <div className="text-[10px] md:text-xs text-primary/50 mb-1">COURSES:</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                      {record.courses.slice(0, 6).map((course, idx) => (
                        <div key={idx} className="flex items-start">
                          <span className="text-primary/50 mr-1.5">•</span>
                          <span className="text-xs md:text-sm truncate">{course.name}</span>
                        </div>
                      ))}
                    </div>
                    {record.courses.length > 6 && (
                      <div className="text-xs md:text-sm text-primary/50 mt-1">
                        +{record.courses.length - 6} more courses
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with metadata */}
            <div className="border-t border-primary/20 p-3 md:p-4 bg-primary/5">
              <div className="grid grid-cols-2 gap-2 md:gap-4 text-[10px] md:text-xs font-sf-mono">
                <div>
                  <span className="text-primary/50">INDEX CODE: </span>
                  <span>{record.indexCode || `AC-${Math.floor(Math.random() * 1000)}-${record.id.split("-")[2]}`}</span>
                </div>
                <div>
                  <span className="text-primary/50">VALIDATION ID: </span>
                  <span>{record.validationId || `VLD-${Math.floor(Math.random() * 10000)}`}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
