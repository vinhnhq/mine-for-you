import { Undo2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { match, P } from "ts-pattern";
import { TagBadge } from "@/components/filter-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { emptyProductsImage } from "@/lib/constants";
import { getProduct } from "@/lib/dal/product";
import { capitalize } from "@/lib/shared";
import { cn } from "@/lib/utils";
import ShareButton from "../_shared/share-button";

interface ProductPageProps {
	params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
	const [product, tags] = await getProduct(Number(await params.then((p) => p.id)));

	if (!product) {
		notFound();
	}

	const image = product.product_images[0]?.url;
	const alt = product.product_images[0]?.alt ?? product.name;

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-xl mx-auto">
				<Card className="border-none shadow-none rounded-none p-0 m-0 gap-4">
					<CardContent className="flex-1 flex flex-col p-0 m-0">
						<div className="relative">
							<Image
								src={image ?? emptyProductsImage}
								alt={alt}
								loading="eager"
								width={400}
								height={400}
								className={cn("w-full h-auto object-cover rounded-md", !image ? "blur-xs" : "")}
							/>
						</div>
					</CardContent>

					<CardHeader className="p-0 space-y-2">
						<CardTitle className="text-base font-medium text-primary leading-tight tracking-tighter">
							{product.name}
						</CardTitle>

						{product.product_tags.length > 0 && (
							<CardDescription className="flex flex-wrap gap-2">
								{product.product_tags.map((t) => (
									<TagBadge key={t.tag_id}>
										{capitalize(tags.find((tag) => tag.id === t.tag_id)?.name ?? "Unknown")}
									</TagBadge>
								))}
							</CardDescription>
						)}

						{product.sub_products.length > 0 && (
							<div className="flex flex-col gap-4 p-4 bg-muted/80 rounded-lg">
								<CardDescription className="flex flex-wrap gap-2">
									{product.sub_products.map((sp) =>
										match(sp)
											.with({ available: P.nullish }, () => {
												return null;
											})
											.otherwise(() => {
												return (
													<TagBadge className="border-black" key={sp.id}>
														{sp.name}
													</TagBadge>
												);
											}),
									)}
								</CardDescription>
								<p className="text-xs text-muted-foreground italic">
									This product is available for individual purchase.
								</p>
							</div>
						)}
					</CardHeader>

					<CardFooter className="flex gap-4 justify-end p-0">
						<Button
							asChild
							variant="default"
							size="sm"
							className={cn(
								"text-sm font-medium",
								"hover:scale-105",
								"transition-all duration-200 ease-in-out",
								"focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
							)}
						>
							<Link href="/products">
								<Undo2 className="size-4" />
								Back to Products
							</Link>
						</Button>

						<ShareButton id={product.id} />
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
