import { Package, Tag } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function AdminPage() {
	return (
		<div className="container mx-auto px-4 py-16">
			<div className="max-w-4xl mx-auto space-y-8">
				<div className="text-center space-y-2">
					<h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
					<p className="text-muted-foreground">Manage your content and settings</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					<Link
						href="/admin/products"
						className={cn(
							"group block transition-all duration-200",
							"hover:scale-[1.02] active:scale-[0.98]",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl",
						)}
					>
						<Card className="h-full transition-all duration-200 hover:shadow-md border-2 hover:border-primary/20">
							<CardHeader>
								<div className="flex items-center gap-4">
									<div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
										<Package className="size-6" />
									</div>
									<div className="flex-1">
										<CardTitle className="text-xl">Products</CardTitle>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-base">
									Manage your product catalog, create, edit, and delete products
								</CardDescription>
							</CardContent>
						</Card>
					</Link>

					<Link
						href="/admin/tags"
						className={cn(
							"group block transition-all duration-200",
							"hover:scale-[1.02] active:scale-[0.98]",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl",
						)}
					>
						<Card className="h-full transition-all duration-200 hover:shadow-md border-2 hover:border-primary/20">
							<CardHeader>
								<div className="flex items-center gap-4">
									<div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
										<Tag className="size-6" />
									</div>
									<div className="flex-1">
										<CardTitle className="text-xl">Tags</CardTitle>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-base">
									Organize products with tags, create and manage categories
								</CardDescription>
							</CardContent>
						</Card>
					</Link>
				</div>
			</div>
		</div>
	);
}
