"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { SubProductsInput } from "@/components/sub-products-input";
import SubmitButton from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type EnhancedProduct, type Tables } from "@/lib/supabase/enhanced.database.types";
import { cn } from "@/lib/utils";
import { type ActionResponse, updateProduct } from "../_shared/actions";

const initialState: ActionResponse = {
	success: false,
	message: "",
};

export default function ProductEditForm({ product, tags }: { product: EnhancedProduct; tags: Tables<"tags">[] }) {
	const [state, formAction] = useActionState(updateProduct, initialState);
	const [resetKey, setResetKey] = useState("");
	const [existingImages, setExistingImages] = useState(product.product_images);
	const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

	useEffect(() => {
		if (state.success) {
			toast.success(state.message);
			setResetKey(crypto.randomUUID());
		}

		if (state.errors) {
			toast.error(state.message);
		}
	}, [state.success, state.message, state.errors, setResetKey]);

	// Get the currently selected tag IDs
	const selectedTagIds = new Set(product.product_tags.map((pt) => pt.tag_id));

	function handleDeleteImage(imageId: number) {
		setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
		setDeletedImageIds((prev) => [...prev, imageId]);
	}

	return (
		<div className="w-full">
			<form action={formAction} key={resetKey}>
				{/* Hidden field for product ID */}
				<input type="hidden" name="product-id" value={product.id} />
				{/* Hidden field for deleted images */}
				{deletedImageIds.map((id) => (
					<input key={`deleted-${id}`} type="hidden" name="deleted-images" value={id.toString()} />
				))}

				<FieldGroup>
					<FieldSet>
						<FieldLegend>Edit product</FieldLegend>
						<FieldDescription>Update the details below to modify the product</FieldDescription>

						<FieldGroup>
							<Field>
								<FieldLabel>Name</FieldLabel>
								<FieldDescription>The name of your product</FieldDescription>
								<Input
									name="name"
									required
									defaultValue={product.name}
									placeholder="e.g. POPLAND Mokoko CLOSE TO SWEET"
								/>
							</Field>

							<Field>
								<FieldLabel>Tags</FieldLabel>
								<FieldDescription>Select the tags that best describe your product</FieldDescription>
								<FieldGroup className="grid grid-cols-2 gap-3">
									{tags.map((tag) => {
										const id = tag.id.toString();
										const isChecked = selectedTagIds.has(tag.id);
										return (
											<Field key={id} orientation="horizontal" className="items-center">
												<Checkbox name="tags" value={id} id={id} defaultChecked={isChecked} />
												<FieldLabel htmlFor={id} className="font-normal">
													{tag.name}
												</FieldLabel>
											</Field>
										);
									})}
								</FieldGroup>
							</Field>

							{/* Display existing images */}
							{existingImages.length > 0 && (
								<Field>
									<FieldLabel>Existing Images</FieldLabel>
									<div className="flex flex-wrap gap-4">
										{existingImages.map((img) => (
											<div key={img.id} className="relative group">
												<Image
													src={img.url}
													alt={img.alt || ""}
													width={100}
													height={100}
													className="object-cover rounded-md border border-dashed border-red-500 p-1"
												/>
												<Button
													type="button"
													variant="secondary"
													size="icon"
													className={cn(
														"absolute -top-2 -right-2 size-6 rounded-full",
														"cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out",
													)}
													onClick={() => handleDeleteImage(img.id)}
												>
													<Trash2 className="size-4" />
												</Button>
											</div>
										))}
									</div>
								</Field>
							)}

							<Field>
								<FieldLabel>Gallery</FieldLabel>
								<FieldDescription>Upload new images to add to your product</FieldDescription>
								<Input type="file" name="images" placeholder="e.g. image1.jpg" accept="image/*" multiple />
							</Field>

							<Field>
								<FieldLabel>Variants</FieldLabel>
								<FieldDescription>
									Add a name, click Add. Items appear as checkable labels (checked = available). Click the trash icon to
									remove an item.
								</FieldDescription>
								<SubProductsInput
									name="sub-products"
									initialValues={product.sub_products.map((sp) => ({
										name: sp.name,
										available: sp.available,
									}))}
								/>
							</Field>

							<Field orientation="horizontal" className="flex justify-end">
								<Button variant="secondary" type="button" asChild>
									<Link href="/admin/products">Cancel</Link>
								</Button>
								<SubmitButton label="Update" loading="Updating..." />
							</Field>
						</FieldGroup>
					</FieldSet>
				</FieldGroup>
			</form>
		</div>
	);
}
