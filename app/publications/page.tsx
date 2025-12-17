"use client"

import { useState, useEffect, useMemo } from "react"
import { PageLayout } from "@/components/layout/page-layout"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, ExternalLink, ChevronDown, X } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface Publication {
  id: string
  title: string
  venue: string
  authors: string
  abstract: string
  year: string
  month: string
  status: "PUBLISHED" | "IN-REVIEW" | "PAY-LOCK"
  doi: string
  pdfLink: string
  citations: number
}

export default function PublicationsPage() {
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [startIndex, setStartIndex] = useState(0)
  const ITEMS_PER_PAGE = 5
  const isMobile = useMediaQuery("(max-width: 768px)")

  const publications: Publication[] = [
    {
      id: "001",
      title: "DEEP ENSEMBLE MAMMOGRAM CLASSIFICATION USING ONE-SHOT SEGMENTATION",
      venue: "NIRMA UNIVERSITY CONFERENCE",
      authors: "R. BHAVSAR, S. PATEL, A. SHAH",
      abstract:
        "This study presents a novel approach to mammogram classification through deep ensemble learning and one-shot segmentation techniques. By aggregating over 7,000 images from 7 distinct sources and applying panoptic annotation with semantic segmentation, we achieved a 23% improvement in cancerous mammogram classification accuracy over baseline methods, reaching 81% accuracy.",
      year: "2022",
      month: "06",
      status: "RELEASED",
      doi: "10.1234/NU.2022.437",
      pdfLink: "#",
      citations: 12,
    },
    {
      id: "002",
      title: "CLASSIFICATION OF POTENTIALLY HAZARDOUS ASTEROIDS USING SUPERVISED QUANTUM MACHINE LEARNING",
      venue: "IEEE ACCESS",
      authors: "R. BHAVSAR, N. K. JADAV, U. BODKHE, R. GUPTA, S. TANWAR, G. SHARMA, P. N. BOKORO, R. SHARMA",
      abstract:
        "This research explores the application of Quantum Machine Learning (QML) for asteroid hazard classification, achieving significant improvements in computational efficiency and classification accuracy using quantum computing approaches.",
      year: "2023",
      month: "07",
      status: "RELEASED",
      doi: "10.1109/ACCESS.2023.3294576",
      pdfLink: "https://ieeexplore.ieee.org/document/10188662",
      citations: 45,
    },
    {
      id: "003",
      title: "METAHATE: AI-BASED HATE SPEECH DETECTION FOR SECURED ONLINE GAMING IN METAVERSE USING BLOCKCHAIN",
      venue: "SECURITY AND PRIVACY",
      authors:
        "H. SANGHVI, R. BHAVSAR, V. HUNDLANI, L. GOHIL, T. VYAS, A. NAIR, S. DESAI, N. K. JADAV, S. TANWAR, R. SHARMA, N. YAMSANI",
      abstract:
        "This article proposes MetaHate, a novel framework that employs AI and blockchain to detect and combat hate speech in online gaming environments within the metaverse, achieving 86.01% accuracy with gradient boosting.",
      year: "2024",
      month: "03",
      status: "RELEASED",
      doi: "10.1002/SPY2.343",
      pdfLink: "https://onlinelibrary.wiley.com/doi/abs/10.1002/spy2.343",
      citations: 28,
    },
    {
      id: "004",
      title: "MACE-PINNS: MULTI-NETWORK DRIVEN DECOUPLING OF INTERDEPENDENT PHYSICS IN COUPLED PDE SYSTEMS",
      venue: "ARIZONA STATE UNIVERSITY DISSERTATIONS",
      authors: "R. BHAVSAR",
      abstract:
        "Introducing Multi-network Architecture for Coupled Equations Physics-Informed Neural Networks (MACE-PINNs), employing parallel subnetworks to independently approximate coupled variables with L2 errors ranging from 10−3 to 10−2.",
      year: "2025",
      month: "01",
      status: "RELEASED",
      doi: "10.48550/DISSERTATION.31994438",
      pdfLink: "https://keep.lib.asu.edu/items/201211",
      citations: 3,
    },
    {
      id: "005",
      title: "MACE-PINNS: MULTI-NETWORK DRIVEN DECOUPLING OF INTERDEPENDENT PHYSICS IN COUPLED PDE SYSTEMS",
      venue: "ARIZONA STATE UNIVERSITY DISSERTATIONS",
      authors: "R. BHAVSAR",
      abstract:
        "Introducing Multi-network Architecture for Coupled Equations Physics-Informed Neural Networks (MACE-PINNs), employing parallel subnetworks to independently approximate coupled variables with L2 errors ranging from 10−3 to 10−2.",
      year: "2025",
      month: "01",
      status: "RELEASED",
      doi: "10.48550/DISSERTATION.31994438",
      pdfLink: "https://keep.lib.asu.edu/items/201211",
      citations: 3,
    },
    {
      id: "006",
      title: "MACE-PINNS: MULTI-NETWORK DRIVEN DECOUPLING OF INTERDEPENDENT PHYSICS IN COUPLED PDE SYSTEMS",
      venue: "ARIZONA STATE UNIVERSITY DISSERTATIONS",
      authors: "R. BHAVSAR",
      abstract:
        "Introducing Multi-network Architecture for Coupled Equations Physics-Informed Neural Networks (MACE-PINNs), employing parallel subnetworks to independently approximate coupled variables with L2 errors ranging from 10−3 to 10−2.",
      year: "2025",
      month: "01",
      status: "RELEASED",
      doi: "10.48550/DISSERTATION.31994438",
      pdfLink: "https://keep.lib.asu.edu/items/201211",
      citations: 3,
    },
    {
      id: "007",
      title: "MACE-PINNS: MULTI-NETWORK DRIVEN DECOUPLING OF INTERDEPENDENT PHYSICS IN COUPLED PDE SYSTEMS",
      venue: "ARIZONA STATE UNIVERSITY DISSERTATIONS",
      authors: "R. BHAVSAR",
      abstract:
        "Introducing Multi-network Architecture for Coupled Equations Physics-Informed Neural Networks (MACE-PINNs), employing parallel subnetworks to independently approximate coupled variables with L2 errors ranging from 10−3 to 10−2.",
      year: "2025",
      month: "01",
      status: "RELEASED",
      doi: "10.48550/DISSERTATION.31994438",
      pdfLink: "https://keep.lib.asu.edu/items/201211",
      citations: 3,
    },
  ]

  const sortedPublications = useMemo(() => {
    return [...publications].sort((a, b) => b.citations - a.citations)
  }, [])

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
  const visiblePublications = sortedPublications.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Pagination controls
  const canShowPrevious = startIndex > 0
  const canShowNext = startIndex + ITEMS_PER_PAGE < sortedPublications.length
  const showPaginationControls = sortedPublications.length > ITEMS_PER_PAGE

  // Calculate current page info
  const currentStart = startIndex + 1
  const currentEnd = Math.min(startIndex + ITEMS_PER_PAGE, sortedPublications.length)

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
        {showPaginationControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 py-3 mb-2"
          >
            <button
              onClick={() => setStartIndex((prev) => Math.max(0, prev - ITEMS_PER_PAGE))}
              disabled={!canShowPrevious}
              className={`px-4 py-1.5 text-[10px] font-sf-mono uppercase tracking-wider border transition-all duration-150 w-32 ${
                canShowPrevious
                  ? "border-primary/30 text-primary/70 hover:bg-primary/10 hover:border-primary/50"
                  : "border-primary/10 text-primary/20 cursor-not-allowed opacity-0 pointer-events-none"
              }`}
            >
              ← PREVIOUS
            </button>
            <span className="text-[9px] font-sf-mono text-primary/40 px-2">
              {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, sortedPublications.length)} OF{" "}
              {sortedPublications.length}
            </span>
            <button
              onClick={() => setStartIndex((prev) => prev + ITEMS_PER_PAGE)}
              disabled={!canShowNext}
              className={`px-4 py-1.5 text-[10px] font-sf-mono uppercase tracking-wider border transition-all duration-150 w-32 ${
                canShowNext
                  ? "border-primary/30 text-primary/70 hover:bg-primary/10 hover:border-primary/50"
                  : "border-primary/10 text-primary/20 cursor-not-allowed opacity-0 pointer-events-none"
              }`}
            >
              NEXT →
            </button>
          </motion.div>
        )}

        <div className="hidden md:grid grid-cols-[40px_1fr_180px_60px_40px_40px] gap-4 px-3 py-2 border-b border-primary/30 text-[10px] font-sf-mono text-primary/50 uppercase tracking-wider">
          <span></span>
          <span>TITLE</span>
          <span>VENUE</span>
          <span>YEAR</span>
          <span>CIT</span>
          <span>LINK</span>
        </div>

        {visiblePublications.map((pub, index) => (
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
                      ? "border-background/30 hover:bg-background/20"
                      : "border-primary/20 hover:bg-primary/10 hover:border-primary/40"
                  }`}
                >
                  <motion.div
                    animate={{ rotate: selectedPublication?.id === pub.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {selectedPublication?.id === pub.id ? (
                      <X className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </motion.div>
                </button>
                <span className="text-xs font-sf-mono font-medium truncate pr-4">{pub.title}</span>
                <span
                  className={`text-[10px] font-sf-mono truncate ${selectedPublication?.id === pub.id ? "text-background/70" : "text-primary/60"}`}
                >
                  {pub.venue}
                </span>
                <span
                  className={`text-xs font-sf-mono ${selectedPublication?.id === pub.id ? "text-background/70" : "text-primary/50"}`}
                >
                  {pub.year}.{pub.month}
                </span>
                <span
                  className={`text-xs font-sf-mono font-medium ${selectedPublication?.id === pub.id ? "text-background" : "text-primary/70"}`}
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
                      ? "border-background/30 hover:bg-background/20"
                      : "border-primary/20 hover:bg-primary/10 hover:border-primary/40"
                  }`}
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="md:hidden px-3 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-sf-mono font-medium line-clamp-2 text-left mb-2">{pub.title}</h3>
                    <p
                      className={`text-[10px] font-sf-mono ${selectedPublication?.id === pub.id ? "text-background/60" : "text-primary/50"}`}
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
                        className={`flex items-center justify-center w-8 h-8 border ${
                          selectedPublication?.id === pub.id ? "border-background/30" : "border-primary/20"
                        }`}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedPublication(selectedPublication?.id === pub.id ? null : pub)
                        }}
                        className={`flex items-center justify-center w-8 h-8 border ${
                          selectedPublication?.id === pub.id ? "border-background/30" : "border-primary/20"
                        }`}
                      >
                        <motion.div
                          animate={{ rotate: selectedPublication?.id === pub.id ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {selectedPublication?.id === pub.id ? (
                            <X className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
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
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-sf-mono px-2 py-0.5 border border-green-500/30 text-green-500 bg-green-500/10">
                              {selectedPublication.status}
                            </span>
                            <span className="text-[10px] font-sf-mono text-primary/50">
                              {selectedPublication.citations} CITATIONS
                            </span>
                          </div>
                          <span className="text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider">
                            TITLE
                          </span>
                          <h2 className="text-sm font-sf-mono font-medium mt-1">{selectedPublication.title}</h2>
                        </div>
                        <div>
                          <span className="text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider">
                            ABSTRACT
                          </span>
                          <p className="text-xs font-sf-mono text-primary/70 mt-1 leading-relaxed border-l-2 border-primary/20 pl-3">
                            {selectedPublication.abstract}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 md:border-l md:border-primary/10 md:pl-6">
                        <div>
                          <span className="text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider">
                            AUTHORS
                          </span>
                          <p className="text-[11px] font-sf-mono text-primary/70 mt-1">{selectedPublication.authors}</p>
                        </div>
                        <div>
                          <span className="text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider">
                            VENUE
                          </span>
                          <p className="text-[11px] font-sf-mono text-primary/70 mt-1">{selectedPublication.venue}</p>
                        </div>
                        <div>
                          <span className="text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider">DOI</span>
                          <p className="text-[10px] font-sf-mono text-primary/50 mt-1 break-all">
                            {selectedPublication.doi}
                          </p>
                        </div>
                        <div className="pt-3 border-t border-primary/10">
                          <a
                            href={selectedPublication.pdfLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-sf-mono px-3 py-2 border border-primary/30 hover:bg-primary hover:text-background transition-all duration-150"
                          >
                            <FileText className="w-3 h-3" />
                            VIEW PUBLICATION
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        <motion.div
          className="flex items-center justify-between border-t border-primary/20 pt-3 mt-4 px-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3 }}
        >
          <div className="flex flex-wrap gap-1 sm:gap-2 md:gap-4 text-[9px] sm:text-[10px] font-sf-mono text-primary/40 uppercase tracking-wider">
            <span>
              {stats.total} {isMobile ? "PUB" : "PUBLICATIONS"}
            </span>
            <span className="text-primary/20">/</span>
            <span>
              {stats.totalCitations} {isMobile ? "CIT" : "CITATIONS"}
            </span>
            <span className="text-primary/20">/</span>
            <span>
              {stats.venues} {isMobile ? "VEN" : "VENUES"}
            </span>
            <span className="text-primary/20">/</span>
            <span>{isMobile ? stats.yearRangeMobile : stats.yearRangeDesktop}</span>
          </div>
          <div className="text-[9px] sm:text-[10px] font-sf-mono text-primary/30">{"LAST.UPDATED: 2025"}</div>
        </motion.div>
      </div>
    </PageLayout>
  )
}
