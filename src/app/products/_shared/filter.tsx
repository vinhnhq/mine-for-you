import Link from "next/link";
import FilterBadge from "@/components/filter-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultTags, getTags } from "@/lib/dal/product";
import { toArray } from "@/lib/shared";
import { AutoSubmitField, AutoSubmitForm } from "./auto-submit-form";

type ProductsFilterProps = {
	selectedTagSlugs: Promise<string | string[] | undefined>;
};

export default async function ProductsFilter({ selectedTagSlugs }: ProductsFilterProps) {
	const tags = await getTags();
	const selectedTags = toArray(await selectedTagSlugs);

	const options = tags.map((tag) => ({
		value: tag.slug,
		label: tag.name,
	}));

	return (
		<AutoSubmitForm action={"/products"}>
			<div className="flex flex-wrap gap-2">
				<MultiSelect name="tags" options={options} selectedValues={selectedTags} />

				{selectedTags.length > 0 && (
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
			{Object.values(defaultTags).map((tag) => (
				<FilterBadge
					key={tag.slug}
					variant="outline"
					className="cursor-not-allowed pointer-events-none bg-accent border-none"
				>
					<span className="invisible">{tag.name}</span>
				</FilterBadge>
			))}
		</div>
	);
}
