import type { NextConfig } from "next";
import { join } from "path";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  outputFileTracingRoot: join(__dirname, "."),
};

export default nextConfig;
