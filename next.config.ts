import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use "output: 'export'" only for APK builds (BUILD_STATIC=1 npm run build)
  ...(process.env.BUILD_STATIC === "1" ? { output: "export" as const } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
