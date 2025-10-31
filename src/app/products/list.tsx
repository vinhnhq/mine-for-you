import Image from "next/image";
import Link from "next/link";
import { match, P } from "ts-pattern";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { emptyProductsImage } from "@/lib/constants";
import { toArray } from "@/lib/shared";
import ProductCard, { ProductCardSkeleton } from "./card";
import { getProducts } from "./query";

export default async function ProductsList({
	selectedTagSlugs,
}: {
	selectedTagSlugs: Promise<string | string[] | undefined>;
}) {
	const [products, tags] = await getProducts(toArray(await selectedTagSlugs));

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{match(products)
				.with([], () => (
					<div className="col-span-full">
						<EmptyProducts />
					</div>
				))
				.with(P.array(), (enhancedProducts) =>
					enhancedProducts.map((product) => <ProductCard key={product.id} product={product} tags={tags} />),
				)
				.exhaustive()}
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

export function EmptyProducts() {
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
						placeholder="blur"
						blurDataURL={emptyProductsImage}
						preload={false}
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
