"use client"

import { useEffect, useState } from "react"
import { FileText, Download, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ResumeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  const pdfUrl = "https://v9fl0vq2qbxv8yrh.public.blob.vercel-storage.com/resume-ZpPZh22hfStdIegCtsD7DORRyDEFN7.pdf"
  // Google Docs viewer URL
  const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  // Reset loading state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLoading(true)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 md:p-0"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-4xl h-[70vh] bg-background dark:bg-eerie-black border border-primary/30 shadow-lg flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="dark:bg-primary/10 bg-white px-3 md:px-4 py-2 md:py-3 flex justify-between items-center border-b border-primary/30">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-primary/70" />
                <span className="text-xs md:text-sm font-sf-mono text-primary/70 truncate">
                  PERSONNEL DOCUMENT [ RESUME-471 ]
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-primary/70 hover:text-primary transition-colors font-sf-mono text-xs md:text-sm"
                aria-label="Close"
              >
                [ CLOSE ]
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background dark:bg-eerie-black">
                  <div className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                </div>
              )}

              <iframe
                src={googleDocsViewerUrl}
                className="w-full h-full"
                onLoad={() => setLoading(false)}
                title="Resume"
                frameBorder="0"
              />
            </div>

            {/* Footer with buttons */}
            <div className="dark:bg-primary/10 bg-white px-3 md:px-4 py-2 md:py-3 flex justify-end items-center gap-3 border-t border-primary/30">
              <a
                href={pdfUrl}
                download="resume.pdf"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-sf-mono border border-primary/30 hover:bg-primary/10 text-primary/70 hover:text-primary transition-colors"
              >
                <Download className="h-3.5 w-3.5" />[ DOWNLOAD ]
              </a>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-sf-mono border border-primary/30 hover:bg-primary/10 text-primary/70 hover:text-primary transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />[ OPEN ]
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
