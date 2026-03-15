import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.thum.io" },
      { protocol: "https", hostname: "**.microlink.io" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
