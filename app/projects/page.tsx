"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageLayout } from "@/components/layout/page-layout"
import { ChevronRight, ExternalLink, Github, Terminal } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  fullDescription: string
  technologies: string[]
  category: "Machine Learning" | "Data Science" | "Web Development" | "Other"
  status: "COMPLETED" | "IN PROGRESS" | "ARCHIVED"
  date: string
  github?: string
  demo?: string
  highlights: string[]
}

const projects: Project[] = [
  {
    id: "proj_physics_nnetworks_001",
    title: "Multi-Arch Physics Informed Neural Network for PDE Solution",
    description:
      "Coupled Ensemble Physics-Informed Neural Networks (MACE-PINN) for solving coupled partial differential equations.",
    fullDescription:
      "A novel neural network architecture for solving coupled partial differential equations using parallel subnetworks with adaptive loss weighting. Successfully applied to Gray-Scott and Ginzburg-Landau reaction-diffusion systems.",
    technologies: ["Python", "PyTorch"],
    category: "Machine Learning",
    status: "COMPLETED",
    date: "2025-04",
    github: "https://github.com/rushirb2001/thesis-mace-pinn",
    demo: "https://demo.example.com",
    highlights: [
      "Implemented Parallel Subnetwork Architecture",
      "Integrated Fourier Feature Embeddings for input scaling and area limiting for PDE solution",
      "Designed Gradient Norm Adaptive Weighting for balancing between trivial and domain-specific solution learning",
      "Published findings to ASU Thesis Directory",
    ],
  },
  {
    id: "proj_personal_portfolio_002",
    title: "Personal Portfolio",
    description: "Interactive OS-Emulated Design Portfolio",
    fullDescription:
      "This portfolio represents a deliberate fusion of modern web development practices and thoughtful user experience design. Built as a platform to present technical work in machine learning and AI, the site demonstrates proficiency in full-stack development, performance optimization, and design-systems-skills that extend beyond data science into production software engineering.",
    technologies: ["react", "Node.js", "typescript", "tailwind", "nextjs"],
    category: "Web Development",
    status: "COMPLETED",
    date: "2024-06",
    highlights: [
      "Processed and visualized 100K+ data points in real-time",
      "Built custom charting library with D3.js",
      "Implemented WebSocket connections for live updates",
      "Achieved 99.9% uptime over 6 months",
    ],
  },
  {
    id: "proj_ml_pipeline_003",
    title: "Machine Learning Pipeline for Diamond Shape Segmentation",
    description: "End-to-end ML pipeline for automated image segmentation.",
    fullDescription:
      "A computer vision pipeline for automated diamond image segmentation using GrabCut algorithm with CLAHE preprocessing. This project segments diamonds from background images across 14 different shape categories.",
    technologies: ["Python", "PyTorch", "Docker", "OpenCV", "Jupyter"],
    category: "Machine Learning",
    status: "COMPLETED",
    date: "2024-10",
    github: "https://github.com/username/ml-pipeline",
    highlights: [
      "Achieved 95% accuracy on custom dataset",
      "Implemented distributed training across multiple GPUs",
      "Built RESTful API for model inference",
      "Containerized deployment with Docker",
    ],
  },
  {
    id: "proj_yelp_ml_004",
    title: "Yelp ML Platform",
    description:
      "A production-ready ML platform for business recommendations and sentiment analysis using the Yelp dataset.",
    fullDescription:
      "A comprehensive fitness tracking application that helps users monitor their workouts, nutrition, and progress over time. Features include workout planning, progress tracking, and social sharing.",
    technologies: ["Docker", "FastAPI", "PySpark", "github"],
    category: "Data Science",
    status: "COMPLETED",
    date: "2024-03",
    highlights: [
      "Architectured a Collaborative filtering recommendation system using ALS (Alternating Least Squares)",
      "Implemented Large-scale data processing with Apache Spark",
      "Built ETL pipelines for JSON to Parquet transformation",
      "Integrated CI/CD pipeline with GitHub Actions",
    ],
  },
]

const categories = ["All", "Web Development", "Machine Learning", "Data Science", "Mobile", "Other"]

// Technology icon mapping
const techIconMap: Record<string, string> = {
  javascript: "javascript",
  typescript: "typescript",
  react: "react",
  nextjs: "nextdotjs",
  nodejs: "nodedotjs",
  "node.js": "nodedotjs",
  python: "python",
  jupyter: "jupyter",
  pytorch: "pytorch",
  opencv: "opencv",
  docker: "docker",
  github: "github",
  mongodb: "mongodb",
  redis: "redis",
  tailwind: "tailwindcss",
  pyspark: "apachespark",
}

const getTechIcon = (tech: string) => {
  const normalized = tech
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "")
  const iconName = techIconMap[normalized] || normalized

  return (
    <img
      src={`https://cdn.simpleicons.org/${iconName}`}
      alt={tech}
      className="w-5 h-5"
      onError={(e) => {
        ;(e.target as HTMLImageElement).src = `data:image/svg+xml,${encodeURIComponent(
          '<svg fill="white" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke="white" strokeWidth="2" fill="none"/></svg>',
        )}`
      }}
    />
  )
}

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal()
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

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 200)
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
        {/* Category Filter - Fixed at 30% height */}
        <div className="h-[10%] flex-shrink-0 border-b border-primary/20">
          <div className="h-full flex items-center justify-center px-2 md:px-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => {
                // Define compact mobile labels
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

        {/* Projects Grid - Takes remaining 70% height with scroll */}
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

                    {/* Category & Date */}
                    {selectedCategory === "All" && (
                      <div className="flex items-center justify-between text-xs font-sf-mono text-primary/50 pt-2 border-t border-primary/10">
                        <span>{project.category.toUpperCase()}</span>
                        <span>{project.date}</span>
                      </div>
                    )}
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
            onClick={closeModal}
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
                  onClick={closeModal}
                  className="text-primary/70 hover:text-primary transition-colors text-xs font-sf-mono"
                >
                  [ ESC ]
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Main Content */}
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
