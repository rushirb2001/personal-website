export interface Project {
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
  feature: boolean
}

export const projects: Project[] = [
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
    feature: true,
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
    feature: true,
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
    feature: true,
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
    feature: false,
  },
]

export const categories = ["All", "Web Development", "Machine Learning", "Data Science", "Mobile", "Other"]
