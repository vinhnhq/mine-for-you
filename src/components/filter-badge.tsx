import { VariantProps } from "class-variance-authority";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type FilterBadgeProps = {
	children: React.ReactNode;
	className?: string;
	variant?: VariantProps<typeof badgeVariants>["variant"];
	asChild?: boolean;
};

export default function FilterBadge({ children, className, variant, asChild }: FilterBadgeProps) {
	return (
		<Badge
			asChild={asChild}
			variant={variant || "outline"}
			className={cn(
				"h-6 font-mono tabular-nums cursor-pointer border-black",
				"transition-all duration-200 ease-in-out hover:scale-105 active:scale-95",
				className,
			)}
		>
			{children}
		</Badge>
	);
}

export function TagBadge({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<Badge variant="default" className={cn("h-6 bg-muted/80 text-primary", className)}>
			{children}
		</Badge>
	);
}
