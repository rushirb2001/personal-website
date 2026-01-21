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
          {/* Left Section (30%) - Circular Gaussian Distribution Design */}
          <div className="w-3/12 h-full relative flex items-center justify-center">
            {/* Circular Gaussian - 25 Bars */}
            <div className="relative" style={{ width: "200px", height: "200px" }}>
              {/* Initials at center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span 
                  className="font-sf-mono font-bold"
                  style={{ 
                    fontSize: "40px", 
                    letterSpacing: "0.05em",
                    color: theme === "light" ? "#1a1a1a" : "#e8e8e8",
                    opacity: 0.8
                  }}
                >
                  RB
                </span>
              </div>
              
              {/* Radial bars arranged in circle */}
              {Array.from({ length: 25 }).map((_, idx) => {
                // Calculate angle for circular arrangement
                const angle = (idx * 360) / 25;
                const radian = (angle * Math.PI) / 180;
                
                // Calculate Gaussian distribution based on position
                const center = 12.5; // Middle position
                const distance = Math.abs(idx - center);
                const sigma = 6;
                const gaussianValue = Math.exp(-(distance * distance) / (2 * sigma * sigma));
                
                // Bar length based on Gaussian
                const barLength = 30 + gaussianValue * 50; // Range: 30px to 80px
                
                // Opacity gradient
                const opacityValue = 0.25 + (gaussianValue * 0.55);
                
                // Position from center
                const centerX = 100;
                const centerY = 100;
                const startRadius = 35; // Inner circle radius
                
                return (
                  <div
                    key={idx}
                    className="absolute origin-left"
                    style={{
                      left: `${centerX}px`,
                      top: `${centerY}px`,
                      width: `${barLength}px`,
                      height: "3px",
                      backgroundColor: theme === "light" ? "#1a1a1a" : "#e8e8e8",
                      opacity: opacityValue,
                      transform: `rotate(${angle}deg) translateX(${startRadius}px)`,
                      transformOrigin: "0 50%",
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Right Section (70%) - All Content */}
          <div className="w-9/12 h-full flex flex-col justify-center pr-16 pl-8">
            {/* Name & Title */}
            <div className="mb-8">
              <h1 
                className="font-sf-mono font-bold tracking-tight leading-none mb-2"
                style={{ fontSize: "56px", letterSpacing: "-0.01em" }}
              >
                RUSHIR BHAVSAR
              </h1>
              
              <p 
                className="font-sf-mono tracking-wide opacity-70"
                style={{ fontSize: "20px", letterSpacing: "0.05em" }}
              >
                DATA SCIENTIST & AI ENGINEER
              </p>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-2 gap-12">
              {/* Left Column - Specializations */}
              <div>
                <span 
                  className="font-sf-mono text-xs tracking-widest opacity-50 block mb-4"
                  style={{ letterSpacing: "0.15em" }}
                >
                  SPECIALIZATIONS
                </span>
                
                <div className="space-y-2">
                  {specializations.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span 
                        className="w-1.5 h-1.5"
                        style={{ backgroundColor: theme === "light" ? "#1a1a1a" : "#e8e8e8", opacity: 0.5 }}
                      />
                      <span 
                        className="font-sf-mono opacity-75"
                        style={{ fontSize: "13px" }}
                      >
                        {spec}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Tech Stack */}
              <div>
                <span 
                  className="font-sf-mono text-xs tracking-widest opacity-50 block mb-4"
                  style={{ letterSpacing: "0.15em" }}
                >
                  TECH STACK
                </span>
                
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, idx) => (
                    <span 
                      key={idx}
                      className="font-sf-mono px-2.5 py-1.5 border font-medium"
                      style={{ 
                        fontSize: "11px",
                        borderColor: theme === "light" ? "rgba(26,26,26,0.25)" : "rgba(232,232,232,0.25)",
                        opacity: 0.8,
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
