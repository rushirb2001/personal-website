import type { Metadata } from "next"
import { getPostById } from "@/lib/blog-data"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const post = getPostById(id)

  if (!post) {
    return { title: "Post Not Found | Rushir Bhavsar" }
  }

  return {
    title: `${post.title} | Rushir Bhavsar`,
    description: post.summary || post.title,
    openGraph: {
      title: `${post.title} | Rushir Bhavsar`,
      description: post.summary || post.title,
    },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
