"use client"

import { PageLayout } from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { useState } from "react"
import { ContactFormModal } from "@/components/features/contact/contact-form-modal"
import { CallFormModal } from "@/components/features/contact/call-form-modal"
import { CONTACT_INFO } from "@/lib/constants"
import { motion } from "framer-motion"

export default function ContactPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCallModalOpen, setIsCallModalOpen] = useState(false)

  return (
    <PageLayout title="CONTACT" subtitle="GET IN TOUCH">
      <div className="space-y-3 max-w-xl mx-auto">
        {/* Primary Action */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="border border-primary/20 bg-background"
        >
          <div className="border-b border-primary/20 px-3 py-2 bg-primary/5">
            <div className="flex items-center justify-between">
              <span className="font-sf-mono font-bold tracking-widest text-base">DIRECT MESSAGE</span>
              <span className="font-sf-mono text-primary/30 text-base">[01]</span>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <p className="font-sf-mono text-primary/60 text-sm">
              SEND ME A DETAILED EMAIL  
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="rounded-none bg-primary text-background border-none hover:bg-primary/90 font-sf-mono text-[10px] tracking-widest px-4 py-2 h-auto"
            >
              {"COMPOSE EMAIL →"}
            </Button>
          </div>
        </motion.div>

        {/* Book a Call */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="border border-primary/20 bg-background"
        >
          <div className="border-b border-primary/20 px-3 py-2 bg-primary/5">
            <div className="flex items-center justify-between">
              <span className="font-sf-mono font-bold tracking-widest text-base">BOOK A CALL</span>
              <span className="font-sf-mono text-primary/30 text-base">[02]</span>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <p className="font-sf-mono text-primary/60 text-sm">
              SCHEDULE A 30-MIN CALL WITH ME
            </p>
            <Button
              onClick={() => setIsCallModalOpen(true)}
              className="rounded-none bg-primary text-background border-none hover:bg-primary/90 font-sf-mono text-[10px] tracking-widest px-4 py-2 h-auto"
            >
              {"BOOK CALL →"}
            </Button>
          </div>
        </motion.div>

        {/* Contact & Social - Two Columns */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          {/* Contact Info */}
          <div className="border border-primary/20 bg-background">
            <div className="border-b border-primary/20 px-3 py-2 bg-primary/5">
              <div className="flex items-center justify-between text-base">
                <span className="font-sf-mono font-bold tracking-widest text-base">CONTACT</span>
                <span className="font-sf-mono text-primary/30 text-base">[02]</span>
              </div>
            </div>
            <div className="divide-y divide-primary/10">
              <a href={`mailto:${CONTACT_INFO.email}`} className="p-4 flex items-center gap-3 hover:bg-primary/5 transition-colors">
                <Mail className="h-4 w-4 text-primary/50 flex-shrink-0" />
                <span className="font-sf-mono text-primary/70 break-all text-xs tracking-[-0.1em]">{CONTACT_INFO.email}</span>
              </a>
              <a href={`tel:${CONTACT_INFO.phone}`} className="p-4 flex items-center gap-3 hover:bg-primary/5 transition-colors">
                <Phone className="h-4 w-4 text-primary/50 flex-shrink-0" />
                <span className="font-sf-mono text-primary/70 text-xs tracking-[-0.1em]">{CONTACT_INFO.phone}</span>
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="border border-primary/20 bg-background">
            <div className="border-b border-primary/20 px-3 py-2 bg-primary/5">
              <div className="flex items-center justify-between">
                <span className="font-sf-mono font-bold tracking-widest text-base">SOCIAL</span>
                <span className="font-sf-mono text-primary/30 text-base">[03]</span>
              </div>
            </div>
            <div className="divide-y divide-primary/10">
              <a href={CONTACT_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 flex items-center gap-3 hover:bg-primary/5 transition-colors">
                <Linkedin className="h-4 w-4 text-primary/50 flex-shrink-0" />
                <span className="font-sf-mono text-primary/70 text-sm">LINKEDIN</span>
              </a>
              <a href={CONTACT_INFO.github} target="_blank" rel="noopener noreferrer" className="p-4 flex items-center gap-3 hover:bg-primary/5 transition-colors">
                <Github className="h-4 w-4 text-primary/50 flex-shrink-0" />
                <span className="font-sf-mono text-primary/70 text-sm">GITHUB</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3 }}
          className="flex items-center justify-between border-t border-primary/20 pt-3"
        >
          <div className="font-sf-mono text-primary/40 uppercase tracking-wider text-sm">
            RESPONSE TIME: 24-48 HOURS
          </div>
          <div className="font-sf-mono text-primary/30 text-sm">LAST.UPDATED: 2025</div>
        </motion.div>
      </div>

      {/* Contact Form Modal */}
      <ContactFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Calendly Form Modal */}
      <CallFormModal 
        isOpen={isCallModalOpen} 
        onClose={() => setIsCallModalOpen(false)} 
        calUsername="rushir-bhavsar-h7hcgm"
        calEventSlug="30min"
      />
    </PageLayout>
  )
}
