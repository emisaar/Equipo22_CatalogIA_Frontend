// Wishlist Types based on backend API schemas

import { ProductResponse } from './product.types';

export interface WishlistCreate {
  product_id: number;
}

export interface WishlistResponse {
  id: number;
  user_id: number;
  product_id: number;
  added_at: string;
}

export interface WishlistWithProduct extends WishlistResponse {
  product: ProductResponse;
}

export interface WishlistList {
  items: WishlistWithProduct[];
  total: number;
}
