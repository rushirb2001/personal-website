"use client"

import type { ReactNode } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

interface PageLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function PageLayout({ title, subtitle, children }: PageLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const contentY = useTransform(scrollYProgress, [0, 1], [20, -20])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.7, 1, 1, 0.7])

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-[1fr_2fr] gap-3 sm:gap-4 md:gap-6 lg:gap-8 py-3 sm:py-4 md:py-6 lg:py-8 px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="md:sticky md:top-20 lg:top-24 self-start flex flex-col justify-center md:h-auto lg:h-[calc(100vh-12rem)] md:mb-4 lg:mb-0">
        <h1 className="relative pb-2 text-lg sm:text-xl md:text-xl lg:text-2xl font-medium tracking-tight uppercase before:content-[''] before:absolute before:top-0 before:left-0 before:w-20 sm:before:w-24 md:before:w-28 lg:before:w-32 before:h-0.5 before:bg-primary/70">
          {title}
        </h1>
        <p className="text-[10px] sm:text-xs md:text-xs lg:text-sm text-primary/70 font-sf-mono tracking-wide">
          {subtitle}
        </p>
      </div>

      <motion.div
        ref={containerRef}
        className="w-full max-w-full flex flex-col justify-center group"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          className="break-words overflow-hidden pt-2 sm:pt-3 md:pt-4 lg:pt-8 px-0 sm:px-2 md:px-4 lg:px-0"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="transition-all duration-500 ease-out"
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
