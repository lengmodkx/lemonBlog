import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static exports for deployment
  output: 'export',
  trailingSlash: true,

  // Image configuration
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Performance optimizations
  poweredByHeader: false,
  compress: true,

  // Turbopack configuration
  turbopack: {},

  // Experimental features
  experimental: {
    optimizePackageImports: ['gray-matter', 'remark', 'rehype'],
  },
};

export default nextConfig;
