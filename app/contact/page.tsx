import { HomeRoute, sectionMetadata } from "../HomeRoute"

// /contact: the home page with this section open. One page of content, one
// path per section; see HOME_SECTIONS in app/site.ts.
export const metadata = sectionMetadata("contact")

export default function Page() {
  return <HomeRoute section="contact" />
}
