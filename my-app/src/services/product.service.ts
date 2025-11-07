import apiClient from './api.client';
import { ProductResponse, ProductList, SemanticSearchResult } from '../types';

export const productService = {
  // List products with optional filters
  listProducts: async (params?: {
    skip?: number;
    limit?: number;
    category?: string;
    min_price?: number;
    max_price?: number;
  }): Promise<ProductList> => {
    const response = await apiClient.get<ProductList>('/api/v1/products/', { params });
    return response.data;
  },

  // Get a single product by ID
  getProduct: async (productId: number): Promise<ProductResponse> => {
    const response = await apiClient.get<ProductResponse>(`/api/v1/products/${productId}`);
    return response.data;
  },

  // Semantic search products (AI-powered)
  semanticSearch: async (params: {
    q: string;
    limit?: number;
    category?: string;
    min_price?: number;
    max_price?: number;
    min_similarity?: number;
  }): Promise<SemanticSearchResult> => {
    const response = await apiClient.get<SemanticSearchResult>(
      '/api/v1/products/search/semantic',
      { params }
    );
    return response.data;
  },
};
