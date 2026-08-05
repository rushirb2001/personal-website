/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
      // Project slugs renamed 2026-08-05 to say what the thing is rather than
      // carry an internal codename ("bff", "ios", "web"). Nothing had been
      // indexed yet, but these URLs were already in a submitted sitemap and may
      // have been shared, so the old paths keep resolving permanently rather
      // than 404ing. Cheap to keep; do not remove.
      ...[
        ["samhita", "samhita-textbook-pipeline"],
        ["hybridflow", "hybridflow-rag-backend"],
        ["sushrutalgs-bff", "sushrutalgs-api-gateway"],
        ["sushrutalgs-ios", "sushrutalgs-ios-app"],
        ["sushrutalgs-web", "sushrutalgs-web-app"],
      ].map(([from, to]) => ({
        source: `/projects/${from}`,
        destination: `/projects/${to}`,
        permanent: true,
      })),
    ]
  },
}

export default nextConfig
