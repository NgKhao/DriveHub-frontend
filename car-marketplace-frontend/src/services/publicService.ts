import axios from 'axios';
import { mapBackendPublicGetPostsResponseToPaginated } from '../types';
import type {
  BackendPublicGetPostsResponse,
  PaginatedResponse,
  SellerPost,
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
}

// Export singleton instance
export const publicService = new PublicService();
