"use client";

import { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export default function SubmitButton({ label, loading }: { label: string; loading: ReactNode }) {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" disabled={pending}>
			{pending ? loading : label}
		</Button>
	);
}
