import { Undo2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FilterBadge from "@/components/filter-badge";
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
				<Card className="grid grid-rows-[auto_1fr_auto] gap-4 py-4">
					<CardHeader className="px-4">
						<div className="flex flex-col gap-4">
							<CardTitle className="text-base font-medium text-primary leading-tight tracking-tight">
								{product.name}
							</CardTitle>
							{product.categories.length > 0 && (
								<CardDescription className="mt-1 flex flex-wrap gap-2">
									{product.categories.map((c) => (
										<FilterBadge key={c.value}>{capitalize(c.label)}</FilterBadge>
									))}
								</CardDescription>
							)}
						</div>
					</CardHeader>

					<CardContent className="flex-1 flex flex-col p-0">
						<div className="aspect-square relative">
							<Image
								src={product.image}
								alt={product.name}
								loading="eager"
								fill
								className="object-cover"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							/>
						</div>

						{product.subCategories.length > 0 && (
							<div className="flex flex-col gap-2 p-4 my-4 bg-muted/80">
								<CardDescription className="flex flex-wrap gap-2">
									{product.subCategories.map((c) => (
										<FilterBadge key={c}>{capitalize(c)}</FilterBadge>
									))}
								</CardDescription>
								<p className="text-xs text-muted-foreground italic">
									This product is able to be purchased individually separately.
								</p>
							</div>
						)}
					</CardContent>

					<CardFooter className="flex gap-2 justify-end px-4">
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
