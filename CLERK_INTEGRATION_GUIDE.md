# Hướng dẫn Tích hợp Clerk Authentication

## Tổng quan

Project đã được tích hợp Clerk để thay thế hệ thống authentication cũ. Clerk cung cấp:

- Đăng nhập/Đăng ký UI components có sẵn
- Bảo mật cao hơn với JWT tokens
- Quản lý user metadata và roles
- Social login sẵn sàng (Google, Facebook, etc.)

## Cấu trúc thay đổi

### 1. AuthStore (`src/store/authStore.ts`)

**Trước:** Lưu trữ full user object, token, và isAuthenticated
**Sau:** Chỉ lưu role của user (vì Clerk quản lý user data)

```typescript
// Chỉ lưu role vì Clerk đã handle user data
interface AuthState {
  userRole: 'buyer' | 'seller' | 'admin' | null;
  setUserRole: (role) => void;
  clearUserRole: () => void;
}
```

### 2. useAuth Hook (`src/hooks/useAuth.ts`)

**Trước:** Sử dụng custom mutations cho login/register
**Sau:** Wrapper cho Clerk hooks với logic tùy chỉnh

```typescript
// Sử dụng Clerk hooks
const { user, isSignedIn, isLoaded } = useUser();
const { signOut } = useClerk();
const { getToken } = useClerkAuth();

// Tự động sync role từ Clerk metadata
useEffect(() => {
  if (isSignedIn && user) {
    const role = user.publicMetadata?.role || 'buyer';
    setUserRole(role);
  }
}, [isSignedIn, user]);
```

### 3. Login & Register Pages

**Trước:** Custom form với react-hook-form
**Sau:** Sử dụng Clerk's SignIn và SignUp components

```typescript
<SignIn routing='path' path='/login' signUpUrl='/register' afterSignInUrl='/' />
```

### 4. API Integration (`src/services/api.ts`)

**Trước:** Tự động inject token từ authStore
**Sau:** Token được lấy từ Clerk khi cần

```typescript
// Helper để inject token
const { getAuthToken } = useAuth();
const token = await getAuthToken();
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### 5. ProtectedRoute Component

**Thêm:** Loading state cho Clerk initialization

```typescript
if (!isLoaded) {
  return <CircularProgress />;
}
```

## Cách sử dụng

### Setup Clerk Dashboard

1. Truy cập https://dashboard.clerk.com
2. Tạo application mới
3. Copy Publishable Key vào `.env`:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### Cấu hình User Metadata (Role)

Trong Clerk Dashboard, để set role cho user:

1. Vào Users → chọn user
2. Click "Metadata"
3. Thêm vào Public Metadata:

```json
{
  "role": "buyer",
  "isVerified": true
}
```

### Sử dụng trong Components

```typescript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, logout, getAuthToken } = useAuth();

  // User object
  console.log(user?.name, user?.email, user?.role);

  // Logout
  const handleLogout = async () => {
    await logout();
  };

  // Get token for API calls
  const callAPI = async () => {
    const token = await getAuthToken();
    // Use token...
  };
}
```

### API Calls với Token

```typescript
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

function MyComponent() {
  const { getAuthToken } = useAuth();

  const fetchData = async () => {
    const token = await getAuthToken();
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const response = await api.get('/my-endpoint');
    return response.data;
  };
}
```

## Migration từ Old Auth

### Files đã được backup:

- `src/hooks/useAuth.ts.backup`
- `src/pages/LoginPage.tsx.backup`
- `src/pages/RegisterPage.tsx.backup`

### Files không còn cần thiết (có thể xóa):

- `src/services/authService.ts` - Clerk handle auth
- `src/utils/validation.ts` - Clerk có built-in validation

### Compatibility Layer

useAuth hook vẫn export các legacy properties để tránh break existing code:

```typescript
return {
  // Legacy compatibility
  token: null, // Use getAuthToken() instead
  isLoginLoading: false,
  loginError: null,
  // ... other legacy props
};
```

## Clerk Features có sẵn

### Clerk Components

- `<SignIn />` - Login UI
- `<SignUp />` - Register UI
- `<UserButton />` - User profile dropdown
- `<UserProfile />` - Full profile page

### Clerk Hooks

- `useUser()` - User data và signed in state
- `useAuth()` - Auth state và methods
- `useClerk()` - Clerk instance với helper methods
- `useSession()` - Session management

### Clerk Features

- Email/Password authentication
- Social login (Google, Facebook, GitHub, etc.)
- Magic link authentication
- SMS/Phone authentication
- Multi-factor authentication (MFA)
- Email verification
- Password reset
- Session management
- User metadata

## Troubleshooting

### User không có role

Sau khi user đăng ký, cần set role trong Clerk Dashboard:

1. Users → Select user → Metadata
2. Add to Public Metadata: `{ "role": "buyer" }`

### Token không được inject vào API

Sử dụng helper:

```typescript
const { getAuthToken } = useAuth();
const token = await getAuthToken();
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### Redirect không hoạt động

Check afterSignInUrl trong ClerkProvider (main.tsx):

```typescript
<ClerkProvider
  publishableKey={PUBLISHABLE_KEY}
  afterSignInUrl='/'
>
```

## Next Steps

1. **Configure Clerk Dashboard:**

   - Enable/disable authentication methods
   - Customize branding và appearance
   - Set up email templates
   - Configure session settings

2. **Add Social Login:**

   ```typescript
   <SignIn appearance={{}} routing='path' path='/login' />
   ```

   Clerk tự động show social login buttons nếu enabled

3. **Customize Appearance:**

   ```typescript
   <SignIn
     appearance={{
       elements: {
         formButtonPrimary: 'bg-blue-500',
         card: 'shadow-lg',
       },
     }}
   />
   ```

4. **Handle Webhooks:**
   - Setup webhook endpoint trong backend
   - Listen for user.created, user.updated events
   - Sync user data với database

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk React SDK](https://clerk.com/docs/references/react/overview)
- [Clerk Dashboard](https://dashboard.clerk.com)
