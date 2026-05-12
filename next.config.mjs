/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
      // Atom/RSS thumbnails often use CDN shards (i1–i4, etc.)
      ...["i1", "i2", "i3", "i4", "i9"].map((sub) => ({
        protocol: "https",
        hostname: `${sub}.ytimg.com`,
        pathname: "/**",
      })),
    ],
  },
};

export default nextConfig;
