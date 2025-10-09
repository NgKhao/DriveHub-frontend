import api from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  Car,
  User,
  AdminStats,
  SellerPost,
  BackendGetUsersResponse,
  BackendAdminUpdateUserResponse,
  BackendCreateUserResponse,
  BackendDeleteUserResponse,
  BackendAdminGetPostsResponse,
  BackendAdminGetPostDetailResponse,
  BackendAdminUpdatePostStatusResponse,
} from '../types';
import {
  mapBackendGetUsersResponseToPaginated,
  mapFrontendUserToBackendAdminUpdate,
  mapBackendAdminUpdateResponseToUser,
  mapFrontendCreateUserToBackend,
  mapBackendCreateUserResponseToUser,
  mapBackendAdminGetPostsResponseToPaginated,
  mapBackendAdminGetPostDetailResponseToSellerPost,
  mapBackendAdminUpdatePostStatusResponseToSellerPost,
} from '../types';

export const adminService = {
  // Get admin dashboard stats
  getStats: async (): Promise<AdminStats> => {
    const response = await api.get<ApiResponse<AdminStats>>('/admin/stats');
    return response.data.data;
  },

  // Get all users
  getUsers: async (page = 0, size = 10): Promise<PaginatedResponse<User>> => {
    const response = await api.get<BackendGetUsersResponse>(
      `/admin/users?page=${page}&size=${size}`
    );

    // Transform backend response to frontend format
    return mapBackendGetUsersResponseToPaginated(response.data.detail);
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/admin/users/${id}`);
    return response.data.data;
  },

  // Update user (old method - keep for compatibility)
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(
      `/admin/users/${id}`,
      userData
    );
    return response.data.data;
  },

  // Update user admin - new API endpoint
  updateUserAdmin: async (
    id: string,
    userData: {
      name?: string;
      phone?: string;
      role?: 'buyer' | 'seller';
      isVerified?: boolean;
    }
  ): Promise<User> => {
    // Convert frontend data to backend format
    const backendData = mapFrontendUserToBackendAdminUpdate(userData);

    const response = await api.put<BackendAdminUpdateUserResponse>(
      `/admin/account/${id}`,
      backendData
    );

    // Convert backend response to frontend format
    return mapBackendAdminUpdateResponseToUser(response.data.detail);
  },

  // Create user - new API endpoint
  createUser: async (userData: {
    name: string;
    email: string;
    phone: string;
    role: 'buyer' | 'seller';
  }): Promise<User> => {
    // Convert frontend data to backend format
    const backendData = mapFrontendCreateUserToBackend(userData);

    const response = await api.post<BackendCreateUserResponse>(
      '/admin/users',
      backendData
    );

    // Convert backend response to frontend format
    return mapBackendCreateUserResponseToUser(response.data.detail);
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await api.delete<BackendDeleteUserResponse>(`/admin/users/${id}`);
    // API returns 204 status with null detail, no need to transform response
  },

  // Block/Unblock user
  toggleUserStatus: async (id: string, isBlocked: boolean): Promise<User> => {
    const response = await api.patch<ApiResponse<User>>(
      `/admin/users/${id}/status`,
      {
        isBlocked,
      }
    );
    return response.data.data;
  },

  // Get all cars for admin approval
  getAllCars: async (
    page = 1,
    limit = 20,
    status?: 'active' | 'pending' | 'sold' | 'rejected'
  ): Promise<PaginatedResponse<Car>> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    if (status) {
      params.append('status', status);
    }

    const response = await api.get<ApiResponse<PaginatedResponse<Car>>>(
      `/admin/cars?${params.toString()}`
    );
    return response.data.data;
  },

  // Get pending car approvals
  getPendingCars: async (): Promise<Car[]> => {
    const response = await api.get<ApiResponse<Car[]>>('/admin/cars/pending');
    return response.data.data;
  },

  // Approve car listing
  approveCar: async (id: string): Promise<Car> => {
    const response = await api.patch<ApiResponse<Car>>(
      `/admin/cars/${id}/approve`
    );
    return response.data.data;
  },

  // Reject car listing
  rejectCar: async (id: string, reason?: string): Promise<Car> => {
    const response = await api.patch<ApiResponse<Car>>(
      `/admin/cars/${id}/reject`,
      {
        reason,
      }
    );
    return response.data.data;
  },

  // Delete car listing (admin)
  deleteCar: async (id: string): Promise<void> => {
    await api.delete(`/admin/cars/${id}`);
  },

  // Get system logs
  getLogs: async (
    page = 1,
    limit = 50
  ): Promise<PaginatedResponse<Record<string, unknown>>> => {
    const response = await api.get<
      ApiResponse<PaginatedResponse<Record<string, unknown>>>
    >(`/admin/logs?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  // Export data
  exportUsers: async (): Promise<Blob> => {
    const response = await api.get('/admin/export/users', {
      responseType: 'blob',
    });
    return response.data;
  },

  exportCars: async (): Promise<Blob> => {
    const response = await api.get('/admin/export/cars', {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get all posts for admin management
  getAllPosts: async (
    page = 0,
    size = 10
  ): Promise<PaginatedResponse<SellerPost>> => {
    const response = await api.get<BackendAdminGetPostsResponse>(
      `/admin/posts?page=${page}&size=${size}`
    );

    // Transform backend response to frontend format
    return mapBackendAdminGetPostsResponseToPaginated(response.data.detail);
  },

  // Get post by ID for admin
  getPostById: async (id: string): Promise<SellerPost> => {
    const response = await api.get<BackendAdminGetPostDetailResponse>(
      `/admin/posts/${id}`
    );

    // Transform backend response to frontend format
    return mapBackendAdminGetPostDetailResponseToSellerPost(
      response.data.detail
    );
  },

  // Update post status (approve/reject)
  updatePostStatus: async (
    id: string,
    status: 'APPROVED' | 'REJECTED'
  ): Promise<SellerPost> => {
    const response = await api.patch<BackendAdminUpdatePostStatusResponse>(
      `/admin/posts/${id}/status?status=${status}`
    );

    // Transform backend response to frontend format
    return mapBackendAdminUpdatePostStatusResponseToSellerPost(
      response.data.detail
    );
  },
};
