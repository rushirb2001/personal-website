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
} from "lucide-react"
import { projects, categories } from "./data"

// Technology icon mapping
const getTechIcon = (tech: string) => {
  const techLower = tech.toLowerCase()

  if (techLower.includes("next") || techLower === "next.js") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M11.5725 0c-.1763 0-.3098.0013-.3584.0067-.0516.0053-.2159.021-.3636.0328-3.4088.3073-6.6017 2.1463-8.624 4.9728C1.1004 6.584.3802 8.3666.1082 10.255c-.0962.659-.108.8537-.108 1.7474s.012 1.0884.108 1.7476c.652 4.506 3.8591 8.2919 8.2087 9.6945.7789.2511 1.6.4223 2.5337.5255.3636.04 1.9354.04 2.299 0 1.6117-.0962 2.9772-.577 4.3237-1.2643.2065-.1056.2464-.1337.2183-.1573-.0188-.0139-.8987-1.1938-1.9543-2.62l-1.919-2.592-2.4047-3.5583c-1.3231-1.9564-2.4117-3.556-2.4211-3.556-.0094-.0026-.0187 1.5787-.0235 3.509-.0067 3.3802-.0093 3.5162-.0516 3.596-.061.115-.108.1618-.2064.2134-.075.0374-.1408.0445-.495.0445h-.406l-.1078-.068a.4383.4383 0 01-.1572-.1712l-.0493-.1056.0053-4.703.0067-4.7054.0726-.0915c.0376-.0493.1174-.1125.1736-.143.0962-.047.1338-.0517.5396-.0517.4787 0 .5584.0187.6827.1547.0353.0377 1.3373 1.9987 2.895 4.3608a10760.433 10760.433 0 004.7344 7.1706l1.9002 2.8782.0971-.0633c.8763-.5536 1.8068-1.3208 2.602-2.1446 1.6547-1.7168 2.7642-3.85 3.3264-6.3879.2065-.9329.2865-1.3766.3471-1.9103.0377-.3329.0377-.4423.0377-1.7476s0-1.4147-.0377-1.7476c-.652-4.506-3.8591-8.2919-8.2087-9.6945-.7672-.2487-1.5836-.4199-2.5146-.5229-.1572-.0175-.3049-.03-.3303-.03s-.2951.0067-.3584.0067z" />
      </svg>
    )
  }
  if (techLower.includes("react")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C10.337,6.182,8.976,12,6.001,12z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,13.382,14.976,12,6.001,12z" />
      </svg>
    )
  }

  if (techLower.includes("typescript")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502.3802 8.3666.1082 10.255c-.0962.659-.108.8537-.108 1.7474s.012 1.0884.108 1.7476c.652 4.506 3.8591 8.2919 8.2087 9.6945.7789.2511 1.6.4223 2.5337.5255.3636.04 1.9354.04 2.299 0 1.6117-.0962 2.9772-.577 4.3237-1.2643.2065-.1056.2464-.1337.2183-.1573-.0188-.0139-.8987-1.1938-1.9543-2.62l-1.919-2.592-2.4047-3.5583c-1.3231-1.9564-2.4117-3.556-2.4211-3.556-.0094-.0026-.0187 1.5787-.0235 3.509-.0067 3.3802-.0093 3.5162-.0516 3.596-.061.115-.108.1618-.2064.2134-.075.0374-.1408.0445-.495.0445h-.406l-.1078-.068a.4383.4383 0 01-.1572-.1712l-.0493-.1056.0053-4.703.0067-4.7054.0726-.0915c.0376-.0493.1174-.1125.1736-.143.0962-.047.1338-.0517.5396-.0517.4787 0 .5584.0187.6827.1547.0353.0377 1.3373 1.9987 2.895 4.3608a10760.433 10760.433 0 004.7344 7.1706l1.9002 2.8782.0971-.0633c.8763-.5536 1.8068-1.3208 2.602-2.1446 1.6547-1.7168 2.7642-3.85 3.3264-6.3879.2065-.9329.2865-1.3766.3471-1.9103.0377-.3329.0377-.4423.0377-1.7476s0-1.4147-.0377-1.7476c-.652-4.506-3.8591-8.2919-8.2087-9.6945-.7672-.2487-1.5836-.4199-2.5146-.5229-.1572-.0175-.3049-.03-.3303-.03s-.2951.0067-.3584.0067z" />
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

  if (techLower.includes("tailwind")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,15.096,8.976,12,6.001,12z" />
      </svg>
    )
  }

  if (techLower.includes("d3")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M13.312 12C13.312 5.718 8.22.625 1.937.625H0v3.75h1.937c4.063 0 7.375 3.313 7.375 7.375s-3.313 7.375-7.375 7.375H0v3.75h1.937C8.22 22.875 13.312 17.782 13.312 12z" />
      </svg>
    )
  }

  if (techLower.includes("node")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z" />
      </svg>
    )
  }

  if (techLower.includes("firebase")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M3.89 15.672L6.255.461A.542.542 0 017.27.288l2.543 4.771zm16.794 3.692l-2.25-14a.54.54 0 00-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 001.588 0zM14.3 7.147l-1.82-3.482a.542.542 0 00-.96 0L3.53 17.984z" />
      </svg>
    )
  }

  if (techLower.includes("redux")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M16.634 16.504c.87-.075 1.543-.84 1.5-1.754-.047-.914-.796-1.648-1.709-1.648h-.061c-.923.047-1.66.84-1.614 1.801.031.456.212.86.5 1.15-1.064 2.083-2.682 3.61-5.11 4.937-1.631 1.017-3.332 1.392-5.046 1.11-1.428-.235-2.536-.988-3.166-2.15-.93-1.768-.914-3.68.045-5.494.705-1.332 1.807-2.312 2.672-2.819-.124-.472-.214-1.26-.214-1.848-5.732 4.116-5.167 9.73-3.442 12.36 1.254 1.943 3.819 3.166 6.53 3.166.686 0 1.389-.077 2.09-.238 4.773-.869 8.394-3.742 10.224-8.054z" />
      </svg>
    )
  }

  if (techLower.includes("websocket") || techLower.includes("socket")) {
    return <Zap className="w-5 h-5" />
  }

  return <span className="text-[0.5rem] font-bold">{tech.substring(0, 3).toUpperCase()}</span>
}

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const handleEscKey = (e) => {
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

  const openModal = (project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 200)
  }

  const getStatusColor = (status) => {
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
                const mobileLabels = {
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
                  className="border border-primary/20 hover:border-primary/40 bg-background dark:bg-eerie-black/50 transition-all duration-200 cursor-pointer"
                >
                  {/* Header Bar */}
                  <div className="border-b border-primary/20 px-3 py-2 flex items-center justify-between bg-primary/5">
                    {selectedCategory === "All" ? (
                      <>
                        <div className="flex items-center gap-2">
                          <Terminal className="h-3 w-3 text-primary/70" />
                          <span className="text-xs font-sf-mono text-primary/70">{project.category.toUpperCase()}</span>
                        </div>
                        <div className={`text-xs font-sf-mono ${getStatusColor(project.status)}`}>{project.status}</div>
                      </>
                    ) : (
                      <div className="w-full flex items-center justify-center">
                        <div className={`text-xs font-sf-mono ${getStatusColor(project.status)}`}>{project.status}</div>
                      </div>
                    )}
                  </div>

                  {/* Tech Stack Icons Row */}
                  <div className="border-b border-primary/10 px-3 py-3 flex gap-2">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <div
                        key={tech}
                        className="w-10 h-10 border border-primary/20 bg-primary/5 flex items-center justify-center text-primary/60 hover:bg-primary/10 hover:text-primary transition-colors relative"
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
                      <h3 className="text-sm font-sf-mono font-medium group-hover:text-primary/90 transition-colors h-10 line-clamp-2 flex items-start mb-1 mt-0 py-0">
                        {project.title}
                      </h3>
                      <p className="text-xs text-primary/70 leading-relaxed h-10 line-clamp-2">{project.description}</p>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="border-t border-primary/20 px-4 py-2 flex items-center justify-between bg-primary/5 group-hover:bg-primary/10 transition-colors">
                    <span className="text-xs font-sf-mono text-primary/60">VIEW DETAILS</span>
                    <ChevronRight className="h-3 w-3 text-primary/60 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-foreground" />
                <p className="text-sm font-sf-mono text-primary/70 font-mono">NEW PROJECTS COMING SOON...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-4xl bg-background dark:bg-eerie-black border border-primary/30 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-primary/5 px-4 py-3 flex justify-between items-center border-b border-primary/30 sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary/70" />
                  <span className="text-sm font-sf-mono text-primary/70">{selectedProject.title.toUpperCase()}</span>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-primary/70 hover:text-primary transition-colors text-xs font-sf-mono"
                >
                  [ ESC ]
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-6">
                    <div>
                      <div className="text-xs font-sf-mono text-primary/50 mb-1">DESCRIPTION:</div>
                      <p className="text-sm leading-relaxed text-primary/90">{selectedProject.fullDescription}</p>
                    </div>

                    <div>
                      <div className="text-xs font-sf-mono text-primary/50 mb-2">KEY HIGHLIGHTS:</div>
                      <div className="space-y-2">
                        {selectedProject.highlights.map((highlight, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="w-6 h-6 border border-primary/30 bg-primary/5 flex items-center justify-center text-xs font-sf-mono text-primary/70 flex-shrink-0">
                              {i + 1}
                            </div>
                            <p className="text-sm leading-relaxed text-primary/90 pt-0.5">{highlight}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-sf-mono text-primary/50 mb-2">TECHNOLOGIES:</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs font-sf-mono bg-primary/5 border border-primary/30 text-primary/70 px-2 py-1"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Links */}
                    {(selectedProject.github || selectedProject.demo) && (
                      <div className="border-t border-primary/20 pt-4">
                        <div className="text-xs font-sf-mono text-primary/50 mb-2">LINKS:</div>
                        <div className="flex gap-3">
                          {selectedProject.github && (
                            <a
                              href={selectedProject.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs font-sf-mono bg-primary/5 border border-primary/30 text-primary/70 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors px-3 py-2 w-full"
                            >
                              <Github className="h-4 w-4" />
                              VIEW SOURCE
                            </a>
                          )}
                          {selectedProject.demo && (
                            <a
                              href={selectedProject.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs font-sf-mono bg-primary/5 border border-primary/30 text-primary/70 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors px-3 py-2 w-full"
                            >
                              <ExternalLink className="h-4 w-4" />
                              LIVE DEMO
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-primary/20 p-4 bg-primary/5 flex justify-between items-center">
                <div className="text-xs font-sf-mono text-primary/50">PERSONAL & PROFESSIONAL PROJECTS</div>
                <div className="text-xs font-sf-mono text-primary/50">ID: {selectedProject.id}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  )
}
