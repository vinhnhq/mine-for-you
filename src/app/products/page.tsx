import { Suspense } from "react";
import ProductsFilter, { ProductsFilterSkeleton } from "./filter";
import ProductsList, { ProductsListSkeleton } from "./list";

export default async function ProductsPage({
	searchParams,
}: {
	searchParams: Promise<{ [tags: string]: string | string[] | undefined }>;
}) {
	return (
		<div className="min-h-screen px-4 py-8 space-y-8">
			<section className="max-w-7xl mx-auto w-full">
				<Suspense fallback={<ProductsFilterSkeleton />}>
					<ProductsFilter selectedTagSlugs={searchParams.then((params) => params.tags)} />
				</Suspense>
			</section>

			<section className="max-w-7xl mx-auto w-full">
				<Suspense fallback={<ProductsListSkeleton />}>
					<ProductsList selectedTagSlugs={searchParams.then((params) => params.tags)} />
				</Suspense>
			</section>
		</div>
	);
}
