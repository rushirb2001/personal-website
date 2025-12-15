"use client"

import {
  ArrowRight,
  Linkedin,
  Github,
  FileText,
  Mail,
  MapPin,
  Calendar,
  Award,
  Briefcase,
  GraduationCap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useNavigation } from "@/contexts/navigation-context"
import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ResumeModal } from "@/components/features/resume/resume-modal"
import Link from "next/link"
import Image from "next/image"

export default function BrutalistSplitHome() {
  const { navigateTo } = useNavigation()
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)

  return (
    <>
      <Header />
      <Footer />

      <div className="fixed top-[60px] bottom-[60px] left-0 right-0 overflow-y-auto">
        <div className="min-h-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-3 sm:gap-4 md:gap-6 lg:gap-8 h-full">
            {/* Left Column - Sticky Sidebar */}
            <motion.div
              className="lg:sticky lg:top-4 self-start flex flex-col gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Title Block */}
              <div className="border-2 border-primary">
                <div className="bg-primary text-background px-4 py-2 font-sf-mono text-[10px] tracking-widest flex justify-between">
                  <span>[00] IDENTITY</span>
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-400 animate-pulse" />
                    OPEN TO WORK
                  </span>
                </div>
                <div className="p-4">
                  <h1 className="font-black text-3xl md:text-4xl tracking-tighter leading-none">
                    RUSHIR
                    <br />
                    BHAVSAR
                  </h1>
                  <div className="h-[3px] w-16 bg-primary mt-3 mb-2" />
                  <p className="font-sf-mono text-[9px] tracking-[0.2em] text-primary/60">
                    DATA SCIENTIST / AI ENGINEER
                  </p>
                </div>
              </div>

              {/* Photo Block */}
              <div className="border-2 border-primary">
                <div className="relative aspect-square">
                  <Image
                    src="/images/design-mode/new_personal_photo(1).png"
                    alt="Profile"
                    fill
                    className="object-cover grayscale contrast-110"
                  />
                </div>
                <div className="bg-primary/5 px-4 py-3 font-sf-mono text-[9px] tracking-widest text-primary/60 flex items-center justify-between border-t-2 border-primary">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    BOSTON, MA
                  </span>
                  <span>EST. 2001</span>
                </div>
              </div>

              {/* Contact Links */}
              <div className="border-2 border-primary">
                <div className="grid grid-cols-2">
                  <Link
                    href="https://github.com/rushirb2001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 flex items-center justify-center gap-2 border-r-2 border-primary hover:bg-primary hover:text-background transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    <span className="font-sf-mono text-[9px] tracking-wider">GITHUB</span>
                  </Link>
                  <Link
                    href="https://linkedin.com/in/rushir-bhavsar/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 flex items-center justify-center gap-2 hover:bg-primary hover:text-background transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span className="font-sf-mono text-[9px] tracking-wider">LINKEDIN</span>
                  </Link>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="border-2 border-primary">
                <Button
                  className="w-full h-12 rounded-none bg-primary text-background hover:bg-primary/90 font-black text-xs tracking-wider"
                  onClick={() => navigateTo("/contact")}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  GET IN TOUCH
                </Button>
              </div>
            </motion.div>

            {/* Right Column - Content */}
            <motion.div
              className="flex flex-col gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {/* Stats Row */}
              <div className="border-2 border-primary">
                <div className="bg-primary text-background px-4 py-2 font-sf-mono text-[10px] tracking-widest">
                  [01] METRICS
                </div>
                <div className="grid grid-cols-4">
                  <div className="p-4 border-r-2 border-primary text-center">
                    <div className="font-black text-2xl md:text-3xl">15+</div>
                    <div className="font-sf-mono text-[8px] tracking-widest text-primary/50 mt-1">PROJECTS</div>
                  </div>
                  <div className="p-4 border-r-2 border-primary text-center">
                    <div className="font-black text-2xl md:text-3xl">3+</div>
                    <div className="font-sf-mono text-[8px] tracking-widest text-primary/50 mt-1">PAPERS</div>
                  </div>
                  <div className="p-4 border-r-2 border-primary text-center">
                    <div className="font-black text-2xl md:text-3xl">2+</div>
                    <div className="font-sf-mono text-[8px] tracking-widest text-primary/50 mt-1">YRS EXP</div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="font-black text-2xl md:text-3xl">70+</div>
                    <div className="font-sf-mono text-[8px] tracking-widest text-primary/50 mt-1">TECH STACK</div>
                  </div>
                </div>
              </div>

              {/* About Block */}
              <div className="border-2 border-primary">
                <div className="bg-primary text-background px-4 py-2 font-sf-mono text-[10px] tracking-widest">
                  [02] ABOUT
                </div>
                <div className="p-4 md:p-6">
                  <p className="font-mono text-xs md:text-sm leading-relaxed text-primary/80">
                    Data Scientist and AI Engineer specializing in machine learning, deep learning, and AI systems
                    development. Creating innovative solutions using cutting-edge AI technologies with experience across
                    healthcare, astronomy, and enterprise AI domains.
                  </p>
                  <div className="h-[2px] w-full bg-primary/10 my-4" />
                  <p className="font-mono text-xs md:text-sm leading-relaxed text-primary/80">
                    Currently pursuing Master's in Data Science at Northeastern University. Previously worked on
                    large-scale ML systems at Chegg and contributed to impactful research in medical imaging and
                    astronomical analysis.
                  </p>
                </div>
              </div>

              {/* Two Column Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Experience Snapshot */}
                <div className="border-2 border-primary flex flex-col">
                  <div className="bg-primary text-background px-4 py-2 font-sf-mono text-[10px] tracking-widest flex items-center gap-2">
                    <Briefcase className="w-3 h-3" />
                    [03] EXPERIENCE
                  </div>
                  <div className="flex-1 p-4 flex flex-col gap-3">
                    <div className="border-l-2 border-primary pl-3">
                      <div className="font-black text-xs tracking-wide">CHEGG INC.</div>
                      <div className="font-sf-mono text-[9px] text-primary/60 mt-0.5">DATA SCIENTIST</div>
                      <div className="font-sf-mono text-[8px] text-primary/40 mt-1">JAN 2023 — AUG 2023</div>
                    </div>
                    <div className="border-l-2 border-primary/40 pl-3">
                      <div className="font-black text-xs tracking-wide">REC COLLEGE</div>
                      <div className="font-sf-mono text-[9px] text-primary/60 mt-0.5">AI RESEARCH ASSISTANT</div>
                      <div className="font-sf-mono text-[8px] text-primary/40 mt-1">JUN 2021 — MAY 2023</div>
                    </div>
                  </div>
                  <div className="border-t-2 border-primary">
                    <button
                      className="w-full p-3 font-sf-mono text-[9px] tracking-widest hover:bg-primary hover:text-background transition-colors flex items-center justify-center gap-2"
                      onClick={() => navigateTo("/experience")}
                    >
                      VIEW ALL EXPERIENCE
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Education Snapshot */}
                <div className="border-2 border-primary flex flex-col">
                  <div className="bg-primary text-background px-4 py-2 font-sf-mono text-[10px] tracking-widest flex items-center gap-2">
                    <GraduationCap className="w-3 h-3" />
                    [04] EDUCATION
                  </div>
                  <div className="flex-1 p-4 flex flex-col gap-3">
                    <div className="border-l-2 border-primary pl-3">
                      <div className="font-black text-xs tracking-wide">NORTHEASTERN UNIV.</div>
                      <div className="font-sf-mono text-[9px] text-primary/60 mt-0.5">M.S. DATA SCIENCE</div>
                      <div className="font-sf-mono text-[8px] text-primary/40 mt-1">2023 — 2025</div>
                    </div>
                    <div className="border-l-2 border-primary/40 pl-3">
                      <div className="font-black text-xs tracking-wide">SAVITRIBAI PHULE PUNE</div>
                      <div className="font-sf-mono text-[9px] text-primary/60 mt-0.5">B.E. COMPUTER ENGINEERING</div>
                      <div className="font-sf-mono text-[8px] text-primary/40 mt-1">2019 — 2023</div>
                    </div>
                  </div>
                  <div className="border-t-2 border-primary">
                    <button
                      className="w-full p-3 font-sf-mono text-[9px] tracking-widest hover:bg-primary hover:text-background transition-colors flex items-center justify-center gap-2"
                      onClick={() => navigateTo("/education")}
                    >
                      VIEW ALL EDUCATION
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div className="border-2 border-primary">
                <div className="bg-primary text-background px-4 py-2 font-sf-mono text-[10px] tracking-widest flex items-center gap-2">
                  <Award className="w-3 h-3" />
                  [05] SPECIALIZATIONS
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {[
                      "LARGE LANGUAGE MODELS",
                      "COMPUTER VISION",
                      "MLOps",
                      "RAG SYSTEMS",
                      "TRANSFORMERS",
                      "DEEP LEARNING",
                      "NLP",
                      "DISTRIBUTED SYSTEMS",
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 border-2 border-primary font-sf-mono text-[9px] tracking-wider hover:bg-primary hover:text-background transition-colors cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Featured Project */}
              <div className="border-2 border-primary">
                <div className="bg-primary text-background px-4 py-2 font-sf-mono text-[10px] tracking-widest flex justify-between items-center">
                  <span>[06] FEATURED PROJECT</span>
                  <span className="text-primary-foreground/60">LATEST</span>
                </div>
                <div className="p-4 md:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-black text-sm md:text-base tracking-wide">
                        RAG PIPELINE FOR ENTERPRISE SEARCH
                      </h3>
                      <p className="font-mono text-[10px] md:text-xs text-primary/70 mt-2 leading-relaxed">
                        Built a production-grade retrieval-augmented generation system handling 10K+ documents with
                        sub-second query latency using LangChain, ChromaDB, and GPT-4.
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {["LANGCHAIN", "CHROMADB", "GPT-4", "FASTAPI"].map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 bg-primary/5 border border-primary/20 font-sf-mono text-[8px] tracking-wider"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t-2 border-primary">
                  <button
                    className="w-full p-3 font-sf-mono text-[9px] tracking-widest hover:bg-primary hover:text-background transition-colors flex items-center justify-center gap-2"
                    onClick={() => navigateTo("/projects")}
                  >
                    VIEW ALL PROJECTS
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Action Row */}
              <div className="border-2 border-primary grid grid-cols-2">
                <Button
                  className="h-14 rounded-none bg-primary text-background hover:bg-primary/90 font-black text-xs tracking-wider border-r border-primary/50"
                  onClick={() => navigateTo("/projects")}
                >
                  EXPLORE WORK
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <button
                  className="h-14 bg-transparent text-primary hover:bg-primary hover:text-background font-black text-xs tracking-wider transition-colors flex items-center justify-center gap-2"
                  onClick={() => setIsResumeModalOpen(true)}
                >
                  <FileText className="h-4 w-4" />
                  VIEW RESUME
                </button>
              </div>

              {/* Footer Info */}
              <div className="border-2 border-primary bg-primary/5 px-4 py-2 flex justify-between items-center">
                <div className="font-sf-mono text-[8px] text-primary/40 tracking-widest flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  UPDATED DEC 2025
                </div>
                <div className="font-sf-mono text-[8px] text-primary/40 tracking-widest">MINIMAL BRUTALISM v2.0</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </>
  )
}
