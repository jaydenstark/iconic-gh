import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Register the custom service worker via HTTP headers
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
    ];
  },
  // Redirect non-www to www domain
  async redirects() {
    return [
      {
        source: "/:path((?!api).*)*",
        has: [
          {
            type: "host",
            value: "iconicgh.com",
          },
        ],
        destination: "https://www.iconicgh.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
