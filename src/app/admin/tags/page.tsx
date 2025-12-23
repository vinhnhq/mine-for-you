import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getTagsWithProducts } from "./_shared/actions";
import TagCreateForm from "./_shared/create-form";
import TagsTable from "./_shared/table";

async function AdminTagsPage() {
	const tags = await getTagsWithProducts();

	return (
		<div className="py-8 space-y-8">
			<Button asChild variant="ghost" size="sm">
				<Link href="/admin">
					<ArrowLeft className="size-4" />
					Back to Dashboard
				</Link>
			</Button>
			<div className="max-w-md">
				<TagCreateForm />
			</div>
			<TagsTable tags={tags} />
		</div>
	);
}

export default function AdminTagsPageContainer() {
	return (
		<div className="container mx-auto px-4 flex justify-center items-center">
			<Suspense fallback={<Spinner />}>
				<AdminTagsPage />
			</Suspense>
		</div>
	);
}
