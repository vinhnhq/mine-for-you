export function toArray<T extends string | undefined>(input: T | T[] | undefined): T[] {
	if (input === undefined || input === null) return [] as T[];
	if (Array.isArray(input)) return input as T[];
	return [input] as T[];
}

export function capitalize(input: string): string {
	return input.charAt(0).toUpperCase() + input.slice(1);
}

export function slugify(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "") // Remove special characters
		.replace(/[\s_-]+/g, "-") // Replace spaces, underscores, and multiple hyphens with single hyphen
		.replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}
