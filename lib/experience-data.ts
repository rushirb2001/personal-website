export interface Metric {
  label: string
  value: string
  isIncrease: boolean
}

export interface Experience {
  title: string
  company: string
  location: string
  period: string
  id: string
  assignmentId: string
  status: "COMPLETED" | "ACTIVE" | "FLAGGED"
  description: string
  responsibilities: string[]
  metrics: Metric[]
}

export const experiences: Experience[] = [
  {
    title: "SCIENTIFIC DEVELOPMENT- AI/ML",
    company: "CADENCE DESIGN SYSTEMS",
    location: "SANTA FE, NM",
    period: "JULY 2025 - OCT 2025",
    id: "EXP-9I-787",
    assignmentId: "COMS-2025-07",
    status: "COMPLETED",
    description:
      "Developed and deployed ETL pipelines and systems for scientific modelling, focusing on generalizability, scalability, and efficiency optimization.",
    responsibilities: [
      "Built end-to-end ML pipeline orchestrator with PyTorch Lightning, processing 1M sequences (5120 embedding size),reducing preprocessing time by 60% across 20+ production experiments.",
      "Engineered distributed clustering system with scikit-learn and CUDA-RAPIDS, improving cluster quality by 35% and reducing computational overhead by 45% for downstream ML teams.",
      "Developed multi-modal deep learning framework with PyTorch Lightning and custom CUDA kernels, achieving 80% faster training convergence and 6x speedup in hyperparameter optimization.",
    ],
    metrics: [
      { label: "PREPROCESSING TIME", value: "60%", isIncrease: false },
      { label: "CLUSTERING QUALITY", value: "35%", isIncrease: true },
      { label: "MODEL CONVERGENCE", value: "80%", isIncrease: true },
    ],
  },
  {
    title: "GENAI ENGINEERING INTERN",
    company: "TALIN LABS INC",
    location: "REMOTE",
    period: "MAY 2024 - SEP 2024",
    id: "EXP-9I-783",
    assignmentId: "TLABS-2024-05",
    status: "COMPLETED",
    description:
      "Developed and deployed AI pipelines and systems for enterprise applications, focusing on reliability, scalability, and performance optimization.",
    responsibilities: [
      "Increased system reliability by 42% and data accessibility by 63% by deploying AI pipelines on AWS & Azure using Docker containers orchestrated by Kubernetes",
      "Enhanced Custom AI Chatbot deployment efficiency by implementing Transformer-based models with OpenAI API and Mistral Big within the LangChain framework",
      "Accelerated supply-chain query handling by 12%, achieving sub-second latencies and an 86% increase in data throughput by applying Retrieval-Augmented Generation (RAG) techniques",
    ],
    metrics: [
      { label: "SYSTEM RELIABILITY", value: "42%", isIncrease: true },
      { label: "PLATFORM ACCESSIBILITY", value: "63%", isIncrease: true },
      { label: "DATA THROUGHPUT", value: "86%", isIncrease: true },
    ],
  },
  {
    title: "AI RESEARCH INTERN",
    company: "GIOSTAR.AI",
    location: "PHOENIX, AZ",
    period: "NOV 2023 - MAY 2024",
    id: "EXP-1J-892",
    assignmentId: "GIO-2023-11",
    status: "COMPLETED",
    description:
      "Conducted research and development in AI applications for healthcare, focusing on EEG processing and medical imaging analysis.",
    responsibilities: [
      "Optimized EEG processing in the PyData Stack by applying time-frequency analysis, reducing latency by 25% and enabling real-time thought-controlled smartphone usage",
      "Incorporated artifact detection algorithms in PyTorch TFT & RCNN models and automated it via Jenkins CI/CD for Epilepsy Detection, exceeding 90% detection accuracy",
      "Built Vision Transformer & U-Net models in ExecuTorch with MONAI for AWS EC2 deployment, improving detection/classification accuracy by 20%",
    ],
    metrics: [
      { label: "LATENCY", value: "25%", isIncrease: false },
      { label: "ACCURACY", value: "90%", isIncrease: true },
      { label: "PERFORMANCE", value: "20%", isIncrease: true },
    ],
  },
  {
    title: "AI/SOW ENGINEER",
    company: "NIRMA UNIVERSITY",
    location: "AHMEDABAD, INDIA",
    period: "AUG 2022 - AUG 2023",
    id: "EXP-2K-901",
    assignmentId: "NU-2022-08",
    status: "COMPLETED",
    description:
      "Developed and optimized computer vision models for license plate detection and recognition, focusing on accuracy and performance improvements.",
    responsibilities: [
      "Aggregated and annotated 10,000+ license plate images using custom scripting and the TensorFlow Object Detection API, boosting OCR model accuracy by 18%",
      "Engineered an OCR Deep Learning Model and an Ensemble Learning Model for 480p and noisy 1080p images, achieving 86% letter detection efficacy",
      "Optimized YOLOv5 and Localized Object Tracking (LOT) for edge devices, cutting detection latency by 13% and raising detection accuracy by 22%",
    ],
    metrics: [
      { label: "ACCURACY", value: "18%", isIncrease: true },
      { label: "EFFICACY", value: "86%", isIncrease: true },
      { label: "LATENCY", value: "13%", isIncrease: false },
    ],
  },
]
