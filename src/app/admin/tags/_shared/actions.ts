"use server";

import { PostgrestError } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { ZodError, z } from "zod";
import { slugify } from "@/lib/shared";
import { type Tables } from "@/lib/supabase/enhanced.database.types";
import { createClient } from "@/lib/supabase/server";

const tagSchema = z.object({
	name: z.string().min(1),
});

export type TagFormData = z.infer<typeof tagSchema>;

export type ActionResponse = {
	success: boolean;
	message: string;
	errors?: {
		[K in keyof TagFormData]?: string[];
	};
};

export async function createTag(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {
	try {
		const supabase = await createClient();

		const name = formData.get("name");

		const validated = tagSchema.parse({ name });
		const { name: validatedName } = validated;

		const slug = slugify(validatedName);

		// Check if tag with same slug already exists
		const existingTag = await supabase
			.from("tags")
			.select("id")
			.eq("slug", slug)
			.single()
			.then(({ data }) => data);

		if (existingTag) {
			return {
				success: false,
				message: "A tag with this name already exists",
				errors: {
					name: ["A tag with this name already exists"],
				},
			};
		}

		await supabase
			.from("tags")
			.insert({
				name: validatedName,
				slug,
			})
			.throwOnError();

		revalidatePath("/admin/tags");

		return {
			success: true,
			message: "Tag created successfully",
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
			message: "An unexpected error occurred while creating the tag",
		};
	}
}

export async function deleteTag(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {
	try {
		const supabase = await createClient();

		const tagId = formData.get("tag-id");
		if (!tagId) {
			return {
				success: false,
				message: "Tag ID is required",
			};
		}

		const tagIdNum = Number(tagId);

		// Check if tag is referenced by any products
		const productTags = await supabase
			.from("product_tags")
			.select("id")
			.eq("tag_id", tagIdNum)
			.throwOnError();

		if (productTags.data && productTags.data.length > 0) {
			return {
				success: false,
				message: `Cannot delete tag. It is currently used by ${productTags.data.length} product(s). Please remove the tag from all products first.`,
			};
		}

		// Delete the tag
		await supabase.from("tags").delete().eq("id", tagIdNum).throwOnError();

		revalidatePath("/admin/tags");

		return {
			success: true,
			message: "Tag deleted successfully",
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
			message: "An unexpected error occurred while deleting the tag",
		};
	}
}

export type TagWithProducts = Tables<"tags"> & {
	products: Tables<"products">[];
};

export async function getTagsWithProducts(): Promise<TagWithProducts[]> {
	const supabase = await createClient();

	const tags = await supabase
		.from("tags")
		.select("*")
		.order("name", { ascending: true })
		.then(({ data }) => data ?? []);

	// For each tag, get all products that reference it
	const tagsWithProducts = await Promise.all(
		tags.map(async (tag) => {
			const productTags = await supabase
				.from("product_tags")
				.select("product_id")
				.eq("tag_id", tag.id)
				.then(({ data }) => data ?? []);

			if (productTags.length === 0) {
				return { ...tag, products: [] };
			}

			const productIds = productTags.map((pt) => pt.product_id);
			const products = await supabase
				.from("products")
				.select("*")
				.in("id", productIds)
				.then(({ data }) => data ?? []);

			return { ...tag, products };
		}),
	);

	return tagsWithProducts;
}
