import api from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  Car,
  User,
  AdminStats,
  BackendGetUsersResponse,
} from '../types';
import { mapBackendGetUsersResponseToPaginated } from '../types';

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

  // Update user
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(
      `/admin/users/${id}`,
      userData
    );
    return response.data.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
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
};
