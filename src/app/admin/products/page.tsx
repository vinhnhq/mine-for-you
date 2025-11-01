import { getProducts } from "@/lib/dal/product";
import ProductsTable from "./_shared/table";

export default async function AdminProductsPage() {
	const [products, tags] = await getProducts([]);

	const tagMap = new Map(tags.map((tag) => [tag.id, tag.name]));

	return <ProductsTable products={products} tagMap={tagMap} />;
}
