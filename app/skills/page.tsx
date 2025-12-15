"use client"

import { PageLayout } from "@/components/layout/page-layout"
import { motion } from "framer-motion"

const skillsData = {
  languages: {
    title: "LANG",
    items: ["Python", "SQL", "Git", "Bash", "CUDA", "Swift", "TypeScript", "C++", "HTML/CSS"],
  },
  frameworks: {
    title: "FRAMEWORKS",
    subcategories: {
      "DEEP LEARN": ["PyTorch", "TensorFlow", "Keras", "JAX"],
      "GEN AI": ["Transformers", "LangGraph", "LangChain", "CrewAI", "HuggingFace"],
      "TRAD ML": ["Pandas", "Numpy", "Scikit-learn", "Matplotlib", "Seaborn", "NLTK"],
      CV: ["OpenCV", "MediaPipe", "Albumentations", "YOLO"],
    },
  },
  trainEvalInfer: {
    title: "PIPELINE",
    subcategories: {
      TRAIN: ["LoRA", "QLoRA", "DeepSpeed", "Ray", "FSDP"],
      EVAL: ["MLFlow", "WandB", "DeepEval", "RAGAS"],
      INFER: ["vLLM", "MLX", "Diffusers", "Ollama", "Groq"],
    },
  },
  databases: {
    title: "DATA",
    subcategories: {
      "BIG DATA": ["Spark", "Hadoop", "Hive", "Databricks"],
      DB: ["PostgreSQL", "MySQL", "MongoDB", "Firebase", "Redis"],
      VECTOR: ["ChromaDB", "Pinecone", "Weaviate", "AstraDB"],
    },
  },
  cloud: {
    title: "CLOUD",
    subcategories: {
      AWS: ["Lambda", "EC2", "S3", "Sagemaker", "Bedrock", "Glue"],
      GCP: ["Cloud Run", "Firebase", "VertexAI", "BigQuery"],
      AZURE: ["AzureML", "Azure OpenAI", "AKS", "CosmosDB"],
    },
  },
}

function SkillTag({ name, delay }: { name: string; delay: number }) {
  return (
    <motion.span
      className="text-[10px] sm:text-xs font-sf-mono text-primary/60 hover:text-primary hover:bg-primary/10 px-1.5 py-0.5 transition-colors duration-100 cursor-default"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, delay }}
    >
      {name}
    </motion.span>
  )
}

function CategoryBlock({
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
  const baseDelay = index * 0.1

  return (
    <motion.div
      className="border border-primary/20 bg-primary/[0.02]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: baseDelay }}
    >
      {/* Category header */}
      <div className="border-b border-primary/20 px-3 py-2 bg-primary/5">
        <span className="text-xs sm:text-sm font-sf-mono font-bold tracking-wider text-primary/80">{title}</span>
      </div>

      {/* Content */}
      <div className="p-2 sm:p-3">
        {subcategories ? (
          <div className="space-y-2">
            {Object.entries(subcategories).map(([subcat, subItems], subIdx) => (
              <div key={subcat} className="group">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-[9px] sm:text-[10px] font-sf-mono text-primary/40 font-medium w-16 sm:w-20 shrink-0 group-hover:text-primary/60 transition-colors">
                    {subcat}
                  </span>
                  <div className="flex flex-wrap gap-x-1 gap-y-0.5">
                    {subItems.map((item, itemIdx) => (
                      <SkillTag key={item} name={item} delay={baseDelay + subIdx * 0.05 + itemIdx * 0.02} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : items ? (
          <div className="flex flex-wrap gap-x-1 gap-y-0.5">
            {items.map((item, idx) => (
              <SkillTag key={item} name={item} delay={baseDelay + idx * 0.02} />
            ))}
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}

export default function SkillsPage() {
  return (
    <PageLayout title="SKILLS" subtitle="TECHNICAL EXPERTISE">
      <div className="py-4 sm:py-6">
        {/* Main grid - responsive layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Languages - full width on mobile, half on desktop */}
          <CategoryBlock title={skillsData.languages.title} items={skillsData.languages.items} index={0} />

          {/* Frameworks */}
          <CategoryBlock
            title={skillsData.frameworks.title}
            subcategories={skillsData.frameworks.subcategories}
            index={1}
          />

          {/* Pipeline (Train/Eval/Infer) */}
          <CategoryBlock
            title={skillsData.trainEvalInfer.title}
            subcategories={skillsData.trainEvalInfer.subcategories}
            index={2}
          />

          {/* Databases */}
          <CategoryBlock
            title={skillsData.databases.title}
            subcategories={skillsData.databases.subcategories}
            index={3}
          />

          {/* Cloud - full width */}
          <div className="md:col-span-2">
            <CategoryBlock title={skillsData.cloud.title} subcategories={skillsData.cloud.subcategories} index={4} />
          </div>
        </div>

        {/* Footer stats */}
        <motion.div
          className="flex items-center justify-between mt-4 sm:mt-6 pt-3 border-t border-primary/10 text-[10px] sm:text-xs font-sf-mono text-primary/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <span>5 CATEGORIES</span>
          <span>15 SUBCATEGORIES</span>
          <span>70+ TECHNOLOGIES</span>
        </motion.div>
      </div>
    </PageLayout>
  )
}
