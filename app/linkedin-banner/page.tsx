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

      {/* LinkedIn Banner - Exact Size with 4:1 Ratio */}
      <div 
        className="relative overflow-hidden flex-shrink-0"
        style={{ 
          width: "1584px", 
          height: "396px",
          backgroundColor: theme === "light" ? "#f5f5f5" : "#0e0e0e",
          color: theme === "light" ? "#1a1a1a" : "#e8e8e8",
          aspectRatio: "4 / 1",
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

        {/* Main Content Container - Full Edge to Edge */}
        <div className="relative h-full w-full flex items-center">
          {/* LEFT SECTION - 50% */}
          <div className="w-1/2 h-full flex flex-col justify-center px-12 py-0">
            {/* Name */}
            <div className="mb-6">
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
            <div className="space-y-1 mb-4">
              <div>
                <span 
                  className="font-sf-mono font-bold tracking-wide"
                  style={{ fontSize: "24px", letterSpacing: "0.01em", lineHeight: "1.2" }}
                >
                  ML ENGINEER
                </span>
              </div>
              <div>
                <span 
                  className="font-sf-mono font-bold tracking-wide"
                  style={{ fontSize: "24px", letterSpacing: "0.01em", lineHeight: "1.2" }}
                >
                  GENAI ENGINEER
                </span>
              </div>
            </div>

            {/* GitHub - Highlighted */}
            <div className="mt-4">
              <span 
                className="font-sf-mono text-xs opacity-50"
                style={{ letterSpacing: "0.2em", display: "block", marginBottom: "4px" }}
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
            className="h-full w-[1px]"
            style={{ backgroundColor: theme === "light" ? "#1a1a1a" : "#e8e8e8", opacity: 0.1 }}
          />

          {/* RIGHT SECTION - 50% */}
          <div className="w-1/2 h-full flex flex-col justify-center px-12 py-0 overflow-hidden">
            {/* SPECIALIZATIONS SECTION */}
            <div className="mb-6">
              <span 
                className="font-sf-mono text-xs font-bold opacity-50 block mb-4"
                style={{ letterSpacing: "0.2em" }}
              >
                SPECIALIZATIONS
              </span>
              
              <div className="space-y-2">
                {specializations.map((spec, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span 
                      className="w-2 h-2 mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: theme === "light" ? "#1a1a1a" : "#e8e8e8" }}
                    />
                    <span 
                      className="font-sf-mono font-medium"
                      style={{ fontSize: "14px", lineHeight: "1.3", opacity: 0.85 }}
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
                className="font-sf-mono text-xs font-bold opacity-50 block mb-3"
                style={{ letterSpacing: "0.2em" }}
              >
                TECHNOLOGIES
              </span>
              
              <div className="flex flex-wrap gap-1.5">
                {libraries.map((lib, idx) => (
                  <span 
                    key={idx}
                    className="font-sf-mono px-2.5 py-1.5 border font-medium whitespace-nowrap"
                    style={{ 
                      fontSize: "11px",
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
