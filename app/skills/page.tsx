"use client"
import { PageLayout } from "@/components/layout/page-layout"
import { motion } from "framer-motion"

const skillsData = {
  languages: {
    title: "LANGUAGES",
    subcategories: {
      Core: ["Python", "SQL", "C++"],
      Scripting: ["Bash", "Git", "CUDA"],
      "Web/Mobile": ["TypeScript", "Swift", "HTML/CSS"],
    },
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

function calculateTotals() {
  let totalTech = 0
  let totalSubcategories = 0

  Object.values(skillsData).forEach((category) => {
    if (category.subcategories) {
      const subcats = Object.entries(category.subcategories)
      totalSubcategories += subcats.length
      subcats.forEach(([_, items]) => {
        totalTech += items.length
      })
    }
  })

  return { totalTech, totalSubcategories }
}

function SkillTag({ name, delay }: { name: string; delay: number }) {
  return (
    <motion.span
      className="inline-block px-1.5 py-0.5 text-[9px] font-sf-mono uppercase tracking-wide border border-primary/20 bg-background text-primary/70 hover:bg-primary hover:text-background hover:border-primary transition-all duration-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, delay }}
    >
      {name}
    </motion.span>
  )
}

function SubcategoryRow({
  title,
  items,
  categoryDelay,
  index,
}: {
  title: string
  items: string[]
  categoryDelay: number
  index: number
}) {
  const baseDelay = categoryDelay + index * 0.03

  return (
    <motion.div
      className="flex items-baseline gap-2 py-1 border-b border-primary/5 last:border-b-0"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: baseDelay }}
    >
      <span className="text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider w-20 shrink-0">{title}</span>
      <div className="flex flex-wrap gap-1">
        {items.map((item, idx) => (
          <SkillTag key={idx} name={item} delay={baseDelay + idx * 0.01} />
        ))}
      </div>
    </motion.div>
  )
}

function CategoryBlock({
  title,
  subcategories,
  index,
  fullWidth = false,
}: {
  title: string
  subcategories: Record<string, string[]>
  index: number
  fullWidth?: boolean
}) {
  const categoryDelay = index * 0.08

  return (
    <motion.div
      className={`border border-primary/20 bg-background ${fullWidth ? "col-span-1 md:col-span-2" : ""}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: categoryDelay }}
    >
      {/* Category header - compact */}
      <div className="border-b border-primary/20 px-2 py-1 bg-primary/5">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-sf-mono font-bold tracking-widest text-primary">{title}</h3>
          <span className="text-[8px] font-sf-mono text-primary/30">[{String(index + 1).padStart(2, "0")}]</span>
        </div>
      </div>

      {/* Category content - minimal padding */}
      <div className="px-2 py-1.5">
        <div className="flex flex-col">
          {Object.entries(subcategories).map(([subcat, subItems], idx) => (
            <SubcategoryRow key={subcat} title={subcat} items={subItems} categoryDelay={categoryDelay} index={idx} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function SkillsPage() {
  const { totalTech, totalSubcategories } = calculateTotals()

  return (
    <PageLayout title="SKILLS" subtitle="TECHNICAL EXPERTISE">
      <div className="flex flex-col justify-between h-[calc(100vh-12rem)] py-0">
        <div className="flex flex-col gap-2">
          {/* Top row: Languages, Train/Eval/Infer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <CategoryBlock
              title={skillsData.languages.title}
              subcategories={skillsData.languages.subcategories}
              index={0}
            />
            <CategoryBlock
              title={skillsData.trainEvalInfer.title}
              subcategories={skillsData.trainEvalInfer.subcategories}
              index={1}
            />
          </div>

          {/* Middle row: Frameworks, Databases */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <CategoryBlock
              title={skillsData.frameworks.title}
              subcategories={skillsData.frameworks.subcategories}
              index={2}
            />
            <CategoryBlock
              title={skillsData.databases.title}
              subcategories={skillsData.databases.subcategories}
              index={3}
            />
          </div>

          {/* Cloud - full width */}
          <CategoryBlock
            title={skillsData.cloud.title}
            subcategories={skillsData.cloud.subcategories}
            index={4}
            fullWidth
          />
        </div>

        <motion.div
          className="flex items-center justify-between border-t border-primary/20 pt-2 mt-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex gap-3 text-[9px] font-sf-mono text-primary/40 uppercase tracking-wider">
            <span>5 CATEGORIES</span>
            <span className="text-primary/20">/</span>
            <span>{totalSubcategories} SUBCATEGORIES</span>
            <span className="text-primary/20">/</span>
            <span>{totalTech} TECHNOLOGIES</span>
          </div>
          <div className="text-[8px] font-sf-mono text-primary/30">LAST.UPDATED: 2024</div>
        </motion.div>
      </div>
    </PageLayout>
  )
}
