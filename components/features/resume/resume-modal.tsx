"use client"

import { useEffect, useState, useCallback } from "react"
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
  const [animationPhase, setAnimationPhase] = useState<"idle" | "expanding" | "open" | "collapsing">("idle")
  const [contentVisible, setContentVisible] = useState(false)

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
      if (e.key === "Escape" && animationPhase === "open") handleClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [animationPhase])

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && animationPhase === "idle") {
      setAnimationPhase("expanding")
      setContentVisible(false)

      // After expansion completes, show content with blur reveal
      const expandTimer = setTimeout(() => {
        setAnimationPhase("open")
        // Small delay before content becomes visible for blur effect
        setTimeout(() => {
          setContentVisible(true)
        }, 50)
      }, 550)

      return () => clearTimeout(expandTimer)
    }
  }, [isOpen, animationPhase])

  const handleClose = useCallback(() => {
    if (animationPhase !== "open") return

    setContentVisible(false)
    setAnimationPhase("collapsing")

    // After collapse animation, fully close
    setTimeout(() => {
      setAnimationPhase("idle")
      onClose()
    }, 500)
  }, [animationPhase, onClose])

  // Reset when closed externally
  useEffect(() => {
    if (!isOpen && animationPhase !== "idle") {
      setAnimationPhase("idle")
      setContentVisible(false)
    }
  }, [isOpen, animationPhase])

  const getTargetRect = () => ({
    top: "15vh",
    left: "50%",
    x: "-50%",
    width: isMobile ? "calc(100vw - 1rem)" : "min(calc(100vw - 2rem), 56rem)",
    height: "70vh",
  })

  const getButtonRect = () => {
    if (!buttonRect) {
      return {
        top: "50%",
        left: "50%",
        x: "-50%",
        y: "-50%",
        width: 150,
        height: 40,
      }
    }
    return {
      top: buttonRect.top,
      left: buttonRect.left,
      x: 0,
      y: 0,
      width: buttonRect.width,
      height: buttonRect.height,
    }
  }

  if (!isOpen && animationPhase === "idle") return null

  return (
    <AnimatePresence mode="wait">
      {(isOpen || animationPhase !== "idle") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/70 backdrop-blur-sm p-2 md:p-0"
          onClick={handleClose}
        >
          {(animationPhase === "expanding" || animationPhase === "collapsing") && (
            <motion.div
              className="fixed bg-background border border-primary/20 z-[100] overflow-hidden"
              initial={animationPhase === "expanding" ? getButtonRect() : getTargetRect()}
              animate={animationPhase === "expanding" ? getTargetRect() : getButtonRect()}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Button content that fades out during expansion */}
              {animationPhase === "expanding" && (
                <motion.div
                  className="flex items-center justify-center h-full gap-2 font-sf-mono text-xs text-primary/70"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0, filter: "blur(8px)" }}
                  transition={{ duration: 0.25 }}
                >
                  <FileText className="h-4 w-4" />
                  <span>VIEW RESUME</span>
                </motion.div>
              )}
            </motion.div>
          )}

          {animationPhase === "open" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-4xl h-[70vh] bg-background border border-primary/20 shadow-lg flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <motion.div
                className="bg-card px-3 md:px-4 py-2 md:py-3 flex justify-between items-center border-b border-primary/20"
                initial={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                animate={{
                  opacity: contentVisible ? 1 : 0,
                  y: contentVisible ? 0 : -10,
                  filter: contentVisible ? "blur(0px)" : "blur(4px)",
                }}
                transition={{ duration: 0.3, delay: 0, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-primary/70" />
                  <span className="text-xs md:text-sm font-sf-mono text-primary/70 truncate">
                    PERSONNEL DOCUMENT [ RESUME-471 ]
                  </span>
                </div>
                <button
                  onClick={handleClose}
                  className="text-primary/70 hover:text-primary transition-colors font-sf-mono text-xs md:text-sm"
                  aria-label="Close"
                >
                  [ CLOSE ]
                </button>
              </motion.div>

              {/* Content */}
              <motion.div
                className="flex-1 overflow-hidden relative"
                initial={{ opacity: 0, filter: "blur(8px)" }}
                animate={{
                  opacity: contentVisible ? 1 : 0,
                  filter: contentVisible ? "blur(0px)" : "blur(8px)",
                }}
                transition={{ duration: 0.35, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
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
              </motion.div>

              {/* Footer */}
              <motion.div
                className="bg-card px-3 md:px-4 py-2 md:py-3 flex justify-end items-center gap-3 border-t border-primary/20"
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{
                  opacity: contentVisible ? 1 : 0,
                  y: contentVisible ? 0 : 10,
                  filter: contentVisible ? "blur(0px)" : "blur(4px)",
                }}
                transition={{ duration: 0.3, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <a
                  href={pdfUrl}
                  download="resume.pdf"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-sf-mono border border-primary/20 hover:bg-primary/10 text-primary/70 hover:text-primary transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />[ DOWNLOAD ]
                </a>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-sf-mono border border-primary/20 hover:bg-primary/10 text-primary/70 hover:text-primary transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />[ OPEN ]
                </a>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
