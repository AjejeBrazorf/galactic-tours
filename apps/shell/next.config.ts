import type { NextConfig } from 'next'

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: ['./src'],
  },
  webpack: (config) => {
    return config
  },
  transpilePackages: [
    '@galactic-tours/ui',
    '@galactic-tours/messaging',
    'destinations',
  ],
}

export default nextConfig
