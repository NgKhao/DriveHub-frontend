import api from './api';
import type {
  BackendAddFavoriteResponse,
  BackendRemoveFavoriteResponse,
  BackendGetFavoritesResponse,
  FavoriteItem,
  SellerPost,
} from '../types';
import {
  mapBackendAddFavoriteResponseToFavoriteItem,
  mapBackendGetFavoritesResponseToSellerPosts,
} from '../types';

export const favoriteService = {
  /**
   * Add post to favorites
   * @param postId Post ID to add to favorites
   * @returns Promise<FavoriteItem>
   */
  addToFavorites: async (postId: string): Promise<FavoriteItem> => {
    try {
      const response = await api.post<BackendAddFavoriteResponse>(
        `/favorites/add/${postId}`
      );

      // Transform backend response to frontend format
      return mapBackendAddFavoriteResponseToFavoriteItem(response.data.detail);
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  },

  /**
   * Remove post from favorites
   * @param postId Post ID to remove from favorites
   * @returns Promise<void>
   */
  removeFromFavorites: async (postId: string): Promise<void> => {
    try {
      await api.delete<BackendRemoveFavoriteResponse>(
        `/favorites/remove/${postId}`
      );
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  },

  /**
   * Get all user's favorite posts (GET /favorites)
   * @returns Promise<SellerPost[]>
   */
  getFavorites: async (): Promise<SellerPost[]> => {
    try {
      const response = await api.get<BackendGetFavoritesResponse>('/favorites');

      // Transform backend response to frontend format
      return mapBackendGetFavoritesResponseToSellerPosts(response.data.detail);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  },

  /**
   * Check if post is in favorites
   * @param postId Post ID to check
   * @returns Promise<boolean>
   */
  isFavorite: async (postId: string): Promise<boolean> => {
    try {
      const favorites = await favoriteService.getFavorites();
      return favorites.some((post) => post.id === postId);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  },
};
