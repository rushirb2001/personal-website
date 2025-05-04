"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface SeveranceLogoProps {
  size?: number
  glitch?: boolean
  className?: string
}

export function SeveranceLogo({ size = 50, glitch = false, className = "" }: SeveranceLogoProps) {
  const [randomOffset, setRandomOffset] = useState({ x: 0, y: 0 })

  // Create glitch effect when the glitch prop changes
  useEffect(() => {
    if (glitch) {
      const interval = setInterval(() => {
        setRandomOffset({
          x: Math.random() * 2 - 1,
          y: Math.random() * 2 - 1,
        })
      }, 50)

      return () => clearInterval(interval)
    } else {
      setRandomOffset({ x: 0, y: 0 })
    }
  }, [glitch])

  const viewBoxSize = 100
  const strokeWidth = 2
  const scale = size / viewBoxSize

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Base logo */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
      >
        {/* Outer circle */}
        <circle
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
          r={viewBoxSize / 2 - strokeWidth}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeOpacity={0.8}
          fill="none"
        />

        {/* Inner circle */}
        <circle
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
          r={viewBoxSize / 3 - strokeWidth}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeOpacity={0.6}
          fill="none"
        />

        {/* Horizontal line */}
        <line
          x1={viewBoxSize / 4}
          y1={viewBoxSize / 2}
          x2={(viewBoxSize * 3) / 4}
          y2={viewBoxSize / 2}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeOpacity={0.9}
        />

        {/* Vertical line */}
        <line
          x1={viewBoxSize / 2}
          y1={viewBoxSize / 4}
          x2={viewBoxSize / 2}
          y2={(viewBoxSize * 3) / 4}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeOpacity={0.9}
        />

        {/* Quadrant markers */}
        <circle cx={(viewBoxSize * 3) / 4} cy={viewBoxSize / 4} r={2} fill="currentColor" fillOpacity={0.7} />
        <circle cx={viewBoxSize / 4} cy={viewBoxSize / 4} r={2} fill="currentColor" fillOpacity={0.7} />
        <circle cx={(viewBoxSize * 3) / 4} cy={(viewBoxSize * 3) / 4} r={2} fill="currentColor" fillOpacity={0.7} />
        <circle cx={viewBoxSize / 4} cy={(viewBoxSize * 3) / 4} r={2} fill="currentColor" fillOpacity={0.7} />

        {/* Center dot */}
        <circle cx={viewBoxSize / 2} cy={viewBoxSize / 2} r={3} fill="currentColor" fillOpacity={0.9} />

        {/* "R" and "B" initials */}
        <path
          d="M35 35 L35 65 M35 35 L50 35 Q55 35 55 42.5 Q55 50 50 50 L35 50 M50 50 L55 65"
          stroke="currentColor"
          strokeWidth={strokeWidth + 1}
          strokeOpacity={0.9}
          fill="none"
        />
        <path
          d="M65 35 L65 65 M65 35 L75 35 Q80 35 80 42.5 Q80 50 75 50 L65 50 M65 50 L75 50 Q80 50 80 57.5 Q80 65 75 65 L65 65"
          stroke="currentColor"
          strokeWidth={strokeWidth + 1}
          strokeOpacity={0.9}
          fill="none"
        />
      </svg>

      {/* Glitch effect overlay */}
      {glitch && (
        <motion.svg
          width={size}
          height={size}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0"
          initial={{ opacity: 0.5 }}
          animate={{
            opacity: [0.5, 0.8, 0.3, 0.7],
            x: randomOffset.x,
            y: randomOffset.y,
          }}
          transition={{ duration: 0.1 }}
        >
          {/* Glitched outer circle */}
          <circle
            cx={viewBoxSize / 2 + 1}
            cy={viewBoxSize / 2 - 1}
            r={viewBoxSize / 2 - strokeWidth}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeOpacity={0.3}
            fill="none"
          />

          {/* Glitched inner circle */}
          <circle
            cx={viewBoxSize / 2 - 1}
            cy={viewBoxSize / 2 + 1}
            r={viewBoxSize / 3 - strokeWidth}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeOpacity={0.2}
            fill="none"
          />

          {/* Glitched horizontal line */}
          <line
            x1={viewBoxSize / 4 - 2}
            y1={viewBoxSize / 2 + 1}
            x2={(viewBoxSize * 3) / 4 + 2}
            y2={viewBoxSize / 2 - 1}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeOpacity={0.4}
          />

          {/* Glitched "R" and "B" initials */}
          <path
            d="M36 36 L36 66 M36 36 L51 36 Q56 36 56 43.5 Q56 51 51 51 L36 51 M51 51 L56 66"
            stroke="currentColor"
            strokeWidth={strokeWidth + 1}
            strokeOpacity={0.4}
            fill="none"
          />
          <path
            d="M66 36 L66 66 M66 36 L76 36 Q81 36 81 43.5 Q81 51 76 51 L66 51 M66 51 L76 51 Q81 51 81 58.5 Q81 66 76 66 L66 66"
            stroke="currentColor"
            strokeWidth={strokeWidth + 1}
            strokeOpacity={0.4}
            fill="none"
          />
        </motion.svg>
      )}

      {/* Scan lines effect */}
      <div className="absolute inset-0 bg-scan-lines opacity-30 pointer-events-none rounded-full"></div>
    </div>
  )
}
