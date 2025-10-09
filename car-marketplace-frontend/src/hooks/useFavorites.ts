import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoriteService } from '../services/favoriteService';
import type { FavoriteItem, SellerPost } from '../types';

interface FavoriteError {
  response?: { status: number };
  message?: string;
}

// Helper function to get user-friendly error message
const getErrorMessage = (error: FavoriteError): string => {
  if (error.response?.status === 401) {
    return 'Vui lòng đăng nhập để sử dụng tính năng này';
  } else if (error.response?.status === 403) {
    return 'Không có quyền truy cập';
  } else if (error.response?.status === 404) {
    return 'Không tìm thấy bài đăng';
  } else if (error.response?.status === 400) {
    return 'Dữ liệu không hợp lệ';
  } else if (error.message?.includes('Network')) {
    return 'Không thể kết nối đến server';
  } else {
    return 'Có lỗi xảy ra. Vui lòng thử lại.';
  }
};

/**
 * Hook để lấy danh sách favorite posts của user
 */
export const useFavorites = () => {
  return useQuery<SellerPost[], FavoriteError>({
    queryKey: ['favorites'],
    queryFn: () => favoriteService.getFavorites(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook để add post vào favorites
 */
export const useAddToFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation<FavoriteItem, FavoriteError, string>({
    mutationFn: (postId: string) => favoriteService.addToFavorites(postId),
    onSuccess: () => {
      // Invalidate and refetch favorites query
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error: FavoriteError) => {
      console.error('Add to favorites error:', error);
    },
  });
};

/**
 * Hook để remove post khỏi favorites
 */
export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation<void, FavoriteError, string>({
    mutationFn: (postId: string) => favoriteService.removeFromFavorites(postId),
    onSuccess: () => {
      // Invalidate and refetch favorites query
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error: FavoriteError) => {
      console.error('Remove from favorites error:', error);
    },
  });
};

/**
 * Hook để toggle favorite status (add hoặc remove)
 */
export const useToggleFavorite = () => {
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();

  const toggleFavorite = async (postId: string, isFavorite: boolean) => {
    if (isFavorite) {
      await removeFromFavorites.mutateAsync(postId);
    } else {
      await addToFavorites.mutateAsync(postId);
    }
  };

  return {
    toggleFavorite,
    isLoading: addToFavorites.isPending || removeFromFavorites.isPending,
    error: addToFavorites.error || removeFromFavorites.error,
    errorMessage: addToFavorites.error
      ? getErrorMessage(addToFavorites.error)
      : removeFromFavorites.error
      ? getErrorMessage(removeFromFavorites.error)
      : null,
  };
};

/**
 * Main favorites hook that combines all favorite operations
 */
export const useFavoritesManager = () => {
  const favoritesQuery = useFavorites();
  const addToFavoritesMutation = useAddToFavorites();
  const removeFromFavoritesMutation = useRemoveFromFavorites();
  const toggleFavoriteHook = useToggleFavorite();

  // Check if a post is in favorites
  const isFavorite = (postId: string): boolean => {
    return favoritesQuery.data?.some((post) => post.id === postId) || false;
  };

  return {
    // Favorites list
    favorites: favoritesQuery.data || [],
    isLoadingFavorites: favoritesQuery.isLoading,
    favoritesError: favoritesQuery.error
      ? getErrorMessage(favoritesQuery.error)
      : null,

    // Add to favorites
    addToFavorites: addToFavoritesMutation.mutate,
    addToFavoritesAsync: addToFavoritesMutation.mutateAsync,
    isAddingToFavorites: addToFavoritesMutation.isPending,
    addToFavoritesError: addToFavoritesMutation.error
      ? getErrorMessage(addToFavoritesMutation.error)
      : null,

    // Remove from favorites
    removeFromFavorites: removeFromFavoritesMutation.mutate,
    removeFromFavoritesAsync: removeFromFavoritesMutation.mutateAsync,
    isRemovingFromFavorites: removeFromFavoritesMutation.isPending,
    removeFromFavoritesError: removeFromFavoritesMutation.error
      ? getErrorMessage(removeFromFavoritesMutation.error)
      : null,

    // Toggle favorite
    toggleFavorite: toggleFavoriteHook.toggleFavorite,
    isTogglingFavorite: toggleFavoriteHook.isLoading,
    toggleFavoriteError: toggleFavoriteHook.errorMessage,

    // Helper functions
    isFavorite,
    refetchFavorites: favoritesQuery.refetch,

    // Reset errors
    resetAddError: addToFavoritesMutation.reset,
    resetRemoveError: removeFromFavoritesMutation.reset,
  };
};
