"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CallFormModalProps {
  isOpen: boolean
  onClose: () => void
  calendlyUrl?: string
}

export function CallFormModal({ 
  isOpen, 
  onClose, 
  calendlyUrl = "https://calendly.com/bhavsarrushir/30min"
}: CallFormModalProps) {
  
  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  // Load Calendly widget script
  useEffect(() => {
    if (isOpen) {
      const script = document.createElement("script")
      script.src = "https://assets.calendly.com/assets/external/widget.js"
      script.async = true
      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 md:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[95%] md:max-w-2xl bg-background dark:bg-eerie-black border border-primary/30 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-3 md:p-4 border-b border-primary/20">
              <div className="text-xs md:text-sm font-sf-mono">SCHEDULE A CALL</div>
              <button onClick={onClose} className="text-primary/70 hover:text-primary font-sf-mono text-xs">
                [ CLOSE ]
              </button>
            </div>

            {/* Calendly Embed */}
            <div className="p-0">
              <div
                className="calendly-inline-widget"
                data-url={calendlyUrl}
                style={{ minWidth: "320px", height: "600px" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
