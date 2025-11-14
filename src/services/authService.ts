import api from './api';
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  BackendLoginResponse,
  BackendLogoutResponse,
  BackendRegisterResponse,
  BackendUpdateProfileResponse,
  BackendResetPasswordResponse,
} from '../types';
import {
  mapBackendUserToFrontendUser,
  mapFrontendRegisterToBackendRegister,
  mapBackendRegisterResponseToUser,
  mapFrontendUserToBackendUpdate,
  mapBackendUpdateProfileResponseToUser,
} from '../types';

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
  register: async (userData: RegisterRequest): Promise<User> => {
    // Transform frontend request to backend format
    const backendRequest = mapFrontendRegisterToBackendRegister(userData);

    const response = await api.post<BackendRegisterResponse>(
      '/auth/register',
      backendRequest
    );

    // Transform backend response to frontend user format
    // Note: Register doesn't return token, only user info
    return mapBackendRegisterResponseToUser(response.data.detail);
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/profile');
    return response.data.data;
  },

  // Update user profile
  updateProfile: async (userData: {
    name?: string;
    phone?: string;
  }): Promise<User> => {
    // Transform frontend data to backend format
    const backendRequest = mapFrontendUserToBackendUpdate(userData);

    const response = await api.put<BackendUpdateProfileResponse>(
      '/account/me',
      backendRequest
    );

    // Transform backend response to frontend user format
    return mapBackendUpdateProfileResponseToUser(response.data.detail);
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
  resetPassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    await api.patch<BackendResetPasswordResponse>('/reset/password', {
      password: currentPassword,
      newPassword: newPassword,
    });
    // Response has no meaningful data to return, just success/failure
  },

  // Verify email
  verifyEmail: async (token: string): Promise<void> => {
    await api.post('/auth/verify-email', { token });
  },
};
