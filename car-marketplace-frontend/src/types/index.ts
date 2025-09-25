// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'buyer' | 'seller';
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Backend API Response Types
export interface BackendLoginResponse {
  messenger: string;
  status: number;
  detail: {
    userInfo: {
      fullName: string;
      email: string;
      role: string; // 'SELLER', 'BUYER', 'ADMIN'
      numberPhone: string;
    };
    token: {
      type: string; // 'Bearer'
      token: string;
    };
  };
  instance: string;
}

export interface BackendLogoutResponse {
  messenger: string;
  status: number;
  detail: null;
  instance: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller' | 'admin';
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Helper function to convert backend user to frontend user
export const mapBackendUserToFrontendUser = (
  backendUser: BackendLoginResponse['detail']['userInfo']
): User => {
  // Map backend role to frontend role
  const roleMap: Record<string, 'buyer' | 'seller' | 'admin'> = {
    BUYER: 'buyer',
    SELLER: 'seller',
    ADMIN: 'admin',
  };

  return {
    id: backendUser.email, // Use email as ID since backend doesn't provide ID
    email: backendUser.email,
    name: backendUser.fullName,
    role: roleMap[backendUser.role] || 'buyer',
    phone: backendUser.numberPhone,
    isVerified: true, // Assume verified for now
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Car Types
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
  sellerPhone?: string;
  sellerType?: 'individual' | 'dealer';
  location: string;
  status: 'active' | 'pending' | 'sold' | 'rejected' | 'approved';
  features?: string[];
  condition: 'new' | 'used';
  views?: number;
  favorites?: number;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Favorites Types
export interface Favorite {
  id: string;
  userId: string;
  carId: string;
  car?: Car;
  createdAt: string;
}

// Rating and Review Types
export interface Rating {
  id: string;
  userId: string;
  sellerId: string;
  rating: number; // 1-5 stars
  review?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SellerRating {
  sellerId: string;
  averageRating: number;
  totalRatings: number;
  ratings: Rating[];
}

// Report Types
export interface Report {
  id: string;
  reporterId: string; // User who created the report
  reportedId: string; // User being reported (seller or buyer)
  reportedType: 'seller' | 'buyer';
  reason: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
  updatedAt: string;
}

export interface ReportReason {
  id: string;
  label: string;
  description: string;
  category: 'fraud' | 'behavior' | 'content' | 'other';
}

export interface CreateCarRequest {
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
  images: File[];
  location: string;
  features: string[];
  condition: 'new' | 'used';
}

export interface UpdateCarRequest extends Partial<CreateCarRequest> {
  id: string;
}

// Filter Types
export interface CarFilters {
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  fuelType?: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  transmission?: 'manual' | 'automatic';
  location?: string;
  condition?: 'new' | 'used';
  features?: string[];
  sortBy?: 'price' | 'year' | 'mileage' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Contact Types
export interface ContactInfo {
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  message: string;
  carId: string;
}

// Admin Types
export interface AdminStats {
  totalUsers: number;
  totalCars: number;
  pendingApprovals: number;
  totalSales: number;
  monthlyRevenue: number;
}

// Form Types
export interface FormError {
  field: string;
  message: string;
}

export interface FormState {
  isSubmitting: boolean;
  errors: FormError[];
}

// Navigation Types
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Constants
export const CAR_BRANDS = [
  'Toyota',
  'Honda',
  'Ford',
  'Hyundai',
  'Kia',
  'Mazda',
  'Nissan',
  'Volkswagen',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Lexus',
  'Mitsubishi',
  'Suzuki',
  'Isuzu',
  'Subaru',
] as const;

export const FUEL_TYPES = ['gasoline', 'diesel', 'hybrid', 'electric'] as const;

export const TRANSMISSION_TYPES = ['manual', 'automatic'] as const;

export const CAR_CONDITIONS = ['new', 'used'] as const;

export const USER_ROLES = ['buyer', 'seller', 'admin'] as const;

export const CAR_STATUS = ['active', 'pending', 'sold', 'rejected'] as const;
