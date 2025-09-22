import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import AdminSidebar from '../components/admin/AdminSidebar';
import CarManagement from '../components/admin/CarManagement';
import UserManagement from '../components/admin/UserManagement';
import ReportManagement from '../components/admin/ReportManagement';

const AdminDashboardPage: React.FC = () => {
  // Sidebar and navigation states
  const [activeMenuItem, setActiveMenuItem] = useState('users');

  const handleMenuItemClick = (itemId: string) => {
    setActiveMenuItem(itemId);
  };

  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <AdminSidebar
        activeMenuItem={activeMenuItem}
        onMenuItemClick={handleMenuItemClick}
        drawerWidth={drawerWidth}
      />

      {/* Main Content */}
      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant='h4' component='h1' gutterBottom>
            {activeMenuItem === 'users' && 'Quản lý tài khoản'}
            {activeMenuItem === 'cars' && 'Quản lý bài đăng'}
            {activeMenuItem === 'reports' && 'Quản lý báo cáo'}
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            {activeMenuItem === 'users' &&
              'Quản lý tài khoản người dùng trong hệ thống'}
            {activeMenuItem === 'cars' &&
              'Duyệt và quản lý các bài đăng xe của người dùng'}
            {activeMenuItem === 'reports' &&
              'Duyệt và quản lý các báo cáo của người dùng'}
          </Typography>
        </Box>
        {/* Content based on active menu item */}
        {activeMenuItem === 'users' && <UserManagement />}
        {activeMenuItem === 'cars' && <CarManagement />}
        {activeMenuItem === 'reports' && <ReportManagement />}{' '}
        {/* Add this line */}
      </Box>
    </Box>
  );
};

export default AdminDashboardPage;
