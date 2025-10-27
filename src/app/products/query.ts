import { cacheLife } from "next/cache";
import { productImageUrl } from "@/lib/constants";

const aDayInSeconds = 60 * 60 * 24;

export interface Category {
	id: number;
	label: string;
	value: string;
}

export const defaultCategories: { [key: string]: Category } = {
	labubu: { id: 1, label: "Labubu", value: "labubu" },
	poplandExclusive: { id: 2, label: "Popland Exclusive", value: "popland-exclusive" },
	blindbox: { id: 3, label: "Blindbox", value: "blindbox" },
	wholeset: { id: 4, label: "Wholeset", value: "wholeset" },
	happyFactor: { id: 5, label: "Happy Factor", value: "happy-factor" },
	surpriseShake: { id: 6, label: "Surprise Shake", value: "surprise-shake" },
	secretMysteriousGuest: { id: 7, label: "Secret Mysterious Guest", value: "secret-mysterious-guest" },
	newSeal: { id: 8, label: "Newseal", value: "new-seal" },
	thailandExclusive: { id: 9, label: "Thailand Exclusive", value: "thailand-exclusive" },
};

export const getCategories = async (): Promise<Category[]> => {
	"use cache";
	cacheLife({ stale: aDayInSeconds });

	return Object.values(defaultCategories);
};

export interface Product {
	id: number;
	name: string;
	image: string;
	categories: Category[];
	subCategories: string[];
}

export const getProducts = async (): Promise<Product[]> => {
	"use cache";
	cacheLife({ stale: aDayInSeconds });

	return [
		{
			id: 136,
			name: "POPLAND Mokoko CLOSE TO SWEET - Vinyl Plush Doll Pendant Keychain",
			image: `${productImageUrl}/136.jpeg`,
			categories: [defaultCategories.poplandExclusive, defaultCategories.labubu],
			subCategories: ["White Tag", "Pink Tag"],
		},
		{
			id: 138,
			name: "POPLAND Mokoko CLOSE TO SWEET - Vinyl Plush Doll",
			image: `${productImageUrl}/138.jpeg`,
			categories: [defaultCategories.poplandExclusive, defaultCategories.labubu],
			subCategories: ["White Tag"],
		},
		{
			id: 123,
			name: "Popmart Labubu Wacky Mart Series Vinyl Plush Hanging Card",
			image: `${productImageUrl}/123.jpeg`,
			categories: [],
			subCategories: [],
		},
		{
			id: 85,
			name: "Popmart Labubu Pin For Love Series-Vinyl Plush Pendant Blind Box (A-M)",
			image: `${productImageUrl}/85.jpeg`,
			categories: [defaultCategories.labubu],
			subCategories: ["Blindbox", "D", "E", "F", "G", "H", "K", "J", "M", "L", "?"],
		},
	];
};

export const getProduct = async (id: number): Promise<Product | undefined> => {
	"use cache";
	cacheLife({ stale: aDayInSeconds });

	return getProducts().then((products) => products.find((p) => p.id === id));
};
