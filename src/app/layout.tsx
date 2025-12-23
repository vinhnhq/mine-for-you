import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "MMine for You - Premium Products",
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
				<header className="container mx-auto py-4">
					<Link href="/" className="flex justify-center items-center">
						<Image src={"/logo.png"} alt="logo image" width={128} height={128} loading="eager" />
					</Link>
				</header>

				<main className="">{children}</main>

				<footer className="container mx-auto py-2 px-4 flex justify-center items-center">
					<span className="text-xs text-muted-foreground">© 2025 MMine for You.</span>
				</footer>

				<Toaster />
			</body>
		</html>
	);
}
