import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store để lưu role tùy chỉnh của user (vì Clerk không hỗ trợ role mặc định)
interface AuthState {
  userRole: 'buyer' | 'seller' | 'admin' | null;
  setUserRole: (role: 'buyer' | 'seller' | 'admin' | null) => void;
  clearUserRole: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userRole: null,

      setUserRole: (role: 'buyer' | 'seller' | 'admin' | null) => {
        set({ userRole: role });
      },

      clearUserRole: () => {
        set({ userRole: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        userRole: state.userRole,
      }),
    }
  )
);
