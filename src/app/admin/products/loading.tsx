import { Spinner } from "@/components/ui/spinner";

export default function AdminProductsLoading() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-center items-center h-screen">
				<Spinner className="size-6" />
			</div>
		</div>
	);
}
