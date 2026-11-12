import { HomeRoute, sectionMetadata } from "../HomeRoute"

// /writing: the home page with this section open. One page of content, one
// path per section; see HOME_SECTIONS in app/site.ts.
export const metadata = sectionMetadata("writing")

export default function Page() {
  return <HomeRoute section="writing" />
}
