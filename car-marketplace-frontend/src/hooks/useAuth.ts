import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import type { LoginRequest, RegisterRequest } from '../types';

interface LoginError {
  response?: { status: number };
  message?: string;
}

// Helper function to get user-friendly error message
const getErrorMessage = (error: LoginError): string => {
  if (error.response?.status === 401) {
    return 'Email hoặc mật khẩu không đúng';
  } else if (error.response?.status === 400) {
    return 'Thông tin đăng nhập không hợp lệ';
  } else if (error.message?.includes('Network')) {
    return 'Không thể kết nối đến server';
  } else {
    return 'Đăng nhập thất bại. Vui lòng thử lại.';
  }
};

// Hook for login mutation
export const useLoginMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login: setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      return await authService.login(credentials);
    },
    onSuccess: (data) => {
      // Update auth store
      setAuth(data.user, data.token);

      // Invalidate and refetch any user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // Redirect based on user role
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else if (data.user.role === 'seller') {
        navigate('/seller-dashboard');
      } else {
        navigate('/');
      }
    },
    onError: (error: LoginError) => {
      console.error('Login error:', error);
    },
  });
};

// Hook for logout mutation
export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token, logout: clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      if (token) {
        await authService.logout(token);
      }
    },
    onSuccess: () => {
      // Clear auth store
      clearAuth();

      // Clear all cached queries
      queryClient.clear();

      // Navigate to home
      navigate('/');
    },
    onError: (error) => {
      console.error('Logout API error:', error);
      // Even if logout fails, still clear local state
      clearAuth();
      queryClient.clear();
      navigate('/');
    },
  });
};

// Hook for register mutation
export const useRegisterMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (registerData: RegisterRequest) => {
      return await authService.register(registerData);
    },
    onSuccess: (user) => {
      // Registration successful, but no token returned
      // User needs to login manually
      console.log('Registration successful:', user);

      // Navigate to login page with success message
      navigate('/login?registered=true');
    },
    onError: (error) => {
      console.error('Register error:', error);
    },
  });
};

// Hook for update profile mutation
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: async (userData: { name?: string; phone?: string }) => {
      return await authService.updateProfile(userData);
    },
    onSuccess: (updatedUser) => {
      // Update auth store with new user data
      updateUser(updatedUser);

      // Invalidate and refetch any user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });

      console.log('Profile updated successfully:', updatedUser);
    },
    onError: (error) => {
      console.error('Update profile error:', error);
    },
  });
};

// Hook for reset password mutation
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: async (passwordData: {
      currentPassword: string;
      newPassword: string;
    }) => {
      return await authService.resetPassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
    },
    onSuccess: () => {
      console.log('Password reset successfully');
    },
    onError: (error) => {
      console.error('Reset password error:', error);
    },
  });
};

// Main auth hook that combines auth state and mutations
export const useAuth = () => {
  const { user, isAuthenticated, token } = useAuthStore();
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  const registerMutation = useRegisterMutation();
  const updateProfileMutation = useUpdateProfileMutation();
  const resetPasswordMutation = useResetPasswordMutation();

  return {
    // Auth state
    user,
    isAuthenticated,
    token,

    // Login
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error
      ? getErrorMessage(loginMutation.error)
      : null,

    // Register
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegisterLoading: registerMutation.isPending,
    registerError: registerMutation.error
      ? getErrorMessage(registerMutation.error)
      : null,

    // Update Profile
    updateProfile: updateProfileMutation.mutate,
    updateProfileAsync: updateProfileMutation.mutateAsync,
    isUpdateProfileLoading: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error
      ? getErrorMessage(updateProfileMutation.error)
      : null,

    // Reset Password
    resetPassword: resetPasswordMutation.mutate,
    resetPasswordAsync: resetPasswordMutation.mutateAsync,
    isResetPasswordLoading: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error
      ? getErrorMessage(resetPasswordMutation.error)
      : null,

    // Logout
    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    isLogoutLoading: logoutMutation.isPending,

    // Reset mutations
    resetLoginError: loginMutation.reset,
    resetLogoutError: logoutMutation.reset,
    resetRegisterError: registerMutation.reset,
    resetUpdateProfileError: updateProfileMutation.reset,
    resetResetPasswordError: resetPasswordMutation.reset,
  };
};
