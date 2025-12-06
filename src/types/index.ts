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
  status: string;
  data: {
    userInfo: {
      id: number;
      name: string;
      email: string;
      role: 'buyer' | 'seller' | 'admin';
      phone: string;
      status: string;
    };
    type: string; // 'Bearer'
    token: string;
  };
}

export interface BackendLogoutResponse {
  messenger: string;
  status: string;
}

export interface BackendRegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  roleName: 'buyer' | 'seller' | 'admin';
}

export interface BackendRegisterResponse {
  messenger: string;
  status: string;
  data: {
    userInfo: {
      id: number;
      name: string;
      email: string;
      phone: string;
      role: 'buyer' | 'seller';
      status: 'active' | 'inactive';
    };
    token: string;
    type: string;
  };
}

export interface BackendUpdateProfileRequest {
  fullName?: string;
  numberPhone?: string;
}

export interface BackendProfileResponse {
  messenger: string;
  status: string;
  detail: {
    id: number;
    email: string;
    fullName: string;
    numberPhone: string;
    role: 'buyer' | 'seller' | 'admin';
    status: 'active' | 'inactive';
  };
}

export interface BackendResetPasswordRequest {
  password: string;
  newPassword: string;
}

export interface BackendResetPasswordResponse {
  messenger: string;
  status: string;
}

export interface BackendGetUsersResponse {
  messenger: string;
  status: string;
  detail: {
    content: {
      id: number;
      email: string;
      fullName: string;
      numberPhone: string;
      role: 'buyer' | 'seller' | 'admin';
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
  roleName?: 'buyer' | 'seller' | 'admin';
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
    role: 'buyer' | 'seller' | 'admin';
    isActive: boolean;
  };
  instance: string;
}

export interface BackendCreateUserRequest {
  email: string;
  fullName: string;
  numberPhone: string;
  role: 'buyer' | 'seller' | 'admin';
  password: string;
}

export interface BackendCreateUserResponse {
  messenger: string;
  status: number;
  detail: {
    id: number;
    email: string;
    fullName: string;
    numberPhone: string;
    role: 'buyer' | 'seller' | 'admin';
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
// Backend create post request - fields sent directly via FormData (Laravel format)
export interface BackendCreatePostRequest {
  title: string;
  description: string;
  price: number;
  brand: string; // Laravel uses 'brand' not 'make'
  model: string;
  year: number;
  color: string;
  mileage: number;
  location: string;
  phoneContact: string;
  transmission: 'manual' | 'automatic';
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  condition: 'new' | 'used';
  // images are sent as files via FormData
}

// Backend create post response - uses PostResource format
export interface BackendCreatePostResponse {
  message: string;
  status: string;
  detail: {
    post: {
      postId: number;
      title: string;
      description: string;
      price: number;
      status: 'draft' | 'pending' | 'approved' | 'rejected';
      location: string;
      phoneContact: string;
      images: string[];
      carDetail: {
        brand: string;
        model: string;
        year: number;
        mileage: number;
        transmission: 'manual' | 'automatic';
        color: string;
        condition: 'new' | 'used';
        fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
      };
      createdAt: string;
      updatedAt: string | null;
    };
    paymentUrl: string; // URL to create payment
  };
}

// Backend payment creation response
export interface BackendCreatePaymentResponse {
  message: string;
  status: string;
  detail: {
    payment_id: number;
    vnpay_url: string;
    amount: number;
  };
}

// Backend car detail in post response (uses brand instead of make)
export interface BackendCarDetail {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  transmission: string;
  color: string;
  condition: string;
  fuelType: string;
}

export interface BackendPostItem {
  postId: number;
  title: string;
  description: string;
  price: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'blocked' | 'hidden';
  location: string;
  phoneContact: string;
  images: string[];
  carDetail: BackendCarDetail;
  createdAt: string;
  updatedAt: string | null;
}

// Backend pagination response structure
export interface BackendPagination {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

export interface BackendGetPostsResponse {
  message: string;
  status: string;
  detail: {
    posts: BackendPostItem[];
    pagination: BackendPagination;
  };
}

export interface BackendGetPostDetailResponse {
  message: string;
  status: string;
  detail: {
    post: BackendPostItem;
  };
}

// Backend update post request - fields sent directly via FormData (Laravel format)
export interface BackendUpdatePostRequest {
  title?: string;
  description?: string;
  price?: number;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  mileage?: number;
  location?: string;
  phoneContact?: string;
  transmission?: 'manual' | 'automatic';
  fuelType?: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  condition?: 'new' | 'used';
  // images are sent as files via FormData
}

// Backend update post response - uses PostResource format (same as show/create)
export interface BackendUpdatePostResponse {
  message: string;
  status: string;
  detail: {
    post: {
      postId: number;
      title: string;
      description: string;
      price: number;
      status: 'draft' | 'pending' | 'approved' | 'rejected';
      location: string;
      phoneContact: string;
      images: string[];
      carDetail: {
        brand: string;
        model: string;
        year: number;
        mileage: number;
        transmission: 'manual' | 'automatic';
        color: string;
        condition: 'new' | 'used';
        fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
      };
      seller?: {
        id: number;
        name: string;
        email: string;
        phone: string | null;
      };
      createdAt: string;
      updatedAt: string;
    };
  };
}

export interface BackendDeletePostResponse {
  messenger: string;
  status: number;
  detail: null;
  instance: string;
}

// Public Posts API Types
export interface BackendPublicGetPostsResponse {
  message: string;
  status: string;
  detail: {
    posts: BackendPostItem[];
    pagination: BackendPagination;
  };
}

// Public Search Posts API Types
export interface BackendPublicSearchPostsResponse {
  messenger: string;
  status: number;
  detail: BackendPostItem[];
  instance: string;
}

// Public Get Post Detail API Types
// GET /posts/{id} - Chi tiết bài đăng public
export interface BackendPublicPostDetailItem {
  postId: number;
  title: string;
  description: string;
  price: number;
  status: string;
  location: string;
  phoneContact: string;
  images: string[];
  carDetail: BackendCarDetail;
  seller: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BackendPublicGetPostDetailResponse {
  message: string;
  status: string;
  detail: BackendPublicPostDetailItem;
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
// GET /admin/posts - Danh sách tất cả bài đăng (admin)
export interface BackendAdminGetPostsResponse {
  message: string;
  status: string;
  detail: {
    posts: BackendPostItem[];
    pagination: BackendPagination;
  };
}

// GET /admin/posts/{id} - Chi tiết bài đăng (admin)
// Response structure same as public post detail (with seller info)
export interface BackendAdminGetPostDetailResponse {
  message: string;
  status: string;
  detail: BackendPublicPostDetailItem;
}

// PATCH /admin/posts/{id}/status - Cập nhật trạng thái bài đăng (admin)
// Request body: { "status": "approved" | "rejected" | "pending" | "draft" }
// Response structure same as post detail (with seller info)
export interface BackendAdminUpdatePostStatusResponse {
  message: string;
  status: string;
  detail: BackendPublicPostDetailItem;
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
  backendUser: BackendLoginResponse['data']['userInfo']
): User => {
  return {
    id: backendUser.email, // Use email as ID since backend doesn't provide ID
    email: backendUser.email,
    name: backendUser.name,
    role: backendUser.role,
    phone: backendUser.phone,
    isVerified: backendUser.status === 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Helper function to convert frontend RegisterRequest to backend format
export const mapFrontendRegisterToBackendRegister = (
  registerData: RegisterRequest
): BackendRegisterRequest => {
  return {
    email: registerData.email,
    password: registerData.password,
    fullName: registerData.name,
    phone: registerData.phone || '',
    roleName: registerData.role,
  };
};

// Helper function to convert backend register response to frontend user
export const mapBackendRegisterResponseToUser = (
  backendResponse: BackendRegisterResponse['data']['userInfo']
): User => {
  return {
    id: backendResponse.email,
    email: backendResponse.email,
    name: backendResponse.name,
    role: backendResponse.role,
    phone: backendResponse.phone,
    isVerified: backendResponse.status === 'active',
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
  backendResponse: BackendProfileResponse['detail']
): User => {
  return {
    id: backendResponse.id.toString(),
    email: backendResponse.email,
    name: backendResponse.fullName,
    role: backendResponse.role || 'buyer',
    phone: backendResponse.numberPhone,
    isVerified: backendResponse.status === 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Helper function to convert backend get users response to frontend format
export const mapBackendGetUsersResponseToPaginated = (
  backendResponse: BackendGetUsersResponse['detail']
): PaginatedResponse<User> => {
  const users: User[] = backendResponse.content.map((user) => ({
    id: user.id.toString(),
    email: user.email,
    name: user.fullName,
    role: user.role as 'buyer' | 'seller' | 'admin',
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
  role?: 'buyer' | 'seller' | 'admin';
  isVerified?: boolean;
}): BackendAdminUpdateUserRequest => {
  return {
    fullName: userData.name,
    numberPhone: userData.phone,
    roleName: userData.role,
    isActive: userData.isVerified,
  };
};

// Helper function to convert backend admin update response to frontend user
export const mapBackendAdminUpdateResponseToUser = (
  backendResponse: BackendAdminUpdateUserResponse['detail']
): User => {
  return {
    id: backendResponse.id.toString(),
    email: backendResponse.email,
    name: backendResponse.fullName,
    role: backendResponse.role as 'buyer' | 'seller' | 'admin',
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
  role: 'buyer' | 'seller' | 'admin';
  password: string;
}): BackendCreateUserRequest => {
  return {
    email: userData.email,
    fullName: userData.name,
    numberPhone: userData.phone,
    role: userData.role,
    password: userData.password,
  };
};

// Helper function to convert backend create user response to frontend user
export const mapBackendCreateUserResponseToUser = (
  backendResponse: BackendCreateUserResponse['detail']
): User => {
  return {
    id: backendResponse.id.toString(),
    email: backendResponse.email,
    name: backendResponse.fullName,
    role: backendResponse.role,
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
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  color: string;
  condition: string;
  images: File[];
  existingImageUrls?: string[]; // URLs of existing images to keep
}

// Seller Info interface for public API response
export interface SellerInfo {
  sellerId: number;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
}

export interface SellerPost {
  id: string;
  title: string;
  description: string;
  price: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'blocked' | 'hidden';
  location: string;
  phoneContact: string;
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
  // Optional seller info (available when fetched from public detail API)
  sellerInfo?: SellerInfo;
}

// Helper function to convert frontend create post data to backend format
// Laravel API expects fields directly, not nested in carDetailDTO
export const mapFrontendCreatePostToBackend = (
  postData: CreatePostData
): BackendCreatePostRequest => {
  return {
    title: postData.title,
    description: postData.description,
    price: postData.price,
    brand: postData.make, // Laravel uses 'brand' not 'make'
    model: postData.model,
    year: postData.year,
    color: postData.color,
    mileage: postData.mileage,
    location: postData.location,
    phoneContact: postData.phoneContact,
    transmission: postData.transmission as 'manual' | 'automatic',
    fuelType: postData.fuelType as 'gasoline' | 'diesel' | 'electric' | 'hybrid',
    condition: postData.condition as 'new' | 'used',
  };
};

// Helper function to convert backend create post response to frontend format
// Response uses PostResource format with carDetail (not carDetailDTO)
export const mapBackendCreatePostResponseToSellerPost = (
  backendResponse: BackendCreatePostResponse['detail']['post']
): SellerPost => {
  return {
    id: backendResponse.postId.toString(),
    title: backendResponse.title,
    description: backendResponse.description,
    price: backendResponse.price,
    status: backendResponse.status, // Already lowercase from backend
    location: backendResponse.location,
    phoneContact: backendResponse.phoneContact,
    images: convertImageUrls(backendResponse.images),
    carDetail: {
      make: backendResponse.carDetail.brand, // Backend uses 'brand'
      model: backendResponse.carDetail.model,
      year: backendResponse.carDetail.year,
      mileage: backendResponse.carDetail.mileage,
      fuelType: backendResponse.carDetail.fuelType,
      transmission: backendResponse.carDetail.transmission,
      color: backendResponse.carDetail.color,
      condition: backendResponse.carDetail.condition,
    },
    createdAt: backendResponse.createdAt,
    updatedAt: backendResponse.updatedAt,
  };
};

// Helper function to convert image URLs with base URL
// Handles both relative paths (/storage/...) and already full URLs
export const convertImageUrls = (images: string[]): string[] => {
  const baseUrl = import.meta.env.VITE_API_IMG_URL || 'http://localhost:8000';
  return images.map((imagePath) => {
    // If already a full URL, return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Otherwise, prepend base URL
    return `${baseUrl}${imagePath}`;
  });
};

// Helper function to convert frontend create post data to backend update format
// Laravel API expects fields directly, not nested in carDetailDTO
export const mapFrontendCreatePostToBackendUpdate = (
  postData: CreatePostData
): BackendUpdatePostRequest => {
  return {
    title: postData.title,
    description: postData.description,
    price: postData.price,
    brand: postData.make, // Laravel uses 'brand' not 'make'
    model: postData.model,
    year: postData.year,
    color: postData.color,
    mileage: postData.mileage,
    location: postData.location,
    phoneContact: postData.phoneContact,
    transmission: postData.transmission as 'manual' | 'automatic',
    fuelType: postData.fuelType as 'gasoline' | 'diesel' | 'electric' | 'hybrid',
    condition: postData.condition as 'new' | 'used',
  };
};

// Helper function to convert backend update post response to frontend format
// Response uses PostResource format with detail.post (same as show/create)
export const mapBackendUpdatePostResponseToSellerPost = (
  backendResponse: BackendUpdatePostResponse['detail']
): SellerPost => {
  const post = backendResponse.post;

  return {
    id: post.postId.toString(),
    title: post.title,
    description: post.description,
    price: post.price,
    status: post.status, // Already lowercase from backend
    location: post.location,
    phoneContact: post.phoneContact,
    images: convertImageUrls(post.images),
    carDetail: {
      make: post.carDetail.brand, // Backend uses 'brand'
      model: post.carDetail.model,
      year: post.carDetail.year,
      mileage: post.carDetail.mileage,
      fuelType: post.carDetail.fuelType,
      transmission: post.carDetail.transmission,
      color: post.carDetail.color,
      condition: post.carDetail.condition,
    },
    sellerInfo: post.seller
      ? {
          sellerId: post.seller.id,
          sellerName: post.seller.name,
          sellerEmail: post.seller.email,
          sellerPhone: post.seller.phone || '',
        }
      : undefined,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};

// Helper function to convert backend post item to seller post
export const mapBackendPostItemToSellerPost = (
  backendPost: BackendPostItem
): SellerPost => {
  // Backend now returns lowercase status directly, but handle both cases for compatibility
  const statusValue = backendPost.status.toLowerCase() as
    | 'draft'
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'blocked'
    | 'hidden';

  return {
    id: backendPost.postId.toString(),
    title: backendPost.title,
    description: backendPost.description,
    price: backendPost.price,
    status: statusValue,
    location: backendPost.location,
    phoneContact: backendPost.phoneContact,
    images: convertImageUrls(backendPost.images), // Convert image URLs
    carDetail: {
      make: backendPost.carDetail.brand, // Backend uses 'brand', frontend uses 'make'
      model: backendPost.carDetail.model,
      year: backendPost.carDetail.year,
      mileage: backendPost.carDetail.mileage,
      fuelType: backendPost.carDetail.fuelType,
      transmission: backendPost.carDetail.transmission,
      color: backendPost.carDetail.color,
      condition: backendPost.carDetail.condition,
    },
    createdAt: backendPost.createdAt,
    updatedAt: backendPost.updatedAt,
  };
};

// Helper function to convert backend get posts response to seller posts array
export const mapBackendGetPostsResponseToSellerPosts = (
  backendResponse: BackendGetPostsResponse['detail']
): SellerPost[] => {
  return backendResponse.posts.map(mapBackendPostItemToSellerPost);
};

// Helper function to convert backend get post detail response to seller post
export const mapBackendGetPostDetailResponseToSellerPost = (
  backendResponse: BackendGetPostDetailResponse['detail']
): SellerPost => {
  return mapBackendPostItemToSellerPost(backendResponse.post);
};

// Helper function to convert backend admin get posts response to paginated seller posts
// Maps BackendAdminGetPostsResponse to PaginatedResponse<SellerPost>
export const mapBackendAdminGetPostsResponseToPaginated = (
  backendResponse: BackendAdminGetPostsResponse['detail']
): PaginatedResponse<SellerPost> => {
  return {
    items: backendResponse.posts.map(mapBackendPostItemToSellerPost),
    total: backendResponse.pagination.total,
    page: backendResponse.pagination.currentPage,
    limit: backendResponse.pagination.perPage,
    totalPages: backendResponse.pagination.lastPage,
  };
};

// Helper function to convert backend admin get post detail response to seller post
// Uses same mapper as public post detail since response structure is identical
export const mapBackendAdminGetPostDetailResponseToSellerPost = (
  backendResponse: BackendAdminGetPostDetailResponse['detail']
): SellerPost => {
  return mapBackendPublicPostDetailToSellerPost(backendResponse);
};

// Helper function to convert backend admin update post status response to seller post
// Uses same mapper as public post detail since response structure is identical
export const mapBackendAdminUpdatePostStatusResponseToSellerPost = (
  backendResponse: BackendAdminUpdatePostStatusResponse['detail']
): SellerPost => {
  return mapBackendPublicPostDetailToSellerPost(backendResponse);
};

// Helper function to convert backend public get posts response to paginated seller posts
export const mapBackendPublicGetPostsResponseToPaginated = (
  backendResponse: BackendPublicGetPostsResponse['detail']
): PaginatedResponse<SellerPost> => {
  return {
    items: backendResponse.posts.map(mapBackendPostItemToSellerPost),
    total: backendResponse.pagination.total,
    page: backendResponse.pagination.currentPage,
    limit: backendResponse.pagination.perPage,
    totalPages: backendResponse.pagination.lastPage,
  };
};

// Helper function to convert backend public search posts response to seller posts array
export const mapBackendPublicSearchPostsResponseToSellerPosts = (
  backendResponse: BackendPublicSearchPostsResponse['detail']
): SellerPost[] => {
  return backendResponse.map(mapBackendPostItemToSellerPost);
};

// Helper function to convert backend public get post detail response to seller post
// Maps BackendPublicPostDetailItem to SellerPost
export const mapBackendPublicPostDetailToSellerPost = (
  backendResponse: BackendPublicPostDetailItem
): SellerPost => {
  return {
    id: backendResponse.postId.toString(),
    title: backendResponse.title,
    description: backendResponse.description,
    price: backendResponse.price,
    status: backendResponse.status.toLowerCase() as 'draft' | 'pending' | 'approved' | 'rejected' | 'blocked' | 'hidden',
    location: backendResponse.location,
    phoneContact: backendResponse.phoneContact,
    images: convertImageUrls(backendResponse.images || []),
    carDetail: {
      make: backendResponse.carDetail.brand,
      model: backendResponse.carDetail.model,
      year: backendResponse.carDetail.year,
      mileage: backendResponse.carDetail.mileage,
      transmission: backendResponse.carDetail.transmission,
      color: backendResponse.carDetail.color,
      condition: backendResponse.carDetail.condition,
      fuelType: backendResponse.carDetail.fuelType,
    },
    sellerInfo: {
      sellerId: backendResponse.seller.id,
      sellerName: backendResponse.seller.name,
      sellerEmail: backendResponse.seller.email,
      sellerPhone: backendResponse.seller.phone,
    },
    createdAt: backendResponse.createdAt,
    updatedAt: backendResponse.updatedAt,
  };
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

  return {
    id: post.postId.toString(),
    title: post.title,
    description: post.description,
    price: post.price,
    status: post.status.toLowerCase() as 'approved' | 'pending' | 'rejected',
    location: post.location,
    phoneContact: post.phoneContact,
    images: convertImageUrls(post.images),
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

// ============================================================================
// REVIEW SYSTEM TYPES
// ============================================================================

// Frontend Review interfaces
export interface Review {
  id: string;
  rating: number;
  comment?: string;
  reviewerId: string;
  reviewedId: string;
  createdAt: string;
}

export interface ReviewSummary {
  sellerId: string;
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
}

export interface CreateReviewData {
  reviewedId: string;
  rating: number;
  comment?: string;
}

// Backend Review API types
export interface BackendCreateReviewRequest {
  reviewedId: number;
  rating: number;
  comment?: string;
}

export interface BackendCreateReviewResponse {
  messenger: string;
  status: number;
  detail: {
    id: number;
    rating: number;
    comment?: string;
    reviewerId: number;
    reviewedId: number;
    createdAt: string;
  };
  instance: string;
}

export interface BackendReviewItem {
  id: number;
  rating: number;
  comment?: string;
  reviewerId: number;
  reviewedId: number;
  createdAt: string;
}

export interface BackendGetSellerReviewsResponse {
  messenger: string;
  status: number;
  detail: {
    content: BackendReviewItem[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
  };
  instance: string;
}

// Mapping functions
export const mapFrontendCreateReviewToBackend = (
  reviewData: CreateReviewData
): BackendCreateReviewRequest => {
  return {
    reviewedId: parseInt(reviewData.reviewedId),
    rating: reviewData.rating,
    comment: reviewData.comment,
  };
};

export const mapBackendReviewItemToReview = (
  backendReview: BackendReviewItem
): Review => {
  return {
    id: backendReview.id.toString(),
    rating: backendReview.rating,
    comment: backendReview.comment,
    reviewerId: backendReview.reviewerId.toString(),
    reviewedId: backendReview.reviewedId.toString(),
    createdAt: backendReview.createdAt,
  };
};

export const mapBackendCreateReviewResponseToReview = (
  backendResponse: BackendCreateReviewResponse['detail']
): Review => {
  return {
    id: backendResponse.id.toString(),
    rating: backendResponse.rating,
    comment: backendResponse.comment,
    reviewerId: backendResponse.reviewerId.toString(),
    reviewedId: backendResponse.reviewedId.toString(),
    createdAt: backendResponse.createdAt,
  };
};

export const mapBackendGetSellerReviewsResponseToReviewSummary = (
  backendResponse: BackendGetSellerReviewsResponse['detail'],
  sellerId: string
): ReviewSummary => {
  const reviews = backendResponse.content.map(mapBackendReviewItemToReview);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return {
    sellerId,
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    totalReviews: backendResponse.totalElements,
    reviews,
  };
};

// Report API Types - Updated for new phone/email based API
export interface CreateReportData {
  reportedUserphone?: string;
  reportedUserEmail?: string;
  reason: string;
  description: string;
}

// Backend Report API Types
export interface BackendCreateReportRequest {
  reportedUserphone?: string;
  reportedUserEmail?: string;
  reason: string;
  description: string;
}

export interface BackendCreateReportResponse {
  messenger: string;
  status: number;
  detail: {
    id: number;
    reporterId: number;
    reporterName: string;
    reportedUserId: number;
    reportedUserName: string;
    reason: string;
    description: string;
    status: 'PENDING' | 'RESOLVED' | 'REJECTED';
    createdAt: string;
    handledAt: string | null;
    handledBy: number | null;
    handledByName: string | null;
  };
  instance: string;
}

// Report mapping functions
export const mapFrontendCreateReportToBackend = (
  reportData: CreateReportData
): BackendCreateReportRequest => {
  return {
    reportedUserphone: reportData.reportedUserphone,
    reportedUserEmail: reportData.reportedUserEmail,
    reason: reportData.reason,
    description: reportData.description,
  };
};

export const mapBackendCreateReportResponseToReport = (
  backendResponse: BackendCreateReportResponse['detail']
): Report => {
  // Map backend status to frontend status
  const mapStatus = (backendStatus: string): Report['status'] => {
    switch (backendStatus) {
      case 'PENDING':
        return 'pending';
      case 'RESOLVED':
        return 'resolved';
      case 'REJECTED':
        return 'dismissed';
      default:
        return 'pending';
    }
  };

  return {
    id: backendResponse.id.toString(),
    reporterId: backendResponse.reporterId.toString(),
    reportedId: backendResponse.reportedUserId.toString(),
    reportedType: 'seller', // Assuming we're reporting sellers from this context
    reason: backendResponse.reason,
    description: backendResponse.description,
    status: mapStatus(backendResponse.status),
    createdAt: backendResponse.createdAt,
    updatedAt: backendResponse.createdAt, // Use createdAt as updatedAt initially
  };
};

// VNPay Payment Response Types
export interface VNPayReturnParams {
  vnp_Amount: string;
  vnp_BankCode?: string;
  vnp_BankTranNo?: string;
  vnp_CardType?: string;
  vnp_OrderInfo: string;
  vnp_PayDate: string;
  vnp_ResponseCode: string;
  vnp_TmnCode: string;
  vnp_TransactionNo?: string;
  vnp_TransactionStatus: string;
  vnp_TxnRef: string;
  vnp_SecureHash: string;
}

export interface PaymentResult {
  success: boolean;
  amount: number;
  orderInfo: string;
  payDate: string;
  transactionRef: string;
  responseCode: string;
  message: string;
}

// My Reports API Types
export interface MyReportItem {
  id: number;
  reporterId: number;
  reporterName: string;
  reportedUserId: number;
  reportedUserName: string;
  reason: string;
  description: string;
  status: 'PENDING' | 'SUSPENDED' | 'BANNED' | 'REJECTED';
  createdAt: string;
  handledAt: string | null;
  handledBy: number | null;
  handledByName: string | null;
}

export interface BackendMyReportsResponse {
  messenger: string;
  status: number;
  detail: MyReportItem[];
  instance: string;
}

// Admin Reports API Types
export interface AdminReportItem {
  id: number;
  reporterId: number;
  reporterName: string;
  reportedUserId: number;
  reportedUserName: string;
  reason: string;
  description: string;
  status: 'PENDING' | 'SUSPENDED' | 'BANNED' | 'REJECTED';
  createdAt: string;
  handledAt: string | null;
  handledBy: number | null;
  handledByName: string | null;
}

export interface BackendAdminGetReportsResponse {
  messenger: string;
  status: number;
  detail: AdminReportItem[];
  instance: string;
}

// Admin Update Report Status API Types
export interface BackendAdminUpdateReportStatusResponse {
  messenger: string;
  status: number;
  detail: AdminReportItem;
  instance: string;
}

// Frontend Admin Report interface for UI
export interface AdminReport {
  id: string;
  reporter: {
    id: string;
    name: string;
  };
  reported: {
    id: string;
    name: string;
  };
  reason: string;
  description: string;
  status: 'pending' | 'suspended' | 'banned' | 'rejected';
  createdAt: string;
  handledAt: string | null;
  handledBy?: {
    id: string;
    name: string;
  };
}

// Mapping function for my reports response
export const mapBackendMyReportsResponseToReports = (
  backendResponse: BackendMyReportsResponse['detail']
): Report[] => {
  return backendResponse.map((item) => {
    // Map backend status to frontend status
    const mapStatus = (backendStatus: string): Report['status'] => {
      switch (backendStatus) {
        case 'PENDING':
          return 'pending';
        case 'SUSPENDED':
          return 'investigating'; // Use investigating for suspended accounts
        case 'BANNED':
          return 'resolved'; // Use resolved for banned (final action taken)
        case 'REJECTED':
          return 'dismissed';
        default:
          return 'pending';
      }
    };

    return {
      id: item.id.toString(),
      reporterId: item.reporterId.toString(),
      reportedId: item.reportedUserId.toString(),
      reportedType: 'buyer', // Since sellers report buyers in my-reports context
      reason: item.reason,
      description: item.description,
      status: mapStatus(item.status),
      createdAt: item.createdAt,
      updatedAt: item.handledAt || item.createdAt,
    };
  });
};

// Mapping function for admin reports response
export const mapBackendAdminReportsResponseToAdminReports = (
  backendResponse: BackendAdminGetReportsResponse['detail']
): AdminReport[] => {
  return backendResponse.map((item) => {
    // Map backend status to frontend status
    const mapStatus = (backendStatus: string): AdminReport['status'] => {
      switch (backendStatus) {
        case 'PENDING':
          return 'pending';
        case 'SUSPENDED':
          return 'suspended';
        case 'BANNED':
          return 'banned';
        case 'REJECTED':
          return 'rejected';
        default:
          return 'pending';
      }
    };

    return {
      id: item.id.toString(),
      reporter: {
        id: item.reporterId.toString(),
        name: item.reporterName,
      },
      reported: {
        id: item.reportedUserId.toString(),
        name: item.reportedUserName,
      },
      reason: item.reason,
      description: item.description,
      status: mapStatus(item.status),
      createdAt: item.createdAt,
      handledAt: item.handledAt,
      handledBy:
        item.handledBy && item.handledByName
          ? {
              id: item.handledBy.toString(),
              name: item.handledByName,
            }
          : undefined,
    };
  });
};

// Mapping function for admin update report status response
export const mapBackendAdminUpdateReportStatusResponseToAdminReport = (
  backendResponse: BackendAdminUpdateReportStatusResponse['detail']
): AdminReport => {
  // Map backend status to frontend status
  const mapStatus = (backendStatus: string): AdminReport['status'] => {
    switch (backendStatus) {
      case 'PENDING':
        return 'pending';
      case 'SUSPENDED':
        return 'suspended';
      case 'BANNED':
        return 'banned';
      case 'REJECTED':
        return 'rejected';
      default:
        return 'pending';
    }
  };

  return {
    id: backendResponse.id.toString(),
    reporter: {
      id: backendResponse.reporterId.toString(),
      name: backendResponse.reporterName,
    },
    reported: {
      id: backendResponse.reportedUserId.toString(),
      name: backendResponse.reportedUserName,
    },
    reason: backendResponse.reason,
    description: backendResponse.description,
    status: mapStatus(backendResponse.status),
    createdAt: backendResponse.createdAt,
    handledAt: backendResponse.handledAt,
    handledBy:
      backendResponse.handledBy && backendResponse.handledByName
        ? {
            id: backendResponse.handledBy.toString(),
            name: backendResponse.handledByName,
          }
        : undefined,
  };
};
