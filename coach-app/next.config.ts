import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/coach',
  output: 'export',
  trailingSlash: true,
  transpilePackages: ['react-router-dom', 'react-router'],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
