import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  allowedDevOrigins: ["example.com"],

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://samyapi.zoomhub.xyz/:path*",
      },
    ];
  },
};

export default nextConfig;
