"use client"

import { useState } from "react"

const specializations = [
  "Distributed Model Training",
  "RAG & Agentic Pipelines",
  "Multi-Modal Learning",
  "LLM Fine-Tuning & RLHF",
  "Protein Structure Prediction",
  "Real-Time Inference Systems",
]

const libraries = [
  "PyTorch",
  "PyTorch Lightning",
  "LangChain",
  "LangGraph",
  "Hugging Face",
  "vLLM",
  "CUDA",
  "DeepSpeed",
  "Ray",
  "Spark",
]

export default function LinkedInBannerPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-neutral-300 dark:bg-neutral-800">
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

      <p className="font-sf-mono text-xs text-neutral-500 mb-4 py-6">
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
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(${theme === "light" ? "#000" : "#fff"} 1px, transparent 1px), linear-gradient(90deg, ${theme === "light" ? "#000" : "#fff"} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Main Content Container - Two Half Design */}
        <div className="relative h-full flex items-center px-20">
          {/* Left Half - Name & Positions */}
          <div className="flex-1 flex flex-col justify-center pr-16">
            {/* Name */}
            <h1 
              className="font-sf-mono font-bold tracking-tight leading-none mb-4"
              style={{ fontSize: "48px", letterSpacing: "-0.01em" }}
            >
              RUSHIR BHAVSAR
            </h1>

            {/* Name Underline */}
            <div 
              className="mb-6"
              style={{ 
                height: "2px", 
                backgroundColor: theme === "light" ? "#1a1a1a" : "#e8e8e8",
                width: "300px"
              }}
            />

            {/* Position 1 */}
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="h-[3px]"
                style={{ 
                  backgroundColor: theme === "light" ? "#1a1a1a" : "#e8e8e8",
                  width: "16px",
                  flexShrink: 0
                }}
              />
              <span 
                className="font-sf-mono font-bold tracking-wide whitespace-nowrap"
                style={{ fontSize: "28px", letterSpacing: "0.02em" }}
              >
                MACHINE LEARNING ENGINEER
              </span>
            </div>

            {/* Position 2 */}
            <div className="flex items-center gap-3 mb-8">
              <div 
                className="h-[3px]"
                style={{ 
                  backgroundColor: theme === "light" ? "#1a1a1a" : "#e8e8e8",
                  width: "16px",
                  flexShrink: 0
                }}
              />
              <span 
                className="font-sf-mono font-bold tracking-wide whitespace-nowrap"
                style={{ fontSize: "28px", letterSpacing: "0.02em" }}
              >
                GENAI ENGINEER
              </span>
            </div>

            {/* GitHub Link */}
            <div>
              <span className="font-sf-mono" style={{ fontSize: "10px", letterSpacing: "0.15em", opacity: 0.4 }}>
                GITHUB
              </span>
              <p 
                className="font-sf-mono font-medium tracking-wide mt-1"
                style={{ fontSize: "16px", letterSpacing: "0.05em" }}
              >
                github.com/rushirb2001
              </p>
            </div>
          </div>

          {/* Vertical Divider */}
          <div 
            className="h-64 w-[1px] opacity-15"
            style={{ backgroundColor: theme === "light" ? "#1a1a1a" : "#e8e8e8" }}
          />

          {/* Right Half - Specializations & Libraries */}
          <div className="flex-1 flex flex-col justify-center pl-20">
            {/* Specializations Section */}
            <div className="mb-12">
              {/* Specializations Header */}
              <span 
                className="font-sf-mono opacity-40 mb-5 block"
                style={{ fontSize: "10px", letterSpacing: "0.15em" }}
              >
                SPECIALIZATIONS
              </span>

              {/* Specializations Grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {specializations.map((spec, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span 
                      className="w-2 h-2 mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: theme === "light" ? "#1a1a1a" : "#e8e8e8", opacity: 0.6 }}
                    />
                    <span 
                      className="font-sf-mono font-medium opacity-80"
                      style={{ fontSize: "14px", lineHeight: "1.4" }}
                    >
                      {spec}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technologies Section */}
            <div>
              {/* Technologies Header */}
              <span 
                className="font-sf-mono opacity-40 mb-5 block"
                style={{ fontSize: "10px", letterSpacing: "0.15em" }}
              >
                TECHNOLOGIES
              </span>

              {/* Technologies Tags */}
              <div className="flex flex-wrap gap-2.5">
                {libraries.map((lib, idx) => (
                  <span 
                    key={idx}
                    className="font-sf-mono px-3 py-2 border font-medium"
                    style={{ 
                      fontSize: "12px",
                      borderColor: theme === "light" ? "rgba(26,26,26,0.25)" : "rgba(232,232,232,0.25)",
                      opacity: 0.8,
                      letterSpacing: "0.02em"
                    }}
                  >
                    {lib}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center py-8">
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
