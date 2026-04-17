import { fileURLToPath } from "node:url";

const nextConfig = {
  experimental: {
    // On Windows, Turbopack's persisted dev cache can corrupt under memory pressure.
    turbopackFileSystemCacheForDev: false,
    turbopackFileSystemCacheForBuild: false,
  },
  turbopack: {
    root: fileURLToPath(new URL("./", import.meta.url)),
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "82.112.237.155",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "veaglespace.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.veaglespace.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.veaglespace.com",
        pathname: "/img/**",
      },
      {
        protocol: "https",
        hostname: "veaglespace.com",
        pathname: "/img/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
