import Image from "next/image";
import Link from "next/link";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { emptyProductsImage } from "@/lib/constants";
import ProductCard, { ProductCardSkeleton } from "./card";
import { getProducts } from "./query";

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
				<ProductCardSkeleton key={index} />
			))}
		</div>
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
