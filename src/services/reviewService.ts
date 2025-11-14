import api from './api';
import {
  mapFrontendCreateReviewToBackend,
  mapBackendCreateReviewResponseToReview,
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
   * @param reviewData Review data to create
   * @returns Promise<Review>
   */
  createReview: async (reviewData: CreateReviewData): Promise<Review> => {
    try {
      const backendRequest = mapFrontendCreateReviewToBackend(reviewData);

      const response = await api.post<BackendCreateReviewResponse>(
        '/reviews',
        backendRequest
      );

      // Transform backend response to frontend format
      return mapBackendCreateReviewResponseToReview(response.data.detail);
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  /**
   * Get all reviews for a seller with pagination
   * @param sellerId Seller ID to get reviews for
   * @param page Page number (0-based)
   * @param size Number of items per page
   * @returns Promise<ReviewSummary>
   */
  getSellerReviews: async (
    sellerId: string,
    page: number = 0,
    size: number = 10
  ): Promise<ReviewSummary> => {
    try {
      const response = await api.get<BackendGetSellerReviewsResponse>(
        `/reviews/seller/${sellerId}`,
        {
          params: {
            page,
            size,
          },
        }
      );

      // Transform backend response to frontend format
      return mapBackendGetSellerReviewsResponseToReviewSummary(
        response.data.detail,
        sellerId
      );
    } catch (error) {
      console.error('Error fetching seller reviews:', error);
      throw error;
    }
  },

  /**
   * Get all reviews for a seller (without pagination) - for full data
   * @param sellerId Seller ID to get reviews for
   * @returns Promise<ReviewSummary>
   */
  getAllSellerReviews: async (sellerId: string): Promise<ReviewSummary> => {
    try {
      // Get first page to know total count
      const firstPage = await reviewService.getSellerReviews(sellerId, 0, 10);

      if (firstPage.totalReviews <= 10) {
        return firstPage;
      }

      // If there are more than 10 reviews, get all of them
      const allReviews = await reviewService.getSellerReviews(
        sellerId,
        0,
        firstPage.totalReviews
      );

      return allReviews;
    } catch (error) {
      console.error('Error fetching all seller reviews:', error);
      throw error;
    }
  },
};
