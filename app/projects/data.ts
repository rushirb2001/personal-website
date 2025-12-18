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
    id: "proj_portfolio_001",
    title: "Personal Portfolio Website",
    description: "Professional portfolio built with Next.js 14, TypeScript, and Tailwind CSS",
    fullDescription:
      "A modern, high-performance portfolio website showcasing machine learning engineering projects and technical expertise. Built with Next.js 14 App Router and React Server Components, featuring custom animations, responsive design, and optimal performance. The site demonstrates production-grade software engineering practices with modular component architecture, comprehensive type safety, and accessibility compliance. Achieves 95+ Lighthouse performance score and perfect accessibility ratings through strategic optimization including server-side rendering, code splitting, image lazy loading, and minimal JavaScript bundles.",
    technologies: [
      "Next.js 14",
      "TypeScript",
      "React Server Components",
      "Tailwind CSS",
      "Framer Motion",
      "shadcn/ui",
      "Radix UI",
      "Vercel",
    ],
    category: "Web Development",
    status: "COMPLETED",
    date: "2024-10",
    github: "https://github.com/rushirb2001/v0-untitled-project",
    demo: "https://rushirbhavsar.vercel.app",
    highlights: [
      "Achieved Lighthouse scores: 95+ Performance, 100 Accessibility, 100 Best Practices, 100 SEO",
      "Implemented Server Components architecture reducing client-side JavaScript by 40%",
      "Built custom design system with dark/light mode and fluid responsive layouts",
      "Optimized Core Web Vitals: LCP < 2.0s, FCP < 1.2s, CLS < 0.1",
      "Deployed on Vercel edge network with automated CI/CD pipeline",
    ],
    feature: false,
  },
  {
    id: "proj_yelp_ml_002",
    title: "Yelp ML Platform",
    description: "Production-ready ML platform for business recommendations and sentiment analysis",
    fullDescription:
      "End-to-end machine learning platform processing millions of Yelp reviews to deliver business recommendations and sentiment analysis through a containerized REST API. Implements collaborative filtering using ALS (Alternating Least Squares) for personalized recommendations and multi-class sentiment classification using TF-IDF with Logistic Regression. The platform demonstrates comprehensive MLOps practices including distributed data processing with Apache Spark, experiment tracking with MLflow, automated testing (24 unit and integration tests), and CI/CD automation with GitHub Actions. Features scalable ETL pipelines transforming JSON to Parquet, comprehensive feature engineering, and Docker-based microservices architecture with multi-service orchestration.",
    technologies: [
      "Python",
      "Spark",
      "PySpark ML",
      "FastAPI",
      "MLflow",
      "Docker",
      "NLTK",
      "Pandas",
      "NumPy",
      "GitHub Actions",
    ],
    category: "Machine Learning",
    status: "COMPLETED",
    date: "2024-11",
    github: "https://github.com/rushirb2001/yelp-ml-platform",
    highlights: [
      "Built collaborative filtering system achieving RMSE of 3.32 and MAE of 2.79 on recommendation tasks",
      "Developed sentiment classifier with 82.9% accuracy, 82.3% F1 score on multi-class classification",
      "Processed millions of Yelp reviews using distributed PySpark data processing pipelines",
      "Implemented complete MLOps workflow with MLflow tracking, automated testing, and CI/CD via GitHub Actions",
      "Created RESTful API with FastAPI featuring auto-generated OpenAPI documentation and Docker containerization",
    ],
    feature: true,
  },
  {
    id: "proj_mace_pinn_003",
    title: "MACE-PINN: Physics-Informed Neural Networks for Coupled PDEs",
    description: "Novel neural network architecture for solving coupled partial differential equations",
    fullDescription:
      "Master's thesis research introducing Multi-Architecture Coupled Ensemble Physics-Informed Neural Networks (MACE-PINN) for solving coupled partial differential equation systems. The architecture employs parallel subnetworks with separate neural networks for each PDE variable, preventing gradient interference while maintaining physical coupling. Implements random Fourier feature embeddings to overcome spectral bias and enable high-frequency pattern capture, combined with gradient norm adaptive loss weighting for training stability. Successfully applied to Gray-Scott and Ginzburg-Landau reaction-diffusion systems, demonstrating superior pattern formation capture including spot formation, stripe patterns, and self-replication dynamics. The research addresses fundamental challenges in scientific computing by enabling accurate simulation of complex physical phenomena using data-efficient neural approaches.",
    technologies: [
      "Python",
      "JAX",
      "Flax",
      "NumPy",
      "MATLAB",
    ],
    category: "Research",
    status: "COMPLETED",
    date: "2025-04",
    github: "https://github.com/rushirb2001/thesis-mace-pinn",
    demo: "https://keep.lib.asu.edu/items/201211",
    highlights: [
      "Achieved 40-60% reduction in relative L2 error compared to single-network PINNs across multiple parameter regimes",
      "Successfully captured complex pattern formation including self-replicating spots and wave propagation (2.3-3.5% error)",
      "Developed parallel subnetwork architecture eliminating gradient interference in coupled systems",
      "Implemented Fourier feature embeddings enabling high-frequency pattern learning despite spectral bias",
      "Defended Master's thesis at Arizona State University, published in ASU Digital Repository",
    ],
    feature: true,
  },
  {
    id: "proj_diamond_seg_004",
    title: "Diamond Shape Segmentation",
    description: "Automated diamond image segmentation using GrabCut with CLAHE preprocessing",
    fullDescription:
      "Computer vision pipeline for automated diamond segmentation processing over 57,000 images across 14 shape categories. Developed during the MiNeD Hackathon at Nirma University, the system implements OpenCV's GrabCut algorithm enhanced with CLAHE (Contrast Limited Adaptive Histogram Equalization) for robust background removal. Features comprehensive batch processing with multi-threaded execution, automated video generation for pipeline visualization, and statistical analysis with quality metrics. The pipeline includes morphological operations for mask refinement, contour detection with bounding box annotation, and interactive Jupyter notebooks for exploration. Demonstrates production-ready computer vision engineering with structured logging, performance profiling, and configurable parameters via YAML.",
    technologies: [
      "Python",
      "OpenCV",
      "NumPy",
      "Jupyter",
      "YAML",
    ],
    category: "Computer Vision",
    status: "COMPLETED",
    date: "2022-03",
    github: "https://github.com/rushirb2001/diamond-shape-segmentation",
    highlights: [
      "Processed 57,344 diamond images across 14 shape categories with 3.7 images/second throughput",
      "Implemented GrabCut segmentation with CLAHE preprocessing achieving 68.45% average foreground extraction",
      "Developed automated video generation pipeline creating triple-split and five-split comparison demonstrations",
      "Built comprehensive analysis system calculating quality metrics including sharpness, contrast, and edge density",
      "Led 5-person team at MiNeD Hackathon, Nirma University, delivering complete production-ready pipeline",
    ],
    feature: false,
  },
];

export const categories = ["All", "Web Development", "Machine Learning", "Data Science", "Mobile", "Other"]
