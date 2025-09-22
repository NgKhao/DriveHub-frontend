import React from 'react';
import { Box, Typography } from '@mui/material';
import AdminSidebar from '../components/admin/AdminSidebar';
import UserManagement from '../components/admin/UserManagement';

const AdminUsersPage: React.FC = () => {
  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <AdminSidebar activeMenuItem='users' drawerWidth={drawerWidth} />

      {/* Main Content */}
      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant='h4' component='h1' gutterBottom>
            Quản lý tài khoản
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Quản lý tài khoản người dùng trong hệ thống
          </Typography>
        </Box>

        {/* Content */}
        <UserManagement />
      </Box>
    </Box>
  );
};

export default AdminUsersPage;
