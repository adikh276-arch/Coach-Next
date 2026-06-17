import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/coach',
  trailingSlash: true,
  transpilePackages: ['react-router-dom', 'react-router'],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
