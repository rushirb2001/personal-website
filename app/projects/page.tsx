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
  SiCypress,
  SiVercel,
  SiNetlify,
  SiVite,
  SiWebpack,
  SiNginx,
  SiElasticsearch,
  SiApachekafka,
  SiRabbitmq,
  SiSqlite,
  SiSupabase,
  SiPrisma,
  SiNumpy,
  SiPandas,
  SiScikitlearn,
  SiOpenai,
  SiLangchain,
} from "react-icons/si"
import { Database, Cloud, Box, Smartphone, Zap, Code2 } from "lucide-react"

const techIconMap: Record<string, any> = {
  // Frontend
  next: SiNextdotjs,
  react: SiReact,
  vite: SiVite,
  webpack: SiWebpack,
  tailwind: SiTailwindcss,
  
  // Languages
  typescript: SiTypescript,
  javascript: SiJavascript,
  python: SiPython,
  html: SiHtml5,
  css: SiCss3,
  
  // ML/AI
  pytorch: SiPytorch,
  tensorflow: SiTensorflow,
  numpy: SiNumpy,
  pandas: SiPandas,
  sklearn: SiScikitlearn,
  scikit: SiScikitlearn,
  openai: SiOpenai,
  langchain: SiLangchain,
  
  // Databases
  postgres: SiPostgresql,
  mongo: SiMongodb,
  mysql: SiMysql,
  redis: SiRedis,
  sqlite: SiSqlite,
  supabase: SiSupabase,
  prisma: SiPrisma,
  elasticsearch: SiElasticsearch,
  
  // Cloud
  aws: SiAmazonaws,
  azure: SiMicrosoftazure,
  gcp: SiGooglecloud,
  vercel: SiVercel,
  netlify: SiNetlify,
  
  // DevOps
  docker: SiDocker,
  kubernetes: SiKubernetes,
  k8s: SiKubernetes,
  nginx: SiNginx,
  
  // Backend
  node: SiNodedotjs,
  fastapi: SiFastapi,
  express: SiExpress,
  flask: SiFlask,
  django: SiDjango,
  
  // Data & Real-time
  d3: SiD3Dotjs,
  graphql: SiGraphql,
  socket: SiSocketdotio,
  websocket: SiSocketdotio,
  kafka: SiApachekafka,
  rabbitmq: SiRabbitmq,
  
  // Tools
  redux: SiRedux,
  firebase: SiFirebase,
  git: SiGit,
  jest: SiJest,
  cypress: SiCypress,
  
  // Generic fallbacks
  sql: Database,
  database: Database,
  cloud: Cloud,
  mobile: Smartphone,
  native: Smartphone,
  ios: Smartphone,
  android: Smartphone,
  api: Zap,
}

const getTechIcon = (tech: string) => {
  const techLower = tech.toLowerCase()
  const iconClass = "w-5 h-5"
  
  const IconComponent = Object.keys(techIconMap).find(key => 
    techLower.includes(key)
  )
  
  if (IconComponent) {
    const Icon = techIconMap[IconComponent]
    return <Icon className={iconClass} />
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
