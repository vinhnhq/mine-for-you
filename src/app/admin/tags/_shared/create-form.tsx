"use client";

import { PlusIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type ActionResponse, createTag } from "./actions";

const initialState: ActionResponse = {
	success: false,
	message: "",
};

export default function TagCreateForm() {
	const [state, formAction] = useActionState(createTag, initialState);
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
		<div className="relative">
			<form action={formAction} key={resetKey} className="flex gap-2">
				<Input
					name="name"
					required
					placeholder="Tag name..."
					aria-invalid={state.errors?.name ? true : undefined}
					className="flex-1"
				/>
				<Button type="submit" size="icon" aria-label="Create tag">
					<PlusIcon className="size-4" />
				</Button>
			</form>
			{state.errors?.name && <p className="mt-1 text-sm text-destructive">{state.errors.name[0]}</p>}
		</div>
	);
}
