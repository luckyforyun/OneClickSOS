// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   output: "export",   // ✅ 静态导出

//   basePath: "/your-repo",        // ⚠️ 改成你的仓库名
//   assetPrefix: "/your-repo/",

//   typescript: {
//     ignoreBuildErrors: true,
//   },

//   eslint: {
//     ignoreDuringBuilds: true,
//   },

//   images: {
//     unoptimized: true,   // ✅ 必加（否则 next/image 报错）
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'placehold.co',
//       },
//       {
//         protocol: 'https',
//         hostname: 'images.unsplash.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'picsum.photos',
//       },
//     ],
//   },
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const repo = "https://github.com/luckyforyun/OneClickSOS"; // ⚠️ 改成你的仓库名

const nextConfig = {
  output: "export", // ✅ 关键：启用静态导出
  basePath: `/${repo}`, // ✅ GitHub Pages 必须
  assetPrefix: `/${repo}/`, // ✅ 静态资源路径
  images: {
    unoptimized: true, // ✅ 必须，不然图片会炸
  },
};

module.exports = nextConfig;
