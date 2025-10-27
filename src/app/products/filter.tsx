import Link from "next/link";
import { defaultCategories, getCategories } from "@/app/products/query";
import FilterBadge from "@/components/filter-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toArray } from "@/lib/shared";
import { AutoSubmitField, AutoSubmitForm } from "./auto-submit-form";
import { Category } from "./query";

export default async function ProductsFilter({ category }: { category: Promise<string | string[] | undefined> }) {
	const allCategories = await getCategories();
	const selectedCategories = toArray(await category);

	return (
		<AutoSubmitForm action={"/products"}>
			<div className="flex flex-wrap gap-2">
				<MultiSelect name="category" options={allCategories} selectedValues={selectedCategories} />

				{selectedCategories.length > 0 && (
					<FilterBadge className="text-destructive border-destructive hover:text-destructive-foreground">
						<Link href="/products" className="focus-visible:outline-none">
							Reset Filters
						</Link>
					</FilterBadge>
				)}
			</div>
		</AutoSubmitForm>
	);
}

type MultiSelectProps = {
	name: string;
	options: { value: string; label: string }[];
	selectedValues?: string[];
};

function MultiSelect({ name, options, selectedValues = [] }: MultiSelectProps) {
	return options.map((option) => {
		const isSelected = selectedValues.includes(option.value);

		return (
			<AutoSubmitField key={option.value} triggerPropName="onChange">
				<FilterBadge asChild variant={isSelected ? "default" : "outline"}>
					<Label htmlFor={`${name}-${option.value}`}>
						<Input
							type="checkbox"
							id={`${name}-${option.value}`}
							name={name}
							value={option.value}
							className="sr-only hidden"
							checked={isSelected}
							readOnly
						/>
						{option.label}
					</Label>
				</FilterBadge>
			</AutoSubmitField>
		);
	});
}

export function ProductsFilterSkeleton() {
	return (
		<div className="flex flex-wrap gap-2 animate-pulse">
			{Object.values(defaultCategories).map((category: Category) => (
				<FilterBadge
					key={category.value}
					variant="outline"
					className="cursor-not-allowed pointer-events-none bg-accent border-none"
				>
					<span className="invisible">{category.label}</span>
				</FilterBadge>
			))}
		</div>
	);
}
