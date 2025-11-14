import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Rating, SellerRating } from '../types';

interface RatingState {
  ratings: Rating[];
  sellerRatings: Map<string, SellerRating>;

  // Actions
  rateSeller: (
    sellerId: string,
    rating: number,
    review?: string
  ) => Promise<void>;
  updateRating: (
    ratingId: string,
    rating: number,
    review?: string
  ) => Promise<void>;
  deleteRating: (ratingId: string) => Promise<void>;
  getSellerRating: (sellerId: string) => SellerRating | null;
  getUserRatingForSeller: (sellerId: string, userId: string) => Rating | null;
  fetchSellerRatings: (sellerId: string) => Promise<void>;
}

export const useRatingStore = create<RatingState>()(
  persist(
    (set, get) => ({
      ratings: [],
      sellerRatings: new Map(),

      rateSeller: async (sellerId: string, rating: number, review?: string) => {
        try {
          // TODO: Replace with actual API call
          const newRating: Rating = {
            id: Math.random().toString(36).substr(2, 9),
            userId: 'current-user-id', // This would come from auth store
            sellerId,
            rating,
            review,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            ratings: [...state.ratings, newRating],
          }));

          // Update seller rating aggregate
          await get().fetchSellerRatings(sellerId);
        } catch (error) {
          console.error('Failed to rate seller:', error);
          throw error;
        }
      },

      updateRating: async (
        ratingId: string,
        rating: number,
        review?: string
      ) => {
        try {
          // TODO: Replace with actual API call
          set((state) => ({
            ratings: state.ratings.map((r) =>
              r.id === ratingId
                ? {
                    ...r,
                    rating,
                    review,
                    updatedAt: new Date().toISOString(),
                  }
                : r
            ),
          }));
        } catch (error) {
          console.error('Failed to update rating:', error);
          throw error;
        }
      },

      deleteRating: async (ratingId: string) => {
        try {
          // TODO: Replace with actual API call
          set((state) => ({
            ratings: state.ratings.filter((r) => r.id !== ratingId),
          }));
        } catch (error) {
          console.error('Failed to delete rating:', error);
          throw error;
        }
      },

      getSellerRating: (sellerId: string) => {
        const { sellerRatings } = get();
        return sellerRatings.get(sellerId) || null;
      },

      getUserRatingForSeller: (sellerId: string, userId: string) => {
        const { ratings } = get();
        return (
          ratings.find((r) => r.sellerId === sellerId && r.userId === userId) ||
          null
        );
      },

      fetchSellerRatings: async (sellerId: string) => {
        try {
          // TODO: Replace with actual API call
          const { ratings } = get();
          const sellerRatings = ratings.filter((r) => r.sellerId === sellerId);

          if (sellerRatings.length > 0) {
            const averageRating =
              sellerRatings.reduce((sum, r) => sum + r.rating, 0) /
              sellerRatings.length;

            const sellerRating: SellerRating = {
              sellerId,
              averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
              totalRatings: sellerRatings.length,
              ratings: sellerRatings,
            };

            set((state) => ({
              sellerRatings: new Map(
                state.sellerRatings.set(sellerId, sellerRating)
              ),
            }));
          }
        } catch (error) {
          console.error('Failed to fetch seller ratings:', error);
          throw error;
        }
      },
    }),
    {
      name: 'rating-store',
      // Don't persist the Map, convert to/from object
      partialize: (state) => ({
        ratings: state.ratings,
        sellerRatings: Object.fromEntries(state.sellerRatings),
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as {
          ratings: Rating[];
          sellerRatings: Record<string, SellerRating>;
        };

        return {
          ...currentState,
          ratings: persisted.ratings || [],
          sellerRatings: new Map(Object.entries(persisted.sellerRatings || {})),
        };
      },
    }
  )
);
