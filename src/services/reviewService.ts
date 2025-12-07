import api from './api';
import {
  mapFrontendCreateReviewToBackend,
  mapBackendReviewItemToReview,
  mapBackendGetSellerReviewsResponseToReviewSummary,
} from '../types';
import type {
  BackendCreateReviewResponse,
  BackendGetSellerReviewsResponse,
  CreateReviewData,
  Review,
  ReviewSummary,
} from '../types';

export const reviewService = {
  /**
   * Create a new review for a seller
   * @param sellerId Seller ID to create review for
   * @param reviewData Review data to create
   * @returns Promise<Review>
   */
  createReview: async (sellerId: string, reviewData: CreateReviewData): Promise<Review> => {
    try {
      const backendRequest = mapFrontendCreateReviewToBackend(reviewData);

      const response = await api.post<BackendCreateReviewResponse>(
        `/sellers/${sellerId}/reviews`,
        backendRequest
      );

      // Transform backend response to frontend format
      return mapBackendReviewItemToReview(response.data.detail);
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  /**
   * Get all reviews for a seller with pagination
   * @param sellerId Seller ID to get reviews for
   * @param page Page number (1-based, default 1)
   * @returns Promise<ReviewSummary>
   */
  getSellerReviews: async (
    sellerId: string,
    page: number = 1
  ): Promise<ReviewSummary> => {
    try {
      const response = await api.get<BackendGetSellerReviewsResponse>(
        `/sellers/${sellerId}/reviews`,
        {
          params: {
            page,
          },
        }
      );

      // Transform backend response to frontend format
      return mapBackendGetSellerReviewsResponseToReviewSummary(response.data);
    } catch (error) {
      console.error('Error fetching seller reviews:', error);
      throw error;
    }
  },


};
