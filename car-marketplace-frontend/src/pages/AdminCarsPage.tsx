import React from 'react';
import { Box, Typography } from '@mui/material';
import AdminSidebar from '../components/admin/AdminSidebar';
import CarManagement from '../components/admin/CarManagement';

const AdminCarsPage: React.FC = () => {
  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <AdminSidebar activeMenuItem='cars' drawerWidth={drawerWidth} />

      {/* Main Content */}
      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant='h4' component='h1' gutterBottom>
            Quản lý bài đăng
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Duyệt và quản lý các bài đăng xe của người dùng
          </Typography>
        </Box>

        {/* Content */}
        <CarManagement />
      </Box>
    </Box>
  );
};

export default AdminCarsPage;
