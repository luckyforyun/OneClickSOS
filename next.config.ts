import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: "export",   // ✅ 静态导出

  basePath: "/your-repo",        // ⚠️ 改成你的仓库名
  assetPrefix: "/your-repo/",

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    unoptimized: true,   // ✅ 必加（否则 next/image 报错）
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
};

export default nextConfig;
