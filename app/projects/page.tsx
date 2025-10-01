"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PageLayout } from "@/components/layout/page-layout"
import {
  ChevronRight,
  ExternalLink,
  Github,
  Terminal,
  Code2,
  Database,
  Cloud,
  Smartphone,
  Box,
  Zap,
} from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  fullDescription: string
  technologies: string[]
  category: "Web Development" | "Machine Learning" | "Data Science" | "Mobile" | "Other"
  status: "COMPLETED" | "IN PROGRESS" | "ARCHIVED"
  date: string
  github?: string
  demo?: string
  highlights: string[]
}

const projects: Project[] = [
  {
    id: "proj_ai_content_001",
    title: "AI-Powered Content Generation Platform",
    description: "Full-stack platform leveraging LLMs for automated content creation",
    fullDescription:
      "A comprehensive content generation platform that uses advanced language models to create, optimize, and manage content across multiple formats. Features include real-time generation, content optimization, and multi-user collaboration.",
    technologies: ["Next.js", "TypeScript", "OpenAI API", "PostgreSQL", "Tailwind CSS"],
    category: "Web Development",
    status: "COMPLETED",
    date: "2024-09",
    github: "https://github.com/username/project",
    demo: "https://demo.example.com",
    highlights: [
      "Implemented real-time streaming for LLM responses",
      "Built scalable API architecture handling 10K+ requests/day",
      "Designed responsive UI with dark mode support",
      "Integrated user authentication and role-based access control",
    ],
  },
  {
    id: "proj_realtime_analytics_002",
    title: "Real-Time Analytics Dashboard",
    description: "Interactive dashboard for monitoring system metrics and KPIs",
    fullDescription:
      "A real-time analytics dashboard built for monitoring complex systems with multiple data sources. Features live updates, customizable widgets, and advanced data visualization.",
    technologies: ["React", "D3.js", "WebSocket", "Node.js", "MongoDB"],
    category: "Web Development",
    status: "COMPLETED",
    date: "2024-06",
    highlights: [
      "Processed and visualized 100K+ data points in real-time",
      "Built custom charting library with D3.js",
      "Implemented WebSocket connections for live updates",
      "Achieved 99.9% uptime over 6 months",
    ],
  },
  {
    id: "proj_ml_pipeline_003",
    title: "Machine Learning Pipeline for Image Classification",
    description: "End-to-end ML pipeline for training and deploying image models",
    fullDescription:
      "A complete machine learning pipeline for image classification tasks, including data preprocessing, model training, evaluation, and deployment. Supports multiple architectures and transfer learning.",
    technologies: ["Python", "PyTorch", "Docker", "FastAPI", "AWS"],
    category: "Machine Learning",
    status: "IN PROGRESS",
    date: "2024-10",
    github: "https://github.com/username/ml-pipeline",
    highlights: [
      "Achieved 95% accuracy on custom dataset",
      "Implemented distributed training across multiple GPUs",
      "Built RESTful API for model inference",
      "Containerized deployment with Docker",
    ],
  },
  {
    id: "proj_mobile_fitness_004",
    title: "Mobile Fitness Tracking App",
    description: "Cross-platform mobile app for workout tracking and analytics",
    fullDescription:
      "A comprehensive fitness tracking application that helps users monitor their workouts, nutrition, and progress over time. Features include workout planning, progress tracking, and social sharing.",
    technologies: ["React Native", "TypeScript", "Firebase", "Redux"],
    category: "Mobile",
    status: "COMPLETED",
    date: "2024-03",
    highlights: [
      "Reached 5K+ downloads in first month",
      "Implemented offline-first architecture",
      "Built custom animation system for smooth UX",
      "Integrated with wearable device APIs",
    ],
  },
]

const categories = ["All", "Web Development", "Machine Learning", "Data Science", "Mobile", "Other"]

// Technology icon mapping
const getTechIcon = (tech: string) => {
  const techLower = tech.toLowerCase()

  // React/Next.js ecosystem
  if (techLower.includes("next") || techLower === "next.js") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M11.5725 0c-.1763 0-.3098.0013-.3584.0067-.0516.0053-.2159.021-.3636.0328-3.4088.3073-6.6017 2.1463-8.624 4.9728C1.1004 6.584.3802 8.3666.1082 10.255c-.0962.659-.108.8537-.108 1.7474s.012 1.0884.108 1.7476c.652 4.506 3.8591 8.2919 8.2087 9.6945.7789.2511 1.6.4223 2.5337.5255.3636.04 1.9354.04 2.299 0 1.6117-.1783 2.9772-.577 4.3237-1.2643.2065-.1056.2464-.1337.2183-.1573-.0188-.0139-.8987-1.1938-1.9543-2.62l-1.919-2.592-2.4047-3.5583c-1.3231-1.9564-2.4117-3.556-2.4211-3.556-.0094-.0026-.0187 1.5787-.0235 3.509-.0067 3.3802-.0093 3.5162-.0516 3.596-.061.115-.108.1618-.2064.2134-.075.0374-.1408.0445-.495.0445h-.406l-.1078-.068a.4383.4383 0 01-.1572-.1712l-.0493-.1056.0053-4.703.0067-4.7054.0726-.0915c.0376-.0493.1174-.1125.1736-.143.0962-.047.1338-.0517.5396-.0517.4787 0 .5584.0187.6827.1547.0353.0377 1.3373 1.9987 2.895 4.3608a10760.433 10760.433 0 004.7344 7.1706l1.9002 2.8782.0971-.0633c.8763-.5536 1.8068-1.3208 2.602-2.1446 1.6547-1.7168 2.7642-3.85 3.3264-6.3879.2065-.9329.2865-1.3766.3471-1.9103.0377-.3329.0377-.4423.0377-1.7476s0-1.4147-.0377-1.7476c-.652-4.506-3.8591-8.2919-8.2087-9.6945-.7672-.2487-1.5836-.4199-2.5146-.5229-.1572-.0175-.3049-.03-.3303-.03s-.2951.0067-.3584.0067z" />
      </svg>
    )
  }
  if (techLower.includes("react")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.868.728-.063 1.466-.098 2.21-.098.74 0 1.477-.035 2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.868.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" />
      </svg>
    )
  }

  // TypeScript
  if (techLower.includes("typescript")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
      </svg>
    )
  }

  // Python/PyTorch
  if (techLower.includes("python") || techLower.includes("pytorch")) {
    return <Code2 className="w-5 h-5" />
  }

  // Databases
  if (
    techLower.includes("sql") ||
    techLower.includes("postgres") ||
    techLower.includes("mongo") ||
    techLower.includes("database")
  ) {
    return <Database className="w-5 h-5" />
  }

  // Cloud/AWS
  if (techLower.includes("aws") || techLower.includes("cloud") || techLower.includes("azure")) {
    return <Cloud className="w-5 h-5" />
  }

  // Docker/Kubernetes
  if (techLower.includes("docker") || techLower.includes("kubernetes")) {
    return <Box className="w-5 h-5" />
  }

  // Mobile
  if (
    techLower.includes("native") ||
    techLower.includes("mobile") ||
    techLower.includes("ios") ||
    techLower.includes("android")
  ) {
    return <Smartphone className="w-5 h-5" />
  }

  // FastAPI/API
  if (techLower.includes("api") || techLower.includes("fastapi")) {
    return <Zap className="w-5 h-5" />
  }

  // Tailwind CSS
  if (techLower.includes("tailwind")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.868.728-.063 1.466-.098 2.21-.098.74 0 1.477-.035 2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.868.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" />
      </svg>
    )
  }

  // D3.js
  if (techLower.includes("d3")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M13.312 12.5c.076 1.077-.088 2.153-.476 3.182a6.4 6.4 0 0 1-1.448 2.347 6.643 6.643 0 0 1-2.347 1.503c-1.806.65-3.8.65-5.606 0a6.643 6.643 0 0 1-2.347-1.503 6.4 6.4 0 0 1-1.448-2.347 7.287 7.287 0 0 1-.476-3.182H0c.142 1.643.602 3.232 1.365 4.666a8.953 8.953 0 0 0 2.923 3.345 10.29 10.29 0 0 0 4.333 1.588 12.44 12.44 0 0 0 4.825-.255 10.055 10.055 0 0 0 4.18-2.291 8.735 8.735 0 0 0 2.588-4.18 10.566 10.566 0 0 0 .442-4.821h-.87a9.695 9.695 0 0 1-.421 4.291 7.865 7.865 0 0 1-2.28 3.521 9.185 9.185 0 0 1-3.855 2.095 11.57 11.57 0 0 1-4.665.227 9.42 9.42 0 0 1-3.954-1.454 8.013 8.013 0 0 1-2.652-3.055 8.417 8.417 0 0 1-1.035-4.107h.87c.011.773.131 1.542.365 2.282.234.742.575 1.439 1.02 2.065.445.626.987 1.177 1.609 1.631a7.553 7.553 0 0 0 4.024 1.387c.695.064 1.398.033 2.089-.092a7.755 7.755 0 0 0 3.779-2.173 6.78 6.78 0 0 0 1.817-3.76 8.422 8.422 0 0 0-.306-4.046h-.87a7.553 7.553 0 0 1 .282 3.679 5.91 5.91 0 0 1-1.575 3.267 6.885 6.885 0 0 1-3.299 1.909 8.687 8.687 0 0 1-3.867.13 6.683 6.683 0 0 1-3.504-2.196 6.26 6.26 0 0 1-1.415-3.68H4.81a5.39 5.39 0 0 0 1.21 3.045 5.813 5.813 0 0 0 2.934 1.832 7.817 7.817 0 0 0 3.496-.108 5.89 5.89 0 0 0 2.762-1.617 4.933 4.933 0 0 0 1.251-2.79 6.567 6.567 0 0 0-.217-3.255h-.87a5.697 5.697 0 0 1 .193 2.888 4.063 4.063 0 0 1-1.02 2.347 4.92 4.92 0 0 1-2.282 1.334 6.947 6.947 0 0 1-2.93.092 4.813 4.813 0 0 1-2.435-1.51 4.385 4.385 0 0 1-.938-2.673H5.68a3.515 3.515 0 0 0 .746 2.13c.217.26.475.483.767.663a3.95 3.95 0 0 0 2.16.519c.38.011.759-.031 1.13-.126a4.05 4.05 0 0 0 1.828-1.107 3.193 3.193 0 0 0 .789-1.882 4.697 4.697 0 0 0-.13-2.032h-.87a5.697 5.697 0 0 1 .193 2.888 4.063 4.063 0 0 1-1.02 2.347 4.92 4.92 0 0 1-2.282 1.334 6.947 6.947 0 0 1-2.93.092 4.813 4.813 0 0 1-2.435-1.51 4.385 4.385 0 0 1-.938-2.673H5.68a3.515 3.515 0 0 0 .746 2.13c.217.26.475.483.767.663a3.95 3.95 0 0 0 2.16.519c.38.011.759-.031 1.13-.126a4.05 4.05 0 0 0 1.828-1.107 3.193 3.193 0 0 0 .789-1.882 4.697 4.697 0 0 0-.13-2.032h-.87a5.697 5.697 0 0 1 .193 2.888 4.063 4.063 0 0 1-1.02 2.347 4.92 4.92 0 0 1-2.282 1.334 6.947 6.947 0 0 1-2.93.092 4.813 4.813 0 0 1-2.435-1.51 4.385 4.385 0 0 1-.938-2.673H5.68a3.515 3.515 0 0 0 .746 2.13c.217.26.475.483.767.663a3.95 3.95 0 0 0 2.16.519c.38.011.759-.031 1.13-.126a4.05 4.05 0 0 0 1.828-1.107 3.193 3.193 0 0 0 .789-1.882 4.697 4.697 0 0 0-.13-2.032h-.87c.044.534.011 1.071-.098 1.599a2.323 2.323 0 0 1-.574 1.267 3.18 3.18 0 0 1-1.374.856 5.077 5.077 0 0 1-1.675.074 2.913 2.913 0 0 1-1.657-.962 2.545 2.545 0 0 1-.52-1.665h-.87c.011.447.131.886.343 1.278.212.393.508.734.872 1 .364.266.784.455 1.234.556.45.1.918.11 1.373.031a4.307 4.307 0 0 0 2.021-1.022 1.453 1.453 0 0 0 .365-1.18 2.827 2.827 0 0 0-.13-1.047h-.87c.055.295.066.599.033.898a.583.583 0 0 1-.228.442 3.437 3.437 0 0 1-1.539.663 3.033 3.033 0 0 1-1.729-.344 1.675 1.675 0 0 1-.63-1.266h-.87c.044.623.343 1.201.832 1.599.489.398 1.124.579 1.761.5a4.567 4.567 0 0 0 1.937-.895.713.713 0 0 0-.13-.13z" />
      </svg>
    )
  }

  // Node.js
  if (techLower.includes("node")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.141,0,0.254,0.112,0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z" />
      </svg>
    )
  }

  // Firebase
  if (techLower.includes("firebase")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M3.89 15.672L6.255.461A.542.542 0 017.27.288l2.543 4.771zm16.794 3.692l-2.25-14a.54.54 0 00-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 001.588 0zM14.3 7.147l-1.82-3.482a.542.542 0 00-.96 0L3.53 17.984z" />
      </svg>
    )
  }

  // Redux
  if (techLower.includes("redux")) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M16.634 16.504c.87-.075 1.543-.84 1.5-1.754-.047-.914-.796-1.648-1.709-1.648h-.061c-.923.047-1.66.84-1.614 1.801.031.456.212.86.5 1.15-1.064 2.083-2.682 3.61-5.11 4.937-1.631 1.017-3.332 1.392-5.046 1.11-1.428-.235-2.536-.988-3.166-2.15-.93-1.768-.914-3.68.045-5.494.705-1.332 1.807-2.312 2.672-2.819-.124-.472-.214-1.26-.214-1.848-5.732 4.116-5.167 9.73-3.442 12.36 1.254 1.943 3.819 3.166 6.53 3.166.686 0 1.389-.077 2.09-.238 4.773-.869 8.394-3.742 10.224-8.054zm5.367-3.495c-2.908-3.398-7.196-5.286-12.07-5.286H9.28l1.665-1.556c.334-.33.334-.876 0-1.206-.334-.33-.877-.33-1.211 0l-3.318 3.104c-.334.33-.334.876 0 1.206l3.318 3.104c.167.165.39.248.606.248.217 0 .439-.083.606-.248.334-.33.334-.876 0-1.206L9.28 9.61h.651c4.116 0 7.713 1.543 10.133 4.342 1.874 2.236 2.818 4.88 2.818 7.87 0 1.207-.16 2.45-.486 3.595-.217.763.137 1.554.889 1.782.152.05.305.073.457.073.61 0 1.177-.387 1.397-1.01.425-1.41.638-2.848.638-4.44 0-3.67-1.254-7.121-3.642-10.01zM10.662 16.504c.031.456.213.86.5 1.15-1.064 2.083-2.682 3.61-5.11 4.937-1.631 1.017-3.332 1.392-5.046 1.11-1.428-.235-2.536-.988-3.166-2.15-.93-1.768-.914-3.68.045-5.494.705-1.332 1.807-2.312 2.672-2.819-.124-.472-.214-1.26-.214-1.848-5.732 4.116-5.167 9.73-3.442 12.36 1.254 1.943 3.819 3.166 6.53 3.166.686 0 1.389-.077 2.09-.238 4.773-.869 8.394-3.742 10.224-8.054z" />
      </svg>
    )
  }

  // WebSocket
  if (techLower.includes("websocket") || techLower.includes("socket")) {
    return <Zap className="w-5 h-5" />
  }

  // Default fallback - show first 3 letters
  return <span className="text-[0.5rem] font-bold">{tech.substring(0, 3).toUpperCase()}</span>
}

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal()
      }
    }

    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [isModalOpen])

  const filteredProjects =
    selectedCategory === "All" ? projects : projects.filter((p) => p.category === selectedCategory)

  const openModal = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 200)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-500"
      case "IN PROGRESS":
        return "text-yellow-500"
      case "ARCHIVED":
        return "text-primary/50"
      default:
        return "text-primary/70"
    }
  }

  return (
    <PageLayout title="PROJECTS" subtitle="Personal & Professional Development Work">
      <div className="h-[calc(100vh-12rem)] flex flex-col">
        {/* Category Filter - Fixed at 30% height */}
        <div className="h-[10%] flex-shrink-0 border-b border-primary/20">
          <div className="h-full flex items-center justify-center px-2 md:px-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => {
                // Define compact mobile labels
                const mobileLabels: Record<string, string> = {
                  All: "ALL",
                  "Web Development": "WEB DEV",
                  "Machine Learning": "ML",
                  "Data Science": "DS",
                  Mobile: "MOBILE",
                  Other: "OTHER",
                }

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`text-xs font-sf-mono px-2 md:px-3 py-1.5 border transition-colors ${
                      selectedCategory === category
                        ? "bg-primary/10 border-primary/40 text-primary"
                        : "bg-transparent border-primary/20 text-primary/60 hover:border-primary/30 hover:text-primary/80"
                    }`}
                  >
                    <span className="hidden md:inline">{category.toUpperCase()}</span>
                    <span className="md:hidden">{mobileLabels[category]}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Projects Grid - Takes remaining 70% height with scroll */}
        <div className="h-[90%] flex-shrink-0 overflow-y-auto px-6 py-6">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => openModal(project)}
                  className="border border-primary/20 hover:border-primary/40 bg-background dark:bg-eerie-black/50 transition-all duration-200 cursor-pointer"
                >
                  {/* Header Bar */}
                  <div className="border-b border-primary/20 px-3 py-2 flex items-center justify-between bg-primary/5">
                    {selectedCategory === "All" ? (
                      <>
                        <div className="flex items-center gap-2">
                          <Terminal className="h-3 w-3 text-primary/70" />
                          <span className="text-xs font-sf-mono text-primary/70">{project.id}</span>
                        </div>
                        <div className={`text-xs font-sf-mono ${getStatusColor(project.status)}`}>{project.status}</div>
                      </>
                    ) : (
                      <div className="w-full flex items-center justify-center">
                        <div className={`text-xs font-sf-mono ${getStatusColor(project.status)}`}>{project.status}</div>
                      </div>
                    )}
                  </div>

                  {/* Tech Stack Icons Row */}
                  <div className="border-b border-primary/10 px-3 py-3 flex gap-2">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <div
                        key={tech}
                        className="w-10 h-10 border border-primary/20 bg-primary/5 flex items-center justify-center text-primary/60 hover:bg-primary/10 hover:text-primary transition-colors relative"
                        title={tech}
                      >
                        {getTechIcon(tech)}
                      </div>
                    ))}
                    {project.technologies.length > 5 && (
                      <div className="w-10 h-10 border border-primary/20 bg-primary/5 flex items-center justify-center text-[0.5rem] font-sf-mono text-primary/60">
                        +{project.technologies.length - 5}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="text-sm font-sf-mono font-medium group-hover:text-primary/90 transition-colors h-10 line-clamp-2 flex items-start mb-1 mt-0 py-0">
                        {project.title}
                      </h3>
                      <p className="text-xs text-primary/70 leading-relaxed h-10 line-clamp-2">{project.description}</p>
                    </div>

                    {/* Category & Date */}
                    {selectedCategory === "All" && (
                      <div className="flex items-center justify-between text-xs font-sf-mono text-primary/50 pt-2 border-t border-primary/10">
                        <span>{project.category.toUpperCase()}</span>
                        <span>{project.date}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="border-t border-primary/20 px-4 py-2 flex items-center justify-between bg-primary/5 group-hover:bg-primary/10 transition-colors">
                    <span className="text-xs font-sf-mono text-primary/60">VIEW DETAILS</span>
                    <ChevronRight className="h-3 w-3 text-primary/60 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-foreground" />
                <p className="text-sm font-sf-mono text-primary/70 font-mono">NEW PROJECTS COMING SOON...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-4xl bg-background dark:bg-eerie-black border border-primary/30 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-primary/5 px-4 py-3 flex justify-between items-center border-b border-primary/30 sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary/70" />
                  <span className="text-sm font-sf-mono text-primary/70">{selectedProject.title.toUpperCase()}</span>
                </div>
                <button
                  onClick={closeModal}
                  className="text-primary/70 hover:text-primary transition-colors text-xs font-sf-mono"
                >
                  [ ESC ]
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Main Content */}
                  <div className="space-y-6">
                    <div>
                      <div className="text-xs font-sf-mono text-primary/50 mb-1">DESCRIPTION:</div>
                      <p className="text-sm leading-relaxed text-primary/90">{selectedProject.fullDescription}</p>
                    </div>

                    <div>
                      <div className="text-xs font-sf-mono text-primary/50 mb-2">KEY HIGHLIGHTS:</div>
                      <div className="space-y-2">
                        {selectedProject.highlights.map((highlight, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="w-6 h-6 border border-primary/30 bg-primary/5 flex items-center justify-center text-xs font-sf-mono text-primary/70 flex-shrink-0">
                              {i + 1}
                            </div>
                            <p className="text-sm leading-relaxed text-primary/90 pt-0.5">{highlight}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-sf-mono text-primary/50 mb-2">TECHNOLOGIES:</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs font-sf-mono bg-primary/5 border border-primary/30 text-primary/70 px-2 py-1"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Links */}
                    {(selectedProject.github || selectedProject.demo) && (
                      <div className="border-t border-primary/20 pt-4">
                        <div className="text-xs font-sf-mono text-primary/50 mb-2">LINKS:</div>
                        <div className="flex gap-3">
                          {selectedProject.github && (
                            <a
                              href={selectedProject.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs font-sf-mono bg-primary/5 border border-primary/30 text-primary/70 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors px-3 py-2 w-full"
                            >
                              <Github className="h-4 w-4" />
                              VIEW SOURCE
                            </a>
                          )}
                          {selectedProject.demo && (
                            <a
                              href={selectedProject.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs font-sf-mono bg-primary/5 border border-primary/30 text-primary/70 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors px-3 py-2 w-full"
                            >
                              <ExternalLink className="h-4 w-4" />
                              LIVE DEMO
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-primary/20 p-4 bg-primary/5 flex justify-between items-center">
                <div className="text-xs font-sf-mono text-primary/50">PERSONAL & PROFESSIONAL PROJECTS</div>
                <div className="text-xs font-sf-mono text-primary/50">ID: {selectedProject.id}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  )
}
