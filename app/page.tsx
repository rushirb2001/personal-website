import { HomeRoute, homeMetadata } from "./HomeRoute"

// The closed page: the hero over the five section heads. Each section also has
// its own path (app/<section>/page.tsx), which is this same page with that
// section open.
export const metadata = homeMetadata

export default function Page() {
  return <HomeRoute />
}
