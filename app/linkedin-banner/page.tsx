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

        {/* Main Content Container */}
        <div className="relative h-full flex items-center justify-between px-16">
          {/* LEFT SECTION - 45% */}
          <div className="flex-1 flex flex-col justify-center pr-12">
            {/* Name */}
            <div className="mb-8">
              <h1 
                className="font-sf-mono font-bold tracking-tight leading-none"
                style={{ fontSize: "56px", letterSpacing: "-0.02em" }}
              >
                RUSHIR
              </h1>
              <h1 
                className="font-sf-mono font-bold tracking-tight leading-none"
                style={{ fontSize: "56px", letterSpacing: "-0.02em" }}
              >
                BHAVSAR
              </h1>
            </div>

            {/* Positions - Large & Bold */}
            <div className="space-y-2">
              <div>
                <span 
                  className="font-sf-mono font-bold tracking-wide"
                  style={{ fontSize: "24px", letterSpacing: "0.01em", lineHeight: "1.3" }}
                >
                  ML ENGINEER
                </span>
              </div>
              <div>
                <span 
                  className="font-sf-mono font-bold tracking-wide"
                  style={{ fontSize: "24px", letterSpacing: "0.01em", lineHeight: "1.3" }}
                >
                  GENAI ENGINEER
                </span>
              </div>
            </div>

            {/* Spacer */}
            <div className="my-6" />

            {/* GitHub - Highlighted */}
            <div>
              <span 
                className="font-sf-mono text-xs opacity-50"
                style={{ letterSpacing: "0.2em", display: "block", marginBottom: "6px" }}
              >
                CONNECT
              </span>
              <span 
                className="font-sf-mono font-bold"
                style={{ fontSize: "16px", letterSpacing: "0.02em", display: "block" }}
              >
                github.com/rushirb2001
              </span>
            </div>
          </div>

          {/* CENTER DIVIDER */}
          <div 
            className="h-80 w-[2px]"
            style={{ backgroundColor: theme === "light" ? "#1a1a1a" : "#e8e8e8", opacity: 0.1 }}
          />

          {/* RIGHT SECTION - 55% */}
          <div className="flex-1 flex flex-col justify-center pl-12">
            {/* SPECIALIZATIONS SECTION */}
            <div className="mb-10">
              <span 
                className="font-sf-mono text-xs font-bold opacity-50 block mb-6"
                style={{ letterSpacing: "0.2em" }}
              >
                SPECIALIZATIONS
              </span>
              
              <div className="space-y-3">
                {specializations.map((spec, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span 
                      className="w-2 h-2 mt-2 flex-shrink-0"
                      style={{ backgroundColor: theme === "light" ? "#1a1a1a" : "#e8e8e8" }}
                    />
                    <span 
                      className="font-sf-mono font-medium"
                      style={{ fontSize: "15px", lineHeight: "1.4", opacity: 0.85 }}
                    >
                      {spec}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* TECHNOLOGIES SECTION */}
            <div>
              <span 
                className="font-sf-mono text-xs font-bold opacity-50 block mb-4"
                style={{ letterSpacing: "0.2em" }}
              >
                TECHNOLOGIES
              </span>
              
              <div className="flex flex-wrap gap-2">
                {libraries.map((lib, idx) => (
                  <span 
                    key={idx}
                    className="font-sf-mono px-3 py-2 border font-medium"
                    style={{ 
                      fontSize: "12px",
                      borderColor: theme === "light" ? "rgba(26,26,26,0.25)" : "rgba(232,232,232,0.25)",
                      opacity: 0.8,
                      letterSpacing: "0.01em"
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
