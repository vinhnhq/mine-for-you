import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/dal/product";
import ProductsTable from "./_shared/table";

export default async function AdminProductsPage() {
	const [products, tags] = await getProducts([]);

	const tagMap = new Map(tags.map((tag) => [tag.id, tag.name]));

	return (
		<div className="container mx-auto px-4">
			<div className="flex justify-between items-center">
				<Button asChild variant="ghost">
					<Link href="/admin">
						<ArrowLeft className="size-4" />
						Back to Dashboard
					</Link>
				</Button>
				<Button asChild variant="default">
					<Link href="/admin/products/create">
						<Plus className="size-4" />
						Create Product
					</Link>
				</Button>
			</div>
			<ProductsTable products={products} tagMap={tagMap} />
		</div>
	);
}
