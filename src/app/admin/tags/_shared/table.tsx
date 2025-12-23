"use client";

import { Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { match, P } from "ts-pattern";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TagWithProducts } from "../_shared/actions";
import { deleteTag } from "../_shared/actions";

type TagsTableProps = {
	tags: TagWithProducts[];
};

export default function TagsTable({ tags }: TagsTableProps) {
	const [deleteState, deleteAction] = useActionState(deleteTag, null);
	const [isPending, startTransition] = useTransition();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

	useEffect(() => {
		if (deleteState?.success) {
			toast.success(deleteState.message);
			setDeleteDialogOpen(false);
			setSelectedTagId(null);
		} else if (deleteState && !deleteState.success) {
			toast.error(deleteState.message);
		}
	}, [deleteState]);

	const handleDeleteClick = (tagId: number) => {
		setSelectedTagId(tagId);
		setDeleteDialogOpen(true);
	};

	const handleConfirmDelete = () => {
		if (!selectedTagId) return;

		const formData = new FormData();
		formData.append("tag-id", selectedTagId.toString());

		startTransition(() => {
			deleteAction(formData);
		});
	};

	const selectedTag = tags.find((t) => t.id === selectedTagId);

	const renderTagContent = (tag: TagWithProducts) => (
		<Card key={tag.id}>
			{/* Title and Delete Button */}
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<CardTitle className="font-medium text-lg">{tag.name}</CardTitle>
						<CardDescription className="text-xs text-muted-foreground">{tag.slug}</CardDescription>
					</div>
					<Button
						variant="secondary"
						size="icon"
						onClick={() => handleDeleteClick(tag.id)}
						disabled={tag.products.length > 0}
						className="hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
						title={tag.products.length > 0 ? "Cannot delete tag that is used by products" : "Delete tag"}
					>
						<Trash2Icon className="size-4" />
					</Button>
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Products List */}
				{match(tag.products)
					.with([], () => <p className="text-muted-foreground">No products</p>)
					.with(P.array(), (products) => (
						<ol className="list-decimal list-outside space-y-2 pl-4">
							{products.map((product) => (
								<li key={product.id}>
									<Link
										href={`/admin/products/${product.id}`}
										className="hover:text-primary transition-colors whitespace-normal"
									>
										{product.name}
									</Link>
								</li>
							))}
						</ol>
					))
					.exhaustive()}

				{/* Product Count and Created Date */}
				<div className="flex items-center justify-between text-xs text-muted-foreground italic">
					<span>
						{tag.products.length} product{tag.products.length !== 1 ? "s" : ""} using this tag
					</span>
					{match(tag.created_at)
						.with(null, () => null)
						.with(P.string, (createdAt) => (
							<span>
								{new Date(createdAt).toLocaleDateString("en-US", {
									year: "numeric",
									month: "short",
									day: "numeric",
								})}
							</span>
						))
						.exhaustive()}
				</div>
			</CardContent>
		</Card>
	);

	return (
		<div className="space-y-4">
			{/* Desktop Table View */}
			<div className="hidden md:block">
				<Table>
					<TableHeader>
						<TableRow className="bg-muted/80">
							<TableHead className="font-semibold">ID</TableHead>
							<TableHead className="font-semibold">Name</TableHead>
							<TableHead className="font-semibold">Slug</TableHead>
							<TableHead className="font-semibold">Referenced Products</TableHead>
							<TableHead className="font-semibold">Created At</TableHead>
							<TableHead className="font-semibold">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{tags.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="text-center text-muted-foreground py-8">
									No tags found
								</TableCell>
							</TableRow>
						) : (
							tags.map((tag) => (
								<TableRow key={tag.id}>
									<TableCell>{tag.id}</TableCell>
									<TableCell className="font-medium">{tag.name}</TableCell>
									<TableCell>
										<code className="text-sm bg-muted px-2 py-1 rounded">{tag.slug}</code>
									</TableCell>
									<TableCell>
										{tag.products.length > 0 ? (
											<div className="space-y-2">
												<div className="flex flex-wrap gap-2">
													{tag.products.map((product) => (
														<Link
															key={product.id}
															href={`/admin/products/${product.id}`}
															className="inline-block max-w-full"
														>
															<Badge
																variant="outline"
																className="hover:bg-primary hover:text-primary-foreground transition-colors whitespace-normal max-w-full"
															>
																{product.name}
															</Badge>
														</Link>
													))}
												</div>
												<p className="text-xs text-muted-foreground">
													{tag.products.length} product{tag.products.length !== 1 ? "s" : ""} using this tag
												</p>
											</div>
										) : (
											<span className="text-muted-foreground text-sm">No products</span>
										)}
									</TableCell>
									<TableCell>
										{tag.created_at
											? new Date(tag.created_at).toLocaleDateString("en-US", {
													year: "numeric",
													month: "short",
													day: "numeric",
												})
											: "N/A"}
									</TableCell>
									<TableCell>
										<Button
											variant="link"
											size="icon"
											onClick={() => handleDeleteClick(tag.id)}
											disabled={tag.products.length > 0}
											className="hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
											title={tag.products.length > 0 ? "Cannot delete tag that is used by products" : "Delete tag"}
										>
											<Trash2Icon className="size-4" />
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Mobile Card View */}
			<div className="md:hidden space-y-4">
				{tags.length === 0 ? (
					<Card>
						<CardContent className="text-center text-muted-foreground py-8">No tags found</CardContent>
					</Card>
				) : (
					tags.map((tag) => renderTagContent(tag))
				)}
			</div>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the tag "{selectedTag?.name || "this tag"}". This action cannot be undone.
							{selectedTag && selectedTag.products.length > 0 && (
								<div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
									<p className="text-sm font-medium text-destructive mb-2">
										Warning: This tag is currently used by {selectedTag.products.length} product
										{selectedTag.products.length !== 1 ? "s" : ""}:
									</p>
									<ul className="list-disc list-inside text-sm space-y-1">
										{selectedTag.products.map((product) => (
											<li key={product.id}>{product.name}</li>
										))}
									</ul>
									<p className="text-sm mt-2">Please remove this tag from all products before deleting it.</p>
								</div>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirmDelete}
							disabled={isPending || (selectedTag?.products.length ?? 0) > 0}
						>
							{isPending ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
