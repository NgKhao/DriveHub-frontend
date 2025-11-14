import api from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  Car,
  CreateCarRequest,
  UpdateCarRequest,
  CarFilters,
  ContactInfo,
} from '../types';

export const carService = {
  // Get all cars with filters and pagination
  getCars: async (
    filters?: CarFilters,
    page = 1,
    limit = 12
  ): Promise<PaginatedResponse<Car>> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get<ApiResponse<PaginatedResponse<Car>>>(
      `/cars?${params.toString()}`
    );
    return response.data.data;
  },

  // Get single car by ID
  getCarById: async (id: string): Promise<Car> => {
    const response = await api.get<ApiResponse<Car>>(`/cars/${id}`);
    return response.data.data;
  },

  // Create new car listing
  createCar: async (carData: CreateCarRequest): Promise<Car> => {
    const formData = new FormData();

    // Add text fields
    Object.entries(carData).forEach(([key, value]) => {
      if (key === 'images') {
        // Handle file uploads
        (value as File[]).forEach((file) => {
          formData.append('images', file);
        });
      } else if (key === 'features') {
        // Handle array fields
        (value as string[]).forEach((feature) => {
          formData.append('features[]', feature);
        });
      } else {
        formData.append(key, value.toString());
      }
    });

    const response = await api.post<ApiResponse<Car>>('/cars', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Update car listing
  updateCar: async (carData: UpdateCarRequest): Promise<Car> => {
    const { id, ...updateData } = carData;
    const formData = new FormData();

    Object.entries(updateData).forEach(([key, value]) => {
      if (key === 'images' && value) {
        (value as File[]).forEach((file) => {
          formData.append('images', file);
        });
      } else if (key === 'features' && value) {
        (value as string[]).forEach((feature) => {
          formData.append('features[]', feature);
        });
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const response = await api.put<ApiResponse<Car>>(`/cars/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Delete car listing
  deleteCar: async (id: string): Promise<void> => {
    await api.delete(`/cars/${id}`);
  },

  // Get cars by seller ID
  getCarsBySeller: async (sellerId: string): Promise<Car[]> => {
    const response = await api.get<ApiResponse<Car[]>>(
      `/cars/seller/${sellerId}`
    );
    return response.data.data;
  },

  // Get cars by current user (for seller dashboard)
  getMyCars: async (): Promise<Car[]> => {
    const response = await api.get<ApiResponse<Car[]>>('/cars/my-cars');
    return response.data.data;
  },

  // Search cars
  searchCars: async (query: string): Promise<Car[]> => {
    const response = await api.get<ApiResponse<Car[]>>(
      `/cars/search?q=${encodeURIComponent(query)}`
    );
    return response.data.data;
  },

  // Get featured cars
  getFeaturedCars: async (): Promise<Car[]> => {
    const response = await api.get<ApiResponse<Car[]>>('/cars/featured');
    return response.data.data;
  },

  // Contact seller
  contactSeller: async (contactInfo: ContactInfo): Promise<void> => {
    await api.post('/cars/contact', contactInfo);
  },

  // Get car brands
  getBrands: async (): Promise<string[]> => {
    const response = await api.get<ApiResponse<string[]>>('/cars/brands');
    return response.data.data;
  },

  // Get car models by brand
  getModels: async (brand: string): Promise<string[]> => {
    const response = await api.get<ApiResponse<string[]>>(
      `/cars/models?brand=${encodeURIComponent(brand)}`
    );
    return response.data.data;
  },
};
