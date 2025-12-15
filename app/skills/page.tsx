"use client"

import type React from "react"

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
      "Generative AI": ["Transformers", "LangGraph", "LangChain", "CrewAI", "Hugging Face"],
      "Traditional ML": ["Pandas", "Numpy", "Scikit-learn", "Matplotlib", "Seaborn", "NLTK"],
      "Computer Vision": ["OpenCV", "MediaPipe", "Albumentations", "YOLO"],
    },
  },
  trainEvalInfer: {
    title: "TRAIN, EVAL & INFER",
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

function SkillTag({ name, showTooltip = false }: { name: string; showTooltip?: boolean }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] md:text-[10px] font-sf-mono bg-primary/5 border border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-150 cursor-default">
      {name}
    </span>
  )
}

function SubcategoryRow({ title, items }: { title: string; items: string[] }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="flex items-start gap-2 py-1">
        <span className="text-[9px] md:text-[10px] font-sf-mono text-primary/50 whitespace-nowrap min-w-[80px] md:min-w-[100px]">
          {title}
        </span>
        <div className="flex flex-wrap gap-1">
          {items.map((item, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0.7 }}
              animate={{ opacity: isHovered ? 1 : 0.7 }}
              transition={{ duration: 0.15, delay: idx * 0.02 }}
            >
              <SkillTag name={item} />
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  )
}

function CategorySection({ title, children, index }: { title: string; children: React.ReactNode; index: number }) {
  return (
    <motion.div
      className="border border-primary/20 bg-background"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="border-b border-primary/20 px-2 py-1.5 bg-primary/5">
        <h3 className="text-[10px] md:text-xs font-sf-mono font-medium tracking-wide">{title}</h3>
      </div>
      <div className="px-2 py-2">{children}</div>
    </motion.div>
  )
}

export default function SkillsPage() {
  return (
    <PageLayout title="SKILLS" subtitle="TECHNICAL EXPERTISE">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-4 pb-4">
        {/* Languages - simple flat list */}
        <CategorySection title={skillsData.languages.title} index={0}>
          <div className="flex flex-wrap gap-1">
            {skillsData.languages.items.map((item, idx) => (
              <SkillTag key={idx} name={item} />
            ))}
          </div>
        </CategorySection>

        {/* Frameworks - subcategorized */}
        <CategorySection title={skillsData.frameworks.title} index={1}>
          <div className="space-y-1">
            {Object.entries(skillsData.frameworks.subcategories).map(([subcat, items]) => (
              <SubcategoryRow key={subcat} title={subcat} items={items} />
            ))}
          </div>
        </CategorySection>

        {/* Train, Eval & Infer */}
        <CategorySection title={skillsData.trainEvalInfer.title} index={2}>
          <div className="space-y-1">
            {Object.entries(skillsData.trainEvalInfer.subcategories).map(([subcat, items]) => (
              <SubcategoryRow key={subcat} title={subcat} items={items} />
            ))}
          </div>
        </CategorySection>

        {/* Databases */}
        <CategorySection title={skillsData.databases.title} index={3}>
          <div className="space-y-1">
            {Object.entries(skillsData.databases.subcategories).map(([subcat, items]) => (
              <SubcategoryRow key={subcat} title={subcat} items={items} />
            ))}
          </div>
        </CategorySection>

        {/* Cloud - spans full width due to more content */}
        <div className="lg:col-span-2">
          <CategorySection title={skillsData.cloud.title} index={4}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {Object.entries(skillsData.cloud.subcategories).map(([provider, items]) => (
                <div key={provider} className="space-y-1">
                  <span className="text-[9px] md:text-[10px] font-sf-mono text-primary/50 block">{provider}</span>
                  <div className="flex flex-wrap gap-1">
                    {items.map((item, idx) => (
                      <SkillTag key={idx} name={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CategorySection>
        </div>

        {/* Stats footer */}
        <div className="lg:col-span-2 text-[9px] md:text-[10px] text-primary/30 font-sf-mono text-center pt-2 flex justify-center gap-6">
          <span>5 CATEGORIES</span>
          <span>•</span>
          <span>15 SUBCATEGORIES</span>
          <span>•</span>
          <span>70+ TECHNOLOGIES</span>
        </div>
      </div>
    </PageLayout>
  )
}
