import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // This will disable ESLint in Vercel deployment
  },
}

export default nextConfig
