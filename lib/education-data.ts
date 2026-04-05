export interface Course {
  name: string
}

export interface Education {
  degree: string
  field: string
  institution: string
  period: string
  id: string
  description: string
  courses: Course[]
  location: string
  status: string
  validationId: string
  indexCode: string
}

export const education: Education[] = [
  {
    degree: "MASTER OF SCIENCE",
    field: "DATA SCIENCE, ANALYTICS AND ENGINEERING",
    institution: "ARIZONA STATE UNIVERSITY",
    period: "AUG 2023 - JUN 2025",
    id: "UNITED STATES",
    description:
      "Pursuing advanced studies in data science and AI, focusing on machine learning techniques, data mining, and statistical analysis.",
    courses: [
      { name: "Artificial Intelligence" },
      { name: "Data Mining" },
      { name: "Convex Optimisation" },
      { name: "Statistical Machine Learning" },
    ],
    location: "ARIZONA, USA",
    status: "GRADUATED",
    validationId: "VLD-4821",
    indexCode: "AC-371-110",
  },
  {
    degree: "BACHELOR OF SCIENCE",
    field: "COMPUTER SCIENCE",
    institution: "INSTITUTE OF TECHNOLOGY, NIRMA UNIVERSITY",
    period: "JUL 2019 - JUN 2023",
    id: "INDIA",
    description: "Completed undergraduate studies in computer science with a focus on AI and machine learning.",
    courses: [
      { name: "Deep Learning" },
      { name: "Machine Learning" },
      { name: "Natural Language Processing" },
      { name: "Scientific Computing" },
    ],
    location: "AHMEDABAD, INDIA",
    status: "GRADUATED",
    validationId: "VLD-7293",
    indexCode: "AC-582-219",
  },
]
