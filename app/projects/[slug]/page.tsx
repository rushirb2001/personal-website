import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { JsonLd, breadcrumbList } from "../../JsonLd"
import { SITE_URL, absoluteUrl } from "../../site"
import { getProjectDetail, PROJECT_DETAIL_SLUGS, type ProjectDetail } from "../projects-data"
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
  if (!detail) return { title: "Project not found" }

  // seoTitle over name: `name` is an internal shorthand ("BFF", "iOS", "Web")
  // that reads as nothing in a result. The root layout appends the site name,
  // so nothing is hand-suffixed here any more.
  const title = detail.seoTitle ?? detail.name
  const description = detail.seoDescription ?? detail.tagline
  const url = absoluteUrl(`/projects/${detail.slug}`)

  return {
    title,
    description,
    alternates: { canonical: `/projects/${detail.slug}` },
    openGraph: { title, description, type: "article", url },
    twitter: { card: "summary_large_image", title, description },
  }
}

// A case study is a written account of a piece of software, so the page is a
// CreativeWork about a SoftwareSourceCode/SoftwareApplication subject rather
// than an Article. Public repos name their code location; private ones do not
// claim one, which keeps the markup honest about what a reader can verify.
function projectJsonLd(detail: ProjectDetail) {
  const url = absoluteUrl(`/projects/${detail.slug}`)
  const repo = detail.links.find((l) => l.href.includes("github.com"))

  return [
    breadcrumbList([
      { name: "Home", url: SITE_URL },
      { name: detail.title ?? detail.name, url },
    ]),
    {
      "@context": "https://schema.org",
      "@type": detail.repoStatus === "public" ? "SoftwareSourceCode" : "CreativeWork",
      "@id": `${url}#project`,
      name: detail.title ?? detail.name,
      alternateName: detail.name,
      description: detail.seoDescription ?? detail.tagline,
      url,
      author: { "@id": `${SITE_URL}/#person` },
      creator: { "@id": `${SITE_URL}/#person` },
      isPartOf: { "@id": `${SITE_URL}/#website` },
      keywords: detail.stack.join(", "),
      ...(detail.repoStatus === "public" && repo
        ? { codeRepository: repo.href, programmingLanguage: detail.stack[0] }
        : {}),
    },
  ]
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const detail = getProjectDetail(slug)
  if (!detail) notFound()

  return (
    <>
      <JsonLd data={projectJsonLd(detail)} />
      <ProjectModal detail={detail} mode="standalone" />
    </>
  )
}
