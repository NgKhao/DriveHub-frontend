# Car Marketplace Frontend - Cấu trúc Project

## 📁 Cấu trúc thư mục

```
src/
├── components/              # Các component tái sử dụng
│   ├── auth/               # Components đăng nhập/đăng ký
│   ├── car/                # Components liên quan đến xe
│   └── common/             # Components chung (Header, Footer, Loading...)
├── pages/                  # Các trang chính
├── layouts/                # Layout components
├── hooks/                  # Custom React hooks
├── services/               # API services
├── store/                  # Zustand stores
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
└── assets/                 # Static assets
```

## 🚀 Tính năng chính

### Người mua:

- Xem danh sách xe
- Tìm kiếm và lọc xe
- Xem chi tiết xe
- Liên hệ với người bán

### Người bán:

- Đăng bài bán xe
- Quản lý bài đăng
- Theo dõi trạng thái phê duyệt

### Admin:

- Phê duyệt bài đăng
- Quản lý người dùng
- Xem thống kê

## 🛠 Tech Stack

- **React 19** + **TypeScript**
- **Material-UI** cho UI components
- **Tailwind CSS** cho styling
- **React Router DOM** cho routing
- **Zustand** cho state management
- **React Query** cho data fetching
- **React Hook Form** cho form handling
- **Axios** cho HTTP requests

## 📦 Các thư mục chi tiết

### `components/`

- `common/`: Header, Footer, LoadingSpinner
- `auth/`: Login, Register components
- `car/`: CarCard, CarDetail, CarForm components

### `pages/`

- `HomePage.tsx`: Trang chủ
- `CarListingsPage.tsx`: Danh sách xe
- `CarDetailPage.tsx`: Chi tiết xe
- `LoginPage.tsx`: Đăng nhập
- `RegisterPage.tsx`: Đăng ký
- `SellerDashboardPage.tsx`: Bảng điều khiển người bán
- `AdminDashboardPage.tsx`: Bảng điều khiển admin
- `CreateListingPage.tsx`: Đăng bài mới

### `services/`

- `api.ts`: Axios instance và interceptors
- `authService.ts`: Authentication API calls
- `carService.ts`: Car CRUD operations
- `adminService.ts`: Admin functions

### `store/`

- `authStore.ts`: User authentication state
- `carStore.ts`: Car listings state

### `types/`

- `index.ts`: All TypeScript interfaces và types

### `utils/`

- `helpers.ts`: Utility functions (format, validation...)
- `validation.ts`: Form validation functions

## 🔧 Các bước tiếp theo

1. **Thiết kế UI components chi tiết**
2. **Implement authentication flow**
3. **Xây dựng car listing components**
4. **Tạo form đăng bài**
5. **Implement search và filtering**
6. **Xây dựng admin dashboard**
7. **Responsive design**
8. **Testing và optimization**

## 🌟 Các tính năng nâng cao có thể thêm

- Upload nhiều ảnh với preview
- Real-time notifications
- Chat system giữa buyer-seller
- Advanced filtering với map
- Car comparison feature
- Favorite cars
- Rating và review system
- Payment integration

## 🚀 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

---

Cấu trúc này đã sẵn sàng để bạn phát triển thêm các UI components chi tiết. Bạn có thể bắt đầu với việc tạo các components cụ thể như CarCard, LoginForm, etc.
