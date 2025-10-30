"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { SubProductsInput } from "@/components/sub-products-input";
import SubmitButton from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type Tables } from "@/lib/supabase/enhanced.database.types";
import { type ActionResponse, createProduct } from "./actions";

const initialState: ActionResponse = {
	success: false,
	message: "",
};

export default function ProductCreateForm({ tags }: { tags: Tables<"tags">[] }) {
	const [state, formAction] = useActionState(createProduct, initialState);
	const [resetKey, setResetKey] = useState("");

	useEffect(() => {
		if (state.success) {
			toast.success(state.message);
			setResetKey(crypto.randomUUID());
		}

		if (state.errors) {
			toast.error(state.message);
		}
	}, [state.success, state.message, state.errors, setResetKey]);

	return (
		<div className="w-full">
			<form action={formAction} key={resetKey}>
				<FieldGroup>
					<FieldSet>
						<FieldLegend>Create a new product</FieldLegend>
						<FieldDescription>Fill in the details below to create a new product</FieldDescription>

						<FieldGroup>
							<Field>
								<FieldLabel>Name</FieldLabel>
								<FieldDescription>The name of your product</FieldDescription>
								<Input name="name" required placeholder="e.g. POPLAND Mokoko CLOSE TO SWEET" />
							</Field>

							<Field>
								<FieldLabel>Tags</FieldLabel>
								<FieldDescription>Select the tags that best describe your product</FieldDescription>
								<FieldGroup className="grid grid-cols-2 gap-3">
									{tags.map((tag) => {
										const id = tag.id.toString();
										return (
											<Field key={id} orientation="horizontal" className="items-center">
												<Checkbox name="tags" value={id} id={id} />
												<FieldLabel htmlFor={id} className="font-normal">
													{tag.name}
												</FieldLabel>
											</Field>
										);
									})}
								</FieldGroup>
							</Field>

							<Field>
								<FieldLabel>Gallery</FieldLabel>
								<FieldDescription>Upload images to your product</FieldDescription>
								<Input
									type="file"
									name="images"
									placeholder="e.g. image1.jpg"
									accept="image/*"
								/>
							</Field>

							<Field>
								<FieldLabel>Variants</FieldLabel>
								<FieldDescription>
									Add a name, click Add. Items appear as checkable labels (checked = available). Click the trash icon to
									remove an item.
								</FieldDescription>
								<SubProductsInput name="sub-products" />
							</Field>

							<Field orientation="horizontal" className="flex justify-end">
								<Button variant="secondary" type="button" asChild>
									<Link href="/products">Cancel</Link>
								</Button>
								<SubmitButton label="Create" loading="Creating..." />
							</Field>
						</FieldGroup>
					</FieldSet>
				</FieldGroup>
			</form>
		</div>
	);
}
