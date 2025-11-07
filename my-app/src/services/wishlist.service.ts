import apiClient from './api.client';
import { WishlistCreate, WishlistResponse, WishlistList } from '../types';

export const wishlistService = {
  // Get user's wishlist
  getWishlist: async (): Promise<WishlistList> => {
    const response = await apiClient.get<WishlistList>('/api/v1/wishlist/');
    return response.data;
  },

  // Add product to wishlist
  addToWishlist: async (data: WishlistCreate): Promise<WishlistResponse> => {
    const response = await apiClient.post<WishlistResponse>('/api/v1/wishlist/', data);
    return response.data;
  },

  // Remove product from wishlist
  removeFromWishlist: async (productId: number): Promise<void> => {
    await apiClient.delete(`/api/v1/wishlist/${productId}`);
  },

  // Check if product is in wishlist
  checkInWishlist: async (productId: number): Promise<boolean> => {
    const response = await apiClient.get(`/api/v1/wishlist/check/${productId}`);
    return response.data.in_wishlist || false;
  },
};
