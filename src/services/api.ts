import axios, { type AxiosResponse } from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token from Clerk
api.interceptors.request.use(
  async (config) => {
    // Token sẽ được lấy từ Clerk khi cần
    // Các component/hooks sẽ tự inject token khi gọi API
    // Hoặc có thể dùng getAuthToken() từ useAuth hook
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - Clerk sẽ tự động handle
      // Có thể redirect hoặc show notification
      console.error('Unauthorized access - please sign in again');
    }
    return Promise.reject(error);
  }
);

export default api;
