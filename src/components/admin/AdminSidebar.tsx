import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Typography,
} from '@mui/material';
import { People, DirectionsCar, Report } from '@mui/icons-material';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  route: string;
}

interface AdminSidebarProps {
  activeMenuItem?: string;
  drawerWidth?: number;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeMenuItem,
  drawerWidth = 240,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active menu item from URL if not provided
  const currentActiveItem =
    activeMenuItem ||
    (location.pathname.includes('/admin/users')
      ? 'users'
      : location.pathname.includes('/admin/cars')
      ? 'cars'
      : location.pathname.includes('/admin/reports')
      ? 'reports'
      : 'users');

  const menuItems: MenuItem[] = [
    {
      id: 'users',
      label: 'Quản lý tài khoản',
      icon: <People />,
      route: '/admin/users',
    },
    {
      id: 'cars',
      label: 'Quản lý bài đăng',
      icon: <DirectionsCar />,
      route: '/admin/cars',
    },
    {
      id: 'reports',
      label: 'Quản lý báo cáo',
      icon: <Report />,
      route: '/admin/reports',
    },
  ];

  const handleMenuClick = (route: string) => {
    navigate(route);
  };

  return (
    <Drawer
      variant='permanent'
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          position: 'relative',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Toolbar sx={{ px: 2.5, py: 2 }}>
        <Typography
          variant='h6'
          noWrap
          component='div'
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            fontSize: '1.1rem',
          }}
        >
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={currentActiveItem === item.id}
              onClick={() => handleMenuClick(item.route)}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 2,
                minHeight: 44,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: currentActiveItem === item.id ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default AdminSidebar;
