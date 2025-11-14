import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Lock } from '@mui/icons-material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'buyer' | 'seller' | 'admin';
  allowedRoles?: ('buyer' | 'seller' | 'admin')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  allowedRoles,
}) => {
  const { user, isAuthenticated, isLoaded } = useAuth();

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to='/login' replace />;
  }

  // Check role permissions
  const hasPermission = () => {
    if (requiredRole) {
      return user.role === requiredRole;
    }

    if (allowedRoles) {
      return allowedRoles.includes(user.role);
    }

    return true; // No role restriction
  };

  // If user doesn't have permission, show access denied
  if (!hasPermission()) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          p: 3,
          textAlign: 'center',
        }}
      >
        <Lock sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant='h4' gutterBottom color='error'>
          Truy cập bị từ chối
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
          Bạn không có quyền truy cập vào trang này.
          {requiredRole && ` Cần quyền: ${getRoleLabel(requiredRole)}`}
          {allowedRoles &&
            ` Cần một trong các quyền: ${allowedRoles
              .map(getRoleLabel)
              .join(', ')}`}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          Quyền hiện tại của bạn: {getRoleLabel(user.role)}
        </Typography>
        <Button variant='contained' onClick={() => window.history.back()}>
          Quay lại
        </Button>
      </Box>
    );
  }

  return <>{children}</>;
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin':
      return 'Quản trị viên';
    case 'seller':
      return 'Người bán';
    case 'buyer':
      return 'Người mua';
    default:
      return role;
  }
};

export default ProtectedRoute;
