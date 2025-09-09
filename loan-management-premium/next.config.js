/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
  reactStrictMode: true,
  // Set turbopack root to silence warnings
  turbopack: {
    root: __dirname,
  },
  // Disable some optimizations that can cause file write issues
  experimental: {
    optimizeCss: false,
  },
}

module.exports = nextConfig