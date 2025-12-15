"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageLayout } from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, X, Star } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  fullDescription: string
  technologies: string[]
  category: "Web Development" | "Machine Learning" | "Data Science" | "Mobile" | "Other"
  status: "COMPLETED" | "IN PROGRESS" | "ARCHIVED"
  date: string
  github?: string
  demo?: string
  highlights: string[]
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: "proj_ai_content_001",
    title: "AI-Powered Content Generation Platform",
    description: "Full-stack platform leveraging LLMs for automated content creation",
    fullDescription:
      "A comprehensive content generation platform that uses advanced language models to create, optimize, and manage content across multiple formats. Features include real-time generation, content optimization, and multi-user collaboration.",
    technologies: ["Next.js", "TypeScript", "OpenAI API", "PostgreSQL", "Tailwind CSS"],
    category: "Web Development",
    status: "COMPLETED",
    date: "2024-09",
    github: "https://github.com/username/project",
    demo: "https://demo.example.com",
    highlights: [
      "Implemented real-time streaming for LLM responses",
      "Built scalable API architecture handling 10K+ requests/day",
      "Designed responsive UI with dark mode support",
      "Integrated user authentication and role-based access control",
    ],
    featured: true,
  },
  {
    id: "proj_realtime_analytics_002",
    title: "Real-Time Analytics Dashboard",
    description: "Interactive dashboard for monitoring system metrics and KPIs",
    fullDescription:
      "A real-time analytics dashboard built for monitoring complex systems with multiple data sources. Features live updates, customizable widgets, and advanced data visualization.",
    technologies: ["React", "D3.js", "WebSocket", "Node.js", "MongoDB"],
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
    title: "Machine Learning Pipeline for Image Classification",
    description: "End-to-end ML pipeline for training and deploying image models",
    fullDescription:
      "A complete machine learning pipeline for image classification tasks, including data preprocessing, model training, evaluation, and deployment. Supports multiple architectures and transfer learning.",
    technologies: ["Python", "PyTorch", "Docker", "FastAPI", "AWS"],
    category: "Machine Learning",
    status: "IN PROGRESS",
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
    id: "proj_mobile_fitness_004",
    title: "Mobile Fitness Tracking App",
    description: "Cross-platform mobile app for workout tracking and analytics",
    fullDescription:
      "A comprehensive fitness tracking application that helps users monitor their workouts, nutrition, and progress over time. Features include workout planning, progress tracking, and social sharing.",
    technologies: ["React Native", "TypeScript", "Firebase", "Redux"],
    category: "Mobile",
    status: "COMPLETED",
    date: "2024-03",
    highlights: [
      "Reached 5K+ downloads in first month",
      "Implemented offline-first architecture",
      "Built custom animation system for smooth UX",
      "Integrated with wearable device APIs",
    ],
  },
]

const categories = ["All", "Web Development", "Machine Learning", "Data Science", "Mobile", "Other"]

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredProjects =
    selectedCategory === "All" ? projects : projects.filter((p) => p.category === selectedCategory)

  // Check for auto-open project from sessionStorage
  useEffect(() => {
    const autoOpenId = sessionStorage.getItem("autoOpenProject")
    if (autoOpenId) {
      sessionStorage.removeItem("autoOpenProject")
      const project = projects.find((p) => p.id === autoOpenId)
      if (project) {
        setTimeout(() => {
          setSelectedProject(project)
          setIsModalOpen(true)
        }, 300)
      }
    }
  }, [])

  const openProjectModal = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 200)
  }

  return (
    <PageLayout title="PROJECTS" subtitle="SELECTED WORKS">
      <div className="flex flex-col gap-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              className={`rounded-none border-primary/20 text-[10px] font-sf-mono uppercase tracking-wider transition-all ${
                selectedCategory === category ? "bg-primary text-background" : "bg-transparent hover:bg-primary/10"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="group border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer relative"
                onClick={() => openProjectModal(project)}
              >
                {/* Featured Star */}
                {project.featured && (
                  <div className="absolute bottom-2 left-2 z-10">
                    <Star className="w-4 h-4 fill-amber-500/80 text-amber-500/80" />
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-xs font-sf-mono font-medium uppercase tracking-wide group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <span
                      className={`text-[9px] font-sf-mono px-2 py-0.5 border shrink-0 ${
                        project.status === "COMPLETED"
                          ? "border-green-500/30 text-green-500"
                          : project.status === "IN PROGRESS"
                            ? "border-amber-500/30 text-amber-500"
                            : "border-primary/30 text-primary/50"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <p className="text-[10px] text-muted-foreground mb-3 line-clamp-2">{project.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[9px] font-sf-mono px-1.5 py-0.5 border border-primary/10 bg-primary/5"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-[9px] font-sf-mono px-1.5 py-0.5 text-muted-foreground">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Stats Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-primary/10">
          <span className="text-[9px] font-sf-mono text-muted-foreground uppercase tracking-wider">
            {filteredProjects.length} PROJECT{filteredProjects.length !== 1 ? "S" : ""} •{" "}
            {projects.filter((p) => p.status === "COMPLETED").length} COMPLETED •{" "}
            {projects.filter((p) => p.status === "IN PROGRESS").length} IN PROGRESS
          </span>
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {isModalOpen && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-primary/20 bg-background"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 flex items-center justify-between p-4 border-b border-primary/20 bg-primary/5">
                <div className="flex items-center gap-3">
                  {selectedProject.featured && <Star className="w-4 h-4 fill-amber-500/80 text-amber-500/80" />}
                  <h2 className="text-sm font-sf-mono font-medium uppercase tracking-wide">{selectedProject.title}</h2>
                </div>
                <Button variant="ghost" size="icon" className="rounded-none h-8 w-8" onClick={closeModal}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="p-4 space-y-4">
                {/* Status & Date */}
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-sf-mono px-2 py-0.5 border ${
                      selectedProject.status === "COMPLETED"
                        ? "border-green-500/30 text-green-500"
                        : selectedProject.status === "IN PROGRESS"
                          ? "border-amber-500/30 text-amber-500"
                          : "border-primary/30 text-primary/50"
                    }`}
                  >
                    {selectedProject.status}
                  </span>
                  <span className="text-[10px] font-sf-mono text-muted-foreground">{selectedProject.date}</span>
                  <span className="text-[10px] font-sf-mono text-muted-foreground border border-primary/10 px-2 py-0.5">
                    {selectedProject.category}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed">{selectedProject.fullDescription}</p>

                {/* Technologies */}
                <div>
                  <h4 className="text-[10px] font-sf-mono uppercase tracking-wider text-muted-foreground mb-2">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-sf-mono px-2 py-1 border border-primary/20 bg-primary/5 hover:bg-primary hover:text-background transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <h4 className="text-[10px] font-sf-mono uppercase tracking-wider text-muted-foreground mb-2">
                    Highlights
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedProject.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="text-primary/50 mt-0.5">•</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Links */}
                {(selectedProject.github || selectedProject.demo) && (
                  <div className="flex gap-2 pt-2">
                    {selectedProject.github && (
                      <a
                        href={selectedProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[10px] font-sf-mono uppercase tracking-wider px-3 py-2 border border-primary/20 hover:bg-primary hover:text-background transition-colors"
                      >
                        <Github className="w-3 h-3" />
                        GitHub
                      </a>
                    )}
                    {selectedProject.demo && (
                      <a
                        href={selectedProject.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[10px] font-sf-mono uppercase tracking-wider px-3 py-2 border border-primary/20 hover:bg-primary hover:text-background transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Live Demo
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  )
}
