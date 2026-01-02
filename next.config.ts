import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel deployment optimization
  // No 'output: export' needed - Vercel handles Next.js natively

  // Image configuration
  images: {
    // Vercel handles image optimization automatically
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
