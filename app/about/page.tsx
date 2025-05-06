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
        {/* Left column - Profile image and metadata */}
        <div className="border border-primary/20 p-3 md:p-4 relative">
          <div className="absolute -top-2 -left-2 text-xs font-sf-mono text-primary/50 bg-background dark:bg-eerie-deepblack px-1.5 py-0.5">
            ID: PROFILE-7J-1801
          </div>

          <div className="space-y-4 md:space-y-6">
            {/* Profile image */}
            <div className="relative border border-primary/10 bg-secondary/20 p-1">
              <Image
                src="https://v9fl0vq2qbxv8yrh.public.blob.vercel-storage.com/personal_photo.png"
                alt="Profile"
                width={400}
                height={400}
                className="w-full grayscale"
              />
              <div className="absolute bottom-2 right-2 text-xs font-sf-mono text-primary/50 bg-background/80 dark:bg-eerie-black/80 px-1.5 py-0.5">
                VERIFIED
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-3 font-sf-mono text-sm">
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

            {/* View Resume Button */}
            <Button
              variant="outline"
              className="w-full rounded-none border-primary/20 text-xs font-sf-mono group"
              onClick={() => setIsResumeModalOpen(true)}
            >
              <span className="group-hover:tracking-widest transition-all duration-500 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                VIEW RESUME
              </span>
            </Button>
          </div>
        </div>

        {/* Right column - Professional data */}
        <div className="lg:col-span-2 border border-primary/20 p-4 md:p-6 relative flex flex-col justify-between">
          <div>
            <div className="absolute -top-2 -left-2 text-xs font-sf-mono text-primary/50 bg-background dark:bg-eerie-deepblack px-1.5 py-0.5">
              SUBJECT: PROFESSIONAL DATA
            </div>

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

          <div className="text-xs text-primary/30 font-sf-mono text-center mt-6 pt-4 border-t border-primary/10">
            DOCUMENT CLASSIFICATION: INTERNAL USE ONLY
          </div>
        </div>
      </div>

      {/* Resume Modal */}
      <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />
    </PageLayout>
  )
}
