"use client"

import { useState } from "react"

const specializations = [
  "Machine Learning",
  "Deep Learning", 
  "Computer Vision",
  "NLP",
  "LLMs",
  "Generative AI",
  "MLOps",
]

const techStack = [
  "PyTorch",
  "TensorFlow",
  "AWS",
  "Python",
  "Kubernetes",
  "Spark",
]

export default function LinkedInBannerPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-neutral-200 dark:bg-neutral-900">
      {/* Controls */}
      <div className="mb-8 flex items-center gap-4">
        <span className="font-sf-mono text-sm text-neutral-600 dark:text-neutral-400">THEME:</span>
        <button
          onClick={() => setTheme("light")}
          className={`px-3 py-1 font-sf-mono text-sm border ${
            theme === "light" 
              ? "bg-black text-white border-black" 
              : "bg-transparent text-neutral-600 border-neutral-400"
          }`}
        >
          LIGHT
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`px-3 py-1 font-sf-mono text-sm border ${
            theme === "dark" 
              ? "bg-white text-black border-white" 
              : "bg-transparent text-neutral-600 border-neutral-400"
          }`}
        >
          DARK
        </button>
      </div>

      <p className="font-sf-mono text-xs text-neutral-500 mb-4">
        LinkedIn Banner Size: 1584 x 396px — Screenshot this banner below
      </p>

      {/* LinkedIn Banner - Exact Size */}
      <div 
        className="relative overflow-hidden"
        style={{ 
          width: "1584px", 
          height: "396px",
          backgroundColor: theme === "light" ? "#f5f5f5" : "#0e0e0e",
          color: theme === "light" ? "#1a1a1a" : "#e8e8e8",
        }}
      >
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(${theme === "light" ? "#000" : "#fff"} 1px, transparent 1px), linear-gradient(90deg, ${theme === "light" ? "#000" : "#fff"} 1px, transparent 1px)`,
            backgroundSize: "44px 44px",
            backgroundPosition: "0 0",
          }}
        />

        {/* Main Content Container */}
        <div className="relative h-full flex items-center justify-between px-16">
          {/* Left Section - Name & Title */}
          <div className="flex flex-col justify-center">
            {/* Decorative Line */}
            <div 
              className="w-24 h-[2px] mb-6"
              style={{ backgroundColor: theme === "light" ? "#1a1a1a" : "#e8e8e8" }}
            />
            
            {/* Name */}
            <h1 
              className="font-sf-mono font-bold tracking-tight leading-none"
              style={{ fontSize: "72px" }}
            >
              RUSHIR BHAVSAR
            </h1>
            
            {/* Title */}
            <p 
              className="font-sf-mono tracking-widest mt-4 opacity-60"
              style={{ fontSize: "18px", letterSpacing: "0.2em" }}
            >
              DATA SCIENTIST & AI ENGINEER
            </p>

            {/* Subtitle */}
            <p 
              className="font-sf-mono mt-2 opacity-40"
              style={{ fontSize: "14px", letterSpacing: "0.1em" }}
            >
              MS Computer Science @ Arizona State University
            </p>
          </div>

          {/* Center Section - Vertical Divider */}
          <div 
            className="h-48 w-[1px] opacity-20"
            style={{ backgroundColor: theme === "light" ? "#1a1a1a" : "#e8e8e8" }}
          />

          {/* Right Section - Specializations */}
          <div className="flex flex-col justify-center">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
              <span 
                className="font-sf-mono text-xs tracking-widest opacity-40"
                style={{ letterSpacing: "0.15em" }}
              >
                SPECIALIZATIONS
              </span>
              <div 
                className="flex-1 h-[1px] opacity-20 w-32"
                style={{ backgroundColor: theme === "light" ? "#1a1a1a" : "#e8e8e8" }}
              />
            </div>

            {/* Specialization Tags - 2 Column Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {specializations.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span 
                    className="w-1.5 h-1.5"
                    style={{ backgroundColor: theme === "light" ? "#1a1a1a" : "#e8e8e8", opacity: 0.4 }}
                  />
                  <span 
                    className="font-sf-mono opacity-70"
                    style={{ fontSize: "14px" }}
                  >
                    {spec}
                  </span>
                </div>
              ))}
            </div>

            {/* Tech Stack Row */}
            <div className="flex items-center gap-3 mt-8">
              {techStack.map((tech, idx) => (
                <span 
                  key={idx}
                  className="font-sf-mono px-2 py-1 border opacity-50"
                  style={{ 
                    fontSize: "11px",
                    borderColor: theme === "light" ? "rgba(26,26,26,0.3)" : "rgba(232,232,232,0.3)",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>


        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center">
        <p className="font-sf-mono text-xs text-neutral-500 mb-2">
          Instructions: Take a screenshot of the banner above
        </p>
        <p className="font-sf-mono text-xs text-neutral-400">
          On Mac: Cmd + Shift + 4, then drag to select the banner area
        </p>
      </div>
    </div>
  )
}
