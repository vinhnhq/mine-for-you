import { Suspense } from "react";
import ProductsFilter, { ProductsFilterSkeleton } from "./filter";
import ProductsList, { ProductsListSkeleton } from "./list";

export default async function ProductsPage({
	searchParams,
}: {
	searchParams: Promise<{ [category: string]: string | string[] | undefined }>;
}) {
	return (
		<div className="flex flex-col gap-4 min-h-screen items-center p-4">
			<Suspense fallback={<ProductsFilterSkeleton />}>
				<ProductsFilter category={searchParams.then((params) => params.category)} />
			</Suspense>

			<Suspense fallback={<ProductsListSkeleton />}>
				<ProductsList category={searchParams.then((params) => params.category)} />
			</Suspense>
		</div>
	);
}
