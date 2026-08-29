import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage (project images served from https://<ref>.supabase.co/...)
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      // Sanity CDN (https://cdn.sanity.io/images/<projectId>/<dataset>/...)
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
