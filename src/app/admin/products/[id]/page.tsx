import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
			<Button asChild variant="ghost" size="sm" className={cn("mb-6")}>
				<Link href="/admin">
					<ArrowLeft className="size-4" />
					Back to Dashboard
				</Link>
			</Button>
			<ProductEditForm product={product} tags={tags} />
		</div>
	);
}
