import { notFound } from "next/navigation";
import { getProduct } from "../_shared/actions";
import ProductEditForm from "./form";

interface AdminProductPageProps {
	params: Promise<{ id: string }>;
}

export default async function AdminProductPage({ params }: AdminProductPageProps) {
	const productId = Number(await params.then((p) => p.id));
	const [product, tags] = await getProduct(productId);

	if (!product) {
		notFound();
	}

	return (
		<div className="max-w-2xl mx-auto p-4 my-32 min-h-screen">
			<ProductEditForm product={product} tags={tags} />
		</div>
	);
}
