"use server";

import { PostgrestError } from "@supabase/supabase-js";
import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { ZodError, z } from "zod";
import { getTags } from "@/lib/dal/product";
import { slugify } from "@/lib/shared";
import { type EnhancedProduct, type Tables } from "@/lib/supabase/enhanced.database.types";
import { createClient } from "@/lib/supabase/server";

const productSchema = z.object({
	name: z.string().min(1),
	tags: z.array(z.number()).optional().default([]),
	images: z.array(z.string()).optional().default([]),
	subProducts: z
		.array(
			z.object({
				name: z.string().min(1),
				available: z.boolean().optional().default(true),
			}),
		)
		.optional()
		.default([]),
});

export type ProductFormData = z.infer<typeof productSchema>;

export type ActionResponse = {
	success: boolean;
	message: string;
	errors?: {
		[K in keyof ProductFormData]?: string[];
	};
};

export async function createProduct(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {
	try {
		const supabase = await createClient();

		const name = formData.get("name");
		const tags = formData.getAll("tags").map((t) => Number(t));
		const subProductsRaw = formData.get("sub-products");
		const imageFiles = formData.getAll("images");

		let subProductsParsed: unknown = [];
		if (typeof subProductsRaw === "string" && subProductsRaw.trim().length > 0) {
			subProductsParsed = JSON.parse(subProductsRaw);
		}

		const validated = productSchema.parse({ name, tags, subProducts: subProductsParsed });
		const { name: validatedName, tags: validatedTags, subProducts: validatedSubProducts } = validated;

		// Upload images first
		const uploadedImages: { name: string; url: string; alt: string }[] = [];

		for (let i = 0; i < imageFiles.length; i++) {
			const file = imageFiles[i];
			if (file instanceof File && file.size > 0) {
				const slugifiedFileName = getFileName(file, validatedName, i + 1);

				const blob = await put(slugifiedFileName, file, {
					access: "public",
				});

				uploadedImages.push({
					name: slugifiedFileName,
					url: blob.url,
					alt: `${validatedName} - Image ${i + 1}`,
				});
			}
		}

		const product = await supabase
			.from("products")
			.insert({ name: validatedName, price: 0 })
			.select()
			.single()
			.throwOnError();

		if (uploadedImages.length > 0) {
			await supabase
				.from("product_images")
				.insert(
					uploadedImages.map((img) => ({
						product_id: product.data.id,
						name: img.name,
						url: img.url,
						alt: img.alt,
					})),
				)
				.throwOnError();
		}

		await supabase
			.from("product_tags")
			.insert(validatedTags.map((t) => ({ product_id: product.data.id, tag_id: t })))
			.throwOnError();

		if (validatedSubProducts.length > 0) {
			await supabase
				.from("sub_products")
				.insert(
					validatedSubProducts.map((sp) => ({
						product_id: product.data.id,
						name: sp.name,
						available: sp.available,
						quantity: 0,
						price: 0,
					})),
				)
				.throwOnError();
		}

		revalidatePath("/products");
		revalidatePath("/admin/products");

		return {
			success: true,
			message: "Product created successfully",
		};
	} catch (error) {
		if (error instanceof PostgrestError) {
			return {
				success: false,
				message: error.message,
				errors: error.details ? JSON.parse(error.details) : undefined,
			};
		}

		if (error instanceof Error) {
			return {
				success: false,
				message: error.message,
			};
		}

		if (error instanceof ZodError) {
			const errors = error.flatten().fieldErrors;

			return {
				success: false,
				message: "Please fix the errors in the form",
				errors,
			};
		}

		return {
			success: false,
			message: "An unexpected error occurred while creating the product",
		};
	}
}

export async function updateProduct(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {
	try {
		const supabase = await createClient();

		const productId = formData.get("product-id");
		if (!productId) {
			return {
				success: false,
				message: "Product ID is required",
			};
		}

		const name = formData.get("name");
		const tags = formData.getAll("tags").map((t) => Number(t));
		const subProductsRaw = formData.get("sub-products");
		const imageFiles = formData.getAll("images");
		const deletedImageIds = formData.getAll("deleted-images").map((id) => Number(id));

		let subProductsParsed: unknown = [];
		if (typeof subProductsRaw === "string" && subProductsRaw.trim().length > 0) {
			subProductsParsed = JSON.parse(subProductsRaw);
		}

		const validated = productSchema.parse({ name, tags, subProducts: subProductsParsed });
		const { name: validatedName, tags: validatedTags, subProducts: validatedSubProducts } = validated;

		const productIdNum = Number(productId);

		// Update product name
		await supabase.from("products").update({ name: validatedName }).eq("id", productIdNum).throwOnError();

		// Delete removed images
		if (deletedImageIds.length > 0) {
			await supabase.from("product_images").delete().in("id", deletedImageIds).throwOnError();
		}

		// Delete existing tags
		await supabase.from("product_tags").delete().eq("product_id", productIdNum).throwOnError();

		// Add new tags
		if (validatedTags.length > 0) {
			await supabase
				.from("product_tags")
				.insert(validatedTags.map((t) => ({ product_id: productIdNum, tag_id: t })))
				.throwOnError();
		}

		// Upload new images
		const uploadedImages: { name: string; url: string; alt: string }[] = [];

		for (let i = 0; i < imageFiles.length; i++) {
			const file = imageFiles[i];
			if (file instanceof File && file.size > 0) {
				const slugifiedFileName = getFileName(file, validatedName, i + 1);

				const blob = await put(slugifiedFileName, file, {
					access: "public",
				});

				uploadedImages.push({
					name: slugifiedFileName,
					url: blob.url,
					alt: `${validatedName} - Image ${i + 1}`,
				});
			}
		}

		if (uploadedImages.length > 0) {
			await supabase
				.from("product_images")
				.insert(
					uploadedImages.map((img) => ({
						product_id: productIdNum,
						name: img.name,
						url: img.url,
						alt: img.alt,
					})),
				)
				.throwOnError();
		}

		// Delete existing sub-products
		await supabase.from("sub_products").delete().eq("product_id", productIdNum).throwOnError();

		// Add new sub-products
		if (validatedSubProducts.length > 0) {
			await supabase
				.from("sub_products")
				.insert(
					validatedSubProducts.map((sp) => ({
						product_id: productIdNum,
						name: sp.name,
						available: sp.available,
						quantity: 0,
						price: 0,
					})),
				)
				.throwOnError();
		}

		revalidatePath("/products");
		revalidatePath("/admin/products");
		revalidatePath(`/admin/products/${productIdNum}`);

		return {
			success: true,
			message: "Product updated successfully",
		};
	} catch (error) {
		if (error instanceof PostgrestError) {
			return {
				success: false,
				message: error.message,
				errors: error.details ? JSON.parse(error.details) : undefined,
			};
		}

		if (error instanceof Error) {
			return {
				success: false,
				message: error.message,
			};
		}

		if (error instanceof ZodError) {
			const errors = error.flatten().fieldErrors;

			return {
				success: false,
				message: "Please fix the errors in the form",
				errors,
			};
		}

		return {
			success: false,
			message: "An unexpected error occurred while updating the product",
		};
	}
}

export async function deleteProduct(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {
	try {
		const supabase = await createClient();

		const productId = formData.get("product-id");
		if (!productId) {
			return {
				success: false,
				message: "Product ID is required",
			};
		}

		const productIdNum = Number(productId);

		// Delete the product images from Vercel Blob
		const productImages = await supabase
			.from("product_images")
			.select("url")
			.eq("product_id", productIdNum)
			.throwOnError();

		for (const image of productImages.data) {
			await del(image.url);
		}

		// Delete related records first (due to foreign key constraints)
		await supabase.from("product_tags").delete().eq("product_id", productIdNum).throwOnError();
		await supabase.from("sub_products").delete().eq("product_id", productIdNum).throwOnError();
		await supabase.from("product_images").delete().eq("product_id", productIdNum).throwOnError();

		// Delete the product
		await supabase.from("products").delete().eq("id", productIdNum).throwOnError();

		revalidatePath("/products");
		revalidatePath("/admin/products");

		return {
			success: true,
			message: "Product deleted successfully",
		};
	} catch (error) {
		if (error instanceof PostgrestError) {
			return {
				success: false,
				message: error.message,
				errors: error.details ? JSON.parse(error.details) : undefined,
			};
		}

		if (error instanceof Error) {
			return {
				success: false,
				message: error.message,
			};
		}

		return {
			success: false,
			message: "An unexpected error occurred while deleting the product",
		};
	}
}

export const getProduct = async (id: number): Promise<[EnhancedProduct | undefined, Tables<"tags">[]]> => {
	const supabase = await createClient();

	const tags = await getTags();
	const product = await supabase
		.from("products")
		.select("*, product_images(*), product_tags(*), sub_products(*)")
		.eq("id", id)
		.single()
		.then(({ data }) => data ?? undefined);

	return [product, tags];
};

function getFileName(file: File, productName: string, imageIndex: number): string {
	const fileExtension = file.name.split(".").pop() || "jpg";
	return `${slugify(productName)}-${imageIndex}-${Date.now()}.${fileExtension}`;
}
