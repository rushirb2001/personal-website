"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageLayout } from "@/components/layout/page-layout"
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Github,
  Terminal,
  Code2,
  Database,
  Cloud,
  Smartphone,
  Zap,
  X,
} from "lucide-react"
import { projects, categories, Project } from "./data"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiPython,
  SiPytorch,
  SiTensorflow,
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiRedis,
  SiGooglecloud,
  SiDocker,
  SiKubernetes,
  SiTailwindcss,
  SiD3Dotjs,
  SiNodedotjs,
  SiFirebase,
  SiRedux,
  SiFastapi,
  SiExpress,
  SiFlask,
  SiDjango,
  SiJavascript,
  SiJupyter,
  SiHtml5,
  SiCss3,
  SiGit,
  SiGraphql,
  SiSocketdotio,
  SiJest,
  SiJupyter,
  SiVercel,
  SiNetlify,
  SiVite,
  SiNginx,
  SiElasticsearch,
  SiApachekafka,
  SiApachespark,
  SiSqlite,
  SiSupabase,
  SiPrisma,
  SiNumpy,
  SiPandas,
  SiScikitlearn,
  SiOpenai,
  SiOpencv,
} from "react-icons/si"

const techIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  next: SiNextdotjs,
  react: SiReact,
  vite: SiVite,
  tailwind: SiTailwindcss,
  typescript: SiTypescript,
  javascript: SiJavascript,
  python: SiPython,
  html: SiHtml5,
  css: SiCss3,
  pytorch: SiPytorch,
  tensorflow: SiTensorflow,
  numpy: SiNumpy,
  pandas: SiPandas,
  sklearn: SiScikitlearn,
  scikit: SiScikitlearn,
  openai: SiOpenai,
  opencv: SiOpencv,
  postgres: SiPostgresql,
  mongo: SiMongodb,
  mysql: SiMysql,
  redis: SiRedis,
  sqlite: SiSqlite,
  supabase: SiSupabase,
  prisma: SiPrisma,
  elasticsearch: SiElasticsearch,
  gcp: SiGooglecloud,
  vercel: SiVercel,
  netlify: SiNetlify,
  docker: SiDocker,
  kubernetes: SiKubernetes,
  k8s: SiKubernetes,
  nginx: SiNginx,
  node: SiNodedotjs,
  fastapi: SiFastapi,
  express: SiExpress,
  flask: SiFlask,
  django: SiDjango,
  d3: SiD3Dotjs,
  graphql: SiGraphql,
  socket: SiSocketdotio,
  websocket: SiSocketdotio,
  kafka: SiApachekafka,
  spark: SiApachespark,
  redux: SiRedux,
  firebase: SiFirebase,
  git: SiGit,
  jest: SiJest,
  jupyter: SiJuptyer,
}

const fallbackIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  sql: Database,
  database: Database,
  cloud: Cloud,
  mobile: Smartphone,
  native: Smartphone,
  ios: Smartphone,
  android: Smartphone,
  api: Zap,
  jax: Code2,
  azure: Cloud,
  aws: Cloud,
}

const getTechIcon = (tech: string) => {
  const techLower = tech.toLowerCase()
  const iconClass = "w-4 h-4"

  const mainKey = Object.keys(techIconMap).find((key) => techLower.includes(key))
  if (mainKey) {
    const Icon = techIconMap[mainKey]
    return <Icon className={iconClass} />
  }

  const fallbackKey = Object.keys(fallbackIconMap).find((key) => techLower.includes(key))
  if (fallbackKey) {
    const Icon = fallbackIconMap[fallbackKey]
    return <Icon className={iconClass} />
  }

  return <span className="text-[8px] font-bold font-sf-mono">{tech.substring(0, 3).toUpperCase()}</span>
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "text-green-500"
    case "IN PROGRESS":
      return "text-yellow-500"
    case "ARCHIVED":
      return "text-primary/50"
    default:
      return "text-primary/70"
  }
}

const mobileLabels: Record<string, string> = {
  All: "ALL",
  "Web Development": "WEB",
  "Machine Learning": "ML",
  "Data Science": "DATA",
  Mobile: "MOBILE",
  Other: "OTHER",
}

const ITEMS_PER_PAGE_DESKTOP = 4
const ITEMS_PER_PAGE_MOBILE = 2

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [startIndex, setStartIndex] = useState(0)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const ITEMS_PER_PAGE = isMobile ? ITEMS_PER_PAGE_MOBILE : ITEMS_PER_PAGE_DESKTOP

  const filteredProjects =
    selectedCategory === "All" ? projects : projects.filter((p) => p.category === selectedCategory)

  const visibleProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  const canShowPrevious = startIndex > 0
  const canShowNext = startIndex + ITEMS_PER_PAGE < filteredProjects.length
  const showPaginationControls = filteredProjects.length > ITEMS_PER_PAGE

  useEffect(() => {
    setStartIndex(0)
  }, [selectedCategory])

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal()
      }
    }
    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [isModalOpen])

  const openModal = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 200)
  }

  return (
    <PageLayout title="PROJECTS" subtitle="PERSONAL & PROFESSIONAL WORK">
      <div className="flex flex-col gap-3">
      {/* Category Filter + Pagination Controls */}
      <div className={`flex gap-2 ${showPaginationControls ? "" : ""}`}>
        {/* Category Dropdown - Full width when no pagination, 60% with pagination */}
        <div className={`border border-primary/20 ${showPaginationControls ? "flex-[6]" : "w-full"}`}>
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-full flex items-center justify-between px-3 py-2 bg-primary/5 hover:bg-primary/10 transition-colors duration-200"
          >
            <div className="flex items-center gap-2">
              <span className="font-sf-mono text-primary/60 text-sm">FILTER</span>
              <span className="text-primary/20">|</span>
              <span className="font-sf-mono text-primary text-sm">
                SHOWING '{isMobile ? (mobileLabels[selectedCategory] || selectedCategory.toUpperCase()) : selectedCategory.toUpperCase()}'
              </span>
            </div>
            <motion.div animate={{ rotate: isCategoryOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-3 h-3 text-primary/50" />
            </motion.div>
          </button>
          <AnimatePresence>
            {isCategoryOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-primary/10"
              >
                <div className="p-3">
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category)
                          setIsCategoryOpen(false)
                        }}
                        className={`px-2 py-1 text-[9px] font-sf-mono border transition-colors duration-200 ${
                          selectedCategory === category
                            ? "bg-primary text-background border-primary"
                            : "bg-primary text-background border-primary/40 hover:bg-primary/90"
                        }`}
                      >
                        <span className="hidden md:inline text-sm">{category.toUpperCase()}</span>
                        <span className="md:hidden">{mobileLabels[category] || category.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination Controls - Only show when needed, takes 40% */}
        {showPaginationControls && (
          <div className="flex-[4] flex items-start gap-2">
            <button
              onClick={() => setStartIndex((prev) => Math.max(0, prev - ITEMS_PER_PAGE))}
              disabled={!canShowPrevious}
              className={`flex-1 h-[42px] border flex items-center justify-center transition-all duration-150 ${
                canShowPrevious
                  ? "bg-primary text-background border-primary/40 hover:bg-primary/90"
                  : "border-primary/10 text-primary/10 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setStartIndex((prev) => prev + ITEMS_PER_PAGE)}
              disabled={!canShowNext}
              className={`flex-1 h-[42px] border flex items-center justify-center transition-all duration-150 ${
                canShowNext
                  ? "bg-primary text-background border-primary/40 hover:bg-primary/90"
                  : "border-primary/10 text-primary/10 cursor-not-allowed"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Projects Grid - No Side Navigation */}
      <div className="min-h-[300px] md:min-h-[300px]">
        {visibleProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
            {visibleProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`border border-primary/20 bg-background transition-all duration-150 cursor-pointer ${
                  hoveredId === project.id ? "border-primary/40 bg-primary/5" : ""
                }`}
              >
                {/* Header - Lighter with inline tech icons */}
                <div className="border-b border-primary/20 px-3 py-2 flex items-center justify-between bg-transparent">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-3 w-3 text-primary" />
                    <span className="font-sf-mono font-bold text-primary tracking-wider text-sm">
                      {project.category.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <div
                        key={tech}
                        className="w-6 h-6 border border-primary/20 flex items-center justify-center text-primary/60 hover:bg-primary/10 hover:text-primary transition-colors"
                        title={tech}
                      >
                        {getTechIcon(tech)}
                      </div>
                    ))}
                    {project.technologies.length > 4 && (
                      <div className="w-6 h-6 border border-primary/20 flex items-center justify-center text-[8px] font-sf-mono text-primary/50">
                        +{project.technologies.length - 4}
                      </div>
                    )}
                  </div>
                </div>

                {/* Body - Content with vertical button stack */}
                <div className="flex">
                  {/* Content Area */}
                  <div className="flex-1 p-3">
                    <h3 className="font-sf-mono font-bold uppercase mb-2 tracking-wider text-base">
                      {project.title}
                    </h3>
                    <p className="font-sf-mono text-primary/60 leading-relaxed line-clamp-3 uppercase tracking-tight text-xs">
                      {project.description}
                    </p>
                  </div>

                  {/* Buttons - Vertically centered, fixed height */}
                  <div className="flex flex-col justify-center gap-2 px-3 py-3">
                    <a
                      href={project.github || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!project.github) e.preventDefault()
                      }}
                      className={`px-3 py-2 border transition-all duration-150 ${
                        project.github
                          ? "bg-primary text-background border-primary hover:bg-primary/90"
                          : "bg-primary/10 text-primary/30 border-primary/20 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <Github className="w-3 h-3" />
                        <span className="font-sf-mono text-sm">CODE</span>
                      </div>
                    </a>

                    <button
                      onClick={() => openModal(project)}
                      className="px-3 py-2 border bg-primary text-background border-primary hover:bg-primary/90 transition-all duration-150"
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <ChevronRight className="w-3 h-3" />
                        <span className="font-sf-mono text-sm">VIEW</span>
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[300px] md:min-h-[300px]">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary/50" />
              <p className="text-xs font-sf-mono text-primary/50">CHECK BACK AGAIN SOON, MORE PROJECTS TO COME...</p>
            </div>
          </div>
        )}
      </div>

        {/* Footer Stats */}
        <motion.div
          className="flex items-center justify-between border-t border-primary/20 pt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3 }}
        >
          <div className="flex gap-1 sm:gap-2 text-[9px] sm:text-[10px] font-sf-mono text-primary/40 uppercase tracking-wider">
            <span className="text-sm">{projects.length} {isMobile ? "PROJ" : "PROJECTS"}</span>
            <span className="text-primary/20">/</span>
            <span className="text-sm">{categories.length - 1} {isMobile ? "CAT" : "CATEGORIES"}</span>
            <span className="text-primary/20">/</span>
            <span className="text-sm">{filteredProjects.length} {isMobile ? "SHOWN" : "FILTERED"}</span>
          </div>
          {showPaginationControls && (
            <span className="text-[9px] sm:text-[10px] font-sf-mono text-primary/30">
              {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredProjects.length)} OF {filteredProjects.length}
            </span>
          )}
          {!showPaginationControls && (
            <div className="text-[9px] sm:text-[10px] font-sf-mono text-primary/30"><span className="text-sm">LAST.UPDATED: 2025</span></div>
          )}
        </motion.div>
      </div>

      {/* Modal - Wide Horizontal Layout */}
      <AnimatePresence>
        {isModalOpen && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 md:p-6"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-5xl bg-background border border-primary/30 shadow-lg max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="border-b border-primary/20 px-3 md:px-4 py-2 md:py-3 flex justify-between items-center bg-primary/5">
                <div className="flex items-center gap-2">
                  <Terminal className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  <span className="text-[10px] md:text-sm font-sf-mono font-bold uppercase tracking-wider text-primary line-clamp-1">
                    {selectedProject.title}
                  </span>
                </div>
                <button
                  onClick={closeModal}
                  className="bg-primary text-background border border-primary/40 hover:bg-primary/90 transition-all duration-200 font-sf-mono flex items-center justify-center w-7 h-7 md:w-auto md:px-2 md:py-1"
                >
                  <span className="hidden md:inline text-[10px]">ESC</span>
                  <X className="w-3 h-3 md:hidden" />
                </button>
              </div>

              {/* Content - Single Column */}
              <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-4 md:space-y-5">
                {/* Description */}
                <div>
                  <div className="flex items-center gap-2 mb-2 md:mb-3 pb-2 border-b border-primary/10">
                    <div className="w-5 h-5 border border-primary/30 bg-primary/10 flex items-center justify-center text-[10px] font-sf-mono text-primary/70">
                      01
                    </div>
                    <span className="text-[9px] md:text-[10px] font-sf-mono text-primary/50 uppercase tracking-wider">
                      DESCRIPTION
                    </span>
                  </div>
                  <p className="text-[10px] md:text-[11px] font-sf-mono text-primary/70 leading-relaxed">
                    {selectedProject.fullDescription}
                  </p>
                </div>

                {/* Highlights */}
                <div>
                  <div className="flex items-center gap-2 mb-2 md:mb-3 pb-2 border-b border-primary/10">
                    <div className="w-5 h-5 border border-primary/30 bg-primary/10 flex items-center justify-center text-[10px] font-sf-mono text-primary/70">
                      02
                    </div>
                    <span className="text-[9px] md:text-[10px] font-sf-mono text-primary/50 uppercase tracking-wider">
                      KEY HIGHLIGHTS
                    </span>
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    {selectedProject.highlights.map((highlight, i) => (
                      <div key={i} className="flex gap-2">
                        <div className="w-5 h-5 border border-primary/20 bg-primary/5 flex items-center justify-center text-[9px] font-sf-mono text-primary/60 flex-shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-[10px] md:text-[11px] font-sf-mono text-primary/70 leading-relaxed">
                          {highlight}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer - Proper Alignment */}
              <div className="border-t border-primary/20 px-3 md:px-4 py-2 md:py-3 bg-primary/5">
                {/* Desktop Layout - Single Row */}
                <div className="hidden md:flex items-center justify-between gap-3">
                  {/* Technologies - Left */}
                  <div className="flex items-center gap-2 flex-wrap flex-1">
                    <span className="text-[9px] font-sf-mono text-primary/50 uppercase tracking-wider">
                      TECH STACK:
                    </span>
                    {selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[9px] font-sf-mono border border-primary/20 bg-background text-primary/70 px-2 py-1 hover:bg-primary hover:text-background transition-colors"
                      >
                        {tech.toUpperCase()}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons - Right */}
                  {(selectedProject.github || selectedProject.demo) && (
                    <div className="flex gap-2 flex-shrink-0">
                      {selectedProject.github && (
                        <a
                          href={selectedProject.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[10px] font-sf-mono border border-primary bg-primary text-background hover:bg-primary/90 transition-all duration-150 px-4 py-2"
                        >
                          <Github className="h-3 w-3" />
                          <span>SOURCE</span>
                        </a>
                      )}
                      {selectedProject.demo && (
                        <a
                          href={selectedProject.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[10px] font-sf-mono border border-primary bg-primary text-background hover:bg-primary/90 transition-all duration-150 px-4 py-2"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>DEMO</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Mobile Layout - Single Row */}
                <div className="flex md:hidden items-center justify-between">
                  {/* Tech Icons - Left */}
                  <div className="flex gap-1 flex-wrap">
                    {selectedProject.technologies.slice(0, 5).map((tech) => (
                      <div
                        key={tech}
                        className="w-7 h-7 border border-primary bg-primary text-background flex items-center justify-center hover:bg-primary/90 transition-colors"
                        title={tech}
                      >
                        {getTechIcon(tech)}
                      </div>
                    ))}
                    {selectedProject.technologies.length > 5 && (
                      <div className="w-7 h-7 border border-primary bg-primary text-background flex items-center justify-center text-[8px] font-sf-mono">
                        +{selectedProject.technologies.length - 5}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons - Right */}
                  {(selectedProject.github || selectedProject.demo) && (
                    <div className="flex gap-2 flex-shrink-0">
                      {selectedProject.github && (
                        <a
                          href={selectedProject.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-7 border border-primary bg-primary text-background hover:bg-primary/90 transition-all duration-150 flex items-center justify-center"
                        >
                          <Github className="h-3 w-3" />
                        </a>
                      )}
                      {selectedProject.demo && (
                        <a
                          href={selectedProject.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-7 border border-primary bg-primary text-background hover:bg-primary/90 transition-all duration-150 flex items-center justify-center"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  )
}
