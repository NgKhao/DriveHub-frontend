import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import api from '../services/api';

// Hook để tự động inject token vào API calls
export const useApiWithAuth = () => {
  const { getToken } = useClerkAuth();

  // Helper function để gọi API với token
  const callApi = async <T>(apiCall: () => Promise<T>): Promise<T> => {
    try {
      const token = await getToken();
      if (token) {
        // Set token vào header trước khi gọi API
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      return await apiCall();
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  };

  return { callApi };
};

// Helper function để set token cho một request cụ thể
export const setAuthToken = async (getToken: () => Promise<string | null>) => {
  try {
    const token = await getToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error setting auth token:', error);
  }
};
