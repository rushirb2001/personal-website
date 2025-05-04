"use client"

import { PageLayout } from "@/components/layout/page-layout"
import { SkillFolder, type SkillGroup } from "@/components/features/skills/skill-folder"

export default function SkillsPage() {
  const skillGroups: SkillGroup[] = [
    {
      title: "PROGRAMMING LANGUAGES",
      id: "PL-3C-129",
      skills: [
        {
          name: "Python",
          proficiency: 5,
          lastUsed: "2024-04-15",
          clearanceLevel: "LEVEL 5",
        },
        {
          name: "C++",
          proficiency: 4,
          lastUsed: "2023-11-20",
          clearanceLevel: "LEVEL 4",
        },
        {
          name: "Java",
          proficiency: 3,
          lastUsed: "2023-08-05",
          clearanceLevel: "LEVEL 3",
        },
        {
          name: "JavaScript",
          proficiency: 4,
          lastUsed: "2024-04-01",
          clearanceLevel: "LEVEL 4",
        },
        {
          name: "TypeScript",
          proficiency: 3,
          lastUsed: "2024-03-15",
          clearanceLevel: "LEVEL 3",
        },
      ],
    },
    {
      title: "MACHINE LEARNING",
      id: "ML-4D-238",
      skills: [
        {
          name: "PyTorch",
          proficiency: 5,
          lastUsed: "2024-04-10",
          clearanceLevel: "LEVEL 5",
        },
        {
          name: "TensorFlow",
          proficiency: 4,
          lastUsed: "2024-02-20",
          clearanceLevel: "LEVEL 4",
        },
        {
          name: "Scikit-learn",
          proficiency: 5,
          lastUsed: "2024-03-30",
          clearanceLevel: "LEVEL 5",
        },
        {
          name: "Keras",
          proficiency: 4,
          lastUsed: "2023-12-15",
          clearanceLevel: "LEVEL 4",
        },
        {
          name: "NLTK",
          proficiency: 3,
          lastUsed: "2023-11-05",
          clearanceLevel: "LEVEL 3",
        },
        {
          name: "Hugging Face",
          proficiency: 4,
          lastUsed: "2024-04-05",
          clearanceLevel: "LEVEL 4",
        },
      ],
    },
    {
      title: "DATA SCIENCE",
      id: "DS-5E-347",
      skills: [
        {
          name: "NumPy",
          proficiency: 5,
          lastUsed: "2024-04-18",
          clearanceLevel: "LEVEL 5",
        },
        {
          name: "Pandas",
          proficiency: 5,
          lastUsed: "2024-04-20",
          clearanceLevel: "LEVEL 5",
        },
        {
          name: "Data Visualization",
          proficiency: 4,
          lastUsed: "2024-03-25",
          clearanceLevel: "LEVEL 4",
        },
        {
          name: "Statistical Modeling",
          proficiency: 4,
          lastUsed: "2024-02-10",
          clearanceLevel: "LEVEL 4",
        },
        {
          name: "Data Mining",
          proficiency: 3,
          lastUsed: "2023-10-15",
          clearanceLevel: "LEVEL 3",
        },
        {
          name: "Matplotlib",
          proficiency: 4,
          lastUsed: "2024-03-20",
          clearanceLevel: "LEVEL 4",
        },
        {
          name: "Seaborn",
          proficiency: 4,
          lastUsed: "2024-03-18",
          clearanceLevel: "LEVEL 4",
        },
      ],
    },
    {
      title: "AI SPECIALIZATIONS",
      id: "AI-6F-456",
      skills: [
        {
          name: "Deep Learning",
          proficiency: 5,
          lastUsed: "2024-04-15",
          clearanceLevel: "LEVEL 5",
        },
        {
          name: "NLP",
          proficiency: 4,
          lastUsed: "2024-03-10",
          clearanceLevel: "LEVEL 4",
        },
        {
          name: "Computer Vision",
          proficiency: 4,
          lastUsed: "2024-02-05",
          clearanceLevel: "LEVEL 4",
        },
        {
          name: "LLMs",
          proficiency: 4,
          lastUsed: "2024-04-01",
          clearanceLevel: "LEVEL 4",
        },
        {
          name: "Prompt Engineering",
          proficiency: 3,
          lastUsed: "2024-03-20",
          clearanceLevel: "LEVEL 3",
        },
        {
          name: "Reinforcement Learning",
          proficiency: 3,
          lastUsed: "2023-11-15",
          clearanceLevel: "LEVEL 3",
        },
      ],
    },
    {
      title: "CLOUD & DEPLOYMENT",
      id: "CD-7G-565",
      skills: [
        {
          name: "AWS",
          proficiency: 4,
          lastUsed: "2024-04-10",
          clearanceLevel: "LEVEL 4",
        },
        {
          name: "Docker",
          proficiency: 4,
          lastUsed: "2024-03-25",
          clearanceLevel: "LEVEL 4",
        },
        {
          name: "Kubernetes",
          proficiency: 3,
          lastUsed: "2024-02-15",
          clearanceLevel: "LEVEL 3",
        },
        {
          name: "FastAPI",
          proficiency: 4,
          lastUsed: "2024-03-05",
          clearanceLevel: "LEVEL 4",
        },
        {
          name: "MLOps",
          proficiency: 3,
          lastUsed: "2024-01-20",
          clearanceLevel: "LEVEL 3",
        },
        {
          name: "CI/CD",
          proficiency: 3,
          lastUsed: "2024-02-10",
          clearanceLevel: "LEVEL 3",
        },
      ],
    },
    {
      title: "DATABASES & TOOLS",
      id: "DT-8H-674",
      skills: [
        {
          name: "SQL",
          proficiency: 4,
          lastUsed: "2024-04-05",
          clearanceLevel: "LEVEL 4",
        },
        {
          name: "Snowflake",
          proficiency: 3,
          lastUsed: "2024-02-25",
          clearanceLevel: "LEVEL 3",
        },
        {
          name: "FAISS",
          proficiency: 3,
          lastUsed: "2024-03-15",
          clearanceLevel: "LEVEL 3",
        },
        {
          name: "Streamlit",
          proficiency: 4,
          lastUsed: "2024-01-10",
          clearanceLevel: "LEVEL 4",
        },
        {
          name: "LangChain",
          proficiency: 4,
          lastUsed: "2024-03-30",
          clearanceLevel: "LEVEL 4",
        },
        {
          name: "MongoDB",
          proficiency: 3,
          lastUsed: "2023-12-05",
          clearanceLevel: "LEVEL 3",
        },
        {
          name: "Redis",
          proficiency: 3,
          lastUsed: "2023-11-20",
          clearanceLevel: "LEVEL 3",
        },
      ],
    },
  ]

  return (
    <PageLayout title="SKILLS" subtitle="TECHNICAL EXPERTISE">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 h-full overflow-y-auto pt-4 md:pt-8 pb-4">
        {skillGroups.map((group, index) => (
          <div key={index} className="h-48 md:h-52">
            <SkillFolder group={group} />
          </div>
        ))}
      </div>
      <div className="text-xs text-primary/30 font-sf-mono text-center mt-6 md:mt-8">
        SKILL ASSESSMENT LAST UPDATED: 05/01/2025
      </div>
      <div className="text-xs text-primary/30 font-sf-mono text-center mt-1 animate-mechanical-pulse">
        CLICK ANY FOLDER TO ACCESS COMPLETE SKILL RECORDS
      </div>
    </PageLayout>
  )
}
