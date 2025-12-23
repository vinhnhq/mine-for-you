import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import ProductCreateForm from "./form";

export default async function AdminProductCreatePage() {
	const supabase = await createClient();
	const { data: tags } = await supabase.from("tags").select("*");

	return (
		<div className="max-w-2xl mx-auto p-4 my-32 min-h-screen">
			<Button asChild variant="ghost" size="sm" className={cn("mb-6")}>
				<Link href="/admin">
					<ArrowLeft className="size-4" />
					Back to Dashboard
				</Link>
			</Button>
			<ProductCreateForm tags={tags ?? []} />
		</div>
	);
}
