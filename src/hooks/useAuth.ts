import { useUser, useClerk, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';

// Custom hook wrapper để tích hợp Clerk với app logic
export const useAuth = () => {
  const navigate = useNavigate();
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useClerkAuth();
  const { userRole, setUserRole, clearUserRole } = useAuthStore();

  // Sync user role từ Clerk metadata khi user thay đổi
  useEffect(() => {
    if (isSignedIn && user) {
      // Lấy role từ publicMetadata hoặc unsafeMetadata
      const role =
        (user.publicMetadata?.role as 'buyer' | 'seller' | 'admin') || 'buyer';
      if (role !== userRole) {
        setUserRole(role);
      }
    } else if (!isSignedIn) {
      clearUserRole();
    }
  }, [isSignedIn, user, userRole, setUserRole, clearUserRole]);

  // Helper function để lấy token cho API calls
  const getAuthToken = async () => {
    try {
      return await getToken();
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut();
      clearUserRole();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local state even if signOut fails
      clearUserRole();
      navigate('/');
    }
  };

  // Redirect based on role (có thể gọi sau khi đăng nhập thành công)
  const redirectByRole = (role: 'buyer' | 'seller' | 'admin') => {
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'seller') {
      navigate('/seller-dashboard');
    } else {
      navigate('/');
    }
  };

  return {
    // User info
    user:
      isSignedIn && user
        ? {
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress || '',
            name: user.fullName || user.username || '',
            phone: user.primaryPhoneNumber?.phoneNumber || '',
            role: userRole || 'buyer',
            isVerified: (user.publicMetadata?.isVerified as boolean) || false,
            avatar: user.imageUrl,
            createdAt:
              user.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt:
              user.updatedAt?.toISOString() || new Date().toISOString(),
          }
        : null,

    // Auth state
    isAuthenticated: isSignedIn || false,
    isLoaded: isUserLoaded,
    userRole,

    // Auth methods
    logout,
    getAuthToken,
    redirectByRole,
    setUserRole,

    // Clerk user object (nếu cần access thêm methods)
    clerkUser: user,

    // Legacy compatibility (để không break existing code)
    token: null, // Clerk sử dụng getAuthToken() thay vì token trực tiếp
    isLoginLoading: false,
    loginError: null,
    resetLoginError: () => {},
    isRegisterLoading: false,
    registerError: null,
    resetRegisterError: () => {},

    // Profile update methods (Clerk handles via user.update())
    updateProfile: async (data: { name?: string; phone?: string }) => {
      if (user) {
        try {
          await user.update({
            firstName: data.name?.split(' ')[0],
            lastName: data.name?.split(' ').slice(1).join(' '),
          });
        } catch (error) {
          console.error('Update profile error:', error);
        }
      }
    },
    isUpdateProfileLoading: false,
    updateProfileError: null,
    resetUpdateProfileError: () => {},

    // Password reset (Clerk handles differently)
    resetPassword: async (passwordData: {
      currentPassword: string;
      newPassword: string;
    }) => {
      if (user) {
        try {
          await user.updatePassword({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          });
        } catch (error) {
          console.error('Reset password error:', error);
        }
      }
    },
    isResetPasswordLoading: false,
    resetPasswordError: null,
    resetResetPasswordError: () => {},
  };
};
