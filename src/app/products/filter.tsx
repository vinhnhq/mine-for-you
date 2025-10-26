import { defaultCategories, getCategories } from "@/app/products/query";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toArray } from "@/lib/shared";
import { cn } from "@/lib/utils";
import { AutoSubmitField, AutoSubmitForm } from "./auto-submit-form";

export default async function ProductsFilter({ category }: { category: Promise<string | string[] | undefined> }) {
	const allCategories = await getCategories();
	const selectedCategories = toArray(await category);

	return (
		<AutoSubmitForm action={"/products"}>
			<MultiSelect name="category" options={allCategories} selectedValues={selectedCategories} />
		</AutoSubmitForm>
	);
}

type MultiSelectProps = {
	name: string;
	options: { value: string; label: string }[];
	selectedValues?: string[];
};

function MultiSelect({ name, options, selectedValues = [] }: MultiSelectProps) {
	return (
		<div className="flex flex-wrap gap-2">
			{options.map((option) => {
				const isSelected = selectedValues.includes(option.value);

				return (
					<AutoSubmitField key={option.value} triggerPropName="onChange">
						<Badge
							asChild
							variant={isSelected ? "default" : "outline"}
							className={cn(
								"h-6 font-mono tabular-nums",
								"cursor-pointer transition-all duration-200 ease-in-out",
								"hover:scale-105 active:scale-95",
							)}
						>
							<Label htmlFor={`${name}-${option.value}`}>
								<Input
									type="checkbox"
									id={`${name}-${option.value}`}
									name={name}
									value={option.value}
									className="sr-only"
									checked={isSelected}
									readOnly
								/>
								{option.label}
							</Label>
						</Badge>
					</AutoSubmitField>
				);
			})}
		</div>
	);
}

export function ProductsFilterSkeleton() {
	return (
		<div className="flex flex-wrap gap-2">
			{defaultCategories.map((category) => (
				<Badge
					key={category.value}
					variant="outline"
					className={cn("h-6 font-mono tabular-nums cursor-not-allowed pointer-events-none bg-muted", "animate-pulse")}
				>
					<Label className="invisible">{category.label}</Label>
				</Badge>
			))}
		</div>
	);
}
