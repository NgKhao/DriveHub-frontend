import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import {
  People,
  DirectionsCar,
  Report,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const drawerWidth = 240;

  const dashboardCards = [
    {
      title: 'Quản lý tài khoản',
      description: 'Quản lý tài khoản người dùng trong hệ thống',
      icon: <People sx={{ fontSize: 48, color: 'primary.main' }} />,
      route: '/admin/users',
      color: 'primary.main',
    },
    {
      title: 'Quản lý bài đăng',
      description: 'Duyệt và quản lý các bài đăng xe của người dùng',
      icon: <DirectionsCar sx={{ fontSize: 48, color: 'secondary.main' }} />,
      route: '/admin/cars',
      color: 'secondary.main',
    },
    {
      title: 'Quản lý báo cáo',
      description: 'Duyệt và quản lý các báo cáo của người dùng',
      icon: <Report sx={{ fontSize: 48, color: 'error.main' }} />,
      route: '/admin/reports',
      color: 'error.main',
    },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <AdminSidebar drawerWidth={drawerWidth} />

      {/* Main Content */}
      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <DashboardIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant='h4' component='h1' fontWeight='bold'>
              Admin Dashboard
            </Typography>
          </Box>
          <Typography variant='body1' color='text.secondary'>
            Chào mừng đến với bảng điều khiển quản trị. Chọn một chức năng để
            bắt đầu.
          </Typography>
        </Box>

        {/* Dashboard Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
            mb: 4,
          }}
        >
          {dashboardCards.map((card) => (
            <Card
              key={card.route}
              elevation={2}
              sx={{
                height: '100%',
                transition: 'all 0.2s',
                '&:hover': {
                  elevation: 4,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardActionArea
                onClick={() => navigate(card.route)}
                sx={{ height: '100%', p: 3 }}
              >
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Box sx={{ mb: 2 }}>{card.icon}</Box>
                  <Typography
                    variant='h6'
                    component='h2'
                    fontWeight='bold'
                    gutterBottom
                    sx={{ color: card.color }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ lineHeight: 1.6 }}
                  >
                    {card.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboardPage;
