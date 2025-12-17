"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageLayout } from "@/components/layout/page-layout"
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Terminal,
  Code2,
  Database,
  Cloud,
  Smartphone,
  Zap,
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
  SiHtml5,
  SiCss3,
  SiGit,
  SiGraphql,
  SiSocketdotio,
  SiJest,
  SiVercel,
  SiNetlify,
  SiVite,
  SiNginx,
  SiElasticsearch,
  SiApachekafka,
  SiSqlite,
  SiSupabase,
  SiPrisma,
  SiNumpy,
  SiPandas,
  SiScikitlearn,
  SiOpenai,
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
  redux: SiRedux,
  firebase: SiFirebase,
  git: SiGit,
  jest: SiJest,
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

const ITEMS_PER_PAGE = 4

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [startIndex, setStartIndex] = useState(0)
  const isMobile = useMediaQuery("(max-width: 768px)")

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
        {/* Category Filter */}
        <div className="flex flex-wrap gap-1.5 justify-center py-2 border-b border-primary/20">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-[10px] font-sf-mono px-2 py-1 border transition-all duration-150 ${
                selectedCategory === category
                  ? "bg-primary text-background border-primary"
                  : "bg-transparent border-primary/20 text-primary/60 hover:border-primary/40 hover:text-primary"
              }`}
            >
              <span className="hidden md:inline">{category.toUpperCase()}</span>
              <span className="md:hidden">{mobileLabels[category] || category.toUpperCase()}</span>
            </button>
          ))}
        </div>

        {/* Projects Grid with Side Navigation */}
        <div className="flex items-center gap-2">
          {/* Left Arrow */}
          {showPaginationControls && (
            <button
              onClick={() => setStartIndex((prev) => Math.max(0, prev - ITEMS_PER_PAGE))}
              disabled={!canShowPrevious}
              className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 border flex items-center justify-center transition-all duration-150 ${
                canShowPrevious
                  ? "border-primary/30 text-primary/70 hover:bg-primary/10 hover:border-primary/50"
                  : "border-primary/10 text-primary/10 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Grid Container - Fixed Height */}
          <div className="flex-1 min-h-[360px] md:min-h-[360px]">
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
                    {/* Header - Lighter with inline tags */}
                    <div className="border-b border-primary/20 px-3 py-2 flex items-center justify-between bg-transparent">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-3 w-3 text-primary" />
                        <span className="text-[10px] font-sf-mono font-bold text-primary tracking-wider">
                          {project.category.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-[9px] font-sf-mono border border-primary/20 text-primary/60 px-1.5 py-0.5"
                          >
                            {tech.toUpperCase()}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-[9px] font-sf-mono border border-primary/20 text-primary/50 px-1.5 py-0.5">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Body - Content with vertical button stack */}
                    <div className="flex">
                      {/* Content Area */}
                      <div className="flex-1 p-3">
                        <h3 className="text-xs font-sf-mono font-bold uppercase mb-2 tracking-wider">
                          {project.title}
                        </h3>
                        <p className="text-[10px] font-sf-mono text-primary/60 leading-relaxed line-clamp-3 uppercase tracking-tight">
                          {project.description}
                        </p>
                      </div>

                      {/* Buttons - Vertically centered, fixed height */}
                      <div className="flex flex-col justify-center gap-2 px-3 py-3">
                        
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
                            <span className="text-[9px] font-sf-mono">CODE</span>
                          </div>
                        </a>

                        <button
                          onClick={() => openModal(project)}
                          className="px-3 py-2 border bg-primary text-background border-primary hover:bg-primary/90 transition-all duration-150"
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-[9px] font-sf-mono">VIEW</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[360px] md:min-h-[360px]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary/50" />
                  <p className="text-xs font-sf-mono text-primary/50">CHECK BACK AGAIN SOON, MORE PROJECTS TO COME...</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Arrow */}
          {showPaginationControls && (
            <button
              onClick={() => setStartIndex((prev) => prev + ITEMS_PER_PAGE)}
              disabled={!canShowNext}
              className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 border flex items-center justify-center transition-all duration-150 ${
                canShowNext
                  ? "border-primary/30 text-primary/70 hover:bg-primary/10 hover:border-primary/50"
                  : "border-primary/10 text-primary/10 cursor-not-allowed"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
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
            <span>{projects.length} {isMobile ? "PROJ" : "PROJECTS"}</span>
            <span className="text-primary/20">/</span>
            <span>{categories.length - 1} {isMobile ? "CAT" : "CATEGORIES"}</span>
            <span className="text-primary/20">/</span>
            <span>{filteredProjects.length} {isMobile ? "SHOWN" : "FILTERED"}</span>
          </div>
          {showPaginationControls && (
            <span className="text-[9px] sm:text-[10px] font-sf-mono text-primary/30">
              {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredProjects.length)} OF {filteredProjects.length}
            </span>
          )}
          {!showPaginationControls && (
            <div className="text-[9px] sm:text-[10px] font-sf-mono text-primary/30">LAST.UPDATED: 2025</div>
          )}
        </motion.div>
      </div>

      {/* Modal - Improved Readability */}
      <AnimatePresence>
        {isModalOpen && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 md:p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl bg-background dark:bg-eerie-black border border-primary/30 shadow-lg max-h-[85vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-primary text-background px-4 py-3 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  <span className="text-sm font-sf-mono font-medium truncate max-w-[250px] md:max-w-none">
                    {selectedProject.title}
                  </span>
                </div>
                <button
                  onClick={closeModal}
                  className="text-background/70 hover:text-background transition-colors text-xs font-sf-mono"
                >
                  [ ESC ]
                </button>
              </div>

              {/* Content */}
              <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-5">
                {/* Description */}
                <div>
                  <span className="text-[10px] font-sf-mono text-primary/50 uppercase tracking-wider">
                    DESCRIPTION
                  </span>
                  <p className="text-sm font-sf-mono text-primary/80 mt-2 leading-relaxed">
                    {selectedProject.fullDescription}
                  </p>
                </div>

                {/* Highlights */}
                <div>
                  <span className="text-[10px] font-sf-mono text-primary/50 uppercase tracking-wider">
                    KEY HIGHLIGHTS
                  </span>
                  <div className="space-y-2.5 mt-3">
                    {selectedProject.highlights.map((highlight, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-5 h-5 border border-primary/30 bg-primary/10 flex items-center justify-center text-[10px] font-sf-mono text-primary/70 flex-shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-xs font-sf-mono text-primary/70 leading-relaxed">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <span className="text-[10px] font-sf-mono text-primary/50 uppercase tracking-wider">
                    TECHNOLOGIES
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-sf-mono border border-primary/20 bg-primary/5 text-primary/70 px-2 py-1 hover:bg-primary hover:text-background transition-colors"
                      >
                        {tech.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                {(selectedProject.github || selectedProject.demo) && (
                  <div className="pt-4 border-t border-primary/10">
                    <span className="text-[10px] font-sf-mono text-primary/50 uppercase tracking-wider">
                      LINKS
                    </span>
                    <div className="flex gap-2 mt-2">
                      {selectedProject.github && (
                        <a
                          href={selectedProject.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs font-sf-mono border border-primary/30 text-primary/70 hover:bg-primary hover:text-background transition-colors px-4 py-2"
                        >
                          <Github className="h-4 w-4" />
                          SOURCE
                        </a>
                      )}
                      {selectedProject.demo && (
                        <a
                          href={selectedProject.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs font-sf-mono border border-primary/30 text-primary/70 hover:bg-primary hover:text-background transition-colors px-4 py-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          DEMO
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-primary/20 px-4 py-2 bg-primary/5 flex justify-between items-center flex-shrink-0">
                <span className="text-[10px] font-sf-mono text-primary/50">{selectedProject.category.toUpperCase()}</span>
                <span className={`text-[10px] font-sf-mono ${getStatusColor(selectedProject.status)}`}>
                  {selectedProject.status}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  )
}
