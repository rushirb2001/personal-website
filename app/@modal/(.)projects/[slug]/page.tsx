import { notFound } from "next/navigation"
import { getProjectDetail } from "@/app/projects/projects-data"
import { ProjectModal } from "@/app/projects/ProjectModal"

// Intercepted route: when a project case study is opened via in-app navigation
// (a <Link> from the home page), it renders here as an overlay in the @modal
// slot, on top of the still-mounted home page. Closing it (router.back) simply
// removes the overlay and reveals home exactly as it was left.
export default async function InterceptedProjectModal({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const detail = getProjectDetail(slug)
  if (!detail) notFound()

  return <ProjectModal detail={detail} mode="overlay" />
}
