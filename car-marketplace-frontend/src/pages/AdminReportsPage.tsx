import React from 'react';
import { Box, Typography } from '@mui/material';
import AdminSidebar from '../components/admin/AdminSidebar';
import ReportManagement from '../components/admin/ReportManagement';

const AdminReportsPage: React.FC = () => {
  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <AdminSidebar activeMenuItem='reports' drawerWidth={drawerWidth} />

      {/* Main Content */}
      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant='h4' component='h1' gutterBottom>
            Quản lý báo cáo
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Duyệt và quản lý các báo cáo của người dùng
          </Typography>
        </Box>

        {/* Content */}
        <ReportManagement />
      </Box>
    </Box>
  );
};

export default AdminReportsPage;
