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
  const [showContent, setShowContent] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const pdfUrl = "https://v9fl0vq2qbxv8yrh.public.blob.vercel-storage.com/resume-ZpPZh22hfStdIegCtsD7DORRyDEFN7.pdf"
  const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isClosing) handleClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [isOpen, isClosing])

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      setIsClosing(false)
      // Delay content reveal for expansion animation
      const timer = setTimeout(() => setShowContent(true), 400)
      return () => clearTimeout(timer)
    } else {
      setShowContent(false)
    }
  }, [isOpen])

  const handleClose = useCallback(() => {
    if (isClosing) return
    setIsClosing(true)
    setShowContent(false)
    // Allow collapse animation to play
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 400)
  }, [isClosing, onClose])

  // Get target modal dimensions
  const getTargetRect = () => {
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1024
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 768
    const modalWidth = isMobile ? viewportWidth - 16 : Math.min(viewportWidth - 32, 896)
    const modalHeight = viewportHeight * 0.7
    return {
      top: viewportHeight * 0.15,
      left: (viewportWidth - modalWidth) / 2,
      width: modalWidth,
      height: modalHeight,
    }
  }

  // Get button start position
  const getButtonRect = () => {
    if (!buttonRect) {
      const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1024
      const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 768
      return {
        top: viewportHeight / 2 - 20,
        left: viewportWidth / 2 - 75,
        width: 150,
        height: 40,
      }
    }
    return {
      top: buttonRect.top,
      left: buttonRect.left,
      width: buttonRect.width,
      height: buttonRect.height,
    }
  }

  if (!isOpen && !isClosing) return null

  const targetRect = getTargetRect()
  const startRect = getButtonRect()

  return (
    <AnimatePresence mode="wait">
      {(isOpen || isClosing) && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-foreground/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Expansion/Collapse Animation Overlay */}
          <motion.div
            className="fixed z-[60] bg-background border border-primary/20 overflow-hidden pointer-events-none"
            initial={{
              top: startRect.top,
              left: startRect.left,
              width: startRect.width,
              height: startRect.height,
            }}
            animate={
              isClosing
                ? {
                    top: startRect.top,
                    left: startRect.left,
                    width: startRect.width,
                    height: startRect.height,
                  }
                : {
                    top: targetRect.top,
                    left: targetRect.left,
                    width: targetRect.width,
                    height: targetRect.height,
                  }
            }
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ opacity: showContent ? 0 : 1 }}
          >
            {/* Button text that blurs out during expansion */}
            <motion.div
              className="flex items-center justify-center h-full gap-2 font-sf-mono text-xs text-primary/70"
              initial={{ opacity: 1, filter: "blur(0px)" }}
              animate={isClosing ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.2 }}
            >
              <FileText className="h-4 w-4" />
              <span>VIEW RESUME</span>
            </motion.div>
          </motion.div>

          {/* Actual Modal Content */}
          <motion.div
            className="fixed z-[60] flex flex-col bg-background border border-primary/20 shadow-lg overflow-hidden"
            style={{
              top: targetRect.top,
              left: targetRect.left,
              width: targetRect.width,
              height: targetRect.height,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <motion.div
              className="bg-card px-3 md:px-4 py-2 md:py-3 flex justify-between items-center border-b border-primary/20"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : -10 }}
              transition={{ duration: 0.3, delay: 0.05 }}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 10 }}
              transition={{ duration: 0.3, delay: 0.15 }}
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
        </>
      )}
    </AnimatePresence>
  )
}
