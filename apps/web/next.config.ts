import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@frontend-builder/types", "@frontend-builder/builder-core"],
};

export default nextConfig;
