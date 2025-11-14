import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Favorite } from '../types';

interface FavoriteState {
  favorites: Favorite[];
  isLoading: boolean;
  error: string | null;
  addToFavorites: (carId: string) => Promise<void>;
  removeFromFavorites: (carId: string) => Promise<void>;
  getFavorites: () => Promise<void>;
  isFavorite: (carId: string) => boolean;
  clearError: () => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      isLoading: false,
      error: null,

      addToFavorites: async (carId: string) => {
        try {
          set({ isLoading: true, error: null });

          // TODO: Replace with actual API call
          const newFavorite: Favorite = {
            id: Math.random().toString(36).substr(2, 9),
            userId: 'current-user-id', // Get from auth store
            carId,
            createdAt: new Date().toISOString(),
          };

          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          set((state) => ({
            favorites: [...state.favorites, newFavorite],
            isLoading: false,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : 'Lỗi khi thêm vào yêu thích',
          });
        }
      },

      removeFromFavorites: async (carId: string) => {
        try {
          set({ isLoading: true, error: null });

          // TODO: Replace with actual API call
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          set((state) => ({
            favorites: state.favorites.filter((fav) => fav.carId !== carId),
            isLoading: false,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : 'Lỗi khi xóa khỏi yêu thích',
          });
        }
      },

      getFavorites: async () => {
        try {
          set({ isLoading: true, error: null });

          // TODO: Replace with actual API call
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Mock data - replace with real API response
          const mockFavorites: Favorite[] = [];

          set({ favorites: mockFavorites, isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : 'Lỗi khi tải danh sách yêu thích',
          });
        }
      },

      isFavorite: (carId: string) => {
        const { favorites } = get();
        return favorites.some((fav) => fav.carId === carId);
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'favorite-storage',
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
);
