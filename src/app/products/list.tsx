import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { capitalize } from "@/lib/shared";
import { getProducts, Product } from "./query";

export default async function ProductsList({ category }: { category: Promise<string | string[] | undefined> }) {
	const selectedCategories = await category;
	const allProducts = await getProducts();

	const filteredProducts =
		allProducts.filter((product) => {
			return selectedCategories ? product.category.some((c) => selectedCategories.includes(c)) : true;
		}) || allProducts;

	return (
		<div className="container mx-auto w-full">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</div>
	);
}

export function ProductsListSkeleton() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{Array.from({ length: 6 }).map((_, index) => (
					<Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
						<div className="aspect-square relative">
							<Skeleton className="w-full h-full animate-pulse" />
						</div>

						<CardHeader>
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

						<CardContent>
							<Skeleton className="w-full h-4 animate-pulse mb-2" />
							<Skeleton className="w-3/4 h-4 animate-pulse" />
							<div className="mt-4">
								<Skeleton className="w-20 h-8 animate-pulse" />
							</div>
						</CardContent>

						<CardFooter className="flex gap-2">
							<Skeleton className="w-full h-10 animate-pulse" />
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
}

function ProductCard({ product }: { product: Product }) {
	return (
		<Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
			<CardHeader>
				<div className="flex items-start justify-between">
					<div>
						<CardTitle className="text-xl">{product.name}</CardTitle>
						<CardDescription className="mt-1 flex flex-wrap gap-2">
							{product.category.map((c) => (
								<Badge key={c} className="text-xs font-mono tabular-nums" variant="outline">
									{capitalize(c)}
								</Badge>
							))}
						</CardDescription>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<div className="aspect-square relative">
					<Image
						src={product.image}
						alt={product.name}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						loading="eager"
					/>
				</div>
			</CardContent>

			<CardFooter className="flex gap-2">
				<Button asChild className="flex-1">
					<Link href={`/products/${product.id}`}>View Product</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
