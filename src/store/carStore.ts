import { create } from 'zustand';

export interface Car {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  transmission: 'manual' | 'automatic';
  color: string;
  description: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerType: 'individual' | 'dealer';
  location: string;
  status: 'active' | 'pending' | 'sold' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

interface CarState {
  cars: Car[];
  selectedCar: Car | null;
  loading: boolean;
  error: string | null;
  filters: {
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    minYear?: number;
    maxYear?: number;
    fuelType?: string;
    transmission?: string;
    location?: string;
  };

  // Actions
  setCars: (cars: Car[]) => void;
  addCar: (car: Car) => void;
  updateCar: (id: string, car: Partial<Car>) => void;
  deleteCar: (id: string) => void;
  setSelectedCar: (car: Car | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<CarState['filters']>) => void;
  clearFilters: () => void;
}

export const useCarStore = create<CarState>((set) => ({
  cars: [],
  selectedCar: null,
  loading: false,
  error: null,
  filters: {},

  setCars: (cars) => set({ cars }),

  addCar: (car) =>
    set((state) => ({
      cars: [...state.cars, car],
    })),

  updateCar: (id, carData) =>
    set((state) => ({
      cars: state.cars.map((car) =>
        car.id === id ? { ...car, ...carData } : car
      ),
    })),

  deleteCar: (id) =>
    set((state) => ({
      cars: state.cars.filter((car) => car.id !== id),
    })),

  setSelectedCar: (car) => set({ selectedCar: car }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  clearFilters: () => set({ filters: {} }),
}));
