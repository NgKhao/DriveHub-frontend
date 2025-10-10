import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import type {
  PaginatedResponse,
  User,
  AdminStats,
  SellerPost,
  AdminReport,
} from '../types';

interface AdminError {
  response?: { status: number };
  message?: string;
}

// Helper function to get user-friendly error message
const getErrorMessage = (error: AdminError): string => {
  if (error.response?.status === 403) {
    return 'Không có quyền truy cập';
  } else if (error.response?.status === 404) {
    return 'Không tìm thấy dữ liệu';
  } else if (error.message?.includes('Network')) {
    return 'Không thể kết nối đến server';
  } else {
    return 'Có lỗi xảy ra. Vui lòng thử lại.';
  }
};

// Hook for fetching users with pagination
export const useUsers = (page = 0, size = 10) => {
  return useQuery<PaginatedResponse<User>, AdminError>({
    queryKey: ['admin', 'users', page, size],
    queryFn: () => adminService.getUsers(page, size),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook for fetching admin stats
export const useAdminStats = () => {
  return useQuery<AdminStats, AdminError>({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminService.getStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
};

// Hook for fetching all posts with pagination
export const useAdminPosts = (page = 0, size = 10) => {
  return useQuery<PaginatedResponse<SellerPost>, AdminError>({
    queryKey: ['admin', 'posts', page, size],
    queryFn: () => adminService.getAllPosts(page, size),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook for fetching single post detail
export const useAdminPostDetail = (postId: string, enabled: boolean = true) => {
  return useQuery<SellerPost, AdminError>({
    queryKey: ['admin', 'posts', postId],
    queryFn: () => adminService.getPostById(postId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: !!postId && enabled, // Only run query if postId is provided and explicitly enabled
  });
};

// Hook for fetching all reports
export const useAdminReports = () => {
  return useQuery<AdminReport[], AdminError>({
    queryKey: ['admin', 'reports'],
    queryFn: () => adminService.getAllReports(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook for updating user (old method)
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: Partial<User> }) => {
      return adminService.updateUser(id, userData);
    },
    onSuccess: () => {
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (error: AdminError) => {
      console.error('Update user error:', error);
    },
  });
};

// Hook for updating user admin - new API endpoint
export const useUpdateUserAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      userData,
    }: {
      id: string;
      userData: {
        name?: string;
        phone?: string;
        role?: 'buyer' | 'seller';
        isVerified?: boolean;
      };
    }) => {
      return adminService.updateUserAdmin(id, userData);
    },
    onSuccess: () => {
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (error: AdminError) => {
      console.error('Update user admin error:', error);
    },
  });
};

// Hook for creating user - new API endpoint
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: {
      name: string;
      email: string;
      phone: string;
      role: 'buyer' | 'seller';
    }) => {
      return adminService.createUser(userData);
    },
    onSuccess: () => {
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (error: AdminError) => {
      console.error('Create user error:', error);
    },
  });
};

// Hook for deleting user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return adminService.deleteUser(id);
    },
    onSuccess: () => {
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (error: AdminError) => {
      console.error('Delete user error:', error);
    },
  });
};

// Hook for toggling user status
export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isBlocked }: { id: string; isBlocked: boolean }) => {
      return adminService.toggleUserStatus(id, isBlocked);
    },
    onSuccess: () => {
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (error: AdminError) => {
      console.error('Toggle user status error:', error);
    },
  });
};

// Hook for updating post status (approve/reject)
export const useUpdatePostStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: 'APPROVED' | 'REJECTED';
    }) => {
      return adminService.updatePostStatus(id, status);
    },
    onSuccess: () => {
      // Invalidate and refetch posts queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
    },
    onError: (error: AdminError) => {
      console.error('Update post status error:', error);
    },
  });
};

// Hook for deleting post
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return adminService.deletePost(id);
    },
    onSuccess: () => {
      // Invalidate and refetch posts queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
    },
    onError: (error: AdminError) => {
      console.error('Delete post error:', error);
    },
  });
};

// Main admin hook that combines all admin operations
export const useAdmin = () => {
  const updateUserMutation = useUpdateUser();
  const updateUserAdminMutation = useUpdateUserAdmin();
  const createUserMutation = useCreateUser();
  const deleteUserMutation = useDeleteUser();
  const toggleUserStatusMutation = useToggleUserStatus();
  const updatePostStatusMutation = useUpdatePostStatus();
  const deletePostMutation = useDeletePost();

  return {
    // User management (old method)
    updateUser: updateUserMutation.mutate,
    updateUserAsync: updateUserMutation.mutateAsync,
    isUpdateUserLoading: updateUserMutation.isPending,
    updateUserError: updateUserMutation.error
      ? getErrorMessage(updateUserMutation.error)
      : null,

    // User management admin (new method)
    updateUserAdmin: updateUserAdminMutation.mutate,
    updateUserAdminAsync: updateUserAdminMutation.mutateAsync,
    isUpdateUserAdminLoading: updateUserAdminMutation.isPending,
    updateUserAdminError: updateUserAdminMutation.error
      ? getErrorMessage(updateUserAdminMutation.error)
      : null,

    // Create user
    createUser: createUserMutation.mutate,
    createUserAsync: createUserMutation.mutateAsync,
    isCreateUserLoading: createUserMutation.isPending,
    createUserError: createUserMutation.error
      ? getErrorMessage(createUserMutation.error)
      : null,

    deleteUser: deleteUserMutation.mutate,
    deleteUserAsync: deleteUserMutation.mutateAsync,
    isDeleteUserLoading: deleteUserMutation.isPending,
    deleteUserError: deleteUserMutation.error
      ? getErrorMessage(deleteUserMutation.error)
      : null,

    toggleUserStatus: toggleUserStatusMutation.mutate,
    toggleUserStatusAsync: toggleUserStatusMutation.mutateAsync,
    isToggleUserStatusLoading: toggleUserStatusMutation.isPending,
    toggleUserStatusError: toggleUserStatusMutation.error
      ? getErrorMessage(toggleUserStatusMutation.error)
      : null,

    // Post status management
    updatePostStatus: updatePostStatusMutation.mutate,
    updatePostStatusAsync: updatePostStatusMutation.mutateAsync,
    isUpdatePostStatusLoading: updatePostStatusMutation.isPending,
    updatePostStatusError: updatePostStatusMutation.error
      ? getErrorMessage(updatePostStatusMutation.error)
      : null,

    // Post delete management
    deletePost: deletePostMutation.mutate,
    deletePostAsync: deletePostMutation.mutateAsync,
    isDeletePostLoading: deletePostMutation.isPending,
    deletePostError: deletePostMutation.error
      ? getErrorMessage(deletePostMutation.error)
      : null,

    // Reset mutations
    resetUpdateUserError: updateUserMutation.reset,
    resetUpdateUserAdminError: updateUserAdminMutation.reset,
    resetCreateUserError: createUserMutation.reset,
    resetDeleteUserError: deleteUserMutation.reset,
    resetToggleUserStatusError: toggleUserStatusMutation.reset,
    resetUpdatePostStatusError: updatePostStatusMutation.reset,
    resetDeletePostError: deletePostMutation.reset,
  };
};
