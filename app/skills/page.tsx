"use client"
import { useState } from "react"
import { PageLayout } from "@/components/layout/page-layout"
import { motion } from "framer-motion"

const skillsData = {
  languages: {
    title: "LANGUAGES",
    items: ["Python", "SQL", "Git", "Bash", "CUDA", "Swift", "TypeScript", "C++", "HTML/CSS"],
  },
  frameworks: {
    title: "FRAMEWORKS",
    subcategories: {
      "Deep Learning": ["PyTorch", "TensorFlow", "Keras", "JAX"],
      "Generative AI": ["Transformers", "LangGraph", "LangChain", "Hugging Face"],
      "Traditional ML": ["Pandas", "Numpy", "Scikit-learn", "Matplotlib", "Seaborn", "NLTK"],
      "Computer Vision": ["OpenCV", "MediaPipe", "Albumentations", "YOLO"],
    },
  },
  trainEvalInfer: {
    title: "TRAIN/EVAL/INFER",
    subcategories: {
      Training: ["LoRA", "QLoRA", "DeepSpeed Zero", "Ray", "Pytorch FSDP"],
      Evaluation: ["MLFlow", "WandB", "DeepEval", "RAGAS"],
      Inference: ["vLLM", "MLX", "Diffusers", "Ollama", "Groq", "Baseten"],
    },
  },
  databases: {
    title: "DATABASES",
    subcategories: {
      "Big Data": ["Apache Spark", "Hadoop", "Hive", "Databricks"],
      "RDBMS/NoSQL": ["PostgreSQL", "MySQL", "MongoDB", "Firebase", "Redis"],
      VectorDB: ["ChromaDB", "Pinecone", "Weaviate", "Datastax AstraDB"],
    },
  },
  cloud: {
    title: "CLOUD",
    subcategories: {
      AWS: ["Lambda", "EC2", "S3", "Sagemaker", "DynamoDB", "OpenSearch", "Bedrock", "Glue"],
      GCP: ["Cloud Run", "Cloud Storage", "Firebase", "Cloud SQL", "VertexAI", "BigQuery"],
      Azure: ["AzureML", "Azure OpenAI", "Azure Kubernetes Service", "CosmosDB"],
    },
  },
}

function TreeBranch({ isLast = false }: { isLast?: boolean }) {
  return (
    <div className="flex items-stretch">
      <div className="w-3 flex flex-col items-center">
        <div className="w-px h-1/2 bg-primary/20" />
        <div className="w-3 h-px bg-primary/20" />
        {!isLast && <div className="w-px h-1/2 bg-primary/20" />}
      </div>
    </div>
  )
}

function LeafBranch({ isLast = false }: { isLast?: boolean }) {
  return (
    <div className="flex items-center h-full">
      <div className="w-2 h-px bg-primary/15" />
    </div>
  )
}

function SkillLeaf({ name, index, isHovered }: { name: string; index: number; isHovered: boolean }) {
  return (
    <motion.span
      className="inline-flex items-center px-2.5 py-1.5 text-xs font-sf-mono bg-primary/5 border border-primary/15 hover:bg-primary/10 hover:border-primary/30 transition-all duration-150 cursor-default"
      initial={{ opacity: 0.6 }}
      animate={{ opacity: isHovered ? 1 : 0.6 }}
      transition={{ duration: 0.1, delay: index * 0.015 }}
    >
      {name}
    </motion.span>
  )
}

function SubcategoryBranch({
  title,
  items,
  isFirst,
  isLast,
  categoryIndex,
  subIndex,
}: {
  title: string
  items: string[]
  isFirst: boolean
  isLast: boolean
  categoryIndex: number
  subIndex: number
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="flex"
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: categoryIndex * 0.05 + subIndex * 0.03 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Vertical trunk + horizontal branch connector */}
      <div className="relative w-5 flex-shrink-0">
        {/* Vertical line - top half */}
        <div className={`absolute left-0 top-0 w-px bg-primary/25 ${isFirst ? "h-1/2 top-1/2" : "h-1/2"}`} />
        {/* Vertical line - bottom half */}
        <div className={`absolute left-0 bottom-0 w-px bg-primary/25 ${isLast ? "h-1/2 bottom-1/2" : "h-1/2"}`} />
        {/* Horizontal branch */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-px bg-primary/25" />
      </div>

      {/* Subcategory node */}
      <div className="flex items-center gap-3 py-2">
        <span
          className={`text-xs font-sf-mono whitespace-nowrap px-2.5 py-1.5 border transition-all duration-150 ${
            isHovered
              ? "text-primary/80 border-primary/30 bg-primary/10"
              : "text-primary/40 border-primary/15 bg-primary/5"
          }`}
        >
          {title}
        </span>

        {/* Horizontal connector to skills */}
        <div className="w-4 h-px bg-primary/20" />

        {/* Skills leaf nodes */}
        <div className="flex flex-wrap gap-2 items-center">
          {items.map((item, idx) => (
            <SkillLeaf key={idx} name={item} index={idx} isHovered={isHovered} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function CategoryTree({
  title,
  subcategories,
  items,
  index,
}: {
  title: string
  subcategories?: Record<string, string[]>
  items?: string[]
  index: number
}) {
  const [isHovered, setIsHovered] = useState(false)
  const subcatEntries = subcategories ? Object.entries(subcategories) : []

  return (
    <motion.div
      className="flex items-start mb-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.08 }}
    >
      {/* Root node */}
      <div
        className="flex items-center shrink-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`px-3 py-2 border text-sm font-sf-mono font-medium tracking-wide transition-all duration-150 ${
            isHovered
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-primary/25 bg-primary/5 text-primary/70"
          }`}
        >
          {title}
        </div>
        {/* Connector line from root */}
        <div className="w-5 h-px bg-primary/25" />
      </div>

      {/* Branches */}
      <div className="flex flex-col">
        {subcategories ? (
          subcatEntries.map(([subcat, subItems], idx) => (
            <SubcategoryBranch
              key={subcat}
              title={subcat}
              items={subItems}
              isFirst={idx === 0}
              isLast={idx === subcatEntries.length - 1}
              categoryIndex={index}
              subIndex={idx}
            />
          ))
        ) : items ? (
          <div className="flex items-center gap-3 py-2">
            <div className="flex flex-wrap gap-2">
              {items.map((item, idx) => (
                <SkillLeaf key={idx} name={item} index={idx} isHovered={isHovered} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}

export default function SkillsPage() {
  return (
    <PageLayout title="SKILLS" subtitle="TECHNICAL EXPERTISE">
      <div className="flex flex-col gap-8 py-6 overflow-x-auto">
        {/* Languages - flat items */}
        <CategoryTree title={skillsData.languages.title} items={skillsData.languages.items} index={0} />

        {/* Frameworks - subcategorized */}
        <CategoryTree
          title={skillsData.frameworks.title}
          subcategories={skillsData.frameworks.subcategories}
          index={1}
        />

        {/* Train/Eval/Infer */}
        <CategoryTree
          title={skillsData.trainEvalInfer.title}
          subcategories={skillsData.trainEvalInfer.subcategories}
          index={2}
        />

        {/* Databases */}
        <CategoryTree title={skillsData.databases.title} subcategories={skillsData.databases.subcategories} index={3} />

        {/* Cloud */}
        <CategoryTree title={skillsData.cloud.title} subcategories={skillsData.cloud.subcategories} index={4} />

        {/* Stats footer */}
        <motion.div
          className="text-xs text-primary/30 font-sf-mono flex gap-4 pt-4 pl-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <span>5 ROOTS</span>
          <span>•</span>
          <span>15 BRANCHES</span>
          <span>•</span>
          <span>70+ LEAVES</span>
        </motion.div>
      </div>
    </PageLayout>
  )
}
