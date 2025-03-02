/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: ['./src'],
  },
  webpack: (config) => {
    return config
  },
}

export default nextConfig
