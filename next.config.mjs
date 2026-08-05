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
    ]
  },
}

export default nextConfig
