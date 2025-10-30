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

export const getProducts = async (): Promise<[EnhancedProduct[], Tables<"tags">[]]> => {
	const supabase = await createClient();

	const tags = await getTags();
	const products = await supabase
		.from("products")
		.select("*, product_images(*), product_tags(*), sub_products(*)")
		.order("created_at", { ascending: false })
		.then(({ data }) => data ?? []);

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
