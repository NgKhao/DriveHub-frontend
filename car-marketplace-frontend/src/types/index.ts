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

export interface BackendRegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  roleName: string; // 'ADMIN', 'SELLER', 'BUYER'
}

export interface BackendRegisterResponse {
  messenger: string;
  status: number;
  detail: {
    fullName: string;
    email: string;
    role: string; // 'ADMIN', 'SELLER', 'BUYER'
    numberPhone: string;
  };
  instance: string;
}

export interface BackendUpdateProfileRequest {
  fullName?: string;
  numberPhone?: string;
}

export interface BackendUpdateProfileResponse {
  messenger: string;
  status: number;
  detail: {
    id: number;
    email: string;
    fullName: string;
    numberPhone: string;
    role: string;
    isActive: boolean;
  };
  instance: string;
}

export interface BackendResetPasswordRequest {
  password: string;
  newPassword: string;
}

export interface BackendResetPasswordResponse {
  messenger: string;
  status: number;
  detail: null;
  instance: string;
}

export interface BackendGetUsersResponse {
  messenger: string;
  status: number;
  detail: {
    content: {
      id: number;
      email: string;
      fullName: string;
      numberPhone: string;
      role: string;
      isActive: boolean;
    }[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
  };
  instance: string;
}

export interface BackendAdminUpdateUserRequest {
  fullName?: string;
  numberPhone?: string;
  roleName?: string; // 'BUYER', 'SELLER'
  isActive?: boolean;
}

export interface BackendAdminUpdateUserResponse {
  messenger: string;
  status: number;
  detail: {
    id: number;
    email: string;
    fullName: string;
    numberPhone: string;
    role: string; // 'BUYER', 'SELLER', 'ADMIN'
    isActive: boolean;
  };
  instance: string;
}

export interface BackendCreateUserRequest {
  email: string;
  fullName: string;
  numberPhone: string;
  role: string; // 'BUYER', 'SELLER'
}

export interface BackendCreateUserResponse {
  messenger: string;
  status: number;
  detail: {
    id: number;
    email: string;
    fullName: string;
    numberPhone: string;
    role: string; // 'BUYER', 'SELLER'
    isActive: boolean;
  };
  instance: string;
}

export interface BackendDeleteUserResponse {
  messenger: string;
  status: number;
  detail: null;
  instance: string;
}

// Seller Post Types
export interface BackendCreatePostRequest {
  title: string;
  description: string;
  price: number;
  location: string;
  phoneContact: string;
  sellerType: 'INDIVIDUAL' | 'AGENCY';
  carDetailDTO: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    fuelType: string;
    transmission: string;
    color: string;
    condition: string;
  };
}

export interface BackendCreatePostResponse {
  messenger: string;
  status: number;
  detail: {
    post: {
      postId: number;
      title: string;
      description: string;
      price: number;
      status:
        | 'DRAFT'
        | 'PENDING'
        | 'APPROVED'
        | 'REJECTED'
        | 'BLOCKED'
        | 'HIDDEN';
      location: string;
      phoneContact: string;
      sellerType: 'INDIVIDUAL' | 'AGENCY';
      images: string[];
      carDetailDTO: {
        make: string;
        model: string;
        year: number;
        mileage: number;
        fuelType: string;
        transmission: string;
        color: string;
        condition: string;
      };
      createdAt: string;
      updatedAt: string | null;
    };
    vnpayUrl: string;
  };
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

// Helper function to convert frontend RegisterRequest to backend format
export const mapFrontendRegisterToBackendRegister = (
  registerData: RegisterRequest
): BackendRegisterRequest => {
  // Map frontend role to backend role
  const roleMap: Record<'buyer' | 'seller', string> = {
    buyer: 'BUYER',
    seller: 'SELLER',
  };

  return {
    email: registerData.email,
    password: registerData.password,
    fullName: registerData.name,
    phone: registerData.phone || '',
    roleName: roleMap[registerData.role],
  };
};

// Helper function to convert backend register response to frontend user
export const mapBackendRegisterResponseToUser = (
  backendResponse: BackendRegisterResponse['detail']
): User => {
  const roleMap: Record<string, 'buyer' | 'seller'> = {
    BUYER: 'buyer',
    SELLER: 'seller',
  };

  return {
    id: backendResponse.email,
    email: backendResponse.email,
    name: backendResponse.fullName,
    role: roleMap[backendResponse.role] || 'buyer',
    phone: backendResponse.numberPhone,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Helper function to convert frontend user data to backend update format
export const mapFrontendUserToBackendUpdate = (userData: {
  name?: string;
  phone?: string;
}): BackendUpdateProfileRequest => {
  return {
    fullName: userData.name,
    numberPhone: userData.phone,
  };
};

// Helper function to convert backend profile response to frontend user
export const mapBackendUpdateProfileResponseToUser = (
  backendResponse: BackendUpdateProfileResponse['detail']
): User => {
  const roleMap: Record<string, 'buyer' | 'seller' | 'admin'> = {
    BUYER: 'buyer',
    SELLER: 'seller',
    ADMIN: 'admin',
  };

  return {
    id: backendResponse.id.toString(),
    email: backendResponse.email,
    name: backendResponse.fullName,
    role: roleMap[backendResponse.role] || 'buyer',
    phone: backendResponse.numberPhone,
    isVerified: backendResponse.isActive,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Helper function to convert backend get users response to frontend format
export const mapBackendGetUsersResponseToPaginated = (
  backendResponse: BackendGetUsersResponse['detail']
): PaginatedResponse<User> => {
  const roleMap: Record<string, 'buyer' | 'seller' | 'admin'> = {
    BUYER: 'buyer',
    SELLER: 'seller',
    ADMIN: 'admin',
  };

  const users: User[] = backendResponse.content.map((user) => ({
    id: user.id.toString(),
    email: user.email,
    name: user.fullName,
    role: roleMap[user.role] || 'buyer',
    phone: user.numberPhone,
    isVerified: user.isActive,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  return {
    items: users,
    total: backendResponse.totalElements,
    page: backendResponse.pageNumber + 1, // Backend uses 0-based, frontend uses 1-based
    limit: backendResponse.pageSize,
    totalPages: backendResponse.totalPages,
  };
};

// Helper function to convert frontend user data to backend admin update format
export const mapFrontendUserToBackendAdminUpdate = (userData: {
  name?: string;
  phone?: string;
  role?: 'buyer' | 'seller';
  isVerified?: boolean;
}): BackendAdminUpdateUserRequest => {
  const roleMap: Record<'buyer' | 'seller', string> = {
    buyer: 'BUYER',
    seller: 'SELLER',
  };

  return {
    fullName: userData.name,
    numberPhone: userData.phone,
    roleName: userData.role ? roleMap[userData.role] : undefined,
    isActive: userData.isVerified,
  };
};

// Helper function to convert backend admin update response to frontend user
export const mapBackendAdminUpdateResponseToUser = (
  backendResponse: BackendAdminUpdateUserResponse['detail']
): User => {
  const roleMap: Record<string, 'buyer' | 'seller' | 'admin'> = {
    BUYER: 'buyer',
    SELLER: 'seller',
    ADMIN: 'admin',
  };

  return {
    id: backendResponse.id.toString(),
    email: backendResponse.email,
    name: backendResponse.fullName,
    role: roleMap[backendResponse.role] || 'buyer',
    phone: backendResponse.numberPhone,
    isVerified: backendResponse.isActive,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Helper function to convert frontend create user data to backend format
export const mapFrontendCreateUserToBackend = (userData: {
  name: string;
  email: string;
  phone: string;
  role: 'buyer' | 'seller';
}): BackendCreateUserRequest => {
  const roleMap: Record<'buyer' | 'seller', string> = {
    buyer: 'BUYER',
    seller: 'SELLER',
  };

  return {
    email: userData.email,
    fullName: userData.name,
    numberPhone: userData.phone,
    role: roleMap[userData.role],
  };
};

// Helper function to convert backend create user response to frontend user
export const mapBackendCreateUserResponseToUser = (
  backendResponse: BackendCreateUserResponse['detail']
): User => {
  const roleMap: Record<string, 'buyer' | 'seller' | 'admin'> = {
    BUYER: 'buyer',
    SELLER: 'seller',
    ADMIN: 'admin',
  };

  return {
    id: backendResponse.id.toString(),
    email: backendResponse.email,
    name: backendResponse.fullName,
    role: roleMap[backendResponse.role] || 'buyer',
    phone: backendResponse.numberPhone,
    isVerified: backendResponse.isActive,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Frontend Create Post Types
export interface CreatePostData {
  title: string;
  description: string;
  price: number;
  location: string;
  phoneContact: string;
  sellerType: 'individual' | 'agency';
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  color: string;
  condition: string;
  images: File[];
}

export interface SellerPost {
  id: string;
  title: string;
  description: string;
  price: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'blocked' | 'hidden';
  location: string;
  phoneContact: string;
  sellerType: 'individual' | 'agency';
  images: string[];
  carDetail: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    fuelType: string;
    transmission: string;
    color: string;
    condition: string;
  };
  createdAt: string;
  updatedAt: string | null;
}

// Helper function to convert frontend create post data to backend format
export const mapFrontendCreatePostToBackend = (
  postData: CreatePostData
): BackendCreatePostRequest => {
  const sellerTypeMap: Record<
    'individual' | 'agency',
    'INDIVIDUAL' | 'AGENCY'
  > = {
    individual: 'INDIVIDUAL',
    agency: 'AGENCY',
  };

  return {
    title: postData.title,
    description: postData.description,
    price: postData.price,
    location: postData.location,
    phoneContact: postData.phoneContact,
    sellerType: sellerTypeMap[postData.sellerType],
    carDetailDTO: {
      make: postData.make,
      model: postData.model,
      year: postData.year,
      mileage: postData.mileage,
      fuelType: postData.fuelType,
      transmission: postData.transmission,
      color: postData.color,
      condition: postData.condition,
    },
  };
};

// Helper function to convert backend create post response to frontend format
export const mapBackendCreatePostResponseToSellerPost = (
  backendResponse: BackendCreatePostResponse['detail']['post']
): SellerPost => {
  const sellerTypeMap: Record<
    'INDIVIDUAL' | 'AGENCY',
    'individual' | 'agency'
  > = {
    INDIVIDUAL: 'individual',
    AGENCY: 'agency',
  };

  const statusMap: Record<
    string,
    'draft' | 'pending' | 'approved' | 'rejected' | 'blocked' | 'hidden'
  > = {
    DRAFT: 'draft',
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    BLOCKED: 'blocked',
    HIDDEN: 'hidden',
  };

  return {
    id: backendResponse.postId.toString(),
    title: backendResponse.title,
    description: backendResponse.description,
    price: backendResponse.price,
    status: statusMap[backendResponse.status] || 'draft',
    location: backendResponse.location,
    phoneContact: backendResponse.phoneContact,
    sellerType: sellerTypeMap[backendResponse.sellerType],
    images: backendResponse.images,
    carDetail: {
      make: backendResponse.carDetailDTO.make,
      model: backendResponse.carDetailDTO.model,
      year: backendResponse.carDetailDTO.year,
      mileage: backendResponse.carDetailDTO.mileage,
      fuelType: backendResponse.carDetailDTO.fuelType,
      transmission: backendResponse.carDetailDTO.transmission,
      color: backendResponse.carDetailDTO.color,
      condition: backendResponse.carDetailDTO.condition,
    },
    createdAt: backendResponse.createdAt,
    updatedAt: backendResponse.updatedAt,
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
