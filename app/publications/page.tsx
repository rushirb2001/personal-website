"use client"

import { useState, useEffect, useMemo } from "react"
import { PageLayout } from "@/components/layout/page-layout"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, ExternalLink, X, ChevronRight } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface Publication {
  id: string
  title: string
  venue: string
  authors: string
  abstract: string
  year: string
  month: string
  status: "RELEASED" | "PENDING" | "RESTRICTED"
  doi: string
  pdfLink: string
  citations: number
}

export default function PublicationsPage() {
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
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
      citations: 8,
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
  ]

  const sortedPublications = useMemo(() => {
    return [...publications].sort((a, b) => b.citations - a.citations)
  }, [])

  const totalPages = Math.ceil(sortedPublications.length / ITEMS_PER_PAGE)
  const currentPublications = sortedPublications.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)
  const hasMorePages = currentPage < totalPages - 1

  const totalCitations = sortedPublications.reduce((sum, pub) => sum + pub.citations, 0)
  const avgCitations = (totalCitations / sortedPublications.length).toFixed(1)
  const yearRange = `${Math.min(...sortedPublications.map((p) => Number.parseInt(p.year)))}-${Math.max(...sortedPublications.map((p) => Number.parseInt(p.year)))}`

  // Handle ESC key press
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
    <PageLayout title="PUBLICATIONS" subtitle="RESEARCH OUTPUT">
      <div className="space-y-0">
        <div className="hidden md:grid grid-cols-[50px_1fr_140px_70px_50px_50px] gap-3 px-3 py-2 border-b border-primary/30 text-[10px] font-sf-mono text-primary/50 uppercase tracking-wider">
          <span>NO.</span>
          <span>VENUE</span>
          <span>AUTHORS</span>
          <span>YEAR</span>
          <span>CIT</span>
          <span>LINK</span>
        </div>

        {/* Publication rows with inline expansion */}
        {currentPublications.map((pub, index) => (
          <div key={pub.id}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15, delay: index * 0.05 }}
              className={`border-b border-primary/10 transition-all duration-150 cursor-pointer ${
                hoveredId === pub.id ? "bg-primary/10" : ""
              } ${selectedPublication?.id === pub.id ? "bg-primary text-background" : ""}`}
              onMouseEnter={() => setHoveredId(pub.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedPublication(selectedPublication?.id === pub.id ? null : pub)}
            >
              {/* Desktop row - removed title, added citations column */}
              <div className="hidden md:grid grid-cols-[50px_1fr_140px_70px_50px_50px] gap-3 px-3 py-3 items-center">
                <span
                  className={`text-xs font-sf-mono ${selectedPublication?.id === pub.id ? "text-background/70" : "text-primary/40"}`}
                >
                  [{pub.id}]
                </span>
                <span
                  className={`text-[10px] font-sf-mono truncate ${selectedPublication?.id === pub.id ? "text-background/80" : "text-primary/70"}`}
                >
                  {pub.venue}
                </span>
                <span
                  className={`text-[10px] font-sf-mono truncate ${selectedPublication?.id === pub.id ? "text-background/60" : "text-primary/50"}`}
                >
                  {pub.authors.split(",")[0]}...
                </span>
                <span
                  className={`text-xs font-sf-mono ${selectedPublication?.id === pub.id ? "text-background/70" : "text-primary/50"}`}
                >
                  {pub.year}
                </span>
                <span
                  className={`text-xs font-sf-mono font-medium ${selectedPublication?.id === pub.id ? "text-background" : "text-primary"}`}
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

              {/* Mobile row */}
              <div className="md:hidden px-3 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-sf-mono ${selectedPublication?.id === pub.id ? "text-background/60" : "text-primary/40"}`}
                      >
                        [{pub.id}]
                      </span>
                      <span
                        className={`text-[10px] font-sf-mono ${selectedPublication?.id === pub.id ? "text-background/60" : "text-primary/50"}`}
                      >
                        {pub.year}
                      </span>
                      <span
                        className={`text-[10px] font-sf-mono font-medium ${selectedPublication?.id === pub.id ? "text-background" : "text-primary"}`}
                      >
                        {pub.citations} cit
                      </span>
                    </div>
                    <p
                      className={`text-[10px] font-sf-mono ${selectedPublication?.id === pub.id ? "text-background/70" : "text-primary/60"}`}
                    >
                      {pub.venue}
                    </p>
                  </div>
                  <a
                    href={pub.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`flex items-center justify-center w-8 h-8 border shrink-0 ${
                      selectedPublication?.id === pub.id ? "border-background/30" : "border-primary/20"
                    }`}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
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
                  <div className="bg-primary/5 p-4 md:p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-sf-mono text-primary/50">[{selectedPublication.id}]</span>
                        <span className="text-[10px] font-sf-mono px-2 py-0.5 border border-green-500/30 text-green-500 bg-green-500/10">
                          {selectedPublication.status}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedPublication(null)
                        }}
                        className="p-1 hover:bg-primary/10 transition-colors"
                      >
                        <X className="w-4 h-4 text-primary/50" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                      {/* Left column */}
                      <div className="space-y-3">
                        <div>
                          <span className="text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider">
                            TITLE
                          </span>
                          <h2 className="text-xs font-sf-mono font-medium mt-1">{selectedPublication.title}</h2>
                        </div>
                        <div>
                          <span className="text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider">
                            ABSTRACT
                          </span>
                          <p className="text-[11px] font-sf-mono text-primary/70 mt-1 leading-relaxed border-l-2 border-primary/20 pl-3">
                            {selectedPublication.abstract}
                          </p>
                        </div>
                      </div>

                      {/* Right column */}
                      <div className="space-y-2 md:border-l md:border-primary/10 md:pl-4">
                        <div>
                          <span className="text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider">
                            AUTHORS
                          </span>
                          <p className="text-[10px] font-sf-mono text-primary/70 mt-1">{selectedPublication.authors}</p>
                        </div>
                        <div>
                          <span className="text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider">DOI</span>
                          <p className="text-[9px] font-sf-mono text-primary/50 mt-1 break-all">
                            {selectedPublication.doi}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-primary/10">
                          <a
                            href={selectedPublication.pdfLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 text-[10px] font-sf-mono px-3 py-1.5 border border-primary/30 hover:bg-primary hover:text-background transition-all duration-150"
                          >
                            <FileText className="w-3 h-3" />
                            VIEW PDF
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

        {hasMorePages && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="w-full py-3 border-b border-primary/10 text-[10px] font-sf-mono text-primary/60 hover:bg-primary/5 hover:text-primary transition-all duration-150 flex items-center justify-center gap-2"
          >
            SHOW NEXT {Math.min(ITEMS_PER_PAGE, sortedPublications.length - (currentPage + 1) * ITEMS_PER_PAGE)}
            <ChevronRight className="w-3 h-3" />
          </motion.button>
        )}

        {/* Show previous button if not on first page */}
        {currentPage > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="w-full py-2 text-[10px] font-sf-mono text-primary/40 hover:text-primary/60 transition-all duration-150"
          >
            ← PREVIOUS
          </motion.button>
        )}

        <div className="border-t border-primary/30 mt-4 pt-4 px-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <span className="block text-lg font-sf-mono font-bold text-primary">{sortedPublications.length}</span>
              <span className="text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider">PUBLICATIONS</span>
            </div>
            <div>
              <span className="block text-lg font-sf-mono font-bold text-primary">{totalCitations}</span>
              <span className="text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider">TOTAL CITATIONS</span>
            </div>
            <div>
              <span className="block text-lg font-sf-mono font-bold text-primary">{avgCitations}</span>
              <span className="text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider">AVG CITATIONS</span>
            </div>
            <div>
              <span className="block text-lg font-sf-mono font-bold text-primary">{yearRange}</span>
              <span className="text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider">YEAR RANGE</span>
            </div>
          </div>
          <div className="text-center mt-3 text-[9px] font-sf-mono text-primary/30">
            SORTED BY CITATIONS • CLICK ROW TO EXPAND
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
