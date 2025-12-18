export interface Experience {
  title: string
  company: string
  location: string
  period: string
  description: string
  responsibilities: string[]
  skills: string[]
}

export const ITEMS_PER_PAGE = 5

export const experiences: readonly Experience[] = [
  {
    title: "GENAI ENGINEERING INTERN",
    company: "TALIN LABS INC",
    location: "REMOTE",
    period: "MAY'24 - SEP'24",
    description:
      "Developed and deployed AI pipelines and systems for enterprise applications, focusing on reliability, scalability, and performance optimization.",
    responsibilities: [
      "Increased system reliability by 42% and data accessibility by 63% by deploying AI pipelines on AWS & Azure using Docker containers orchestrated by Kubernetes",
      "Enhanced Custom AI Chatbot deployment efficiency by implementing Transformer-based models with OpenAI API and Mistral Big within the LangChain framework",
      "Accelerated supply-chain query handling by 12%, achieving sub-second latencies and an 86% increase in data throughput by applying Retrieval-Augmented Generation (RAG) techniques",
    ],
    skills: ["AWS", "AZURE", "DOCKER", "LANGCHAIN", "RAG"],
  },
  {
    title: "AI RESEARCH INTERN",
    company: "GIOSTAR.AI",
    location: "PHOENIX, AZ",
    period: "NOV'23 - MAY'24",
    description:
      "Conducted research and development in AI applications for healthcare, focusing on EEG processing and medical imaging analysis.",
    responsibilities: [
      "Optimized EEG processing in the PyData Stack by applying time-frequency analysis, reducing latency by 25% and enabling real-time thought-controlled smartphone usage",
      "Incorporated artifact detection algorithms in PyTorch TFT & RCNN models and automated it via Jenkins CI/CD for Epilepsy Detection, exceeding 90% detection accuracy",
      "Built Vision Transformer & U-Net models in ExecuTorch with MONAI for AWS EC2 deployment, improving detection/classification accuracy by 20%",
    ],
    skills: ["PYTORCH", "JENKINS", "AWS EC2", "MONAI", "CV"],
  },
  {
    title: "AI/ML ENGINEER",
    company: "NIRMA UNIVERSITY",
    location: "INDIA",
    period: "AUG'22 - AUG'23",
    description:
      "Developed and optimized computer vision models for license plate detection and recognition, focusing on accuracy and performance improvements.",
    responsibilities: [
      "Aggregated and annotated 10,000+ license plate images using custom scripting and the TensorFlow Object Detection API, boosting OCR model accuracy by 18%",
      "Engineered an OCR Deep Learning Model and an Ensemble Learning Model for 480p and noisy 1080p images, achieving 86% letter detection efficacy",
      "Optimized YOLOv5 and Localized Object Tracking (LOT) for edge devices, cutting detection latency by 13% and raising detection accuracy by 22%",
    ],
    skills: ["TENSORFLOW", "YOLOV5", "OCR", "EDGE DEPLOYMENT"],
  },
] as const
