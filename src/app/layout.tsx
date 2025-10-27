import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";

const logoImage = "https://cdn-global-naus.popmart.com/global-web/naus-prod/assets/images/logo.png";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Mine for You - Premium Products",
	description: "Discover amazing products curated just for you.",
};

export function generateViewport({ params }: { params: { theme: string } }): Viewport {
	return {
		width: "device-width",
		initialScale: 1,
		themeColor: params.theme === "dark" ? "#000000" : "#ffffff",
	};
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased text-base`}>
				<header className="container mx-auto px-4 fixed top-0 left-0 right-0 py-4 bg-background/30 backdrop-blur-md z-50">
					<Link href="/" className="flex flex-col items-center gap-1 h-full justify-center">
						<Image
							src={logoImage}
							alt="logo image"
							width={100}
							height={100}
							className="w-auto h-auto"
							loading="eager"
						/>
						<span className="text-sm font-medium leading-none text-center">Mine for You</span>
					</Link>
				</header>

				<main className="mt-16">{children}</main>

				<footer className="container mx-auto py-2 px-4 flex justify-center items-center">
					<span className="text-xs text-muted-foreground">© 2025 Mine for You.</span>
				</footer>

				<Toaster />
			</body>
		</html>
	);
}
