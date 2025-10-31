"use server";

import { PostgrestError } from "@supabase/supabase-js";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { ZodError, z } from "zod";
import { slugify } from "@/lib/shared";
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
		const productSlug = slugify(validatedName);

		for (let i = 0; i < imageFiles.length; i++) {
			const file = imageFiles[i];
			if (file instanceof File && file.size > 0) {
				const fileExtension = file.name.split(".").pop() || "jpg";
				const slugifiedFileName = `${productSlug}-${i + 1}.${fileExtension}`;

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
