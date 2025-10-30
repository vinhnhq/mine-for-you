import Image from "next/image";
import Link from "next/link";
import { TagBadge } from "@/components/filter-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { emptyProductsImage } from "@/lib/constants";
import { capitalize } from "@/lib/shared";
import { EnhancedProduct, Tables } from "@/lib/supabase/enhanced.database.types";
import { cn } from "@/lib/utils";

export default function ProductCard({ product, tags }: { product: EnhancedProduct; tags: Tables<"tags">[] }) {
	const image = product.product_images[0]?.url;
	const alt = product.product_images[0]?.alt ?? product.name;

	return (
		<Card
			key={product.id}
			className="grid grid-rows-[auto_1fr_auto] gap-0 py-0 border-none shadow-initial rounded-xl overflow-hidden"
		>
			<CardContent className="flex-1 flex flex-col p-0 m-0">
				<div className="aspect-square relative">
					<Image
						src={image ?? emptyProductsImage}
						alt={alt}
						loading="eager"
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						className={cn("w-full h-auto object-cover", !image ? "blur-xs" : "")}
					/>
				</div>
			</CardContent>

			<CardHeader className="space-y-0 bg-muted/80 p-4">
				<CardTitle className="text-base font-medium text-primary leading-tight tracking-tighter">
					{product.name}
				</CardTitle>
				<CardDescription className="flex flex-wrap gap-2">
					{product.product_tags.map((t) => (
						<TagBadge className="border-black" key={t.tag_id}>
							{capitalize(tags.find((tag) => tag.id === t.tag_id)?.name ?? "Unknown")}
						</TagBadge>
					))}
				</CardDescription>
			</CardHeader>

			<CardFooter className="flex gap-4 justify-end p-4 bg-muted/80">
				<Button
					asChild
					variant="default"
					size="sm"
					className={cn(
						"text-sm font-medium",
						"focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
						"hover:scale-105",
						"transition-all duration-200 ease-in-out",
					)}
				>
					<Link href={`/products/${product.id}`}>Details</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}

export function ProductCardSkeleton() {
	return (
		<Card className="gap-0 py-0 border-none rounded-xl overflow-hidden animate-pulse shadow-initial">
			<CardContent className="p-0 m-0">
				<div className="aspect-square relative">
					<Skeleton className="w-full h-full rounded-none" />
				</div>
			</CardContent>
			<CardHeader className="p-4 space-y-2">
				<Skeleton className="w-full h-6" />
				<Skeleton className="w-1/2 h-6" />
				<Skeleton className="w-1/4 h-6 ml-auto" />
			</CardHeader>
		</Card>
	);
}
