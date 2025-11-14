import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import { Person, Security, Edit, Save, Cancel } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import {
  validateRegisterForm,
  validateResetPasswordForm,
} from '../utils/validation';
import type { User } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    updateProfile,
    isUpdateProfileLoading,
    updateProfileError,
    resetUpdateProfileError,
    resetPassword,
    isResetPasswordLoading,
    resetPasswordError,
    resetResetPasswordError,
  } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState<string>('');
  const [passwordSuccess, setPasswordSuccess] = useState<string>('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Partial<User>>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  // Form for reset password
  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<{
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const onSubmit = async (data: Partial<User>) => {
    // Reset previous error
    resetUpdateProfileError();

    // Validate form
    if (data.name) {
      const validationErrors = validateRegisterForm(
        user?.email || '', // use current email for validation
        '', // password not required for profile update
        '',
        data.name,
        data.phone
      );
      const relevantErrors = validationErrors.filter(
        (err) => err.field !== 'password' && err.field !== 'confirmPassword'
      );
      if (relevantErrors.length > 0) {
        return; // validation will be shown by form errors
      }
    }

    // Call update profile mutation
    try {
      await updateProfile({
        name: data.name,
        phone: data.phone,
      });
      setSuccess('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  const handleCancel = () => {
    reset({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
    resetUpdateProfileError();
  };

  const onPasswordSubmit = async (data: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => {
    // Reset previous error and success
    resetResetPasswordError();
    setPasswordSuccess('');

    // Validate form
    const validationErrors = validateResetPasswordForm(
      data.currentPassword,
      data.newPassword,
      data.confirmNewPassword
    );

    if (validationErrors.length > 0) {
      // Validation errors will be shown by form
      return;
    }

    // Call reset password mutation
    try {
      await resetPassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setPasswordSuccess('Đổi mật khẩu thành công!');
      resetPasswordForm();
    } catch (error) {
      console.error('Reset password error:', error);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        Thông tin cá nhân
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<Person />} label='Thông tin cơ bản' />
          <Tab icon={<Security />} label='Bảo mật' />
        </Tabs>

        {/* Basic Information Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ p: 3 }}>
            {updateProfileError && (
              <Alert severity='error' sx={{ mb: 3 }}>
                {updateProfileError}
              </Alert>
            )}

            {success && (
              <Alert severity='success' sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            {/* Avatar Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={user.avatar}
                  sx={{ width: 100, height: 100, mr: 3 }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
              </Box>

              <Box>
                <Typography variant='h6'>{user.name}</Typography>
                <Typography variant='body2' color='text.secondary'>
                  {user.role === 'buyer'
                    ? 'Người mua'
                    : user.role === 'seller'
                    ? 'Người bán'
                    : 'Quản trị viên'}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Tham gia từ{' '}
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </Typography>
              </Box>

              <Box sx={{ ml: 'auto' }}>
                {!isEditing ? (
                  <Button
                    startIcon={<Edit />}
                    onClick={() => setIsEditing(true)}
                    variant='outlined'
                  >
                    Chỉnh sửa
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      variant='outlined'
                    >
                      Hủy
                    </Button>
                    <Button
                      startIcon={<Save />}
                      onClick={handleSubmit(onSubmit)}
                      variant='contained'
                      disabled={isUpdateProfileLoading}
                    >
                      {isUpdateProfileLoading ? (
                        <CircularProgress size={20} />
                      ) : (
                        'Lưu'
                      )}
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Profile Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: 1, minWidth: '250px' }}>
                    <Controller
                      name='name'
                      control={control}
                      rules={{
                        required: 'Họ tên là bắt buộc',
                        minLength: {
                          value: 2,
                          message: 'Họ tên phải có ít nhất 2 ký tự',
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label='Họ và tên'
                          disabled={!isEditing}
                          error={!!errors.name}
                          helperText={errors.name?.message}
                        />
                      )}
                    />
                  </Box>

                  <Box sx={{ flex: 1, minWidth: '250px' }}>
                    <Controller
                      name='phone'
                      control={control}
                      rules={{
                        pattern: {
                          value: /^(\+84|0)[3-9]\d{8}$/,
                          message: 'Số điện thoại không hợp lệ',
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label='Số điện thoại'
                          disabled={!isEditing}
                          error={!!errors.phone}
                          helperText={errors.phone?.message}
                        />
                      )}
                    />
                  </Box>
                </Box>

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
                      disabled={true} // Always disabled as per requirements
                      error={!!errors.email}
                      helperText={
                        errors.email?.message || 'Email không thể chỉnh sửa'
                      }
                    />
                  )}
                />

                <TextField
                  fullWidth
                  label='Vai trò'
                  value={
                    user.role === 'buyer'
                      ? 'Người mua'
                      : user.role === 'seller'
                      ? 'Người bán'
                      : 'Quản trị viên'
                  }
                  disabled
                />
              </Box>
            </form>
          </Box>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
              Đổi mật khẩu
            </Typography>

            {resetPasswordError && (
              <Alert severity='error' sx={{ mb: 3 }}>
                {resetPasswordError}
              </Alert>
            )}

            {passwordSuccess && (
              <Alert severity='success' sx={{ mb: 3 }}>
                {passwordSuccess}
              </Alert>
            )}

            <Card>
              <CardContent>
                <Typography variant='body2' color='text.secondary' gutterBottom>
                  Vui lòng nhập mật khẩu hiện tại và mật khẩu mới của bạn
                </Typography>

                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                  <Box
                    sx={{
                      mt: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <Controller
                      name='currentPassword'
                      control={passwordControl}
                      rules={{
                        required: 'Mật khẩu hiện tại là bắt buộc',
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label='Mật khẩu hiện tại'
                          type='password'
                          fullWidth
                          error={!!passwordErrors.currentPassword}
                          helperText={passwordErrors.currentPassword?.message}
                        />
                      )}
                    />

                    <Controller
                      name='newPassword'
                      control={passwordControl}
                      rules={{
                        required: 'Mật khẩu mới là bắt buộc',
                        minLength: {
                          value: 6,
                          message: 'Mật khẩu mới phải có ít nhất 6 ký tự',
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label='Mật khẩu mới'
                          type='password'
                          fullWidth
                          error={!!passwordErrors.newPassword}
                          helperText={passwordErrors.newPassword?.message}
                        />
                      )}
                    />

                    <Controller
                      name='confirmNewPassword'
                      control={passwordControl}
                      rules={{
                        required: 'Xác nhận mật khẩu mới là bắt buộc',
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label='Xác nhận mật khẩu mới'
                          type='password'
                          fullWidth
                          error={!!passwordErrors.confirmNewPassword}
                          helperText={
                            passwordErrors.confirmNewPassword?.message
                          }
                        />
                      )}
                    />

                    <Button
                      type='submit'
                      variant='contained'
                      disabled={isResetPasswordLoading}
                      sx={{ mt: 2 }}
                    >
                      {isResetPasswordLoading ? (
                        <CircularProgress size={20} />
                      ) : (
                        'Xác nhận thay đổi'
                      )}
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default UserProfilePage;
