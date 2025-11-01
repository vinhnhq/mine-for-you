"server only";

import { ProductFormData } from "@/app/admin/products/_shared/actions";
import { EnhancedProduct, type Tables } from "@/lib/supabase/enhanced.database.types";
import { createClient } from "@/lib/supabase/server";

export const defaultTags: { [key: string]: Omit<Tables<"tags">, "created_at" | "updated_at"> } = {
	labubu: { id: 1, slug: "labubu", name: "Labubu" },
	poplandExclusive: { id: 2, slug: "popland-exclusive", name: "Popland Exclusive" },
	blindbox: { id: 3, slug: "blindbox", name: "Blindbox" },
	wholeset: { id: 4, slug: "wholeset", name: "Wholeset" },
	happyFactor: { id: 5, slug: "happy-factor", name: "Happy Factor" },
	surpriseShake: { id: 6, slug: "surprise-shake", name: "Surprise Shake" },
	secretMysteriousGuest: { id: 7, slug: "secret-mysterious-guest", name: "Secret Mysterious Guest" },
	newSeal: { id: 8, slug: "new-seal", name: "Newseal" },
	thailandExclusive: { id: 9, slug: "thailand-exclusive", name: "Thailand Exclusive" },
};

export const getTags = async (): Promise<Tables<"tags">[]> => {
	const supabase = await createClient();
	return supabase
		.from("tags")
		.select("*")
		.then(({ data }) => data ?? []);
};

const fromSlugsToIds = (slugs: string[], tags: Tables<"tags">[]): number[] => {
	return slugs.map((slug) => tags.find((tag) => tag.slug === slug)?.id).filter((id): id is number => id !== undefined);
};

export const getProducts = async (selectedTagSlugs: string[]): Promise<[EnhancedProduct[], Tables<"tags">[]]> => {
	const supabase = await createClient();

	const tags = await getTags();
	const tagIds = fromSlugsToIds(selectedTagSlugs, tags);

	let baseQuery = supabase.from("products");

	const productsQuery =
		tagIds.length > 0
			? baseQuery
					.select("*, product_images(*), product_tags!inner(*), sub_products(*)")
					.filter("product_tags.tag_id", "in", `(${tagIds.join(",")})`)
					.order("created_at", { ascending: false })
					.throwOnError()
			: baseQuery
					.select("*, product_images(*), product_tags(*), sub_products(*)")
					.order("created_at", { ascending: false })
					.throwOnError();

	const products = await productsQuery.then(({ data }) => data ?? []);

	return [products, tags];
};

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

export const createProduct = async (product: ProductFormData): Promise<number | undefined> => {
	const supabase = await createClient();

	const result = await supabase
		.from("products")
		.insert({ name: product.name, price: 0 })
		.select("id")
		.single()
		.throwOnError();

	return result.data.id;
};

export const createProductImages = async (
	productId: number,
	images: { name: string; url: string; alt: string }[],
): Promise<void> => {
	const supabase = await createClient();
	await supabase
		.from("product_images")
		.insert(images.map((image) => ({ ...image, product_id: productId })))
		.throwOnError();
};

export const createProductTags = async (productId: number, tags: number[]): Promise<void> => {
	const supabase = await createClient();
	await supabase
		.from("product_tags")
		.insert(tags.map((tag) => ({ product_id: productId, tag_id: tag })))
		.throwOnError();
};

export const createSubProducts = async (
	productId: number,
	subProducts: { name: string; available: boolean }[],
): Promise<void> => {
	const supabase = await createClient();
	await supabase
		.from("sub_products")
		.insert(subProducts.map((subProduct) => ({ ...subProduct, product_id: productId })))
		.throwOnError();
};

export const updateProduct = async (productId: number, product: ProductFormData): Promise<void> => {
	const supabase = await createClient();
	await supabase.from("products").update(product).eq("id", productId).throwOnError();
};
