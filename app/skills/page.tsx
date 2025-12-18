"use client"
import { PageLayout } from "@/components/layout/page-layout"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ChevronDown, X } from "lucide-react"

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
      DL: ["PyTorch", "TensorFlow", "JAX"],
      GenAI: ["Transformers", "LangGraph/Chain", "CrewAI", "Hugging Face"],
      ML: ["Pandas", "Numpy", "Sklearn", "Matplotlib"], // , "NLTK",  "Seaborn"
      CV: ["OpenCV", "MediaPipe", "Albumentations", "YOLO"],
    },
  },
  trainEvalInfer: {
    title: "TRAIN/EVAL/INFER",
    subcategories: {
      Training: ["LoRA", "QLoRA", "DSP-Zero", "Ray", "FSDP"],
      Evaluation: ["MLFlow", "WandB", "DeepEval", "RAGAS"],
      Inference: ["vLLM/MLX", "Ollama", "Groq", "Baseten"],
      // "Diffusers",
    },
  },
  databases: {
    title: "DATABASES",
    subcategories: {
      RDBMS: ["PostgreSQL", "MySQL"],
      "Big Data": ["Apache Spark", "Hadoop", "Hive", "Databricks"],
      NoSQL: ["MongoDB", "Firebase", "Redis"],
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

function SkillTag({ name, isHighlighted }: { name: string; isHighlighted?: boolean }) {
  return (
    <span
      className={`inline-block px-1.5 py-0.5 text-[9px] md:text-sm font-sf-mono uppercase tracking-wide border transition-all duration-100 whitespace-nowrap ${
        isHighlighted
          ? "bg-primary text-background border-primary"
          : "bg-background text-primary/70 border-primary/20 hover:bg-primary hover:text-background hover:border-primary"
      }`}
    >
      {name}
    </span>
  )
}

function SubcategoryRow({
  title,
  items,
  isContainerHovered = false,
}: {
  title: string
  items: string[]
  isContainerHovered?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`grid grid-cols-[25%_75%] gap-3 items-center py-1.5 border-b last:border-b-0 transition-colors duration-150 ${
        isContainerHovered ? "border-primary/10" : "border-primary/5"
      }`}
    >
      <span
        className={`font-sf-mono uppercase tracking-wider cursor-pointer transition-colors duration-100 text-right text-xs ${
          isContainerHovered || isHovered ? "text-primary/70" : "text-primary/40"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {title}
      </span>
      <div className="flex flex-wrap items-center gap-1">
        {items.map((item, idx) => (
          <SkillTag key={idx} name={item} isHighlighted={isHovered} />
        ))}
      </div>
    </div>
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
  return (
    <div
      className={`border border-primary/20 transition-colors duration-150 ${
        isExpanded ? "bg-primary/5 border-primary/30" : "bg-background"
      }`}
    >
      {/* Header */}
      <button
        onClick={() => onToggle(categoryKey)}
        className={`w-full px-3 py-2 flex items-center justify-between transition-colors duration-150 ${
          isExpanded ? "bg-primary text-background" : "bg-primary/5 hover:bg-primary/10"
        }`}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-sf-mono font-bold tracking-widest">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-sf-mono ${isExpanded ? "text-background/50" : "text-primary/30"}`}>
            [{String(index + 1).padStart(2, "0")}]
          </span>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            {isExpanded ? <X className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </motion.div>
        </div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 py-2">
              {Object.entries(subcategories).map(([subcat, subItems], idx) => (
                <SubcategoryRow key={subcat} title={subcat} items={subItems} isContainerHovered={false} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
  const [isContainerHovered, setIsContainerHovered] = useState(false)

  return (
    <motion.div
      className={`border border-primary/20 flex flex-col transition-colors duration-150 ${fullWidth ? "col-span-1 md:col-span-2" : ""} ${
        isContainerHovered ? "bg-primary/5 border-primary/40" : "bg-background"
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.08 }}
      onMouseEnter={() => setIsContainerHovered(true)}
      onMouseLeave={() => setIsContainerHovered(false)}
    >
      <div
        className={`border-b border-primary/20 px-3 py-2 transition-colors duration-150 ${
          isContainerHovered ? "bg-primary/15" : "bg-primary/5"
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-sf-mono font-bold tracking-widest text-primary text-base">{title}</h3>
          <span
            className={`font-sf-mono transition-colors duration-150 text-base ${
              isContainerHovered ? "text-primary/50" : "text-primary/30"
            }`}
          >
            [{String(index + 1).padStart(2, "0")}]
          </span>
        </div>
      </div>

      <div className="px-3 py-2 flex-1">
        {Object.entries(subcategories).map(([subcat, subItems]) => (
          <SubcategoryRow key={subcat} title={subcat} items={subItems} isContainerHovered={isContainerHovered} />
        ))}
      </div>
    </motion.div>
  )
}

export default function SkillsPage() {
  const { totalTech, totalSubcategories } = calculateTotals()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [expandedSection, setExpandedSection] = useState<CategoryKey | null>("languages")

  const handleToggle = (key: CategoryKey) => {
    setExpandedSection(expandedSection === key ? null : key)
  }

  return (
    <PageLayout title="SKILLS" subtitle="TECHNICAL EXPERTISE">
      <div className="flex flex-col gap-2 md:gap-3 h-full">
        {isMobile ? (
          /* Mobile: Accordion */
          <div className="flex flex-col gap-1.5">
            {categoryKeys.map((key, idx) => (
              <MobileCollapsibleCategory
                key={key}
                categoryKey={key}
                title={skillsData[key].title}
                subcategories={skillsData[key].subcategories}
                index={idx}
                isExpanded={expandedSection === key}
                onToggle={handleToggle}
              />
            ))}
          </div>
        ) : (
          /* Desktop: Grid */
          <>
            <div className="flex flex-col md:flex-row gap-2 md:gap-3 items-stretch">
              <div className="flex flex-col gap-2 md:gap-3 flex-1">
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
              <div className="flex flex-col gap-2 md:gap-3 flex-1">
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

        {/* Footer Stats */}
        <motion.div
          className="flex items-center justify-between border-t border-primary/20 pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.5 }}
        >
          <div className="flex gap-1 sm:gap-2 md:gap-4 text-[9px] sm:text-[10px] font-sf-mono text-primary/40 uppercase tracking-wider">
            <span className="text-sm">5 {isMobile ? "CAT" : "CATEGORIES"}</span>
            <span className="text-primary/20">/</span>
            <span className="text-sm">
              {totalSubcategories} {isMobile ? "SUB" : "SUBCATEGORIES"}
            </span>
            <span className="text-primary/20">/</span>
            <span className="text-sm">
              {totalTech} {isMobile ? "TECH" : "TECHNOLOGIES"}
            </span>
          </div>
          <div className="sm:text-[10px] font-sf-mono text-primary/30 text-sm">
            <span className="text-sm">{isMobile ? "2025" : "LAST.UPDATED: 2025"}</span>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  )
}
