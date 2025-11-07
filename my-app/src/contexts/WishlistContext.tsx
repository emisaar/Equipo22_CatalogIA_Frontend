import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { WishlistWithProduct } from '../types';
import { wishlistService } from '../services';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlistItems: WishlistWithProduct[];
  loading: boolean;
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistWithProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const data = await wishlistService.getWishlist();
      setWishlistItems(data.items);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Load wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [isAuthenticated, refreshWishlist]);

  const addToWishlist = async (productId: number) => {
    try {
      await wishlistService.addToWishlist({ product_id: productId });
      await refreshWishlist();
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      throw error;
    }
  };

  const removeFromWishlist = async (productId: number) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      await refreshWishlist();
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      throw error;
    }
  };

  const isInWishlist = (productId: number): boolean => {
    return wishlistItems.some((item) => item.product_id === productId);
  };

  const value: WishlistContextType = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
