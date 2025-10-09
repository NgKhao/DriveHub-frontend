import { useQuery } from '@tanstack/react-query';
import { publicService } from '../services/publicService';
import type {
  PaginatedResponse,
  SellerPost,
  PublicSearchParams,
} from '../types';

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

/**
 * Hook để search public posts với filters (không cần authentication)
 */
export const usePublicPostsSearch = (
  searchParams: PublicSearchParams,
  enabled: boolean = true
) => {
  return useQuery<SellerPost[], Error>({
    queryKey: ['publicPostsSearch', searchParams],
    queryFn: () => publicService.searchPublicPosts(searchParams),
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for search results)
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: enabled && Object.keys(searchParams).length > 0, // Only run if there are search params
  });
};

/**
 * Hook để lấy chi tiết public post (không cần authentication)
 */
export const usePublicPostDetail = (
  postId: string,
  enabled: boolean = true
) => {
  return useQuery<SellerPost, Error>({
    queryKey: ['publicPostDetail', postId],
    queryFn: () => publicService.getPublicPostDetail(postId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    refetchOnWindowFocus: false,
    enabled: !!postId && enabled, // Only run if postId is provided and explicitly enabled
  });
};
