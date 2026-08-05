import type { MetadataRoute } from "next"

// Replaces the old public/site.webmanifest, which pointed at two PNGs that were
// never in the repo, used a black theme against a cream site, and was never
// linked from <head> at all. As app/manifest.ts, Next emits the <link> itself.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rushir Bhavsar",
    short_name: "Rushir Bhavsar",
    description:
      "ML engineer and researcher at ASU. Case studies, research, and the AI-engineer portfolio playbook.",
    start_url: "/",
    display: "standalone",
    // The site's paper and ink, not the black placeholder the old file carried.
    background_color: "#f4f1ec",
    theme_color: "#f4f1ec",
    icons: [
      {
        // app/icon.svg is the one icon that actually exists; SVG scales to every
        // slot, so there is nothing to keep in sync.
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  }
}
