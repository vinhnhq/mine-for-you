import { sampleProducts } from "./data";

export interface FilterParams {
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
}

export function filterProducts(params: FilterParams) {
  let filtered = [...sampleProducts];

  // Category filter
  if (params.categories && params.categories.length > 0) {
    filtered = filtered.filter(product =>
      params.categories!.includes(product.category)
    );
  }

  // Price range filter
  if (params.minPrice !== undefined) {
    filtered = filtered.filter(product => product.price >= params.minPrice!);
  }
  if (params.maxPrice !== undefined) {
    filtered = filtered.filter(product => product.price <= params.maxPrice!);
  }

  // Stock filter
  if (params.inStock !== undefined) {
    filtered = filtered.filter(product => product.inStock === params.inStock);
  }

  // Search filter
  if (params.search && params.search.trim()) {
    const searchTerm = params.search.toLowerCase();
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }

  return filtered;
}

export function getFilterOptions() {
  const categories = Array.from(new Set(sampleProducts.map(p => p.category)));
  const maxPrice = Math.max(...sampleProducts.map(p => p.price));

  return {
    categories,
    maxPrice,
  };
}
