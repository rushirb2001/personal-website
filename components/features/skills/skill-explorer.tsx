"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, AlertCircle, FileText } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { SkillGroup } from "./skill-folder"

interface SkillExplorerProps {
  group: SkillGroup
  isOpen: boolean
  onClose: () => void
}

// Systemic, abrupt transitions
const systemicTransition = {
  duration: 0.2,
  ease: [0.4, 0, 1, 1], // Abrupt cubic-bezier
}

export function SkillExplorer({ group, isOpen, onClose }: SkillExplorerProps) {
  const [sortField, setSortField] = useState<"name" | "proficiency" | "lastUsed" | "clearanceLevel">("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isGlitching, setIsGlitching] = useState(false)

  // Occasional random glitch effect
  useEffect(() => {
    if (!isOpen) return

    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 100)
      }
    }, 3000)

    return () => clearInterval(glitchInterval)
  }, [isOpen])

  // Add ESC key handler
  useEffect(() => {
    if (!isOpen) return

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [isOpen, onClose])

  // Sort skills based on current sort field and direction
  const sortedSkills = [...group.skills].sort((a, b) => {
    let comparison = 0

    if (sortField === "name") {
      comparison = a.name.localeCompare(b.name)
    } else if (sortField === "proficiency") {
      comparison = a.proficiency - b.proficiency
    } else if (sortField === "lastUsed") {
      comparison = new Date(a.lastUsed).getTime() - new Date(b.lastUsed).getTime()
    } else if (sortField === "clearanceLevel") {
      comparison = a.clearanceLevel.localeCompare(b.clearanceLevel)
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  // Handle sort click
  const handleSort = (field: "name" | "proficiency" | "lastUsed" | "clearanceLevel") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Get sort icon
  const getSortIcon = (field: "name" | "proficiency" | "lastUsed" | "clearanceLevel") => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
  }

  // Render proficiency bars
  const renderProficiency = (level: number) => {
    return (
      <div className="flex space-x-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`h-2 md:h-3 w-2 md:w-3 ${i <= level ? "bg-primary/70" : "bg-primary/10"}`}></div>
        ))}
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-2"
          onClick={onClose}
        >
          <motion.div
            className={`w-full max-w-[95%] md:max-w-4xl border border-primary/30 bg-background dark:bg-eerie-black relative overflow-hidden ${isGlitching ? "animate-systemic-glitch" : ""}`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={systemicTransition}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-primary/20 p-2 md:p-3 flex justify-between items-center bg-secondary/30 dark:bg-eerie-darkgray/30">
              <div className="flex items-center">
                <FileText className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 text-primary/70" />
                <h2 className="text-xs md:text-sm font-sf-mono truncate">{group.title} - SKILL INVENTORY</h2>
              </div>
              <button
                onClick={onClose}
                className="text-primary/70 hover:text-primary transition-colors font-sf-mono text-xs"
                aria-label="Close"
              >
                [ CLOSE ]
              </button>
            </div>

            {/* Warning banner */}
            <div className="bg-yellow-500/10 border-b border-yellow-500/30 p-1 md:p-2 flex items-center text-[10px] md:text-xs">
              <AlertCircle className="h-2 w-2 md:h-3 md:w-3 mr-1 md:mr-2 text-yellow-500/70" />
              <span className="font-sf-mono text-primary/80 animate-mechanical-pulse truncate">
                NOTICE: ACCESSING RESTRICTED SKILL DATA - ACTIVITY LOGGED
              </span>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-4 border-b border-primary/20 text-[10px] md:text-xs font-sf-mono bg-secondary/20 dark:bg-eerie-darkgray/20">
              <button
                className="p-1 md:p-2 flex items-center justify-between hover:bg-primary/5 transition-colors"
                onClick={() => handleSort("name")}
              >
                <span>NAME</span>
                {getSortIcon("name")}
              </button>
              <button
                className="p-1 md:p-2 flex items-center justify-between hover:bg-primary/5 transition-colors border-l border-primary/10"
                onClick={() => handleSort("proficiency")}
              >
                <span>PROFICIENCY</span>
                {getSortIcon("proficiency")}
              </button>
              <button
                className="p-1 md:p-2 flex items-center justify-between hover:bg-primary/5 transition-colors border-l border-primary/10"
                onClick={() => handleSort("lastUsed")}
              >
                <span className="hidden md:inline">LAST UTILIZED</span>
                <span className="md:hidden">LAST USED</span>
                {getSortIcon("lastUsed")}
              </button>
              <button
                className="p-1 md:p-2 flex items-center justify-between hover:bg-primary/5 transition-colors border-l border-primary/10"
                onClick={() => handleSort("clearanceLevel")}
              >
                <span className="hidden md:inline">CLEARANCE LEVEL</span>
                <span className="md:hidden">CLEARANCE</span>
                {getSortIcon("clearanceLevel")}
              </button>
            </div>

            {/* Table content */}
            <div className="max-h-[50vh] md:max-h-[60vh] overflow-y-auto custom-scrollbar">
              {sortedSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-4 text-[10px] md:text-xs border-b border-primary/10 hover:bg-primary/5 transition-colors ${idx % 2 === 0 ? "bg-secondary/10 dark:bg-eerie-darkgray/10" : ""}`}
                >
                  <div className="p-2 md:p-3 flex items-center">
                    <FileText className="h-2 w-2 md:h-3 md:w-3 mr-1 md:mr-2 text-primary/50" />
                    <span className="truncate">{skill.name}</span>
                  </div>
                  <div className="p-2 md:p-3 border-l border-primary/10 flex items-center">
                    {renderProficiency(skill.proficiency)}
                  </div>
                  <div className="p-2 md:p-3 border-l border-primary/10 font-sf-mono truncate">{skill.lastUsed}</div>
                  <div className="p-2 md:p-3 border-l border-primary/10 font-sf-mono truncate">
                    {skill.clearanceLevel}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-primary/20 p-1 md:p-2 flex justify-between items-center text-[10px] md:text-xs font-sf-mono bg-secondary/30 dark:bg-eerie-darkgray/30">
              <div>TOTAL: {group.skills.length}</div>
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 mr-1 md:mr-2 animate-mechanical-pulse"></div>
                <span>SECURE</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
