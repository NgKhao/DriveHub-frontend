import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sellerService } from '../services/sellerService';
import type { CreatePostData, SellerPost } from '../types';
import type { CreatePostResult } from '../services/sellerService';

interface SellerError {
  response?: { status: number };
  message?: string;
}

// Helper function to get user-friendly error message
const getErrorMessage = (error: SellerError): string => {
  if (error.response?.status === 403) {
    return 'Không có quyền truy cập';
  } else if (error.response?.status === 404) {
    return 'Không tìm thấy dữ liệu';
  } else if (error.response?.status === 400) {
    return 'Dữ liệu không hợp lệ';
  } else if (error.message?.includes('Network')) {
    return 'Không thể kết nối đến server';
  } else {
    return 'Có lỗi xảy ra. Vui lòng thử lại.';
  }
};

// Hook for creating post
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<CreatePostResult, SellerError, CreatePostData>({
    mutationFn: (postData: CreatePostData) => {
      return sellerService.createPost(postData);
    },
    onSuccess: () => {
      // Invalidate and refetch seller posts query
      queryClient.invalidateQueries({ queryKey: ['seller', 'posts'] });
    },
    onError: (error: SellerError) => {
      console.error('Create post error:', error);
    },
  });
};

// Hook for fetching seller's posts
export const useSellerPosts = () => {
  return useQuery<SellerPost[], SellerError>({
    queryKey: ['seller', 'posts'],
    queryFn: () => sellerService.getMyPosts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook for fetching single post detail
export const useSellerPostDetail = (postId: string) => {
  return useQuery<SellerPost, SellerError>({
    queryKey: ['seller', 'posts', postId],
    queryFn: () => sellerService.getPostById(postId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: !!postId, // Only run query if postId is provided
  });
};

// Hook for updating post
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SellerPost,
    SellerError,
    { postId: string; postData: Partial<CreatePostData> }
  >({
    mutationFn: ({ postId, postData }) => {
      return sellerService.updatePost(postId, postData);
    },
    onSuccess: () => {
      // Invalidate and refetch seller posts query
      queryClient.invalidateQueries({ queryKey: ['seller', 'posts'] });
    },
    onError: (error: SellerError) => {
      console.error('Update post error:', error);
    },
  });
};

// Hook for deleting post
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation<void, SellerError, string>({
    mutationFn: (postId: string) => {
      return sellerService.deletePost(postId);
    },
    onSuccess: () => {
      // Invalidate and refetch seller posts query
      queryClient.invalidateQueries({ queryKey: ['seller', 'posts'] });
    },
    onError: (error: SellerError) => {
      console.error('Delete post error:', error);
    },
  });
};

// Main seller hook that combines all seller operations
export const useSeller = () => {
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();

  return {
    // Create post
    createPost: createPostMutation.mutate,
    createPostAsync: createPostMutation.mutateAsync,
    isCreatePostLoading: createPostMutation.isPending,
    createPostError: createPostMutation.error
      ? getErrorMessage(createPostMutation.error)
      : null,

    // Update post
    updatePost: updatePostMutation.mutate,
    updatePostAsync: updatePostMutation.mutateAsync,
    isUpdatePostLoading: updatePostMutation.isPending,
    updatePostError: updatePostMutation.error
      ? getErrorMessage(updatePostMutation.error)
      : null,

    // Delete post
    deletePost: deletePostMutation.mutate,
    deletePostAsync: deletePostMutation.mutateAsync,
    isDeletePostLoading: deletePostMutation.isPending,
    deletePostError: deletePostMutation.error
      ? getErrorMessage(deletePostMutation.error)
      : null,

    // Reset mutations
    resetCreatePostError: createPostMutation.reset,
    resetUpdatePostError: updatePostMutation.reset,
    resetDeletePostError: deletePostMutation.reset,
  };
};
