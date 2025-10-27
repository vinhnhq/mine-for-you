import Image from "next/image";
import Link from "next/link";
import FilterBadge from "@/components/filter-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { emptyProductsImage } from "@/lib/constants";
import { capitalize } from "@/lib/shared";
import { cn } from "@/lib/utils";
import { getProducts, Product } from "./query";

export default async function ProductsList({ category }: { category: Promise<string | string[] | undefined> }) {
	const selectedCategories = await category;
	const allProducts = await getProducts();

	const filteredProducts =
		allProducts.filter((product) => {
			return selectedCategories ? product.categories.some((c) => selectedCategories.includes(c.value)) : true;
		}) || allProducts;

	if (filteredProducts.length === 0) {
		return <EmptyProducts />;
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{filteredProducts.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}

export function ProductsListSkeleton() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{Array.from({ length: 6 }).map((_, index) => (
				<Card key={index} className="grid grid-rows-[auto_1fr_auto]">
					<CardHeader className="pb-4">
						<div className="flex items-start justify-between">
							<div>
								<CardTitle className="text-xl">
									<Skeleton className="w-full h-6 animate-pulse mb-2" />
								</CardTitle>
								<CardDescription className="mt-1">
									<Skeleton className="w-full h-4 animate-pulse" />
								</CardDescription>
							</div>
							<div className="flex items-center gap-1">
								<Skeleton className="h-4 w-4 animate-pulse" />
								<Skeleton className="h-4 w-8 animate-pulse" />
							</div>
						</div>
					</CardHeader>

					<CardContent className="flex-1 flex flex-col">
						<div className="aspect-square relative">
							<Skeleton className="w-full h-full animate-pulse" />
						</div>
					</CardContent>

					<CardFooter className="flex gap-2 pt-4">
						<Skeleton className="w-full h-10 animate-pulse" />
					</CardFooter>
				</Card>
			))}
		</div>
	);
}

function ProductCard({ product }: { product: Product }) {
	return (
		<Card key={product.id} className="grid grid-rows-[auto_1fr_auto] gap-4 py-4">
			<CardHeader className="px-4">
				<div className="flex flex-col gap-4">
					<CardTitle className="text-base font-medium text-primary leading-tight tracking-tight">
						{product.name}
					</CardTitle>
					<CardDescription className="mt-1 flex flex-wrap gap-2">
						{product.categories.map((c) => (
							<FilterBadge key={c.value}>{capitalize(c.label)}</FilterBadge>
						))}
					</CardDescription>
				</div>
			</CardHeader>

			<CardContent className="flex-1 flex flex-col p-0">
				<div className="aspect-square relative">
					<Image
						src={product.image}
						alt={product.name}
						loading="eager"
						fill
						className="object-cover"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				</div>
			</CardContent>

			<CardFooter className="flex gap-2 justify-end px-4">
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

function EmptyProducts() {
	return (
		<Empty className="p-0">
			<EmptyHeader>
				<EmptyMedia>
					<Image
						src={emptyProductsImage}
						alt="no products found"
						width={400}
						height={400}
						className="w-full h-auto object-contain"
					/>
				</EmptyMedia>
				<EmptyTitle>Oops!</EmptyTitle>
				<EmptyDescription>
					There are no monsters matching your filters, try adjusting your filters or{" "}
					<Link href="/products" className="font-medium text-primary">
						click here
					</Link>{" "}
					to view all products again.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
