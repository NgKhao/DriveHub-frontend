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

export interface BackendPostItem {
  postId: number;
  title: string;
  description: string;
  price: number;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'BLOCKED' | 'HIDDEN';
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
}

export interface BackendGetPostsResponse {
  messenger: string;
  status: number;
  detail: BackendPostItem[];
  instance: string;
}

export interface BackendGetPostDetailResponse {
  messenger: string;
  status: number;
  detail: BackendPostItem;
  instance: string;
}

export interface BackendUpdatePostRequest {
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

export interface BackendUpdatePostResponse {
  messenger: string;
  status: number;
  detail: {
    postId: number;
    title: string;
    description: string;
    price: number;
    status: string;
    location: string;
    phoneContact: string;
    sellerType: string;
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
    updatedAt: string;
  };
  instance: string;
}

export interface BackendDeletePostResponse {
  messenger: string;
  status: number;
  detail: null;
  instance: string;
}

// Public Posts API Types
export interface BackendPublicGetPostsResponse {
  messenger: string;
  status: number;
  detail: {
    content: BackendPostItem[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
  };
  instance: string;
}

// Public Search Posts API Types
export interface BackendPublicSearchPostsResponse {
  messenger: string;
  status: number;
  detail: BackendPostItem[];
  instance: string;
}

// Public Get Post Detail API Types
export interface BackendPublicGetPostDetailResponse {
  messenger: string;
  status: number;
  detail: BackendPostItem;
  instance: string;
}

// Search parameters interface
export interface PublicSearchParams {
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  color?: string;
  fuelType?: string;
  transmission?: string;
  location?: string;
}

// Admin Posts API Types
export interface BackendAdminGetPostsResponse {
  messenger: string;
  status: number;
  detail: {
    content: BackendPostItem[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
  };
  instance: string;
}

export interface BackendAdminGetPostDetailResponse {
  messenger: string;
  status: number;
  detail: BackendPostItem;
  instance: string;
}

export interface BackendAdminUpdatePostStatusResponse {
  messenger: string;
  status: number;
  detail: BackendPostItem;
  instance: string;
}

export interface BackendAdminDeletePostResponse {
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

// Helper function to convert image URLs with base URL
export const convertImageUrls = (images: string[]): string[] => {
  const baseUrl = import.meta.env.VITE_API_IMG_URL || 'http://localhost:8080';
  return images.map((imagePath) => `${baseUrl}${imagePath}`);
};

// Helper function to convert frontend create post data to backend update format
export const mapFrontendCreatePostToBackendUpdate = (
  postData: CreatePostData
): BackendUpdatePostRequest => {
  const sellerTypeMap: Record<
    'individual' | 'agency',
    'INDIVIDUAL' | 'AGENCY'
  > = {
    individual: 'INDIVIDUAL',
    agency: 'AGENCY',
  };

  const fuelTypeMap: Record<string, string> = {
    gasoline: 'Xăng',
    diesel: 'Dầu',
    hybrid: 'Hybrid',
    electric: 'Điện',
  };

  const transmissionMap: Record<string, string> = {
    manual: 'Số sàn',
    automatic: 'Số tự động',
  };

  const conditionMap: Record<string, string> = {
    new: 'Mới',
    used: 'Cũ',
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
      fuelType: fuelTypeMap[postData.fuelType] || postData.fuelType,
      transmission:
        transmissionMap[postData.transmission] || postData.transmission,
      color: postData.color,
      condition: conditionMap[postData.condition] || postData.condition,
    },
  };
};

// Helper function to convert backend update post response to frontend format
export const mapBackendUpdatePostResponseToSellerPost = (
  backendResponse: BackendUpdatePostResponse['detail']
): SellerPost => {
  const sellerTypeMap: Record<
    'INDIVIDUAL' | 'AGENCY',
    'individual' | 'agency'
  > = {
    INDIVIDUAL: 'individual',
    AGENCY: 'agency',
  };

  const statusMap: Record<string, 'approved' | 'pending' | 'rejected'> = {
    APPROVED: 'approved',
    PENDING: 'pending',
    REJECTED: 'rejected',
    DRAFT: 'pending',
    BLOCKED: 'rejected',
    HIDDEN: 'rejected',
  };

  const fuelTypeMap: Record<
    string,
    'gasoline' | 'diesel' | 'hybrid' | 'electric'
  > = {
    gasoline: 'gasoline',
    diesel: 'diesel',
    hybrid: 'hybrid',
    electric: 'electric',
    Xăng: 'gasoline',
    Dầu: 'diesel',
    Hybrid: 'hybrid',
    Điện: 'electric',
  };

  const transmissionMap: Record<string, 'manual' | 'automatic'> = {
    automatic: 'automatic',
    manual: 'manual',
    'Số tự động': 'automatic',
    'Số sàn': 'manual',
  };

  const conditionMap: Record<string, 'new' | 'used'> = {
    new: 'new',
    used: 'used',
    Mới: 'new',
    Cũ: 'used',
  };

  return {
    id: backendResponse.postId.toString(),
    title: backendResponse.title,
    description: backendResponse.description,
    price: backendResponse.price,
    status: statusMap[backendResponse.status] || 'pending',
    location: backendResponse.location,
    phoneContact: backendResponse.phoneContact,
    sellerType:
      sellerTypeMap[backendResponse.sellerType as 'INDIVIDUAL' | 'AGENCY'],
    images: convertImageUrls(backendResponse.images),
    carDetail: {
      make: backendResponse.carDetailDTO.make,
      model: backendResponse.carDetailDTO.model,
      year: backendResponse.carDetailDTO.year,
      mileage: backendResponse.carDetailDTO.mileage,
      fuelType:
        fuelTypeMap[backendResponse.carDetailDTO.fuelType] || 'gasoline',
      transmission:
        transmissionMap[backendResponse.carDetailDTO.transmission] ||
        'automatic',
      color: backendResponse.carDetailDTO.color,
      condition: conditionMap[backendResponse.carDetailDTO.condition] || 'used',
    },
    createdAt: backendResponse.createdAt,
    updatedAt: backendResponse.updatedAt,
  };
};

// Helper function to convert backend post item to seller post
export const mapBackendPostItemToSellerPost = (
  backendPost: BackendPostItem
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
    id: backendPost.postId.toString(),
    title: backendPost.title,
    description: backendPost.description,
    price: backendPost.price,
    status: statusMap[backendPost.status] || 'draft',
    location: backendPost.location,
    phoneContact: backendPost.phoneContact,
    sellerType: sellerTypeMap[backendPost.sellerType],
    images: convertImageUrls(backendPost.images), // Convert image URLs
    carDetail: {
      make: backendPost.carDetailDTO.make,
      model: backendPost.carDetailDTO.model,
      year: backendPost.carDetailDTO.year,
      mileage: backendPost.carDetailDTO.mileage,
      fuelType: backendPost.carDetailDTO.fuelType,
      transmission: backendPost.carDetailDTO.transmission,
      color: backendPost.carDetailDTO.color,
      condition: backendPost.carDetailDTO.condition,
    },
    createdAt: backendPost.createdAt,
    updatedAt: backendPost.updatedAt,
  };
};

// Helper function to convert backend get posts response to seller posts array
export const mapBackendGetPostsResponseToSellerPosts = (
  backendResponse: BackendGetPostsResponse['detail']
): SellerPost[] => {
  return backendResponse.map(mapBackendPostItemToSellerPost);
};

// Helper function to convert backend get post detail response to seller post
export const mapBackendGetPostDetailResponseToSellerPost = (
  backendResponse: BackendGetPostDetailResponse['detail']
): SellerPost => {
  return mapBackendPostItemToSellerPost(backendResponse);
};

// Helper function to convert backend admin get posts response to paginated seller posts
export const mapBackendAdminGetPostsResponseToPaginated = (
  backendResponse: BackendAdminGetPostsResponse['detail']
): PaginatedResponse<SellerPost> => {
  return {
    items: backendResponse.content.map(mapBackendPostItemToSellerPost),
    total: backendResponse.totalElements,
    page: backendResponse.pageNumber,
    limit: backendResponse.pageSize,
    totalPages: backendResponse.totalPages,
  };
};

// Helper function to convert backend admin get post detail response to seller post
export const mapBackendAdminGetPostDetailResponseToSellerPost = (
  backendResponse: BackendAdminGetPostDetailResponse['detail']
): SellerPost => {
  return mapBackendPostItemToSellerPost(backendResponse);
};

// Helper function to convert backend admin update post status response to seller post
export const mapBackendAdminUpdatePostStatusResponseToSellerPost = (
  backendResponse: BackendAdminUpdatePostStatusResponse['detail']
): SellerPost => {
  return mapBackendPostItemToSellerPost(backendResponse);
};

// Helper function to convert backend public get posts response to paginated seller posts
export const mapBackendPublicGetPostsResponseToPaginated = (
  backendResponse: BackendPublicGetPostsResponse['detail']
): PaginatedResponse<SellerPost> => {
  return {
    items: backendResponse.content.map(mapBackendPostItemToSellerPost),
    total: backendResponse.totalElements,
    page: backendResponse.pageNumber,
    limit: backendResponse.pageSize,
    totalPages: backendResponse.totalPages,
  };
};

// Helper function to convert backend public search posts response to seller posts array
export const mapBackendPublicSearchPostsResponseToSellerPosts = (
  backendResponse: BackendPublicSearchPostsResponse['detail']
): SellerPost[] => {
  return backendResponse.map(mapBackendPostItemToSellerPost);
};

// Helper function to convert backend public get post detail response to seller post
export const mapBackendPublicGetPostDetailResponseToSellerPost = (
  backendResponse: BackendPublicGetPostDetailResponse['detail']
): SellerPost => {
  return mapBackendPostItemToSellerPost(backendResponse);
};

// Helper function to convert frontend filters to backend search params
export const mapFrontendFiltersToBackendSearchParams = (
  filters: CarFilters,
  searchQuery?: string
): PublicSearchParams => {
  const params: PublicSearchParams = {};

  // Map CarFilters to backend search params
  if (filters.brand) params.make = filters.brand;
  if (filters.model) params.model = filters.model;
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.condition) params.condition = filters.condition;
  if (filters.fuelType) params.fuelType = filters.fuelType;
  if (filters.transmission) params.transmission = filters.transmission;
  if (filters.location) params.location = filters.location;

  // Handle search query (could be for color or general search)
  if (searchQuery && searchQuery.trim()) {
    // Assume search query is for color for now
    // You can extend this logic based on your requirements
    params.color = searchQuery.trim();
  }

  return params;
};

// Helper function to convert SellerPost to Car format for CarCard component
export const mapSellerPostToCar = (sellerPost: SellerPost): Car => {
  return {
    id: sellerPost.id,
    title: sellerPost.title,
    brand: sellerPost.carDetail.make,
    model: sellerPost.carDetail.model,
    year: sellerPost.carDetail.year,
    price: sellerPost.price,
    mileage: sellerPost.carDetail.mileage,
    fuelType: sellerPost.carDetail.fuelType.toLowerCase() as
      | 'gasoline'
      | 'diesel'
      | 'hybrid'
      | 'electric',
    transmission: sellerPost.carDetail.transmission.toLowerCase() as
      | 'manual'
      | 'automatic',
    color: sellerPost.carDetail.color,
    description: sellerPost.description,
    images: sellerPost.images,
    sellerId: sellerPost.id, // Using post id as seller id for now
    sellerName: 'Seller', // Default name since not available in SellerPost
    sellerPhone: sellerPost.phoneContact,
    sellerType: sellerPost.sellerType === 'agency' ? 'dealer' : 'individual',
    location: sellerPost.location,
    status:
      sellerPost.status === 'approved'
        ? 'active'
        : (sellerPost.status as 'pending' | 'sold' | 'rejected'),
    condition: sellerPost.carDetail.condition.toLowerCase() as 'new' | 'used',
    createdAt: sellerPost.createdAt,
    updatedAt: sellerPost.updatedAt || sellerPost.createdAt,
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

// Favorite API Types
export interface BackendAddFavoriteResponse {
  messenger: string;
  status: number;
  detail: {
    favoriteId: number;
    post: BackendPostItem;
  };
  instance: string;
}

export interface BackendRemoveFavoriteResponse {
  messenger: string;
  status: number;
  detail: null;
  instance: string;
}

export interface BackendGetFavoritesResponse {
  messenger: string;
  status: number;
  detail: BackendFavoriteItem[];
  instance: string;
}

export interface BackendFavoriteItem {
  favoriteId: number;
  post: {
    postId: number;
    title: string;
    description: string;
    price: number;
    status: string;
    location: string;
    phoneContact: string;
    sellerType: string;
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
    updatedAt: string;
  };
}

export interface FavoriteItem {
  favoriteId: number;
  post: SellerPost;
}

// Mapping function for add favorite response
export const mapBackendAddFavoriteResponseToFavoriteItem = (
  backendResponse: BackendAddFavoriteResponse['detail']
): FavoriteItem => {
  return {
    favoriteId: backendResponse.favoriteId,
    post: mapBackendPostItemToSellerPost(backendResponse.post),
  };
};

// Mapping function for backend favorite item to SellerPost
export const mapBackendFavoriteItemToSellerPost = (
  backendFavoriteItem: BackendFavoriteItem
): SellerPost => {
  const post = backendFavoriteItem.post;
  const baseImgUrl =
    import.meta.env.VITE_API_IMG_URL || 'http://localhost:8080';

  return {
    id: post.postId.toString(),
    title: post.title,
    description: post.description,
    price: post.price,
    status: post.status.toLowerCase() as 'approved' | 'pending' | 'rejected',
    location: post.location,
    phoneContact: post.phoneContact,
    sellerType: post.sellerType.toLowerCase() as 'individual' | 'agency',
    images: post.images.map((img) => `${baseImgUrl}${img}`),
    carDetail: {
      make: post.carDetailDTO.make,
      model: post.carDetailDTO.model,
      year: post.carDetailDTO.year,
      mileage: post.carDetailDTO.mileage,
      fuelType: post.carDetailDTO.fuelType.toLowerCase() as
        | 'gasoline'
        | 'diesel'
        | 'hybrid'
        | 'electric',
      transmission: post.carDetailDTO.transmission.toLowerCase() as
        | 'manual'
        | 'automatic',
      color: post.carDetailDTO.color,
      condition: post.carDetailDTO.condition.toLowerCase() as 'new' | 'used',
    },
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};

// Mapping function for get favorites response
export const mapBackendGetFavoritesResponseToSellerPosts = (
  backendResponse: BackendGetFavoritesResponse['detail']
): SellerPost[] => {
  return backendResponse.map(mapBackendFavoriteItemToSellerPost);
};
