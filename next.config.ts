import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backend = (process.env.API_INTERNAL_URL || 'http://localhost:5000').replace(/\/$/, '');
    return [{
      source: '/api/:path*',
      destination: `${backend}/api/:path*`,
    }];
  },
};

export default nextConfig;
