export type PublicationStatus = "PUBLISHED" | "IN-REVIEW" | "PAY-LOCK"
export type PublicationType = "JOURNAL" | "CONFERENCE" | "DISSERTATION"

export interface Publication {
  id: string
  title: string
  venue: string
  authors: string
  abstract: string
  year: string
  month: string
  status: PublicationStatus
  type: PublicationType
  doi: string
  pdfLink: string
  citations: number
}

export const ITEMS_PER_PAGE = 3

export const publications: readonly Publication[] = [
  {
    id: "001",
    title: "DEEP ENSEMBLE MAMMOGRAM CLASSIFICATION USING ONE-SHOT SEGMENTATION",
    venue: "NIRMA UNIVERSITY CONFERENCE",
    authors: "R. BHAVSAR, ET AL.",
    abstract:
      "This study presents a novel approach to mammogram classification through deep ensemble learning and one-shot segmentation techniques. By aggregating over 7,000 images from 7 distinct sources and applying panoptic annotation with semantic segmentation, we achieved a 23% improvement in cancerous mammogram classification accuracy over baseline methods, reaching 81% accuracy.",
    year: "2022",
    month: "06",
    status: "PUBLISHED",
    type: "CONFERENCE",
    doi: "10.1234/NU.2022.437",
    pdfLink: "#",
    citations: 12,
  },
  {
    id: "002",
    title: "CLASSIFICATION OF POTENTIALLY HAZARDOUS ASTEROIDS USING SUPERVISED QUANTUM MACHINE LEARNING",
    venue: "IEEE ACCESS",
    authors: "R. BHAVSAR, ET AL.",
    abstract:
      "This research explores the application of Quantum Machine Learning (QML) for asteroid hazard classification, achieving significant improvements in computational efficiency and classification accuracy using quantum computing approaches.",
    year: "2023",
    month: "07",
    status: "PUBLISHED",
    type: "JOURNAL",
    doi: "10.1109/ACCESS.2023.3294576",
    pdfLink: "https://ieeexplore.ieee.org/document/10188662",
    citations: 45,
  },
  {
    id: "003",
    title: "METAHATE: AI-BASED HATE SPEECH DETECTION FOR SECURED ONLINE GAMING IN METAVERSE USING BLOCKCHAIN",
    venue: "SECURITY AND PRIVACY",
    authors: "H. SANGHVI, R. BHAVSAR, V. HUNDLANI, ET AL.",
    abstract:
      "This article proposes MetaHate, a novel framework that employs AI and blockchain to detect and combat hate speech in online gaming environments within the metaverse, achieving 86.01% accuracy with gradient boosting.",
    year: "2024",
    month: "03",
    status: "PUBLISHED",
    type: "JOURNAL",
    doi: "10.1002/SPY2.343",
    pdfLink: "https://onlinelibrary.wiley.com/doi/abs/10.1002/spy2.343",
    citations: 28,
  },
  {
    id: "004",
    title: "MACE-PINNS: MULTI-NETWORK DRIVEN DECOUPLING OF INTERDEPENDENT PHYSICS IN COUPLED PDE SYSTEMS",
    venue: "ARIZONA STATE UNIVERSITY DISSERTATIONS",
    authors: "R. BHAVSAR",
    abstract:
      "Introducing Multi-network Architecture for Coupled Equations Physics-Informed Neural Networks (MACE-PINNs), employing parallel subnetworks to independently approximate coupled variables with L2 errors ranging from 10−3 to 10−2.",
    year: "2025",
    month: "01",
    status: "PUBLISHED",
    type: "DISSERTATION",
    doi: "10.48550/DISSERTATION.31994438",
    pdfLink: "https://keep.lib.asu.edu/items/201211",
    citations: 3,
  },
] as const
