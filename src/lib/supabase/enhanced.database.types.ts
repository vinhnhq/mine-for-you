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
