import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the Turbopack root to this directory. Git worktrees live under
  // .claude/worktrees/ inside the main checkout, so two pnpm-lock.yaml files
  // sit on the path and Next infers the OUTER one as the root, then compiles
  // the outer checkout's middleware.ts and friends instead of this tree's.
  turbopack: { root: dirname(fileURLToPath(import.meta.url)) },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // The only image the optimizer serves is the hero portrait, and its source
    // file is renamed whenever it changes, so an optimized variant is safe to
    // keep for a month. Short TTLs just re-run the optimizer for bytes that
    // have not changed.
    minimumCacheTTL: 2678400,
  },
  // Vercel serves everything in public/ with `max-age=0, must-revalidate`, so
  // a returning visitor's browser re-asks for every font on every page view
  // and waits on the 304 before it can paint text in the right face. The font
  // files are subset builds that never change in place (a new subset gets a
  // new name), so they can be cached for a year and never revalidated.
  async headers() {
    return [
      {
        source: "/fonts/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // Not immutable: these two keep their URL when the file is replaced.
      {
        source: "/rushir-bhavsar-resume.pdf",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      {
        source: "/images/rushir-bhavsar.jpg",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ]
  },
  // The production deploy also answers on its .vercel.app alias, which is a
  // second indexable copy of every page competing with the real domain. Fold it
  // into the canonical host at the routing layer rather than in middleware, so
  // requests that already arrive at the right host pay nothing for it.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "rushirbhavsar.vercel.app" }],
        destination: "https://www.rushirbhavsar.dev/:path*",
        permanent: true,
      },
      // The playbook is retired. Its URLs, the /playbook/in India variant and
      // the /buy checkout hop all 308 to the home page, so inbound links and
      // anything already indexed hand their weight to the canonical page
      // instead of landing on a 404. `:path*` also matches /playbook itself.
      { source: "/playbook/:path*", destination: "/", permanent: true },
      { source: "/buy", destination: "/", permanent: true },
      // The addresses people guess. Each lands on the page that answers it
      // instead of the 404.
      { source: "/contact", destination: "/hire", permanent: true },
      { source: "/about", destination: "/", permanent: true },
      { source: "/cv", destination: "/resume", permanent: true },
      { source: "/resume.pdf", destination: "/rushir-bhavsar-resume.pdf", permanent: true },
      { source: "/work", destination: "/projects", permanent: true },
      { source: "/blog", destination: "/writing", permanent: true },
    ]
  },
}

export default nextConfig
