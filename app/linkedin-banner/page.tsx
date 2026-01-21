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
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(${theme === "light" ? "#000" : "#fff"} 1px, transparent 1px), linear-gradient(90deg, ${theme === "light" ? "#000" : "#fff"} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Main Content Container */}
        <div className="relative h-full flex items-center justify-center px-24 py-12">
          <div className="flex flex-col items-center text-center w-full">
            {/* Position Titles */}
            <div className="flex items-center gap-6 mb-8">
              <h1 
                className="font-sf-mono font-bold tracking-tight leading-none"
                style={{ fontSize: "52px" }}
              >
                MACHINE LEARNING ENGINEER
              </h1>
              <span 
                className="font-sf-mono opacity-30"
                style={{ fontSize: "40px" }}
              >
                /
              </span>
              <h1 
                className="font-sf-mono font-bold tracking-tight leading-none"
                style={{ fontSize: "52px" }}
              >
                GENAI ENGINEER
              </h1>
            </div>

            {/* Divider */}
            <div 
              className="w-48 h-[1px] mb-8 opacity-20"
              style={{ backgroundColor: theme === "light" ? "#1a1a1a" : "#e8e8e8" }}
            />

            {/* Specializations */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-8 max-w-4xl">
              {specializations.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span 
                    className="w-1 h-1"
                    style={{ backgroundColor: theme === "light" ? "#1a1a1a" : "#e8e8e8", opacity: 0.5 }}
                  />
                  <span 
                    className="font-sf-mono opacity-60 uppercase tracking-wider"
                    style={{ fontSize: "12px", letterSpacing: "0.1em" }}
                  >
                    {spec}
                  </span>
                </div>
              ))}
            </div>

            {/* Libraries */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {libraries.map((lib, idx) => (
                <span 
                  key={idx}
                  className="font-sf-mono px-3 py-1.5 border"
                  style={{ 
                    fontSize: "11px",
                    borderColor: theme === "light" ? "rgba(26,26,26,0.25)" : "rgba(232,232,232,0.25)",
                    opacity: 0.7,
                  }}
                >
                  {lib}
                </span>
              ))}
            </div>

            {/* Contact Info */}
            <div className="flex items-center gap-8 opacity-40">
              <span className="font-sf-mono" style={{ fontSize: "11px", letterSpacing: "0.1em" }}>
                rbhavsar@asu.edu
              </span>
              <span 
                className="font-sf-mono"
                style={{ fontSize: "11px" }}
              >
                |
              </span>
              <span className="font-sf-mono" style={{ fontSize: "11px", letterSpacing: "0.1em" }}>
                github.com/rushirb2001
              </span>
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
