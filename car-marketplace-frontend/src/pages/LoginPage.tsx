import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff, DirectionsCar } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import type { LoginRequest } from '../types';

interface LoginFormData extends LoginRequest {
  role: 'buyer' | 'seller' | 'admin';
}

const LoginPage: React.FC = () => {
  const { login, isLoginLoading, loginError, resetLoginError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      role: 'buyer',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    // Reset previous errors
    resetLoginError();

    // Call login mutation
    login({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth='sm'>
        <Paper elevation={10} sx={{ p: 4, borderRadius: 3 }}>
          <Box textAlign='center' mb={3}>
            <DirectionsCar
              sx={{ fontSize: 48, color: 'primary.main', mb: 1 }}
            />
            <Typography
              variant='h4'
              component='h1'
              gutterBottom
              fontWeight='bold'
            >
              Đăng nhập
            </Typography>
            <Typography variant='body1' color='text.secondary'>
              Chào mừng trở lại với Car Marketplace
            </Typography>
          </Box>

          {loginError && (
            <Alert severity='error' sx={{ mb: 3 }}>
              {loginError}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name='email'
              control={control}
              rules={{
                required: 'Email là bắt buộc',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Email không hợp lệ',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Email'
                  type='email'
                  margin='normal'
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isLoginLoading}
                />
              )}
            />

            <Controller
              name='password'
              control={control}
              rules={{
                required: 'Mật khẩu là bắt buộc',
                minLength: {
                  value: 6,
                  message: 'Mật khẩu phải có ít nhất 6 ký tự',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Mật khẩu'
                  type={showPassword ? 'text' : 'password'}
                  margin='normal'
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={isLoginLoading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge='end'
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            {/* <Controller
              name='role'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin='normal'>
                  <InputLabel>Loại tài khoản</InputLabel>
                  <Select
                    {...field}
                    label='Loại tài khoản'
                    disabled={isLoginLoading}
                  >
                    <MenuItem value='buyer'>Người mua</MenuItem>
                    <MenuItem value='seller'>Người bán</MenuItem>
                    <MenuItem value='admin'>Quản trị viên</MenuItem>
                  </Select>
                </FormControl>
              )}
            /> */}

            <Button
              type='submit'
              fullWidth
              variant='contained'
              size='large'
              disabled={isLoginLoading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isLoginLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </Button>

            <Box textAlign='center' mt={2}>
              <Typography variant='body2' color='text.secondary'>
                Chưa có tài khoản?{' '}
                <Link
                  to='/register'
                  style={{
                    color: '#1976d2',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  Đăng ký ngay
                </Link>
              </Typography>
            </Box>

            <Box textAlign='center' mt={1}>
              <Link
                to='/'
                style={{
                  color: '#666',
                  textDecoration: 'none',
                  fontSize: '14px',
                }}
              >
                ← Quay về trang chủ
              </Link>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
