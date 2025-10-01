"use client"

import { useState } from "react"
import Image from "next/image"
import { PageLayout } from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { FileText, User, Calendar, MapPin } from "lucide-react"
import { ResumeModal } from "@/components/features/resume/resume-modal"

export default function AboutPage() {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)

  return (
    <PageLayout title="ABOUT" subtitle="PROFESSIONAL SUMMARY">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 h-full">
        {/* Tablet View */}
        <div className="hidden md:block lg:hidden col-span-full">
          {/* Header Row */}
          <div className="flex items-center justify-center gap-4 mb-4 pb-4 border-b border-primary/20 font-sf-mono text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary/50" />
              <span className="text-primary/70">DATA SCIENTIST</span>
            </div>
            <span className="text-primary/30">|</span>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary/50" />
              <span className="text-primary/70">ACTIVE SINCE 2018</span>
            </div>
            <span className="text-primary/30">|</span>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary/50" />
              <span className="text-primary/70">ARIZONA, USA</span>
            </div>
          </div>

          {/* Content Row */}
          <div className="grid grid-cols-[200px_1fr] gap-6 border border-primary/20 p-4">
            {/* Left: Small Profile Photo */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative border border-primary/10 bg-secondary/20 p-1 w-32 h-32">
                <Image
                  src="/images/design-mode/personal_photo.png"
                  alt="Profile"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover grayscale"
                />
                <div className="absolute bottom-1 right-1 text-[10px] font-sf-mono text-primary/50 bg-background/80 dark:bg-eerie-black/80 px-1 py-0.5">
                  VERIFIED
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-none border-primary/20 text-xs font-sf-mono bg-transparent"
                onClick={() => setIsResumeModalOpen(true)}
              >
                <FileText className="h-3 w-3 mr-1" />
                RESUME
              </Button>
            </div>

            {/* Right: Professional Summary */}
            <div className="space-y-4">
              <div className="border-b border-primary/10 pb-3">
                <h3 className="text-xs font-sf-mono text-primary/50 mb-2">PROFILE OVERVIEW</h3>
                <p className="text-sm leading-relaxed">
                  Data Scientist and AI Engineer specializing in machine learning, deep learning, and AI systems
                  development. Creating innovative solutions using cutting-edge AI technologies.
                </p>
              </div>

              <div className="border-b border-primary/10 pb-3">
                <h3 className="text-xs font-sf-mono text-primary/50 mb-2">EXPERTISE</h3>
                <p className="text-sm leading-relaxed">
                  Experience across healthcare, astronomy, and enterprise AI domains. Expertise in transformer-based
                  models, retrieval-augmented generation, and production AI system optimization.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-sf-mono text-primary/50 mb-2">EDUCATION</h3>
                <p className="text-sm leading-relaxed">
                  Currently pursuing Master's in Data Science, Analytics and Engineering at Arizona State University.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile and Desktop View (hide on tablet) */}
        <div className="contents md:hidden lg:contents">
          {/* Left column - Profile image and metadata */}
          <div className="border border-primary/20 p-3 md:p-4 relative bg-background">
            {/* Mobile View - Two separate 60-40 columns */}
            <div className="flex md:hidden gap-4 mb-0">
              {/* Profile image - 60% width */}
              <div className="w-[60%] relative p-1 flex-shrink-0 px-2.5 py-2.5 bg-background border-input border">
                <Image
                  src="/images/design-mode/personal_photo.png"
                  alt="Profile"
                  width={400}
                  height={400}
                  className="w-full grayscale"
                />
                           </div>

              {/* Metadata and Button - 40% width */}
              <div className="w-[40%] flex flex-col justify-evenly">
                <div className="flex items-center space-x-2 font-sf-mono text-xs">
                  <User className="h-4 w-4 text-primary/50" />
                  <span className="text-primary">DATA SCIENTIST</span>
                </div>
                <div className="flex items-center space-x-2 font-sf-mono text-xs">
                  <Calendar className="h-4 w-4 text-primary/50" />
                  <span className="text-secondary-foreground">ACTIVE SINCE 2018</span>
                </div>
                <div className="flex items-center space-x-2 font-sf-mono text-xs">
                  <MapPin className="h-4 w-4 text-primary/50" />
                  <span className="text-secondary-foreground">ARIZONA, USA</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-none border-primary/20 text-[10px] font-sf-mono group py-2.5 bg-primary-foreground"
                  onClick={() => setIsResumeModalOpen(true)}
                >
                  <span className="group-hover:tracking-widest transition-all duration-500 flex items-center justify-center">
                    <FileText className="h-3 w-3 mr-1.5" />
                    VIEW RESUME
                  </span>
                </Button>
              </div>
            </div>

            {/* Desktop View - Profile Image */}
            <div className="hidden md:block relative border border-primary/10 bg-secondary/20 p-1 w-full mb-4">
              <Image
                src="/images/design-mode/personal_photo.png"
                alt="Profile"
                width={400}
                height={400}
                className="w-full grayscale"
              />
              <div className="absolute bottom-2 right-2 text-xs font-sf-mono text-primary/50 bg-background/80 dark:bg-eerie-black/80 px-1.5 py-0.5">
                VERIFIED
              </div>
            </div>

            {/* Desktop Metadata */}
            <div className="hidden md:block space-y-3 font-sf-mono text-sm mb-4">
              <div className="flex items-center space-x-2 border-b border-primary/10 pb-2">
                <User className="h-4 w-4 text-primary/50" />
                <span className="text-primary/70">DATA SCIENTIST</span>
              </div>
              <div className="flex items-center space-x-2 border-b border-primary/10 pb-2">
                <Calendar className="h-4 w-4 text-primary/50" />
                <span className="text-primary/70">ACTIVE SINCE 2018</span>
              </div>
              <div className="flex items-center space-x-2 border-b border-primary/10 pb-2">
                <MapPin className="h-4 w-4 text-primary/50" />
                <span className="text-primary/70">ARIZONA, USA</span>
              </div>
            </div>

            {/* Desktop View Resume Button */}
            <Button
              variant="outline"
              className="hidden md:block w-full rounded-none border-primary/20 text-xs font-sf-mono group bg-transparent"
              onClick={() => setIsResumeModalOpen(true)}
            >
              <span className="group-hover:tracking-widest transition-all duration-500 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                VIEW RESUME
              </span>
            </Button>
          </div>

          {/* Right column - Professional data */}
          <div className="lg:col-span-2 border border-primary/20 p-4 md:p-6 relative flex flex-col justify-between">
            <div>
              <div className="space-y-4 md:space-y-6">
                <div className="border-b border-primary/10 pb-4">
                  <h3 className="text-sm font-sf-mono text-primary/50 mb-2">PROFILE OVERVIEW</h3>
                  <p className="text-sm leading-relaxed">
                    Data Scientist and AI Engineer specializing in machine learning, deep learning, and AI systems
                    development. Creating innovative solutions using cutting-edge AI technologies.
                  </p>
                </div>

                <div className="border-b border-primary/10 pb-4">
                  <h3 className="text-sm font-sf-mono text-primary/50 mb-2">EXPERTISE</h3>
                  <p className="text-sm leading-relaxed">
                    Experience across healthcare, astronomy, and enterprise AI domains. Expertise in transformer-based
                    models, retrieval-augmented generation, and production AI system optimization.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-sf-mono text-primary/50 mb-2">EDUCATION</h3>
                  <p className="text-sm leading-relaxed">
                    Currently pursuing Master's in Data Science, Analytics and Engineering at Arizona State University.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Modal */}
        <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
      </div>
    </PageLayout>
  )
}
