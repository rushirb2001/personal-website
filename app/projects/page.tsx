"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageLayout } from "@/components/layout/page-layout"
import {
  ChevronRight,
  ExternalLink,
  Github,
  Terminal,
  Code2,
  Database,
  Cloud,
  Smartphone,
  Box,
  Zap,
  X,
} from "lucide-react"
import { projects, categories, type Project } from "./data"

// Technology icon mapping
const getTechIcon = (tech: string) => {
  const techLower = tech.toLowerCase()

  if (techLower.includes("next") || techLower === "next.js") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M11.5725 0c-.1763 0-.3098.0013-.3584.0067-.0516.0053-.2159.021-.3636.0328-3.4088.3073-6.6017 2.1463-8.624 4.9728C1.1004 6.584.3802 8.3666.1082 10.255c-.0962.659-.108.8537-.108 1.7474s.012 1.0884.108 1.7476c.652 4.506 3.8591 8.2919 8.2087 9.6945.7789.2511 1.6.4223 2.5337.5255.3636.04 1.9354.04 2.299 0 1.6117-.1783 2.9772-.577 4.3237-1.2643.2065-.1056.2464-.1337.2183-.1573-.0188-.0139-.8987-1.1938-1.9543-2.62l-1.919-2.592-2.4047-3.5583c-1.3231-1.9564-2.4117-3.556-2.4211-3.556-.0094-.0026-.0187 1.5787-.0235 3.509-.0067 3.3802-.0093 3.5162-.0516 3.596-.061.115-.108.1618-.2064.2134-.075.0374-.1408.0445-.495.0445h-.406l-.1078-.068a.4383.4383 0 01-.1572-.1712l-.0493-.1056.0053-4.703.0067-4.7054.0726-.0915c.0376-.0493.1174-.1125.1736-.143.0962-.047.1338-.0517.5396-.0517.4787 0 .5584.0187.6827.1547.0353.0377 1.3373 1.9987 2.895 4.3608a10760.433 10760.433 0 004.7344 7.1706l1.9002 2.8782.0971-.0633c.8763-.5536 1.8068-1.3208 2.602-2.1446 1.6547-1.7168 2.7642-3.85 3.3264-6.3879.2065-.9329.2865-1.3766.3471-1.9103.0377-.3329.0377-.4423.0377-1.7476s0-1.4147-.0377-1.7476c-.652-4.506-3.8591-8.2919-8.2087-9.6945-.7672-.2487-1.5836-.4199-2.5146-.5229-.1572-.0175-.3049-.03-.3303-.03s-.2951.0067-.3584.0067z" />
      </svg>
    )
  }

  if (techLower.includes("react")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38a1.638 1.638 0 0 0-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44a23.122 23.122 0 0 0-3.107-.534A23.76 23.76 0 0 0 12.769 4.7c1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442a22.73 22.73 0 0 0-3.113.538 15.02 15.02 0 0 1-.254-1.42c-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87a24.5 24.5 0 0 1-2.21.09c-.74 0-1.477-.035-2.202-.093a24.508 24.508 0 0 1-1.183-1.86c-.372-.64-.71-1.29-1.018-1.946.308-.655.646-1.31 1.013-1.95.38-.66.773-1.286 1.18-1.868A24.29 24.29 0 0 1 12 8.1z" />
      </svg>
    )
  }

  if (techLower.includes("typescript")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
      </svg>
    )
  }

  if (techLower.includes("python") || techLower.includes("pytorch")) {
    return <Code2 className="w-5 h-5" />
  }

  if (
    techLower.includes("sql") ||
    techLower.includes("postgres") ||
    techLower.includes("mongo") ||
    techLower.includes("database")
  ) {
    return <Database className="w-5 h-5" />
  }

  if (techLower.includes("aws") || techLower.includes("cloud") || techLower.includes("azure")) {
    return <Cloud className="w-5 h-5" />
  }

  if (techLower.includes("docker") || techLower.includes("kubernetes")) {
    return <Box className="w-5 h-5" />
  }

  if (
    techLower.includes("native") ||
    techLower.includes("mobile") ||
    techLower.includes("ios") ||
    techLower.includes("android")
  ) {
    return <Smartphone className="w-5 h-5" />
  }

  if (techLower.includes("api") || techLower.includes("fastapi")) {
    return <Zap className="w-5 h-5" />
  }

  return <span className="text-[0.5rem] font-bold">{tech.substring(0, 3).toUpperCase()}</span>
}

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false)
        setTimeout(() => setSelectedProject(null), 200)
      }
    }

    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [isModalOpen])

  const filteredProjects =
    selectedCategory === "All" ? projects : projects.filter((p) => p.category === selectedCategory)

  const openModal = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
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

  return (
    <PageLayout title="PROJECTS" subtitle="Personal & Professional Development Work">
      <div className="h-[calc(100vh-12rem)] flex flex-col">
        {/* Category Filter */}
        <div className="h-[10%] flex-shrink-0 border-b border-primary/20">
          <div className="h-full flex items-center justify-center px-2 md:px-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => {
                const mobileLabels: Record<string, string> = {
                  All: "ALL",
                  "Web Development": "WEB DEV",
                  "Machine Learning": "ML",
                  "Data Science": "DS",
                  Mobile: "MOBILE",
                  Other: "OTHER",
                }

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`text-xs font-sf-mono px-2 md:px-3 py-1.5 border transition-colors ${
                      selectedCategory === category
                        ? "bg-primary/10 border-primary/40 text-primary"
                        : "bg-transparent border-primary/20 text-primary/60 hover:border-primary/30 hover:text-primary/80"
                    }`}
                  >
                    <span className="hidden md:inline">{category.toUpperCase()}</span>
                    <span className="md:hidden">{mobileLabels[category]}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="h-[90%] flex-shrink-0 overflow-y-auto px-6 py-6">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => openModal(project)}
                  className="border border-primary/20 hover:border-primary/40 bg-background transition-all duration-200 cursor-pointer"
                >
                  {/* Header Bar */}
                  <div className="border-b border-primary/20 px-3 py-2 flex items-center justify-between bg-primary/5">
                    {selectedCategory === "All" ? (
                      <>
                        <div className="flex items-center gap-2">
                          <Terminal className="h-3 w-3 text-primary/70" />
                          <span className="text-xs font-sf-mono text-primary/70">{project.id}</span>
                        </div>
                        <div className={`text-xs font-sf-mono ${getStatusColor(project.status)}`}>{project.status}</div>
                      </>
                    ) : (
                      <div className="w-full flex items-center justify-center">
                        <div className={`text-xs font-sf-mono ${getStatusColor(project.status)}`}>{project.status}</div>
                      </div>
                    )}
                  </div>

                  {/* Tech Stack Icons */}
                  <div className="border-b border-primary/10 px-3 py-3 flex gap-2">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <div
                        key={tech}
                        className="w-10 h-10 border border-primary/20 bg-primary/5 flex items-center justify-center text-primary/60 hover:bg-primary/10 hover:text-primary transition-colors"
                        title={tech}
                      >
                        {getTechIcon(tech)}
                      </div>
                    ))}
                    {project.technologies.length > 5 && (
                      <div className="w-10 h-10 border border-primary/20 bg-primary/5 flex items-center justify-center text-[0.5rem] font-sf-mono text-primary/60">
                        +{project.technologies.length - 5}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="text-sm font-sf-mono font-medium transition-colors">{project.title}</h3>
                      <p className="text-xs text-primary/60 mt-1 line-clamp-2">{project.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-primary/10">
                      <span className="text-[10px] font-sf-mono text-primary/40">{project.date}</span>
                      <ChevronRight className="h-4 w-4 text-primary/40" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-primary/50 font-sf-mono text-sm">No projects found in this category.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsModalOpen(false)
              setTimeout(() => setSelectedProject(null), 200)
            }}
          >
            <motion.div
              className="bg-background border border-primary/20 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="border-b border-primary/20 px-4 py-3 flex items-center justify-between bg-primary/5 sticky top-0">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary/70" />
                  <span className="text-sm font-sf-mono text-primary/70">{selectedProject.id}</span>
                </div>
                <button
                  onClick={() => {
                    setIsModalOpen(false)
                    setTimeout(() => setSelectedProject(null), 200)
                  }}
                  className="p-1 hover:bg-primary/10 transition-colors"
                >
                  <X className="h-4 w-4 text-primary/70" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-sf-mono font-medium">{selectedProject.title}</h2>
                    <span className={`text-xs font-sf-mono ${getStatusColor(selectedProject.status)}`}>
                      {selectedProject.status}
                    </span>
                  </div>
                  <p className="text-sm text-primary/70">{selectedProject.fullDescription}</p>
                </div>

                <div>
                  <h3 className="text-xs font-sf-mono text-primary/50 uppercase mb-3">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <span key={tech} className="px-2 py-1 text-xs font-sf-mono border border-primary/20 bg-primary/5">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-sf-mono text-primary/50 uppercase mb-3">Highlights</h3>
                  <ul className="space-y-2">
                    {selectedProject.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-primary/70">
                        <ChevronRight className="h-4 w-4 text-primary/40 mt-0.5 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Links */}
                <div className="flex gap-3 pt-4 border-t border-primary/10">
                  {selectedProject.github && (
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-sf-mono border border-primary/20 hover:bg-primary/10 transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      VIEW CODE
                    </a>
                  )}
                  {selectedProject.demo && (
                    <a
                      href={selectedProject.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-sf-mono border border-primary/20 hover:bg-primary/10 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      LIVE DEMO
                    </a>
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
