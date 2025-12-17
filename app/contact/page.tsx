"use client"

import { PageLayout } from "@/components/layout/page-layout"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { useState } from "react"
import { ContactFormModal } from "@/components/features/contact/contact-form-modal"
import { CONTACT_INFO } from "@/lib/constants"
import { motion } from "framer-motion"

export default function ContactPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <PageLayout title="CONTACT" subtitle="GET IN TOUCH">
      <div className="space-y-3">
        {/* Primary Action */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="border border-primary/20 bg-background"
        >
          <div className="border-b border-primary/20 px-3 py-2 bg-primary/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sf-mono font-bold tracking-widest">DIRECT MESSAGE</span>
              <span className="text-[10px] font-sf-mono text-primary/30">[01]</span>
            </div>
          </div>
          <div className="p-6 flex flex-col items-center justify-center">
            <p className="text-xs font-sf-mono text-primary/60 mb-6 text-center max-w-md">
              SEND ME A DETAILED EMAIL OR DROP A CALL
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="rounded-none bg-primary text-background border-none hover:bg-primary/90 font-sf-mono text-xs tracking-widest px-8 py-5"
            >
              COMPOSE EMAIL →
            </Button>
          </div>
        </motion.div>

        {/* Contact Details Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="border border-primary/20 bg-background"
        >
          <div className="border-b border-primary/20 px-3 py-2 bg-primary/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sf-mono font-bold tracking-widest">CONTACT INFO</span>
              <span className="text-[10px] font-sf-mono text-primary/30">[02]</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-primary/10">
            {/* Email */}
            <div className="p-4 flex items-start gap-3 hover:bg-primary/5 transition-colors">
              <Mail className="h-4 w-4 mt-0.5 text-primary/50 flex-shrink-0" />
              <div>
                <span className="text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider block mb-1">
                  EMAIL
                </span>
                
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-xs font-sf-mono text-primary/70 hover:text-primary transition-colors break-all"
                >
                  {CONTACT_INFO.email}
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="p-4 flex items-start gap-3 hover:bg-primary/5 transition-colors">
              <Phone className="h-4 w-4 mt-0.5 text-primary/50 flex-shrink-0" />
              <div>
                <span className="text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider block mb-1">
                  PHONE
                </span>
                
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="text-xs font-sf-mono text-primary/70 hover:text-primary transition-colors"
                >
                  {CONTACT_INFO.phone}
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="p-4 flex items-start gap-3 hover:bg-primary/5 transition-colors md:col-span-2 border-t border-primary/10">
              <MapPin className="h-4 w-4 mt-0.5 text-primary/50 flex-shrink-0" />
              <div>
                <span className="text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider block mb-1">
                  LOCATION
                </span>
                <span className="text-xs font-sf-mono text-primary/70">{CONTACT_INFO.location}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="border border-primary/20 bg-background"
        >
          <div className="border-b border-primary/20 px-3 py-2 bg-primary/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sf-mono font-bold tracking-widest">SOCIAL LINKS</span>
              <span className="text-[10px] font-sf-mono text-primary/30">[03]</span>
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-primary/10">
            
              href={CONTACT_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 flex flex-col items-center gap-2 hover:bg-primary/10 transition-colors group"
            >
              <Linkedin className="h-5 w-5 text-primary/50 group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-sf-mono text-primary/50 group-hover:text-primary uppercase tracking-wider">
                LinkedIn
              </span>
            </a>
            
              href={CONTACT_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 flex flex-col items-center gap-2 hover:bg-primary/10 transition-colors group"
            >
              <Github className="h-5 w-5 text-primary/50 group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-sf-mono text-primary/50 group-hover:text-primary uppercase tracking-wider">
                GitHub
              </span>
            </a>
            
              href={`mailto:${CONTACT_INFO.email}`}
              className="p-4 flex flex-col items-center gap-2 hover:bg-primary/10 transition-colors group"
            >
              <Mail className="h-5 w-5 text-primary/50 group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-sf-mono text-primary/50 group-hover:text-primary uppercase tracking-wider">
                Email
              </span>
            </a>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3 }}
          className="flex items-center justify-between border-t border-primary/20 pt-3"
        >
          <div className="text-[10px] font-sf-mono text-primary/40 uppercase tracking-wider">
            RESPONSE TIME: 24-48 HOURS
          </div>
          <div className="text-[10px] font-sf-mono text-primary/30">LAST.UPDATED: 2025</div>
        </motion.div>
      </div>

      {/* Contact Form Modal */}
      <ContactFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </PageLayout>
  )
}
