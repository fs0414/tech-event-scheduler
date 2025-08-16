import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		optimizePackageImports: ["@yamada-ui/react"],
	},
};

export default nextConfig;
