"use client"

import type { ReactNode } from "react"
import { Github, Linkedin, Mail, FileText } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ResumeModal } from "@/components/features/resume/resume-modal"
import { useNavigation } from "@/contexts/navigation-context"

interface PageLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  showSocialLinks?: boolean
}

export function PageLayout({ title, subtitle, children, showSocialLinks = false }: PageLayoutProps) {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)
  const { navigateTo } = useNavigation()

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-[1fr_2fr] gap-3 sm:gap-4 md:gap-6 lg:gap-8 py-3 sm:py-4 md:py-6 lg:py-8 px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="md:sticky md:top-20 lg:top-24 self-start flex flex-col justify-center md:h-auto lg:h-[calc(100vh-12rem)] md:mb-4 lg:mb-0">
          <h1 className="relative pb-2 text-lg sm:text-xl md:text-xl lg:text-2xl font-medium tracking-tight uppercase before:content-[''] before:absolute before:top-0 before:left-0 before:w-20 sm:before:w-24 md:before:w-28 lg:before:w-32 before:h-0.5 before:bg-primary/70">
            {title}
          </h1>
          <p className="text-[10px] sm:text-xs md:text-xs lg:text-sm text-primary/70 font-sf-mono tracking-wide">
            {subtitle}
          </p>

          {showSocialLinks && (
            <div className="mt-6 flex flex-col gap-3">
              {/* Social Icons Row */}
              <div className="flex items-center gap-2">
                <Link
                  href="https://github.com/rushirb2001"
                  target="_blank"
                  className="w-8 h-8 flex items-center justify-center border border-primary/20 hover:bg-primary hover:text-background transition-colors"
                >
                  <Github className="h-4 w-4" />
                </Link>
                <Link
                  href="https://linkedin.com/in/rushir-bhavsar/"
                  target="_blank"
                  className="w-8 h-8 flex items-center justify-center border border-primary/20 hover:bg-primary hover:text-background transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </Link>
                <Link
                  href="mailto:rushirbhavsar@gmail.com"
                  className="w-8 h-8 flex items-center justify-center border border-primary/20 hover:bg-primary hover:text-background transition-colors"
                >
                  <Mail className="h-4 w-4" />
                </Link>
              </div>

              {/* Resume & Contact Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsResumeModalOpen(true)}
                  className="h-8 px-3 flex items-center gap-1.5 text-[10px] font-sf-mono border border-primary/20 hover:bg-primary hover:text-background transition-colors tracking-wider"
                >
                  <FileText className="h-3 w-3" />
                  RESUME
                </button>
                <button
                  onClick={() => navigateTo("/contact")}
                  className="h-8 px-3 flex items-center gap-1.5 text-[10px] font-sf-mono border border-primary/20 hover:bg-primary hover:text-background transition-colors tracking-wider"
                >
                  CONTACT
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="w-full max-w-full flex flex-col justify-center">
          <div className="break-words overflow-hidden pt-2 sm:pt-3 md:pt-4 lg:pt-8 px-0 sm:px-2 md:px-4 lg:px-0">
            {children}
          </div>
        </div>
      </div>

      {showSocialLinks && <ResumeModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />}
    </>
  )
}
