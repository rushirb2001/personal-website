"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { useNavigation } from "@/contexts/navigation-context"
import ResumeModal from "@/components/features/resume/resume-modal"
import { projects } from "@/app/projects/data"
import { PageLayout } from "@/components/layout/page-layout"

const HomeSplitPage = () => {
  const navigateTo = useNavigation()
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0)
  const featuredProjects = projects

  const currentFeatured = featuredProjects[currentFeaturedIndex]

  const goToPrevFeatured = () => {
    setCurrentFeaturedIndex((prevIndex) => (prevIndex === 0 ? featuredProjects.length - 1 : prevIndex - 1))
  }

  const goToNextFeatured = () => {
    setCurrentFeaturedIndex((prevIndex) => (prevIndex === featuredProjects.length - 1 ? 0 : prevIndex + 1))
  }

  return (
    <>
      <PageLayout title="RUSHIR BHAVSAR" subtitle="DATA SCIENTIST • AI ENGINEER • ML RESEARCHER">
        <div className="flex flex-col gap-3 h-full min-w-0 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Featured Projects */}
            <div className="flex flex-col md:flex-row md:w-[600px] lg:w-[800px]">
              <div className="p-3 flex flex-col md:flex-row gap-3 md:gap-0">
                <div className="p-3 flex-1 flex relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentFeatured?.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 flex"
                    >
                      <div className="flex gap-3 w-full">
                        {/* Left: Title + Description */}
                        <div className="flex-1 flex flex-col justify-center min-w-0">
                          <h4 className="text-sm font-sf-mono font-bold text-primary mb-1 truncate">
                            {currentFeatured?.title}
                          </h4>
                          <p className="text-[9px] font-sf-mono text-primary/60 line-clamp-2">
                            {currentFeatured?.description}
                          </p>
                        </div>

                        {/* Right: Technologies */}
                        <div className="flex flex-col gap-1 shrink-0">
                          {currentFeatured?.technologies.slice(0, 3).map((tech, idx) => (
                            <span key={idx} className="text-[8px] font-sf-mono text-primary/50 whitespace-nowrap">
                              {tech}
                            </span>
                          ))}
                          {currentFeatured?.technologies && currentFeatured?.technologies.length > 3 && (
                            <span className="text-[8px] font-sf-mono text-primary/40">
                              +{currentFeatured?.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="flex items-center justify-center gap-2">
                  {featuredProjects.length > 1 && (
                    <button
                      onClick={goToPrevFeatured}
                      className="w-5 h-5 flex items-center justify-center border border-primary/20 hover:bg-primary hover:text-background transition-colors"
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </button>
                  )}
                  <Button
                    variant="ghost"
                    className="h-5 px-2 border border-primary/20 text-[8px] font-sf-mono bg-transparent hover:bg-primary hover:text-background rounded-none transition-colors"
                    onClick={() => navigateTo("/projects")}
                  >
                    VIEW ALL
                    <ArrowRight className="h-2.5 w-2.5 ml-1" />
                  </Button>
                  {featuredProjects.length > 1 && (
                    <button
                      onClick={goToNextFeatured}
                      className="w-5 h-5 flex items-center justify-center border border-primary/20 hover:bg-primary hover:text-background transition-colors"
                    >
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <motion.div
                className="border border-primary/20 bg-background md:w-[180px] lg:w-[200px] shrink-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.35 }}
              >
                <div className="border-b border-primary/20 px-3 py-1.5 bg-primary/5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-sf-mono font-bold text-primary tracking-tighter">EXPLORE</h3>
                    <span className="text-[9px] font-sf-mono text-primary/30">[04]</span>
                  </div>
                </div>
                <div className="p-2 flex flex-col gap-1">
                  <button
                    onClick={() => navigateTo("/projects")}
                    className="w-full py-1.5 px-2 border border-primary/20 hover:bg-primary hover:text-background transition-colors text-[9px] font-sf-mono text-primary/70 text-left flex items-center justify-between animate-arrow-push-1"
                  >
                    PROJECTS
                    <ArrowRight className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => navigateTo("/experience")}
                    className="w-full py-1.5 px-2 border border-primary/20 hover:bg-primary hover:text-background transition-colors text-[9px] font-sf-mono text-primary/70 text-left flex items-center justify-between animate-arrow-push-2"
                  >
                    EXPERIENCE
                    <ArrowRight className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => navigateTo("/publications")}
                    className="w-full py-1.5 px-2 border border-primary/20 hover:bg-primary hover:text-background transition-colors text-[9px] font-sf-mono text-primary/70 text-left flex items-center justify-between animate-arrow-push-3"
                  >
                    PUBLICATIONS
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Section: Featured Project + Quick Actions */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch min-w-0">
            {/* Featured Project Tile */}
            <motion.div
              className="border border-primary/20 bg-background flex-1 min-w-0 flex flex-col"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="border-b border-primary/20 px-3 py-1.5 bg-primary/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-sf-mono font-bold text-primary tracking-tighter">FEATURED PROJECT</h3>
                    {featuredProjects.length > 1 && (
                      <div className="flex gap-1">
                        {featuredProjects.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentFeaturedIndex(idx)}
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${
                              idx === currentFeaturedIndex ? "bg-primary" : "bg-primary/20 hover:bg-primary/40"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {featuredProjects.length > 1 && (
                      <button
                        onClick={goToPrevFeatured}
                        className="w-5 h-5 flex items-center justify-center border border-primary/20 hover:bg-primary hover:text-background transition-colors"
                      >
                        <ChevronLeft className="h-3 w-3" />
                      </button>
                    )}
                    <Button
                      variant="ghost"
                      className="h-5 px-2 border border-primary/20 text-[8px] font-sf-mono bg-transparent hover:bg-primary hover:text-background rounded-none transition-colors"
                      onClick={() => navigateTo("/projects")}
                    >
                      VIEW ALL
                      <ArrowRight className="h-2.5 w-2.5 ml-1" />
                    </Button>
                    {featuredProjects.length > 1 && (
                      <button
                        onClick={goToNextFeatured}
                        className="w-5 h-5 flex items-center justify-center border border-primary/20 hover:bg-primary hover:text-background transition-colors"
                      >
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="border border-primary/20 bg-background md:w-[180px] lg:w-[200px] shrink-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.35 }}
            >
              <div className="border-b border-primary/20 px-3 py-1.5 bg-primary/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-sf-mono font-bold text-primary tracking-tighter">EXPLORE</h3>
                  <span className="text-[9px] font-sf-mono text-primary/30">[04]</span>
                </div>
              </div>
              <div className="p-2 flex flex-col gap-1">
                <button
                  onClick={() => navigateTo("/projects")}
                  className="w-full py-1.5 px-2 border border-primary/20 hover:bg-primary hover:text-background transition-colors text-[9px] font-sf-mono text-primary/70 text-left flex items-center justify-between animate-arrow-push-1"
                >
                  PROJECTS
                  <ArrowRight className="h-3 w-3" />
                </button>
                <button
                  onClick={() => navigateTo("/experience")}
                  className="w-full py-1.5 px-2 border border-primary/20 hover:bg-primary hover:text-background transition-colors text-[9px] font-sf-mono text-primary/70 text-left flex items-center justify-between animate-arrow-push-2"
                >
                  EXPERIENCE
                  <ArrowRight className="h-3 w-3" />
                </button>
                <button
                  onClick={() => navigateTo("/publications")}
                  className="w-full py-1.5 px-2 border border-primary/20 hover:bg-primary hover:text-background transition-colors text-[9px] font-sf-mono text-primary/70 text-left flex items-center justify-between animate-arrow-push-3"
                >
                  PUBLICATIONS
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </PageLayout>
      {isResumeModalOpen && <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />}
    </>
  )
}

export default HomeSplitPage
