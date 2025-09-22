import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

// Mock test accounts for development
export const MOCK_USERS = {
  admin: {
    id: '1',
    name: 'Admin User',
    email: 'admin@test.com',
    role: 'admin' as const,
    phone: '+84123456789',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  seller: {
    id: '2',
    name: 'Seller User',
    email: 'seller@test.com',
    role: 'seller' as const,
    phone: '+84987654321',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  buyer: {
    id: '3',
    name: 'Buyer User',
    email: 'buyer@test.com',
    role: 'buyer' as const,
    phone: '+84555666777',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

// Mock credentials for easy testing
export const MOCK_CREDENTIALS = {
  'admin@test.com': { password: 'admin123', user: MOCK_USERS.admin },
  'seller@test.com': { password: 'seller123', user: MOCK_USERS.seller },
  'buyer@test.com': { password: 'buyer123', user: MOCK_USERS.buyer },
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  mockLogin: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  quickLogin: (role: 'admin' | 'seller' | 'buyer') => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      login: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      // Mock authentication for development
      mockLogin: async (email: string, password: string) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const mockAccount =
              MOCK_CREDENTIALS[email as keyof typeof MOCK_CREDENTIALS];

            if (!mockAccount) {
              resolve({ success: false, error: 'Email không tồn tại' });
              return;
            }

            if (mockAccount.password !== password) {
              resolve({ success: false, error: 'Mật khẩu không đúng' });
              return;
            }

            // Generate mock token
            const token = `mock_token_${mockAccount.user.role}_${Date.now()}`;

            // Set auth state
            set({
              user: mockAccount.user,
              token,
              isAuthenticated: true,
            });

            resolve({ success: true });
          }, 1000); // Simulate API delay
        });
      },

      // Quick login for testing different roles
      quickLogin: (role: 'admin' | 'seller' | 'buyer') => {
        const user = MOCK_USERS[role];
        const token = `mock_token_${role}_${Date.now()}`;

        set({
          user,
          token,
          isAuthenticated: true,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
