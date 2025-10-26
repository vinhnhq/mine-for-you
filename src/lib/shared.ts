export function toArray<T extends string | undefined>(input: T | T[] | undefined): T[] {
	if (input === undefined || input === null) return [] as T[];
	if (Array.isArray(input)) return input as T[];
	return [input] as T[];
}

export function capitalize(input: string): string {
	return input.charAt(0).toUpperCase() + input.slice(1);
}
