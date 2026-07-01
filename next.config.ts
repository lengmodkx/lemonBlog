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
        hostname: 'media.giphy.com',
      },
      {
        protocol: 'https',
        hostname: 'giphy.com',
      },
      {
        protocol: 'http',
        hostname: 'lemon-blog-oss.oss-cn-beijing.aliyuncs.com',
      },
      {
        protocol: 'https',
        hostname: 'lemon-blog-oss.oss-cn-beijing.aliyuncs.com',
      },
      {
        protocol: 'http',
        hostname: 'lemon-obsidian-article.oss-cn-beijing.aliyuncs.com',
      },
      {
        protocol: 'https',
        hostname: 'lemon-obsidian-article.oss-cn-beijing.aliyuncs.com',
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
