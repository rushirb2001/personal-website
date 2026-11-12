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
    ]
  },
}

export default nextConfig
