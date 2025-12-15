"use client"

import { useEffect, useState } from "react"
import { FileText, Download, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ResumeModalProps {
  isOpen: boolean
  onClose: () => void
  buttonRect?: DOMRect | null
}

export function ResumeModal({ isOpen, onClose, buttonRect }: ResumeModalProps) {
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [showExpansion, setShowExpansion] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const pdfUrl = "https://v9fl0vq2qbxv8yrh.public.blob.vercel-storage.com/resume-ZpPZh22hfStdIegCtsD7DORRyDEFN7.pdf"
  const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && buttonRect) {
      setShowExpansion(true)
      setShowModal(false)

      const timer = setTimeout(() => {
        setShowExpansion(false)
        setShowModal(true)
      }, 500)

      return () => clearTimeout(timer)
    } else if (isOpen) {
      setShowModal(true)
      setShowExpansion(false)
    } else {
      setShowModal(false)
      setShowExpansion(false)
    }
  }, [isOpen, buttonRect])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/70 backdrop-blur-sm p-2 md:p-0"
          onClick={onClose}
        >
          {showExpansion && buttonRect && (
            <motion.div
              className="fixed bg-background border border-primary/20 z-[100]"
              initial={{
                top: buttonRect.top,
                left: buttonRect.left,
                width: buttonRect.width,
                height: buttonRect.height,
              }}
              animate={{
                top: "15vh",
                left: "50%",
                x: "-50%",
                width: "min(calc(100vw - 1rem), 56rem)",
                height: "70vh",
              }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          )}

          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-4xl h-[70vh] bg-background border border-primary/30 shadow-lg flex flex-col modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-card px-3 md:px-4 py-2 md:py-3 flex justify-between items-center border-b border-primary/30">
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

              <div className="flex-1 overflow-hidden relative">
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background">
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

              <div className="bg-card px-3 md:px-4 py-2 md:py-3 flex justify-end items-center gap-3 border-t border-primary/30">
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
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
