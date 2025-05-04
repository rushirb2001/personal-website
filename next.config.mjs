/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false, // Enable Next.js image optimization
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [], // Add any external domains you need to load images from
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  optimizeFonts: true,
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true,
    legacyBrowsers: false,
    browsersListForSwc: true,
    gzipSize: true,
    scrollRestoration: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development',
  },
}

export default nextConfig
