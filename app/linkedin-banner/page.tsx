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

      <p className="font-sf-mono text-xs text-neutral-500 mb-4 py-4">
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
        <div className="relative h-full flex items-center">
          {/* Left Section (30%) - Gaussian Distribution Design */}
          <div className="h-full relative flex flex-col items-center justify-center w-[26%]">
            {/* Initials at top */}
            <div className="mb-8">
              <span 
                className="font-sf-mono font-bold"
                style={{ 
                  fontSize: "48px", 
                  letterSpacing: "0.05em",
                  color: theme === "light" ? "#1a1a1a" : "#e8e8e8",
                  opacity: 0.8
                }}
              >
                RB
              </span>
            </div>
            
            {/* Gaussian Distribution - 25 Bins */}
            <div className="flex items-end justify-center gap-1 h-48">
              {Array.from({ length: 25 }).map((_, idx) => {
                // Calculate Gaussian height (bell curve)
                const center = 12; // Middle bin
                const distance = Math.abs(idx - center);
                const sigma = 6; // Standard deviation
                const gaussianValue = Math.exp(-(distance * distance) / (2 * sigma * sigma));
                const height = gaussianValue * 200; // Max height in pixels
                
                // Calculate opacity gradient (darker at center, lighter at edges)
                const opacityValue = 0.1 + (gaussianValue * 0.7); // Range: 0.3 to 0.8
                
                return (
                  <div
                    key={idx}
                    className="w-2"
                    style={{
                      height: `${height}px`,
                      backgroundColor: theme === "light" ? "#1a1a1a" : "#e8e8e8",
                      opacity: opacityValue,
                      transition: "all 0.3s ease"
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Right Section (70%) - All Content */}
          <div className="w-9/12 h-full flex flex-col justify-center items-center pr-16 pl-8 text-center">
            {/* Role Titles with Pipes */}
            <div className="mb-6">
              <p 
                className="font-sf-mono tracking-wide opacity-80 text-5xl font-bold py-7 my-0"
                style={{ letterSpacing: "0.08em" }}
              >
                ML ENGINEER | GENAI ENGINEER
              </p>
            </div>

            {/* Main Statement - Large and Prominent */}
            <div className="mb-8 max-w-5xl">
              <p 
                className="font-sans font-medium leading-relaxed"
                style={{ 
                  fontSize: "21px", 
                  letterSpacing: "0.01em",
                  lineHeight: "1.6",
                  opacity: 0.85
                }}
              >
                I build agentic AI systems with LLM orchestration, tool calling architectures, and multi-agent workflows, 
                develop CUDA-accelerated ML pipelines with contrastive learning and embedding-based retrieval, 
                and ship production GenAI platforms with evaluation frameworks for retrieval quality and factual grounding 
                across enterprise deployments.
              </p>
            </div>

            {/* Tech Stack - Centered and Prominent */}
            <div className="w-full py-4">
              <div className="flex justify-between items-center w-full px-8 gap-4">
                {techStack.map((tech, idx) => (
                  <span 
                    key={idx}
                    className="font-sans px-4 py-2.5 border-2 font-semibold text-center flex-1"
                    style={{ 
                      fontSize: "22px",
                      borderColor: theme === "light" ? "rgba(26,26,26,0.3)" : "rgba(232,232,232,0.3)",
                      opacity: 0.85,
                      letterSpacing: "0.03em"
                    }}
                  >
                    {tech}
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
