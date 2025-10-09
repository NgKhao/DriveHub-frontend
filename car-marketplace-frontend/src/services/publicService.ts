import axios from 'axios';
import {
  mapBackendPublicGetPostsResponseToPaginated,
  mapBackendPublicSearchPostsResponseToSellerPosts,
} from '../types';
import type {
  BackendPublicGetPostsResponse,
  BackendPublicSearchPostsResponse,
  PaginatedResponse,
  SellerPost,
  PublicSearchParams,
} from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export class PublicService {
  /**
   * Get all public posts (không cần authentication)
   * @param page Page number (0-based)
   * @param size Number of items per page
   * @returns Promise<PaginatedResponse<SellerPost>>
   */
  async getAllPublicPosts(
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<SellerPost>> {
    try {
      const response = await axios.get<BackendPublicGetPostsResponse>(
        `${API_BASE_URL}/public/posts`,
        {
          params: {
            page,
            size,
          },
        }
      );

      // Transform backend response to frontend format
      return mapBackendPublicGetPostsResponseToPaginated(response.data.detail);
    } catch (error) {
      console.error('Error fetching public posts:', error);
      throw error;
    }
  }

  /**
   * Search public posts with filters (không cần authentication)
   * @param searchParams Search parameters object
   * @returns Promise<SellerPost[]>
   */
  async searchPublicPosts(
    searchParams: PublicSearchParams
  ): Promise<SellerPost[]> {
    try {
      // Remove empty/undefined values from params
      const cleanParams = Object.entries(searchParams).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, string | number>
      );

      const response = await axios.get<BackendPublicSearchPostsResponse>(
        `${API_BASE_URL}/public/posts/search`,
        {
          params: cleanParams,
        }
      );

      // Transform backend response to frontend format
      return mapBackendPublicSearchPostsResponseToSellerPosts(
        response.data.detail
      );
    } catch (error) {
      console.error('Error searching public posts:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const publicService = new PublicService();
