import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: [
      'localhost',
      'images.unsplash.com',
      'static-qa.propertycopilot.io',
    ],
  },
};

export default nextConfig;
