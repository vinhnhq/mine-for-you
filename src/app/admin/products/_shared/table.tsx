"use client";

import { PencilIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { EnhancedProduct } from "@/lib/supabase/enhanced.database.types";
import { deleteProduct } from "../_shared/actions";

type ProductsTableProps = {
	products: EnhancedProduct[];
	tagMap: Map<number, string>;
};

export default function ProductsTable({ products, tagMap }: ProductsTableProps) {
	const [deleteState, deleteAction] = useActionState(deleteProduct, null);
	const [isPending, startTransition] = useTransition();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

	useEffect(() => {
		if (deleteState?.success) {
			toast.success(deleteState.message);
			setDeleteDialogOpen(false);
			setSelectedProductId(null);
		} else if (deleteState && !deleteState.success) {
			toast.error(deleteState.message);
		}
	}, [deleteState]);

	const handleDeleteClick = (productId: number) => {
		setSelectedProductId(productId);
		setDeleteDialogOpen(true);
	};

	const handleConfirmDelete = () => {
		if (!selectedProductId) return;

		const formData = new FormData();
		formData.append("product-id", selectedProductId.toString());

		startTransition(() => {
			deleteAction(formData);
		});
	};

	const selectedProduct = products.find((p) => p.id === selectedProductId);

	return (
		<div className="container mx-auto py-8">
			<Table>
				<TableHeader>
					<TableRow className="bg-muted/80">
						<TableHead className="font-semibold">ID</TableHead>
						<TableHead className="font-semibold">Name</TableHead>
						<TableHead className="font-semibold">Images</TableHead>
						<TableHead className="font-semibold">Tags</TableHead>
						<TableHead className="font-semibold">Sub-Products</TableHead>
						<TableHead className="font-semibold">Created At</TableHead>
						<TableHead className="font-semibold">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{products.length === 0 ? (
						<TableRow>
							<TableCell colSpan={7} className="text-center text-muted-foreground py-8">
								No products found
							</TableCell>
						</TableRow>
					) : (
						products.map((product) => (
							<TableRow key={product.id}>
								<TableCell>{product.id}</TableCell>
								<TableCell>{product.name}</TableCell>
								<TableCell>
									<div className="flex flex-wrap gap-2">
										{product.product_images.length > 0
											? product.product_images.map((img) => (
													<Image
														key={img.id}
														src={img.url}
														alt={img.alt ?? product.name}
														className="object-cover rounded-md border border-dashed border-red-500 p-1"
														width={100}
														height={100}
														preload={false}
													/>
												))
											: null}
									</div>
								</TableCell>
								<TableCell>
									<div className="flex flex-wrap gap-1">
										{product.product_tags.length > 0
											? product.product_tags.map((pt) => {
													const tagName = tagMap.get(pt.tag_id);
													return (
														<Badge key={pt.id} variant="default">
															{tagName || `Tag ${pt.tag_id}`}
														</Badge>
													);
												})
											: null}
									</div>
								</TableCell>
								<TableCell>
									<div className="flex flex-col gap-1">
										{product.sub_products.length > 0
											? product.sub_products.map((sp) => (
													<Badge key={sp.id} variant={!sp.available ? "outline" : "default"}>
														{sp.name}
													</Badge>
												))
											: null}
									</div>
								</TableCell>
								<TableCell>
									{product.created_at
										? new Date(product.created_at).toLocaleDateString("en-US", {
												year: "numeric",
												month: "short",
												day: "numeric",
											})
										: "N/A"}
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<Link
											href={`/admin/products/${product.id}`}
											className="flex items-center justify-center gap-2 hover:scale-105 transition-all duration-200 ease-in-out"
										>
											<PencilIcon className="size-4" />
										</Link>
										<Button
											variant="link"
											size="icon"
											onClick={() => handleDeleteClick(product.id)}
											className="hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer"
										>
											<TrashIcon className="size-4" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete {selectedProduct?.name || "this product"}. This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleConfirmDelete} disabled={isPending}>
							{isPending ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
