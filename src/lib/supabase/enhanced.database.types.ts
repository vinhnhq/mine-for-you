import { MergeDeep } from "type-fest";
import { Database as DatabaseGenerated, Json } from "./database.types";

export type { Json };

export type Database = MergeDeep<
	DatabaseGenerated,
	{
		public: {
			Views: {
				[_ in never]: never;
			};
		};
	}
>;

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];

export type EnhancedProduct = Tables<"products"> & {
	product_images: Tables<"product_images">[];
	product_tags: Tables<"product_tags">[];
	sub_products: Tables<"sub_products">[];
};
