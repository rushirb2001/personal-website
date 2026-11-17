import { HomeRoute, sectionMetadata } from "../HomeRoute"

// /education: the home page with this section open. One page of content, one
// path per section; see HOME_SECTIONS in app/site.ts.
export const metadata = sectionMetadata("education")

export default function Page() {
  return <HomeRoute section="education" />
}
