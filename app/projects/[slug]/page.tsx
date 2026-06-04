import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProjectDetail, PROJECT_DETAIL_SLUGS } from "../projects-data"
import { ProjectModal } from "../ProjectModal"

// Pre-render the known project pages at build time.
export function generateStaticParams() {
  return PROJECT_DETAIL_SLUGS.map((slug) => ({ slug }))
}

// Next 16: params is async.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const detail = getProjectDetail(slug)
  if (!detail) return { title: "Project not found — Rushir Bhavsar" }

  const title = `${detail.name} — Rushir Bhavsar`
  return {
    title,
    description: detail.tagline,
    openGraph: { title, description: detail.tagline, type: "article" },
    twitter: { card: "summary", title, description: detail.tagline },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const detail = getProjectDetail(slug)
  if (!detail) notFound()

  return <ProjectModal detail={detail} mode="standalone" />
}
