import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Divider,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import {
  AccountCircle,
  DirectionsCar,
  Person,
  ExitToApp,
  Favorite,
  Report,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <AppBar position='static'>
      <Toolbar>
        <DirectionsCar sx={{ mr: 2 }} />
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          <Link to='/' style={{ textDecoration: 'none', color: 'inherit' }}>
            Car Marketplace
          </Link>
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button color='inherit' component={Link} to='/cars'>
            Xe đang bán
          </Button>
          {isAuthenticated && (
            <Button color='inherit' component={Link} to='/sell'>
              Đăng bán
            </Button>
          )}

          {isAuthenticated ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                <IconButton
                  size='large'
                  aria-label='account of current user'
                  aria-controls='menu-appbar'
                  aria-haspopup='true'
                  onClick={handleMenu}
                  color='inherit'
                  sx={{ p: 0 }}
                >
                  {user?.avatar ? (
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      sx={{ width: 32, height: 32 }}
                    />
                  ) : (
                    <Avatar
                      sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}
                    >
                      {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  )}
                </IconButton>
              </Box>
              <Menu
                id='menu-appbar'
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{ mt: 1 }}
              >
                <MenuItem disabled>
                  <Box>
                    <Typography variant='subtitle2'>{user?.name}</Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {user?.email}
                    </Typography>
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate('/profile');
                  }}
                >
                  <Person sx={{ mr: 1 }} fontSize='small' />
                  Thông tin cá nhân
                </MenuItem>
                {/* Chỉ hiển thị Yêu thích cho buyer */}
                {user?.role === 'buyer' && (
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate('/favorites');
                    }}
                  >
                    <Favorite sx={{ mr: 1 }} fontSize='small' />
                    Yêu thích
                  </MenuItem>
                )}
                {/* Chỉ hiển thị Báo cáo cho seller */}
                {user?.role === 'seller' && (
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate('/reports');
                    }}
                  >
                    <Report sx={{ mr: 1 }} fontSize='small' />
                    Báo cáo
                  </MenuItem>
                )}
                {user?.role === 'seller' && (
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate('/seller-dashboard');
                    }}
                  >
                    Bảng điều khiển
                  </MenuItem>
                )}
                {user?.role === 'admin' && (
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate('/admin');
                    }}
                  >
                    Quản trị
                  </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 1 }} fontSize='small' />
                  Đăng xuất
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <IconButton
                size='large'
                aria-label='account menu'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleMenu}
                color='inherit'
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{ mt: 1 }}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate('/login');
                  }}
                >
                  Đăng nhập
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate('/register');
                  }}
                >
                  Đăng ký
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
