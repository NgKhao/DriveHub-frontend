import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '../services/reviewService';
import type { CreateReviewData, Review, ReviewSummary } from '../types';

interface ReviewError {
  response?: { status: number };
  message?: string;
}

// Helper function to get user-friendly error message
const getErrorMessage = (error: ReviewError): string => {
  if (error.response?.status === 401) {
    return 'Vui lòng đăng nhập để đánh giá';
  } else if (error.response?.status === 403) {
    return 'Không có quyền truy cập';
  } else if (error.response?.status === 404) {
    return 'Không tìm thấy người bán';
  } else if (error.response?.status === 400) {
    return 'Dữ liệu không hợp lệ';
  } else if (error.message?.includes('Network')) {
    return 'Không thể kết nối đến server';
  } else {
    return 'Có lỗi xảy ra. Vui lòng thử lại.';
  }
};

/**
 * Hook để lấy tất cả reviews của seller
 */
export const useSellerReviews = (sellerId: string, enabled: boolean = true) => {
  return useQuery<ReviewSummary, ReviewError>({
    queryKey: ['sellerReviews', sellerId],
    queryFn: () => reviewService.getAllSellerReviews(sellerId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!sellerId && enabled, // Only run if sellerId is provided and explicitly enabled
  });
};

/**
 * Hook để tạo review mới
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation<Review, ReviewError, CreateReviewData>({
    mutationFn: (reviewData: CreateReviewData) => {
      return reviewService.createReview(reviewData);
    },
    onSuccess: (newReview) => {
      // Invalidate and refetch seller reviews query
      queryClient.invalidateQueries({
        queryKey: ['sellerReviews', newReview.reviewedId],
      });
    },
    onError: (error: ReviewError) => {
      console.error('Create review error:', error);
    },
  });
};

/**
 * Main reviews hook that combines all review operations
 */
export const useReviewsManager = () => {
  const createReviewMutation = useCreateReview();

  return {
    // Create review
    createReview: createReviewMutation.mutate,
    createReviewAsync: createReviewMutation.mutateAsync,
    isCreatingReview: createReviewMutation.isPending,
    createReviewError: createReviewMutation.error
      ? getErrorMessage(createReviewMutation.error)
      : null,

    // Reset mutations
    resetCreateReviewError: createReviewMutation.reset,
  };
};

/**
 * Hook để kiểm tra xem user hiện tại đã review seller này chưa
 */
export const useUserReviewForSeller = (
  sellerId: string,
  userId: string | undefined,
  enabled: boolean = true
) => {
  const { data: reviewSummary, ...rest } = useSellerReviews(sellerId, enabled);

  const userReview = reviewSummary?.reviews?.find(
    (review) => review.reviewerId === userId
  );

  return {
    userReview,
    hasReviewed: !!userReview,
    reviewSummary,
    ...rest,
  };
};
