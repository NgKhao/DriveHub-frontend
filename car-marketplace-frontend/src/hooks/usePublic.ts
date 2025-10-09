import { useQuery } from '@tanstack/react-query';
import { publicService } from '../services/publicService';
import type { PaginatedResponse, SellerPost } from '../types';

/**
 * Hook để lấy tất cả public posts (không cần authentication)
 */
export const usePublicPosts = (page: number = 0, size: number = 10) => {
  return useQuery<PaginatedResponse<SellerPost>, Error>({
    queryKey: ['publicPosts', page, size],
    queryFn: () => publicService.getAllPublicPosts(page, size),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    refetchOnWindowFocus: false,
  });
};
