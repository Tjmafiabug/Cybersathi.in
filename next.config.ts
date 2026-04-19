import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      // news source image CDNs — add specific domains as new sources are onboarded
      { protocol: "https", hostname: "static.toiimg.com" },
      { protocol: "https", hostname: "images.hindustantimes.com" },
      { protocol: "https", hostname: "**.ndtv.com" },
      { protocol: "https", hostname: "**.indiatvnews.com" },
      { protocol: "https", hostname: "**.thehindu.com" },
      { protocol: "https", hostname: "**.livemint.com" },
      // catch-all for scraped news images from arbitrary sources
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
