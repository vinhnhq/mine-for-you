import { cacheLife } from "next/cache";

const aDayInSeconds = 60 * 60 * 24;

export const defaultCategories = [
	{ value: "electronics", label: "Electronics" },
	{ value: "clothing", label: "Clothing" },
	{ value: "books", label: "Books" },
	{ value: "home", label: "Home" },
	{ value: "garden", label: "Garden" },
	{ value: "sports", label: "Sports" },
	{ value: "beauty", label: "Beauty" },
];

export const getCategories = async () => {
	"use cache";
	cacheLife({ stale: aDayInSeconds });

	return [
		{ value: "electronics", label: "Electronics" },
		{ value: "clothing", label: "Clothing" },
		{ value: "books", label: "Books" },
		{ value: "home", label: "Home" },
		{ value: "garden", label: "Garden" },
		{ value: "sports", label: "Sports" },
		{ value: "beauty", label: "Beauty" },
		{ value: "food", label: "Food" },
		{ value: "beverage", label: "Beverage" },
	];
};

export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	image: string;
	category: string[];
	inStock: boolean;
}

export const getProducts = async (): Promise<Product[]> => {
	"use cache";
	cacheLife({ stale: aDayInSeconds });

	return [
		{
			id: "1",
			name: "Premium Wireless Headphones",
			description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
			price: 299.99,
			image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
			category: ["electronics"],
			inStock: true,
		},
		{
			id: "2",
			name: "Smart Fitness Watch",
			description: "Advanced fitness tracking with heart rate monitoring, GPS, and water resistance.",
			price: 199.99,
			image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
			category: ["electronics"],
			inStock: true,
		},
		{
			id: "3",
			name: "Organic Coffee Beans",
			description: "Premium organic coffee beans from sustainable farms. Rich, bold flavor with notes of chocolate.",
			price: 24.99,
			image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
			category: ["food", "beverage"],
			inStock: true,
		},
		{
			id: "4",
			name: "Minimalist Backpack",
			description: "Sleek, durable backpack perfect for daily commute or weekend adventures.",
			price: 89.99,
			image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
			category: ["fashion"],
			inStock: false,
		},
		{
			id: "5",
			name: "Yoga Mat Pro",
			description: "Non-slip yoga mat with extra cushioning for maximum comfort during practice.",
			price: 49.99,
			image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
			category: ["sports"],
			inStock: true,
		},
		{
			id: "6",
			name: "Artisan Ceramic Mug",
			description: "Handcrafted ceramic mug with unique glaze patterns. Perfect for your morning coffee.",
			price: 18.99,
			image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
			category: ["home", "garden"],
			inStock: true,
		},
	];
};
