"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type SubProductItem = {
	id: string;
	name: string;
	available: boolean;
};

export function SubProductsInput({ name }: { name: string }) {
	const [subProductInput, setSubProductInput] = useState("");
	const [subProducts, setSubProducts] = useState<SubProductItem[]>([]);

	const serializedSubProducts = useMemo(() => {
		return JSON.stringify(
			subProducts
				.filter((sp) => sp.name.trim().length > 0)
				.map((sp) => ({ name: sp.name.trim(), available: !!sp.available })),
		);
	}, [subProducts]);

	function addSubProduct() {
		const value = subProductInput.trim();
		if (!value) return;
		setSubProducts((prev) => [{ id: crypto.randomUUID(), name: value, available: true }, ...prev]);
		setSubProductInput("");
	}

	function removeSubProduct(id: string) {
		setSubProducts((prev) => prev.filter((sp) => sp.id !== id));
	}

	function toggleAvailable(id: string, checked: boolean) {
		setSubProducts((prev) => prev.map((sp) => (sp.id === id ? { ...sp, available: checked } : sp)));
	}

	return (
		<FieldGroup className="gap-3">
			<div className="flex items-center gap-2">
				<Input
					value={subProductInput}
					onChange={(e) => setSubProductInput(e.target.value)}
					placeholder="e.g. Variant A"
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							addSubProduct();
						}
					}}
				/>
				<Button type="button" variant="secondary" size="icon" onClick={addSubProduct}>
					<Plus className="w-4 h-4" />
				</Button>
			</div>

			<div className="grid grid-cols-2 gap-3">
				{subProducts.map((sp) => (
					<Field key={sp.id} orientation="horizontal">
						<Checkbox
							checked={sp.available}
							onCheckedChange={(checked) => toggleAvailable(sp.id, Boolean(checked))}
							id={sp.id}
						/>
						<FieldLabel htmlFor={sp.id} className="font-normal">
							{sp.name}
						</FieldLabel>
						<Button type="button" variant="secondary" size="icon" onClick={() => removeSubProduct(sp.id)}>
							<Trash2 className="w-4 h-4" />
						</Button>
					</Field>
				))}
			</div>

			{/* Hidden JSON field carrying subProducts */}
			<input type="hidden" name={name} value={serializedSubProducts} />
		</FieldGroup>
	);
}
