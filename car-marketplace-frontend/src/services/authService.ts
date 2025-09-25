import api from './api';
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  BackendLoginResponse,
  BackendLogoutResponse,
} from '../types';
import { mapBackendUserToFrontendUser } from '../types';

export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<BackendLoginResponse>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });

    // Transform backend response to frontend format
    const user = mapBackendUserToFrontendUser(response.data.detail.userInfo);
    const token = response.data.detail.token.token;

    return {
      user,
      token,
    };
  },

  // Register user
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      userData
    );
    return response.data.data;
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/profile');
    return response.data.data;
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(
      '/auth/profile',
      userData
    );
    return response.data.data;
  },

  // Logout user
  logout: async (token: string): Promise<void> => {
    await api.post<BackendLogoutResponse>('/auth/logout', {
      token,
    });
  },

  // Refresh token
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await api.post<ApiResponse<{ token: string }>>(
      '/auth/refresh'
    );
    return response.data.data;
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: async (token: string, password: string): Promise<void> => {
    await api.post('/auth/reset-password', { token, password });
  },

  // Verify email
  verifyEmail: async (token: string): Promise<void> => {
    await api.post('/auth/verify-email', { token });
  },
};
