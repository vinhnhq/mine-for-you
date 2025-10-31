import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactCompiler: true,
	typedRoutes: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "prod-america-res.popmart.com",
			},
			{
				protocol: "https",
				hostname: "cdn-global-naus.popmart.com",
			},
			{
				protocol: "https",
				hostname: "drive.google.com",
			},
			{
				protocol: "https",
				hostname: "drive.usercontent.google.com",
			},
			{
				protocol: "https",
				hostname: "nhzlizipk0zlzqqp.public.blob.vercel-storage.com",
			},
		],
	},
	cacheComponents: true,
	experimental: {
		serverActions: {
			bodySizeLimit: "5mb",
		},
	},
};

export default nextConfig;
