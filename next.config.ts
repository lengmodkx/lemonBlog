import type { NextConfig } from "next";

// 自建图床（RustFS 等）的图片域名。域名本身不是机密，直接写在代码里入库即可，
// 这样 GitHub/Vercel 部署时不需要配置任何环境变量。
// 只有上传脚本用到的 AccessKey/Secret 才需要保密（放 .env.local，不入库）。
const PUBLIC_IMAGE_HOSTS: string[] = [
  'storage.lengmodkx.club',
];

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
      ...PUBLIC_IMAGE_HOSTS.flatMap((hostname) => [
        {
          protocol: 'http' as const,
          hostname,
        },
        {
          protocol: 'https' as const,
          hostname,
        },
      ]),
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
