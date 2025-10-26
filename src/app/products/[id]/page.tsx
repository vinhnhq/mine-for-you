import { ArrowLeft, Heart, Share, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { sampleProducts } from "@/lib/data";

interface ProductPageProps {
	params: {
		id: string;
	};
}

export default function ProductPage({ params }: ProductPageProps) {
	const product = sampleProducts.find((p) => p.id === params.id);

	if (!product) {
		notFound();
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6">
				<Button variant="ghost" asChild className="mb-4">
					<Link href="/products" className="flex items-center gap-2">
						<ArrowLeft className="h-4 w-4" />
						Back to Products
					</Link>
				</Button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Product Image */}
				<div className="space-y-4">
					<div className="aspect-square relative rounded-lg overflow-hidden">
						<Image src={product.image} alt={product.name} fill className="object-cover" />
						{!product.inStock && (
							<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
								<Badge variant="destructive" className="text-lg px-4 py-2">
									Out of Stock
								</Badge>
							</div>
						)}
					</div>
				</div>

				{/* Product Details */}
				<div className="space-y-6">
					<div>
						<Badge variant="secondary" className="mb-2">
							{product.category}
						</Badge>
						<h1 className="text-3xl font-bold mb-2">{product.name}</h1>
						<div className="flex items-center gap-2 mb-4">
							<div className="flex items-center gap-1">
								<Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
								<Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
								<Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
								<Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
								<Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
							</div>
							<span className="text-sm text-muted-foreground">(4.8/5 • 127 reviews)</span>
						</div>
						<p className="text-3xl font-bold text-primary">${product.price}</p>
					</div>

					<Separator />

					<div>
						<h3 className="text-lg font-semibold mb-2">Description</h3>
						<p className="text-muted-foreground leading-relaxed">{product.description}</p>
					</div>

					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Features</h3>
						<ul className="space-y-2 text-sm">
							<li className="flex items-center gap-2">
								<div className="w-2 h-2 bg-primary rounded-full" />
								Premium quality materials
							</li>
							<li className="flex items-center gap-2">
								<div className="w-2 h-2 bg-primary rounded-full" />
								Free shipping on orders over $50
							</li>
							<li className="flex items-center gap-2">
								<div className="w-2 h-2 bg-primary rounded-full" />
								30-day money-back guarantee
							</li>
							<li className="flex items-center gap-2">
								<div className="w-2 h-2 bg-primary rounded-full" />
								Customer support 24/7
							</li>
						</ul>
					</div>

					<Separator />

					<div className="flex gap-3">
						<Button size="lg" className="flex-1" disabled={!product.inStock}>
							<ShoppingCart className="h-4 w-4 mr-2" />
							{product.inStock ? "Add to Cart" : "Out of Stock"}
						</Button>
						<Button variant="outline" size="lg">
							<Heart className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="lg">
							<Share className="h-4 w-4" />
						</Button>
					</div>

					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Shipping & Returns</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span>Free shipping</span>
								<span className="text-muted-foreground">Orders over $50</span>
							</div>
							<div className="flex justify-between">
								<span>Standard shipping</span>
								<span className="text-muted-foreground">3-5 business days</span>
							</div>
							<div className="flex justify-between">
								<span>Returns</span>
								<span className="text-muted-foreground">30 days</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
