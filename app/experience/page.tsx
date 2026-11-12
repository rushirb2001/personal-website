import { HomeRoute, sectionMetadata } from "../HomeRoute"

// /experience: the home page with this section open. One page of content, one
// path per section; see HOME_SECTIONS in app/site.ts.
export const metadata = sectionMetadata("experience")

export default function Page() {
  return <HomeRoute section="experience" />
}
