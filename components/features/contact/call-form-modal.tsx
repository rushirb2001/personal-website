"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"

interface CallFormModalProps {
  isOpen: boolean
  onClose: () => void
  calUsername?: string
  calEventSlug?: string
}

export function CallFormModal({
  isOpen,
  onClose,
  calUsername = "rushir-bhavsar-h7hcgm",
  calEventSlug = "30min",
}: CallFormModalProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const calTheme = mounted && resolvedTheme === "dark" ? "dark" : "light"
  const calUrl = `https://cal.com/${calUsername}/${calEventSlug}?embed=true&layout=month_view&theme=${calTheme}`

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 md:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[95%] md:max-w-4xl bg-background dark:bg-eerie-black border border-primary/30 shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-2 md:p-3 border-b border-primary/20">
              <div className="text-[10px] md:text-xs font-sf-mono">SCHEDULE A CALL</div>
              <button
                onClick={onClose}
                className="text-primary/70 hover:text-primary font-sf-mono text-[10px] md:text-xs"
              >
                [ CLOSE ]
              </button>
            </div>

            <div className="relative overflow-hidden" style={{ height: "450px" }}>
              <iframe
                key={calTheme}
                src={calUrl}
                title="Schedule a call"
                className={`absolute top-0 left-0 border-0 ${calTheme === "dark" ? "bg-neutral-900" : "bg-white"}`}
                style={{
                  width: "125%",
                  height: "125%",
                  transform: "scale(0.8)",
                  transformOrigin: "top left",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
