/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: ['./src'],
  },
  webpack: (config) => {
    return config
  },
  transpilePackages: ['@repo/ui', 'destinations'],
}

export default nextConfig
