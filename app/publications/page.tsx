"use client"

import { useState, useEffect, useMemo } from "react"
import { PageLayout } from "@/components/layout/page-layout"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { publications, ITEMS_PER_PAGE, type Publication } from "./data"

type PublicationType = "All" | "Journal" | "Conference" | "Dissertation"

const PUBLICATION_TYPES: PublicationType[] = ["All", "Journal", "Conference", "Dissertation"]

function getPublicationType(venue: string): PublicationType {
  const venueLower = venue.toLowerCase()
  if (venueLower.includes("dissertation") || venueLower.includes("thesis")) return "Dissertation"
  if (venueLower.includes("conference") || venueLower.includes("symposium") || venueLower.includes("workshop"))
    return "Conference"
  return "Journal"
}

export default function PublicationsPage() {
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [startIndex, setStartIndex] = useState(0)
  const [selectedType, setSelectedType] = useState<PublicationType>("All")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const filteredPublications = useMemo(() => {
    let filtered = [...publications]
    if (selectedType !== "All") {
      filtered = filtered.filter((pub) => getPublicationType(pub.venue) === selectedType)
    }
    return filtered.sort((a, b) => b.citations - a.citations)
  }, [selectedType])

  useEffect(() => {
    setStartIndex(0)
    setSelectedPublication(null)
  }, [selectedType])

  const stats = useMemo(() => {
    const totalCitations = publications.reduce((sum, pub) => sum + pub.citations, 0)
    const years = publications.map((p) => Number.parseInt(p.year))
    const yearRangeDesktop = `${Math.min(...years)}-${Math.max(...years)}`
    const yearRangeMobile = `${Math.min(...years)}-${Math.max(...years)
      .toString()
      .slice(-2)}`
    const venues = new Set(publications.map((p) => p.venue)).size
    return { totalCitations, yearRangeDesktop, yearRangeMobile, venues, total: publications.length }
  }, [])

  // Sliding window pagination: show ITEMS_PER_PAGE items at a time
  const visiblePublications = filteredPublications.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Pagination controls
  const canShowPrevious = startIndex > 0
  const canShowNext = startIndex + ITEMS_PER_PAGE < filteredPublications.length
  const showPaginationControls = filteredPublications.length > ITEMS_PER_PAGE

  // Calculate current page info
  const currentStart = startIndex + 1
  const currentEnd = Math.min(startIndex + ITEMS_PER_PAGE, filteredPublications.length)

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && selectedPublication) {
        setSelectedPublication(null)
      }
    }
    document.addEventListener("keydown", handleEscKey)
    return () => document.removeEventListener("keydown", handleEscKey)
  }, [selectedPublication])

  return (
    <PageLayout title="PUBLICATIONS" subtitle="RESEARCH & PAPERS">
      <div className="space-y-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col md:flex-row items-center justify-center gap-2 py-3 mb-2"
        >
          {/* Category Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-sf-mono uppercase tracking-wider border border-primary/30 bg-background hover:bg-primary/10 transition-colors min-w-[140px] justify-between"
            >
              <span>{selectedType}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-1 w-full bg-background border border-primary/30 z-50"
                >
                  {PUBLICATION_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedType(type)
                        setIsFilterOpen(false)
                      }}
                      className={`w-full px-3 py-1.5 text-[10px] font-sf-mono uppercase tracking-wider text-left transition-colors ${
                        selectedType === type ? "bg-primary text-background" : "hover:bg-primary/10"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pagination Controls */}
          {showPaginationControls && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStartIndex((prev) => Math.max(0, prev - ITEMS_PER_PAGE))}
                disabled={!canShowPrevious}
                className={`p-1.5 border transition-all duration-150 ${
                  canShowPrevious
                    ? "bg-primary text-background border-primary/40 hover:bg-primary/90"
                    : "border-primary/10 text-primary/20 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[9px] font-sf-mono text-primary/40 px-1 min-w-[60px] text-center">
                {currentStart}-{currentEnd} / {filteredPublications.length}
              </span>
              <button
                onClick={() =>
                  setStartIndex((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredPublications.length - ITEMS_PER_PAGE))
                }
                disabled={!canShowNext}
                className={`p-1.5 border transition-all duration-150 ${
                  canShowNext
                    ? "bg-primary text-background border-primary/40 hover:bg-primary/90"
                    : "border-primary/10 text-primary/20 cursor-not-allowed"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[40px_1fr_180px_60px_40px_40px] gap-4 px-3 py-2 border-b border-primary/30 font-sf-mono text-primary/50 uppercase tracking-wider text-sm">
          <span></span>
          <span>TITLE</span>
          <span>VENUE</span>
          <span>YEAR</span>
          <span>CIT</span>
          <span>LINK</span>
        </div>

        {filteredPublications.length === 0 ? (
          <div className="py-8 text-center font-sf-mono text-primary/40 text-sm">
            No publications found for "{selectedType}"
          </div>
        ) : (
          visiblePublications.map((pub, index) => (
            <div key={pub.id}>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: index * 0.05 }}
                className={`border-b border-primary/10 transition-all duration-150 cursor-pointer ${
                  selectedPublication?.id === pub.id
                    ? hoveredId === pub.id
                      ? "bg-primary/70 text-background"
                      : "bg-primary text-background"
                    : hoveredId === pub.id
                      ? "bg-primary/10"
                      : ""
                }`}
                onMouseEnter={() => setHoveredId(pub.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedPublication(selectedPublication?.id === pub.id ? null : pub)}
              >
                <div className="hidden md:grid grid-cols-[40px_1fr_180px_60px_40px_40px] gap-4 px-3 py-3 items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedPublication(selectedPublication?.id === pub.id ? null : pub)
                    }}
                    className={`flex items-center justify-center w-8 h-8 border transition-all duration-200 ${
                      selectedPublication?.id === pub.id
                        ? "bg-background text-primary border-background/30 hover:bg-background/90"
                        : "bg-primary text-background border-primary/40 hover:bg-primary/90"
                    }`}
                  >
                    <motion.div
                      animate={{ rotate: selectedPublication?.id === pub.id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {selectedPublication?.id === pub.id ? (
                        <X className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </motion.div>
                  </button>
                  <span className="font-sf-mono font-medium pr-4 text-base">{pub.title}</span>
                  <span
                    className={`font-sf-mono text-base ${selectedPublication?.id === pub.id ? "text-background/70" : "text-primary/60"}`}
                  >
                    {pub.venue}
                  </span>
                  <span
                    className={`font-sf-mono tracking-tighter text-sm ${selectedPublication?.id === pub.id ? "text-background/70" : "text-primary/50"}`}
                  >
                    {pub.year}.{pub.month}
                  </span>
                  <span
                    className={`font-sf-mono font-medium text-base ${selectedPublication?.id === pub.id ? "text-background" : "text-primary/70"}`}
                  >
                    {pub.citations}
                  </span>
                  <a
                    href={pub.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`flex items-center justify-center w-8 h-8 border transition-colors ${
                      selectedPublication?.id === pub.id
                        ? "bg-background text-primary border-background/30 hover:bg-background/90"
                        : "bg-primary text-background border-primary/40 hover:bg-primary/90"
                    }`}
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>

                <div className="md:hidden px-3 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-sf-mono font-medium line-clamp- text-left mb-2 tracking-tighter text-sm">
                        {pub.title}
                      </h3>
                      <p
                        className={`font-sf-mono text-xs ${selectedPublication?.id === pub.id ? "text-background/60" : "text-primary/50"}`}
                      >
                        {pub.venue}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <div className="flex items-center gap-1">
                        <a
                          href={pub.pdfLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={`flex items-center justify-center w-8 h-8 border transition-all duration-200 ${
                            selectedPublication?.id === pub.id
                              ? "bg-background text-primary border-background/30 hover:bg-background/90"
                              : "bg-primary text-background border-primary/40 hover:bg-primary/90"
                          }`}
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedPublication(selectedPublication?.id === pub.id ? null : pub)
                          }}
                          className={`flex items-center justify-center w-8 h-8 border transition-all duration-200 ${
                            selectedPublication?.id === pub.id
                              ? "bg-background text-primary border-background/30 hover:bg-background/90"
                              : "bg-primary text-background border-primary/40 hover:bg-primary/90"
                          }`}
                        >
                          <motion.div
                            animate={{ rotate: selectedPublication?.id === pub.id ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {selectedPublication?.id === pub.id ? (
                              <X className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </motion.div>
                        </button>
                      </div>
                      <div className="flex flex-col items-end gap-0.5 text-right">
                        <span
                          className={`text-[9px] font-sf-mono ${selectedPublication?.id === pub.id ? "text-background/60" : "text-primary/50"}`}
                        >
                          {pub.year} | {pub.citations} CIT
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <AnimatePresence>
                {selectedPublication?.id === pub.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-b border-primary/20"
                  >
                    <div className="bg-primary/5 p-4 md:p-6">
                      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
                        <div className="space-y-4">
                          <div>
                            <span className="font-sf-mono text-primary/40 uppercase tracking-wider text-xs">
                              ABSTRACT
                            </span>
                            <p className="font-sf-mono text-primary/70 mt-1 leading-relaxed border-l-2 border-primary/20 pl-3 tracking-tighter text-xs">
                              {selectedPublication.abstract}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3 md:border-l md:border-primary/10 md:pl-6 grid grid-cols-2 md:grid-cols-1">
                          <div>
                            <span className="font-sf-mono text-primary/40 uppercase tracking-wider text-xs">
                              AUTHORS
                            </span>
                            <p className="font-sf-mono text-primary/70 mt-1 text-xs tracking-[-0.1em]">
                              {selectedPublication.authors}
                            </p>
                          </div>

                          <div>
                            <span className="font-sf-mono text-primary/40 uppercase tracking-wider text-sm">DOI</span>
                            <p className="font-sf-mono text-primary/50 mt-1 break-all text-xs tracking-[-0.1em]">
                              {selectedPublication.doi}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}

        <motion.div
          className="flex items-center justify-between border-t border-primary/20 pt-3 mt-4 px-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3 }}
        >
          <div className="flex flex-wrap gap-1 sm:gap-2 md:gap-4 text-[9px] sm:text-[10px] font-sf-mono text-primary/40 uppercase tracking-wider">
            <span className="text-xs tracking-tighter">
              {filteredPublications.length === stats.total
                ? `${stats.total} ${isMobile ? "PUB" : "PUBLICATIONS"}`
                : `${filteredPublications.length}/${stats.total} ${isMobile ? "PUB" : "PUBLICATIONS"}`}
            </span>
            <span className="text-primary/20">/</span>
            <span className="text-xs tracking-tighter">
              {stats.totalCitations} {isMobile ? "CIT" : "CITATIONS"}
            </span>
            <span className="text-primary/20">/</span>
            <span className="text-xs tracking-tighter">
              {stats.venues} {isMobile ? "VEN" : "VENUES"}
            </span>
            <span className="text-primary/20">/</span>
            <span className="text-xs tracking-tighter">
              {isMobile ? stats.yearRangeMobile : stats.yearRangeDesktop}
            </span>
          </div>
          <div className="text-[9px] sm:text-[10px] font-sf-mono text-primary/30">
            <span className="text-xs">{"LAST.UPDATED: 2025"}</span>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
}
