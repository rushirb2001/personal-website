"use client"
import { PageLayout } from "@/components/layout/page-layout"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ChevronDown } from "lucide-react"

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
      "Deep Learning": ["PyTorch", "TensorFlow", "JAX"],
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

const categoryKeys = ["languages", "frameworks", "trainEvalInfer", "databases", "cloud"] as const
type CategoryKey = (typeof categoryKeys)[number]

const DEFAULT_EXPANDED: CategoryKey[] = ["languages", "frameworks"]

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

function SkillTag({ name, delay, isHighlighted }: { name: string; delay: number; isHighlighted?: boolean }) {
  return (
    <motion.span
      className={`inline-block px-1.5 py-0.5 text-[8px] sm:text-[9px] md:text-xs font-sf-mono uppercase tracking-wide border transition-all duration-100 whitespace-nowrap ${
        isHighlighted
          ? "bg-primary text-background border-primary"
          : "bg-background text-primary/70 border-primary/20 hover:bg-primary hover:text-background hover:border-primary"
      }`}
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
  isContainerHovered = false,
}: {
  title: string
  items: string[]
  categoryDelay: number
  index: number
  isContainerHovered?: boolean
}) {
  const baseDelay = categoryDelay + index * 0.03
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`flex flex-wrap items-center gap-1 py-0.5 sm:py-1 border-b last:border-b-0 transition-colors duration-150 ${
        isContainerHovered ? "border-primary/10" : "border-primary/5"
      }`}
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.15, delay: baseDelay }}
    >
      <span
        className={`text-[8px] sm:text-[9px] font-sf-mono uppercase tracking-wider cursor-pointer transition-colors duration-100 mr-1 ${
          isContainerHovered || isHovered ? "text-primary/70" : "text-primary/40"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {title}:
      </span>
      {items.map((item, idx) => (
        <SkillTag key={idx} name={item} delay={baseDelay + idx * 0.01} isHighlighted={isHovered} />
      ))}
    </motion.div>
  )
}

function MobileCollapsibleCategory({
  categoryKey,
  title,
  subcategories,
  index,
  isExpanded,
  onToggle,
}: {
  categoryKey: CategoryKey
  title: string
  subcategories: Record<string, string[]>
  index: number
  isExpanded: boolean
  onToggle: (key: CategoryKey) => void
}) {
  const categoryDelay = index * 0.05

  return (
    <motion.div
      className={`border border-primary/20 transition-colors duration-150 py-0 ${
        isExpanded ? "bg-primary/5 border-primary/30" : "bg-background"
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: categoryDelay }}
    >
      {/* Collapsible Header */}
      <button
        onClick={() => onToggle(categoryKey)}
        className={`w-full border-primary/20 px-2 py-1.5 flex items-center justify-between transition-colors duration-150 border-b-0 ${
          isExpanded ? "bg-primary/10" : "bg-primary/5"
        }`}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-[10px] font-sf-mono font-bold tracking-widest text-primary">{title}</h3>
          <span className="text-[8px] font-sf-mono text-primary/30">[{String(index + 1).padStart(2, "0")}]</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={isExpanded ? "" : "animate-bounce"}
          style={{ animationDuration: isExpanded ? "0s" : "2s" }}
        >
          <ChevronDown className={`w-4 h-4 ${isExpanded ? "text-primary" : "text-primary/40"}`} />
        </motion.div>
      </button>

      {/* Collapsible Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-2 py-1">
              <div className="flex flex-col gap-0">
                {Object.entries(subcategories).map(([subcat, subItems], idx) => (
                  <SubcategoryRow
                    key={subcat}
                    title={subcat}
                    items={subItems}
                    categoryDelay={0}
                    index={idx}
                    isContainerHovered={false}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
  const [isContainerHovered, setIsContainerHovered] = useState(false)

  return (
    <motion.div
      className={`border border-primary/20 flex flex-col transition-colors duration-150 ${fullWidth ? "col-span-1 md:col-span-2" : ""} ${
        isContainerHovered ? "bg-primary/5 border-primary/40" : "bg-background"
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: categoryDelay }}
      onMouseEnter={() => setIsContainerHovered(true)}
      onMouseLeave={() => setIsContainerHovered(false)}
    >
      <div
        className={`border-b border-primary/20 px-2 py-1 transition-colors duration-150 ${
          isContainerHovered ? "bg-primary/15" : "bg-primary/5"
        }`}
      >
        <div className="flex items-center justify-between">
          <h3
            className={`text-[9px] sm:text-sm font-sf-mono font-bold tracking-widest transition-colors duration-150 ${
              isContainerHovered ? "text-primary" : "text-primary"
            }`}
          >
            {title}
          </h3>
          <span
            className={`text-[8px] sm:text-[10px] font-sf-mono transition-colors duration-150 ${
              isContainerHovered ? "text-primary/50" : "text-primary/30"
            }`}
          >
            [{String(index + 1).padStart(2, "0")}]
          </span>
        </div>
      </div>

      <div className="px-2 py-1 flex-1">
        <div className="flex flex-col gap-0">
          {Object.entries(subcategories).map(([subcat, subItems], idx) => (
            <SubcategoryRow
              key={subcat}
              title={subcat}
              items={subItems}
              categoryDelay={categoryDelay}
              index={idx}
              isContainerHovered={isContainerHovered}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function SkillsPage() {
  const { totalTech, totalSubcategories } = calculateTotals()
  const isMobile = useMediaQuery("(max-width: 768px)")

  const [expandedSections, setExpandedSections] = useState<CategoryKey[]>(DEFAULT_EXPANDED)

  const handleToggle = (key: CategoryKey) => {
    setExpandedSections((prev) => {
      if (prev.includes(key)) {
        // If already expanded, collapse it
        return prev.filter((k) => k !== key)
      } else {
        // Expand this one, collapse others (only one open at a time after initial state)
        return [key]
      }
    })
  }

  return (
    <PageLayout title="SKILLS" subtitle="TECHNICAL EXPERTISE">
      <div className="flex flex-col gap-1 sm:gap-2 md:gap-3 h-full">
        {isMobile ? (
          <div className="flex flex-col gap-1 py-3.5">
            {categoryKeys.map((key, idx) => (
              <MobileCollapsibleCategory
                key={key}
                categoryKey={key}
                title={skillsData[key].title}
                subcategories={skillsData[key].subcategories}
                index={idx}
                isExpanded={expandedSections.includes(key)}
                onToggle={handleToggle}
              />
            ))}
          </div>
        ) : (
          /* Desktop layout - unchanged */
          <>
            <div className="flex flex-col md:flex-row gap-1 sm:gap-2 md:gap-3 items-stretch">
              <div className="flex flex-col gap-1 sm:gap-2 md:gap-3 flex-1">
                <CategoryBlock
                  title={skillsData.languages.title}
                  subcategories={skillsData.languages.subcategories}
                  index={0}
                />
                <CategoryBlock
                  title={skillsData.frameworks.title}
                  subcategories={skillsData.frameworks.subcategories}
                  index={2}
                />
              </div>
              <div className="flex flex-col gap-1 sm:gap-2 md:gap-3 flex-1">
                <CategoryBlock
                  title={skillsData.trainEvalInfer.title}
                  subcategories={skillsData.trainEvalInfer.subcategories}
                  index={1}
                />
                <CategoryBlock
                  title={skillsData.databases.title}
                  subcategories={skillsData.databases.subcategories}
                  index={3}
                />
              </div>
            </div>
            <CategoryBlock
              title={skillsData.cloud.title}
              subcategories={skillsData.cloud.subcategories}
              index={4}
              fullWidth
            />
          </>
        )}

        <motion.div
          className="flex items-center justify-between border-t border-primary/20 pt-1 sm:pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.5 }}
        >
          <div className="flex gap-1 sm:gap-3 md:gap-4 text-[8px] sm:text-[10px] font-sf-mono text-primary/40 uppercase tracking-wider">
            <span>5 {isMobile ? "CAT" : "CATEGORIES"}</span>
            <span className="text-primary/20">/</span>
            <span>
              {totalSubcategories} {isMobile ? "SUB" : "SUBCATEGORIES"}
            </span>
            <span className="text-primary/20">/</span>
            <span>
              {totalTech} {isMobile ? "TECH" : "TECHNOLOGIES"}
            </span>
          </div>
          <div className="text-[8px] sm:text-[10px] font-sf-mono text-primary/30">
            {isMobile ? "2025" : "LAST.UPDATED: 2025"}
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
}
