"use client"

import { useState, useEffect } from "react"
import { PageLayout } from "@/components/layout/page-layout"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, ChevronRight } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

// Define the publication type
interface Publication {
  id: string
  title: string
  venue: string
  authors: string
  abstract: string
  year: string
  month: string
  status: "RELEASED" | "PENDING" | "RESTRICTED"
  classification: "PUBLIC" | "CONFIDENTIAL"
  doi: string
  projectRef: string
  reviewedBy: string
  dataSize: string
  pdfLink: string
}

export default function PublicationsPage() {
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"details" | "metadata">("details")
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Publications data
  const publications: Publication[] = [
    {
      id: "PRJ-6O-437",
      title: "DEEP ENSEMBLE MAMMOGRAM CLASSIFICATION USING ONE-SHOT SEGMENTATION",
      venue: "NIRMA UNIVERSITY CONFERENCE",
      authors: "R. BHAVSAR, S. PATEL, A. SHAH",
      abstract:
        "This study presents a novel approach to mammogram classification through deep ensemble learning and one-shot segmentation techniques. By aggregating over 7,000 images from 7 distinct sources and applying panoptic annotation with semantic segmentation, we achieved a 23% improvement in cancerous mammogram classification accuracy over baseline methods, reaching 81% accuracy. The methodology combines ResNet, U-Net, EfficientNet, and MobileNet architectures with one-shot transfer learning and Tree-based Boosting Ensembling.",
      year: "2022",
      month: "06",
      status: "RELEASED",
      classification: "PUBLIC",
      doi: "10.1234/NU.2022.437",
      projectRef: "MED-AI-1872",
      reviewedBy: "PEER-COMMITTEE",
      dataSize: "12.8MB",
      pdfLink: "#",
    },
    {
      id: "PUB-7P-546",
      title: "CLASSIFICATION OF POTENTIALLY HAZARDOUS ASTEROIDS USING SUPERVISED QUANTUM MACHINE LEARNING",
      venue: "IEEE ACCESS",
      authors: "R. BHAVSAR, N. K. JADAV, U. BODKHE, R. GUPTA, S. TANWAR, G. SHARMA, P. N. BOKORO, R. SHARMA",
      abstract:
        "Quantum computing (QC) and quantum machine learning (QML) are emerging technologies with the potential to revolutionize the way we approach complex problems in mathematics, physics, and other fields. The increasing availability of data and computing power has led to a rise in using Artificial Intelligence (AI) to solve real-time problems. In space science, employing AI-based approaches to address various challenges, including the potential risks posed by asteroids, is becoming increasingly necessary. This research explores the application of Quantum Machine Learning (QML) for asteroid hazard classification, achieving significant improvements in computational efficiency and classification accuracy.",
      year: "2023",
      month: "07",
      status: "RELEASED",
      classification: "PUBLIC",
      doi: "10.1109/ACCESS.2023.3294576",
      projectRef: "QC-AST-2213",
      reviewedBy: "IEEE EDITORIAL BOARD",
      dataSize: "7.3MB",
      pdfLink: "#",
    },
    {
      id: "PUB-8Q-655",
      title: "METAHATE: AI-BASED HATE SPEECH DETECTION FOR SECURED ONLINE GAMING IN METAVERSE USING BLOCKCHAIN",
      venue: "SECURITY AND PRIVACY",
      authors:
        "H. SANGHVI, R. BHAVSAR, V. HUNDLANI, L. GOHIL, T. VYAS, A. NAIR, S. DESAI, N. K. JADAV, S. TANWAR, R. SHARMA, N. YAMSANI",
      abstract:
        "The emergence of Web 3.0, blockchain technology (BC), and artificial intelligence (AI) are transforming multiplayer online gaming in the metaverse. This development has its concerns about safety and inclusivity. Hate speech, in particular, poses a significant threat to the harmony of these online communities. This article proposes a novel framework, MetaHate, that employs AI and BC to detect and combat hate speech in online gaming environments within the metaverse. Various machine learning (ML) models are applied to analyze Hindi–English code mixed datasets, with gradient boosting proving the most effective, achieving 86.01% accuracy.",
      year: "2024",
      month: "03",
      status: "RELEASED",
      classification: "PUBLIC",
      doi: "10.1002/SPY2.343",
      projectRef: "NLP-META-3341",
      reviewedBy: "WILEY EDITORIAL BOARD",
      dataSize: "5.2MB",
      pdfLink: "#",
    },
    {
      id: "PUB-9R-764",
      title: "MACE-PINNS: MULTI-NETWORK DRIVEN DECOUPLING OF INTERDEPENDENT PHYSICS IN COUPLED PDE SYSTEMS",
      venue: "ARIZONA STATE UNIVERSITY DISSERTATIONS & THESES",
      authors: "R. BHAVSAR",
      abstract:
        "Physics-Informed Neural Networks (PINNs) provide an innovative framework for solving complex nonlinear Partial Differential Equations (PDEs) by embedding the governing equations directly into neural networks. To address challenges with standard PINNs, the Multi-network Architecture for Coupled Equations Physics-Informed Neural Networks (MACE-PINNs) is introduced. This approach employs parallel subnetworks to independently approximate coupled variables, interconnected via iterative residual constraints. Experimental results demonstrate robust pattern reproduction spanning 5 parametric variations for each RDS, with L2 errors ranging from 10−3 to 10−2.",
      year: "2025",
      month: "01",
      status: "PENDING",
      classification: "PUBLIC",
      doi: "10.48550/DISSERTATION.31994438",
      projectRef: "AI-PDE-4127",
      reviewedBy: "DISSERTATION COMMITTEE",
      dataSize: "18.6MB",
      pdfLink: "#",
    },
  ]

  // Open modal with selected publication
  const openDossier = (publication: Publication) => {
    setSelectedPublication(publication)
    setIsModalOpen(true)
    setActiveTab("details") // Reset to details tab when opening
  }

  // Close modal
  const closeDossier = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedPublication(null), 300) // Clear after animation
  }

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) {
        closeDossier()
      }
    }

    // Add event listener
    document.addEventListener("keydown", handleEscKey)

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isModalOpen]) // Re-add listener if modal state changes

  // Format date as YYYY.MM
  const formatDate = (year: string, month: string) => {
    return `${year}.${month.padStart(2, "0")}`
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "RELEASED":
        return "text-green-500"
      case "PENDING":
        return "text-yellow-500"
      case "RESTRICTED":
        return "text-red-500"
      default:
        return "text-primary/70"
    }
  }

  return (
    <PageLayout title="CASE DOSSIERS" subtitle="RESEARCH PUBLICATIONS">
      <div className="space-y-6">
        {/* Dossier index cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {publications.map((pub) => (
            <div
              key={pub.id}
              onClick={() => openDossier(pub)}
              className="relative h-52 cursor-pointer group transition-all duration-200 hover:-translate-y-1"
            >
              {/* Folder tab */}
              <div className="absolute top-0 left-[10%] right-[10%] h-8 bg-secondary dark:bg-eerie-darkgray border-t border-l border-r border-primary/40 rounded-t-md z-10 flex items-center justify-center shadow-sm">
                <div className="text-xs font-sf-mono text-primary/70">[ CASE: {pub.id} ]</div>
              </div>

              {/* Folder body */}
              <div className="absolute top-8 inset-x-0 bottom-0 bg-secondary/90 dark:bg-eerie-darkgray/90 border border-primary/40 rounded-b-md rounded-tr-md shadow-md transition-all duration-200 group-hover:shadow-lg">
                {/* Folder content */}
                <div className="p-4 h-full flex flex-col">
                  <div className="flex-grow space-y-3 mb-3 mt-1">
                    {/* Title */}
                    <h3 className="text-sm font-sf-mono font-medium truncate">{pub.title}</h3>

                    {/* Venue */}
                    <div className="flex items-center text-xs">
                      <FileText className="h-3 w-3 mr-2 text-primary/50" />
                      <span className="truncate">{pub.venue}</span>
                    </div>

                    {/* Date */}
                    <div className="text-xs font-sf-mono text-primary/60">{formatDate(pub.year, pub.month)}</div>
                  </div>

                  {/* Folder footer */}
                  <div className="border-t border-primary/20 pt-2 mt-auto">
                    <div className="text-xs flex items-center text-primary/60 group-hover:text-primary/80 transition-colors animate-mechanical-pulse">
                      <ChevronRight className="h-3 w-3 mr-1" />
                      <span className="font-sf-mono tracking-wide text-[0.65rem]">VIEW DOSSIER</span>
                    </div>

                    <div className="flex justify-between items-center mt-1">
                      <div className={`text-[0.6rem] font-sf-mono ${getStatusColor(pub.status)}`}>
                        STATUS: {pub.status}
                      </div>
                      <div className="text-[0.6rem] font-sf-mono text-primary/30">{pub.classification}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs text-primary/30 font-sf-mono text-center mt-8">
          DOSSIER ACCESS LEVEL: AUTHORIZED PERSONNEL ONLY
        </div>
      </div>

      {/* Full dossier modal - Desktop version */}
      <AnimatePresence>
        {isModalOpen && selectedPublication && !isMobile && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={closeDossier}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-4xl bg-background dark:bg-eerie-black border border-primary/30 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Dossier header */}
              <div className="dark:bg-primary/10 bg-white px-4 py-3 flex justify-between items-center border-b border-primary/30">
                <div className="flex items-center">
                  <span className="text-sm font-sf-mono text-primary/70">[ CASE: {selectedPublication.id} ]</span>
                </div>
                <div className="flex items-center space-x-6">
                  <span className="text-sm font-sf-mono text-primary/70">
                    CLASS: {selectedPublication.classification}
                  </span>
                  <span className="text-sm font-sf-mono text-primary/70">
                    DATE: {formatDate(selectedPublication.year, selectedPublication.month)}
                  </span>
                </div>
                <button
                  onClick={closeDossier}
                  className="text-primary/70 hover:text-primary transition-colors ml-4 font-sf-mono text-xs"
                  aria-label="Close"
                >
                  [ CLOSE ]
                </button>
              </div>

              {/* Dossier content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
                  {/* Main content */}
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-sf-mono text-primary/50 mb-1">TITLE:</div>
                      <h2 className="text-lg font-medium">{selectedPublication.title}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-sf-mono text-primary/50 mb-1">VENUE:</div>
                        <p className="text-sm">{selectedPublication.venue}</p>
                      </div>

                      <div>
                        <div className="text-xs font-sf-mono text-primary/50 mb-1">AUTHORS:</div>
                        <p className="text-sm">{selectedPublication.authors}</p>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-sf-mono text-primary/50 mb-1">ABSTRACT:</div>
                      <p className="text-xs font-sf-mono leading-relaxed border-l-2 border-primary/20 pl-3 py-1">
                        {selectedPublication.abstract}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div>
                        <div className="text-xs font-sf-mono text-primary/50 mb-1">DOI:</div>
                        <p className="text-xs font-sf-mono">{selectedPublication.doi}</p>
                      </div>

                      <div>
                        <div className="text-xs font-sf-mono text-primary/50 mb-1">STATUS:</div>
                        <p className={`text-xs font-sf-mono ${getStatusColor(selectedPublication.status)}`}>
                          {selectedPublication.status}
                        </p>
                      </div>

                      <div>
                        <div className="text-xs font-sf-mono text-primary/50 mb-1">FILE ACCESS:</div>
                        <div className="flex space-x-2">
                          <a
                            href={selectedPublication.pdfLink}
                            className="flex items-center text-xs font-sf-mono text-primary/70 hover:text-primary border border-primary/30 px-2 py-1 transition-colors"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            VIEW PDF
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metadata sidebar */}
                  <div className="border-l border-primary/20 pl-6 space-y-4">
                    <div className="text-sm font-medium mb-2">METADATA</div>

                    <div>
                      <div className="text-xs font-sf-mono text-primary/50 mb-1">PROJECT REF:</div>
                      <p className="text-xs font-sf-mono">{selectedPublication.projectRef}</p>
                    </div>

                    <div>
                      <div className="text-xs font-sf-mono text-primary/50 mb-1">REVIEWED BY:</div>
                      <p className="text-xs font-sf-mono">{selectedPublication.reviewedBy}</p>
                    </div>

                    <div>
                      <div className="text-xs font-sf-mono text-primary/50 mb-1">DATA SIZE:</div>
                      <p className="text-xs font-sf-mono">{selectedPublication.dataSize}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-primary/20">
                      <div className="text-xs font-sf-mono text-primary/40 flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-mechanical-pulse"></div>
                        DOSSIER VERIFIED
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dossier footer */}
              <div className="border-t border-primary/20 p-4 bg-primary/5 flex justify-between items-center">
                <div className="text-xs font-sf-mono text-primary/50">
                  SECURITY CLEARANCE: LEVEL {Math.floor(Math.random() * 5) + 1}
                </div>
                <div className="text-xs font-sf-mono text-primary/50">
                  ACCESS LOGGED: {new Date().toISOString().split("T")[0].replace(/-/g, ".")}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Mobile-specific compact modal */}
        {isModalOpen && selectedPublication && isMobile && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
            onClick={closeDossier}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-[90%] max-h-[70vh] mx-auto bg-background dark:bg-eerie-black border border-primary/30 shadow-lg rounded-md flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile header */}
              <div className="bg-primary/10 px-3 py-2 flex justify-between items-center border-b border-primary/30">
                <div className="flex items-center">
                  <span className="text-xs font-sf-mono text-primary/70">[ {selectedPublication.id} ]</span>
                </div>
                <button
                  onClick={closeDossier}
                  className="text-primary/70 hover:text-primary transition-colors font-sf-mono text-xs"
                  aria-label="Close"
                >
                  [ CLOSE ]
                </button>
              </div>

              {/* Mobile title */}
              <div className="px-3 py-2 border-b border-primary/20">
                <h2 className="text-sm font-medium font-sf-mono truncate">{selectedPublication.title}</h2>
                <div className="flex justify-between items-center mt-1">
                  <div className={`text-[0.65rem] font-sf-mono ${getStatusColor(selectedPublication.status)}`}>
                    {selectedPublication.status}
                  </div>
                  <div className="text-[0.65rem] font-sf-mono text-primary/60">
                    {formatDate(selectedPublication.year, selectedPublication.month)}
                  </div>
                </div>
              </div>

              {/* Mobile tabs */}
              <div className="flex border-b border-primary/20">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`flex-1 py-2 text-xs font-sf-mono ${
                    activeTab === "details" ? "bg-primary/10 text-primary" : "text-primary/60"
                  }`}
                >
                  DETAILS
                </button>
                <button
                  onClick={() => setActiveTab("metadata")}
                  className={`flex-1 py-2 text-xs font-sf-mono ${
                    activeTab === "metadata" ? "bg-primary/10 text-primary" : "text-primary/60"
                  }`}
                >
                  METADATA
                </button>
              </div>

              {/* Mobile content - scrollable */}
              <div className="flex-1 overflow-y-auto">
                {activeTab === "details" ? (
                  <div className="p-3 space-y-3">
                    <div>
                      <div className="text-[0.65rem] font-sf-mono text-primary/50 mb-1">VENUE:</div>
                      <p className="text-xs">{selectedPublication.venue}</p>
                    </div>

                    <div>
                      <div className="text-[0.65rem] font-sf-mono text-primary/50 mb-1">AUTHORS:</div>
                      <p className="text-xs">{selectedPublication.authors}</p>
                    </div>

                    <div>
                      <div className="text-[0.65rem] font-sf-mono text-primary/50 mb-1">ABSTRACT:</div>
                      <p className="text-[0.65rem] font-sf-mono leading-relaxed border-l border-primary/20 pl-2 py-1">
                        {selectedPublication.abstract}
                      </p>
                    </div>

                    <div>
                      <div className="text-[0.65rem] font-sf-mono text-primary/50 mb-1">DOI:</div>
                      <p className="text-[0.65rem] font-sf-mono break-all">{selectedPublication.doi}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 space-y-3">
                    <div>
                      <div className="text-[0.65rem] font-sf-mono text-primary/50 mb-1">PROJECT REF:</div>
                      <p className="text-[0.65rem] font-sf-mono">{selectedPublication.projectRef}</p>
                    </div>

                    <div>
                      <div className="text-[0.65rem] font-sf-mono text-primary/50 mb-1">REVIEWED BY:</div>
                      <p className="text-[0.65rem] font-sf-mono">{selectedPublication.reviewedBy}</p>
                    </div>

                    <div>
                      <div className="text-[0.65rem] font-sf-mono text-primary/50 mb-1">DATA SIZE:</div>
                      <p className="text-[0.65rem] font-sf-mono">{selectedPublication.dataSize}</p>
                    </div>

                    <div>
                      <div className="text-[0.65rem] font-sf-mono text-primary/50 mb-1">CLASSIFICATION:</div>
                      <p className="text-[0.65rem] font-sf-mono">{selectedPublication.classification}</p>
                    </div>

                    <div className="pt-2 mt-2 border-t border-primary/20">
                      <div className="text-[0.65rem] font-sf-mono text-primary/40 flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-mechanical-pulse"></div>
                        DOSSIER VERIFIED
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile footer */}
              <div className="border-t border-primary/20 p-3 bg-primary/5">
                <a
                  href={selectedPublication.pdfLink}
                  className="flex items-center justify-center w-full text-xs font-sf-mono text-primary/70 hover:text-primary border border-primary/30 py-1.5 transition-colors"
                >
                  <FileText className="h-3 w-3 mr-1.5" />
                  VIEW DOCUMENT
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  )
}
