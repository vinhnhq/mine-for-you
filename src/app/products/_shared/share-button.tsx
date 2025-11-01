"use client";

import { Share2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
	id: number;
}

export default function ShareButton({ id }: ShareButtonProps) {
	const [isCopied, setIsCopied] = useState(false);
	const [isPending, startTransition] = useTransition();

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(`${window.location.origin}/products/${id}`);

			startTransition(() => {
				setIsCopied(true);
				toast.success("Link copied to clipboard", {
					duration: 2000,
				});

				setTimeout(() => {
					setIsCopied(false);
				}, 2000);
			});
		} catch (error) {
			toast.error("Failed to copy link");
		}
	};

	return (
		<Button
			variant="secondary"
			size="sm"
			disabled={isPending}
			className={cn(
				"text-sm font-medium",
				"focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
				"hover:scale-105 pointer-events-auto",
				"transition-all duration-200 ease-in-out cursor-pointer",
			)}
			onClick={handleCopy}
		>
			<Share2 className="size-4" />
		</Button>
	);
}
