import { createClient } from "@/lib/supabase/server";
import ProductCreateForm from "./form";

export default async function ProductCreatePage() {
	const supabase = await createClient();
	const { data: tags } = await supabase.from("tags").select("*");

	return (
		<div className="max-w-2xl mx-auto p-4 my-32 min-h-screen">
			<ProductCreateForm tags={tags ?? []} />
		</div>
	);
}
