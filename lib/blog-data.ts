export type BlogPost = {
  id: string
  title: string
  date: string
  summary: string
  content: string
  tags: string[]
  image?: string
  status?: "draft" | "published"
}

// Sample blog posts
export const blogPosts: BlogPost[] = [
  {
    id: "001",
    title: "SYSTEM UPDATE: PORTFOLIO LAUNCH",
    date: "2025-05-01",
    summary: "Initial deployment of personal portfolio system with core functionality.",
    content: `
## SYSTEM UPDATE: PORTFOLIO LAUNCH

**DATE: 2025.05.01**
**STATUS: OPERATIONAL**

The initial deployment of my personal portfolio system is now complete. This marks the first major milestone in establishing my digital presence as a data scientist and AI engineer.

### DEPLOYMENT NOTES

The system has been designed with a focus on clean aesthetics and intuitive navigation. Key features include:

- Terminal-inspired interface for a unique user experience
- Responsive design that adapts to various device dimensions
- Dark/light mode toggle for optimal viewing in different environments
- Section-based navigation for easy access to professional information

### TECHNICAL IMPLEMENTATION

The portfolio is built using Next.js with TypeScript, leveraging the App Router for optimized navigation. Styling is implemented with Tailwind CSS, providing a consistent and maintainable design system.

Animation effects are carefully crafted using Framer Motion to enhance the user experience without compromising performance. The terminal interface is fully functional, allowing command-based navigation as an alternative to traditional clicking.

#### System Architecture

\`\`\`mermaid
graph TD;
    A["App Layout"]-->B["Navigation System"]
    A-->C["Page Components"]
    A-->D["UI Components"]
    B-->E["Navigation Context"]
    B-->F["Transition Effects"]
    C-->G["Content Pages"]
    C-->H["Dynamic Content"]
    D-->I["Shared UI Elements"]
    D-->J["Feature Components"]
\`\`\`

#### Navigation Flow

\`\`\`mermaid
graph LR;
    A["User Click"]-->B["NavigateTo() Called"]
    B-->C["Set Transition State"]
    C-->D["Show Transition Animation"]
    D-->E["Router.push() After Delay"]
    E-->F["Hide Animation"]
\`\`\`

#### Data Flow

\`\`\`mermaid
graph TD;
    A["Static Content"]-->B["Page Components"]
    C["Context Providers"]-->B
    C-->D["UI Components"]
    E["User Interactions"]-->F["Context Updates"]
    F-->D
    G["Server Actions"]-->H["External Services"]
\`\`\`

### FUTURE DEVELOPMENT

This initial release establishes the foundation for future enhancements. Planned updates include:

1. Integration of interactive project demonstrations
2. Implementation of a more robust content management system
3. Addition of real-time data visualization components
4. Performance optimizations for global accessibility

The system will continue to evolve as new projects and capabilities are developed. Regular updates will be posted to document this progress.

**END TRANSMISSION**
    `,
    tags: ["update", "launch", "development"],
    status: "published",
  },
  {
    id: "002",
    title: "RESEARCH MILESTONE: THESIS DEFENDED – MACE-PINNs",
    date: "2025-04-10",
    summary: "Successfully defended my MS thesis introducing MACE-PINNs for solving complex coupled PDEs.",
    content: `
## RESEARCH MILESTONE: THESIS DEFENDED – MACE-PINNs

**DATE: 2025.04.10**  
**STATUS: COMPLETED**

I'm excited to share that I successfully defended my Master's thesis at Arizona State University. The research focused on solving complex coupled PDEs using a modular deep learning framework I proposed: **MACE-PINNs** (Multi-Network Architecture for Coupled Equations - Physics-Informed Neural Networks).

### THESIS OVERVIEW

Physics-Informed Neural Networks (PINNs) are powerful tools for scientific modeling, but they often struggle with coupled systems and instabilities. My work introduces MACE-PINNs, which decouple the training of neural subnetworks for each variable while enforcing physical consistency via iterative constraints—an approach inspired by classical solvers.

📘 Title: *MACE-PINNs: Multi-Network Driven Decoupling of Interdependent Physics in Coupled PDE Systems*  
👨‍🏫 Committee: Dr. Kookjin Lee (Chair), Dr. Hokeun Kim, Dr. Yanjie Fu, Dr. Yoojung Choi

### HIGHLIGHTS

- Proposed parallel subnetworks to tackle training pathologies in coupled PDEs  
- Achieved stable neural solutions for Gray-Scott and Ginzburg–Landau systems  
- Demonstrated significant accuracy gains over standard PINNs with L2 errors down to 1e-3  
- Integrated Fourier embeddings, adaptive gradient weighting, and solver-inspired iteration

### NEXT STEPS

The thesis lays the groundwork for future work in scalable physics-based machine learning. The methods developed will be extended for multi-physics systems, real-time simulation, and potentially integrated into open-source scientific ML libraries.

**END TRANSMISSION**
    `,
    tags: ["research", "defense", "PINNs", "MACE-PINNs"],
    status: "published",
  },
  {
    id: "003",
    title: "LIFE UPDATE: MS DSAE GRADUATION",
    date: "2025-05-15",
    summary: "I'm officially graduating with a Master of Science in Data Science, Analytics, and Engineering.",
    content: `
## LIFE UPDATE: MS DSAE GRADUATION

**DATE: 2025.05.15**  
**STATUS: TO GRADUATE**

I'm officially graduating with a **Master of Science in Data Science, Analytics, and Engineering (DSAE)** from **Arizona State University**.

This journey has been about more than just coursework—it's been about exploring the edge of scientific computing, AI systems, and learning how to build things that matter.

### PROGRAM HIGHLIGHTS

- Specialized in Scientific Machine Learning and Neural PDE Solvers  
- Thesis on MACE-PINNs: AI-driven decoupling strategies for nonlinear physics  
- Research assistantships, model development, and long nights debugging turbulent gradients

### A MOMENT TO REFLECT

Graduate school taught me how to think structurally, fail intelligently, and communicate ideas with clarity. It's also where I built this portfolio system that you're browsing—designed to evolve with my growth.

As I transition forward, this marks both an end and a beginning. Expect more updates soon—experiments, open-source work, and maybe a few strange but meaningful projects.

**END TRANSMISSION**
    `,
    tags: ["graduation", "life update", "milestone"],
    status: "published",
  },
]

// Function to get all published posts
export function getPublishedPosts(): BlogPost[] {
  return blogPosts
    .filter((post) => post.status === "published")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Function to get a specific post by ID
export function getPostById(id: string): BlogPost | undefined {
  return blogPosts.find((post) => post.id === id)
}

// Function to get recent posts (limited number)
export function getRecentPosts(limit = 3): BlogPost[] {
  return getPublishedPosts().slice(0, limit)
}
