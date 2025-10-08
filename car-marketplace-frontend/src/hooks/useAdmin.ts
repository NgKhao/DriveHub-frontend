import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import type { PaginatedResponse, User, AdminStats } from '../types';

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

// Hook for updating user
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

// Main admin hook that combines all admin operations
export const useAdmin = () => {
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const toggleUserStatusMutation = useToggleUserStatus();

  return {
    // User management
    updateUser: updateUserMutation.mutate,
    updateUserAsync: updateUserMutation.mutateAsync,
    isUpdateUserLoading: updateUserMutation.isPending,
    updateUserError: updateUserMutation.error
      ? getErrorMessage(updateUserMutation.error)
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

    // Reset mutations
    resetUpdateUserError: updateUserMutation.reset,
    resetDeleteUserError: deleteUserMutation.reset,
    resetToggleUserStatusError: toggleUserStatusMutation.reset,
  };
};
