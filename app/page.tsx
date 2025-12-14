"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, FileText, Github, Linkedin } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { AnimatePresence } from "framer-motion"

const navigateTo = (url) => {
  window.location.href = url
}

const Page = () => {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)

  return (
    <AnimatePresence>
      {true && (
        <motion.div
          className="relative flex flex-col md:flex-row items-center justify-center min-h-screen py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Left Column - Buttons */}
          <motion.div className="flex flex-col md:flex-row items-center justify-center w-full md:w-1/2">
            <motion.div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Button
                className="group rounded-none border border-primary/20 bg-transparent text-primary hover:bg-primary/10 font-black text-sm px-4"
                onClick={() => navigateTo("/projects")}
              >
                EXPLORE
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                className="group rounded-none border border-primary/20 bg-transparent text-primary hover:bg-primary/10 font-black text-sm px-4"
                onClick={() => navigateTo("/contact")}
              >
                CONTACT
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column - Profile Image and Resume */}
          <motion.div
            className="relative px-6 md:px-5 py-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {/* Profile Image */}
            <div className="relative border border-primary/20 bg-secondary/20 p-1 mb-4">
              <Image
                src="/images/design-mode/new_personal_photo(1).png"
                alt="Profile"
                width={300}
                height={300}
                className="w-full grayscale"
              />
              <div className="absolute top-2 right-2 bg-background/80 border border-primary/30 px-2 py-1 text-[10px] font-sf-mono">
                VERIFIED
              </div>
            </div>

            {/* Resume Button */}
            <Button
              className="w-full rounded-none border-primary/20 text-xs font-sf-mono group bg-transparent hover:bg-primary/10 mb-2"
              onClick={() => setIsResumeModalOpen(true)}
            >
              <span className="group-hover:tracking-widest transition-all duration-500 flex items-center">
                <FileText className="h-3 w-3 mr-2" />
                VIEW RESUME
                <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>

            {/* GitHub and LinkedIn Buttons */}
            <div className="flex gap-2">
              <Button
                className="flex-1 group rounded-none border border-primary/20 bg-transparent text-primary hover:bg-primary/10 font-black p-2"
                asChild
              >
                <Link href="https://github.com/rushirb2001" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 text-purple-800" />
                  <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                className="flex-1 group rounded-none border border-primary/20 bg-transparent text-primary hover:bg-primary/10 font-black p-2"
                asChild
              >
                <Link href="https://linkedin.com/in/rushir-bhavsar/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4 text-blue-700" />
                  <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Page
