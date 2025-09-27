"use client"

import { PageLayout } from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { useState } from "react"
import { ContactFormModal } from "@/components/features/contact/contact-form-modal"
import { CONTACT_INFO } from "@/lib/constants"

export default function ContactPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <PageLayout title="CONTACT" subtitle="COMMUNICATION PROTOCOL">
      <div className="grid gap-4 md:gap-8 h-full">
        {/* Button to open contact form modal */}
        <div className="border border-primary/20 p-4 md:p-6 relative bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
          {/* ID Label */}
          <div className="absolute -top-2 -left-2 text-xs font-sf-mono text-primary/50 bg-background dark:bg-eerie-deepblack px-1.5 py-0.5">
            FORM-7G-893
          </div>

          {/* Status indicator */}
          <div className="absolute -bottom-2 -right-2 text-xs font-sf-mono text-primary/50 bg-background dark:bg-eerie-deepblack px-1.5 py-0.5 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
            SECURE CHANNEL
          </div>

          <div className="text-center mb-6">
            <h2 className="text-lg font-medium mb-2">DIRECT COMMUNICATION</h2>
            <p className="text-sm text-primary/70 mb-4">Initiate a secure transmission to establish direct contact</p>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="rounded-none bg-transparent border border-primary/20 text-primary hover:bg-primary/5 font-sf-mono text-sm group px-8 py-6"
          >
            <span className="group-hover:tracking-widest transition-all duration-500">OPEN COMMUNICATION CHANNEL</span>
          </Button>
        </div>

        {/* Contact information */}
        <div className="border border-primary/10 p-4 md:p-6 relative">
          <div className="absolute -top-2 -left-2 text-xs font-sf-mono text-primary/50 bg-background dark:bg-eerie-deepblack px-1.5 py-0.5">
            DIRECT CHANNELS
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="flex items-center text-sm group border border-primary/10 p-3">
                <Mail className="h-4 w-4 mr-3 text-primary/70 group-hover:text-primary transition-colors flex-shrink-0" />
                <span className="font-sf-mono tracking-wider group-hover:tracking-widest transition-all duration-700 text-xs truncate">
                  {CONTACT_INFO.email}
                </span>
              </div>

              <div className="flex items-center text-sm group border border-primary/10 p-3">
                <Phone className="h-4 w-4 mr-3 text-primary/70 group-hover:text-primary transition-colors flex-shrink-0" />
                <span className="font-sf-mono tracking-wider group-hover:tracking-widest transition-all duration-700 text-xs">
                  {CONTACT_INFO.phone}
                </span>
              </div>

              <div className="flex items-center text-sm group border border-primary/10 p-3 md:col-span-2">
                <MapPin className="h-4 w-4 mr-3 text-primary/70 group-hover:text-primary transition-colors flex-shrink-0" />
                <span className="font-sf-mono tracking-wider group-hover:tracking-widest transition-all duration-700 text-xs">
                  LOCATION: {CONTACT_INFO.location}
                </span>
              </div>
            </div>

            <div className="pt-3 md:pt-4 border-t border-primary/10">
              <p className="text-xs font-medium mb-3 text-primary/50 font-sf-mono">EXTERNAL NETWORKS:</p>
              <div className="flex space-x-4 md:space-x-6">
                <a
                  href={CONTACT_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary/70 hover:text-primary transition-colors group border border-primary/10 p-2"
                >
                  <Linkedin className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="sr-only">LinkedIn</span>
                </a>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-primary/70 hover:text-primary transition-colors group border border-primary/10 p-2"
                >
                  <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="sr-only">Email</span>
                </a>
                <a
                  href={CONTACT_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary/70 hover:text-primary transition-colors group border border-primary/10 p-2"
                >
                  <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="sr-only">Website</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Warning message */}
        <div className="text-xs text-primary/40 font-sf-mono text-center mt-2 border-t border-primary/10 pt-4">
          NOTICE: ALL COMMUNICATIONS ARE SUBJECT TO REVIEW
        </div>
      </div>

      {/* Contact Form Modal */}
      <ContactFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </PageLayout>
  )
}
