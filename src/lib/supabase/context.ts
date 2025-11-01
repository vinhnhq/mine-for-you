import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { AsyncLocalStorage } from "async_hooks";
import { Database } from "@/lib/supabase/enhanced.database.types";
import { createClient } from "@/lib/supabase/server";

type Store = { [key: symbol]: SupabaseClient<Database> };

const key = Symbol("supabase-connection");
const storage = new AsyncLocalStorage<Store>();

export const withSupabaseContext = async <T>(callback: () => Promise<T>): Promise<T> => {
	try {
		const supabase = await createClient();
		return await storage.run({ [key]: supabase }, async () => await callback());
	} catch (error) {
		console.error(`Error creating supabase connection: ${error}`);
		throw error;
	} finally {
		storage.disable();
	}
};

export const getSupabase = (): SupabaseClient<Database> => {
	const store = storage.getStore();
	if (!store) {
		throw new Error("Supabase connection not found");
	}
	return store[key];
};
