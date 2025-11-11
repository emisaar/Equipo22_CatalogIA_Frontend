// Product Types based on backend API schemas

export interface ProductCreate {
  ean: string;
  title: string;
  brand?: string;
  product_description?: string;
  category: string;
  price: number | string;
  color?: string;
  discount?: number | string;
  rating?: number | string;
  stock: number;
  sponsored?: boolean;
  image_url?: string;
}

export interface ProductResponse {
  id: number;
  ean: string;
  title: string;
  brand?: string;
  product_description?: string;
  category: string;
  price: string;
  color?: string;
  discount: string;
  rating: string;
  stock: number;
  sponsored: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductUpdate {
  ean?: string;
  title?: string;
  brand?: string;
  product_description?: string;
  category?: string;
  price?: number | string;
  color?: string;
  discount?: number | string;
  rating?: number | string;
  stock?: number;
  sponsored?: boolean;
  image_url?: string;
}

export interface ProductWithScore extends ProductResponse {
  similarity_score: number;
}

export interface ProductList {
  products: ProductResponse[];
  total: number;
  skip: number;
  limit: number;
}

export interface SemanticSearchResult {
  products: ProductWithScore[];
  total: number;
  skip: number;
  limit: number;
  min_similarity?: number;
}

export interface RecommendationResult {
  products: ProductWithScore[];
  total: number;
  limit: number;
  strategy: string;
  wishlist_size: number;
  min_similarity?: number;
}
