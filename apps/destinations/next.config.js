/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@repo/ui'],
  output: 'standalone',
  experimental: {
    esmExternals: 'loose', // This helps with three.js compatibility
  },
}

module.exports = nextConfig
