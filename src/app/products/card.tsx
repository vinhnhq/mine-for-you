import Image from "next/image";
import Link from "next/link";
import { TagBadge } from "@/components/filter-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { capitalize } from "@/lib/shared";
import { cn } from "@/lib/utils";
import { Product } from "./query";

export default function ProductCard({ product }: { product: Product }) {
	return (
		<Card
			key={product.id}
			className="grid grid-rows-[auto_1fr_auto] gap-0 py-0 border-none shadow-initial rounded-xl overflow-hidden"
		>
			<CardContent className="flex-1 flex flex-col p-0 m-0">
				<div className="aspect-square relative">
					<Image src={product.image} alt={product.name} loading="eager" fill className="w-full h-auto object-cover" />
				</div>
			</CardContent>

			<CardHeader className="space-y-0 bg-muted/80 p-4">
				<CardTitle className="text-base font-medium text-primary leading-tight tracking-tighter">
					{product.name}
				</CardTitle>
				<CardDescription className="flex flex-wrap gap-2">
					{product.categories.map((c) => (
						<TagBadge className="border-black" key={c.value}>
							{capitalize(c.label)}
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
