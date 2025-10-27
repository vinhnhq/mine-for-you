import { Undo2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FilterBadge, { TagBadge } from "@/components/filter-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { capitalize } from "@/lib/shared";
import { cn } from "@/lib/utils";
import { getProduct } from "../query";
import ShareButton from "./share-button";

interface ProductPageProps {
	params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
	const product = await getProduct(Number(await params.then((p) => p.id)));

	if (!product) {
		notFound();
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-xl mx-auto">
				<Card className="border-none shadow-none rounded-none p-0 m-0 gap-4">
					<CardContent className="flex-1 flex flex-col p-0 m-0">
						<div className="relative">
							<Image
								src={product.image}
								alt={product.name}
								loading="eager"
								width={400}
								height={400}
								className="w-full h-auto object-cover"
							/>
						</div>
					</CardContent>

					<CardHeader className="p-0 space-y-2">
						<CardTitle className="text-base font-medium text-primary leading-tight tracking-tighter">
							{product.name}
						</CardTitle>

						{product.categories.length > 0 && (
							<CardDescription className="flex flex-wrap gap-2">
								{product.categories.map((c) => (
									<TagBadge key={c.value}>{capitalize(c.label)}</TagBadge>
								))}
							</CardDescription>
						)}

						{product.subCategories.length > 0 && (
							<div className="flex flex-col gap-4 p-4 bg-muted/80 rounded-lg">
								<CardDescription className="flex flex-wrap gap-2">
									{product.subCategories.map((c) => (
										<TagBadge className="border-black" key={c}>
											{capitalize(c)}
										</TagBadge>
									))}
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
