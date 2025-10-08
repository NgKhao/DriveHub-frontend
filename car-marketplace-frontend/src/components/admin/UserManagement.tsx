import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Avatar,
  Card,
  CardContent,
  Snackbar,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Search,
  MoreVert,
  Visibility,
  Edit,
  Delete,
  Refresh,
  Save,
  People,
  VerifiedUser,
  Storefront,
  ShoppingCart,
  Add,
  Close,
} from '@mui/icons-material';
import { formatDate } from '../../utils/helpers';
import { useUsers, useAdmin } from '../../hooks/useAdmin';
import type { User } from '../../types';

const UserManagement: React.FC = () => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // API hooks
  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useUsers(page, rowsPerPage);
  const { updateUserAdmin, deleteUser } = useAdmin();

  // Dialog states
  const [userDetailDialogOpen, setUserDetailDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Edit user states
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'buyer' as 'buyer' | 'seller', // Only buyer and seller roles
    isActive: true,
  });

  // Add user states
  const [addUserForm, setAddUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'buyer' as 'buyer' | 'seller',
    isActive: true,
  });

  // Get filtered users from API data
  const filteredUsers = React.useMemo(() => {
    if (!usersData?.items) return [];

    // Filter out admin users and then apply other filters
    const nonAdminUsers = usersData.items.filter(
      (user) => user.role !== 'admin'
    );

    return nonAdminUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && user.isVerified) ||
        (statusFilter === 'inactive' && !user.isVerified);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [usersData?.items, searchQuery, roleFilter, statusFilter]);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    user: User
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // Don't clear selectedUser here as it's needed for the dialog
  };

  const handleViewUser = () => {
    if (
      selectedUser &&
      (selectedUser.role === 'buyer' || selectedUser.role === 'seller')
    ) {
      setEditForm({
        name: selectedUser.name,
        email: selectedUser.email,
        phone: selectedUser.phone || '',
        role: selectedUser.role,
        isActive: selectedUser.isVerified, // Mapping isVerified to isActive
      });
      setEditMode(false);
      setUserDetailDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleEditUser = () => {
    if (
      selectedUser &&
      (selectedUser.role === 'buyer' || selectedUser.role === 'seller')
    ) {
      setEditForm({
        name: selectedUser.name,
        email: selectedUser.email,
        phone: selectedUser.phone || '',
        role: selectedUser.role,
        isActive: selectedUser.isVerified, // Mapping isVerified to isActive
      });
      setEditMode(true);
      setUserDetailDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleToggleVerification = () => {
    if (selectedUser) {
      // Use updateUserAdmin to toggle user status (same API as edit user)
      const newStatus = !selectedUser.isVerified;

      updateUserAdmin(
        {
          id: selectedUser.id,
          userData: {
            name: selectedUser.name,
            phone: selectedUser.phone,
            role: selectedUser.role as 'buyer' | 'seller',
            isVerified: newStatus,
          },
        },
        {
          onSuccess: () => {
            setSnackbarMessage(
              newStatus ? 'Đã kích hoạt tài khoản' : 'Đã vô hiệu hóa tài khoản'
            );
            setSnackbarOpen(true);
            refetch(); // Refetch data
          },
        }
      );
    }
    handleMenuClose();
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id, {
        onSuccess: () => {
          setSnackbarMessage('Đã xóa người dùng thành công');
          setSnackbarOpen(true);
          refetch(); // Refetch data
        },
      });
    }
    handleMenuClose();
  };

  const handleSaveUser = () => {
    if (selectedUser) {
      const userData = {
        name: editForm.name,
        phone: editForm.phone,
        role: editForm.role,
        isVerified: editForm.isActive,
      };

      updateUserAdmin(
        { id: selectedUser.id, userData },
        {
          onSuccess: () => {
            setSnackbarMessage('Đã cập nhật thông tin người dùng');
            setSnackbarOpen(true);
            handleCloseDialog();
            refetch(); // Refetch data
          },
        }
      );
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'seller':
        return 'Người bán';
      case 'buyer':
        return 'Người mua';
      default:
        return role;
    }
  };

  const getRoleColor = (
    role: string
  ): 'primary' | 'secondary' | 'error' | 'default' => {
    switch (role) {
      case 'seller':
        return 'primary';
      case 'buyer':
        return 'secondary';
      case 'admin':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleReset = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
  };

  const handleCloseDialog = () => {
    setUserDetailDialogOpen(false);
    setSelectedUser(null);
    setEditMode(false);
  };

  const handleCloseAddUserDialog = () => {
    setAddUserDialogOpen(false);
    setAddUserForm({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'buyer',
      isActive: true,
    });
  };

  const handleAddUser = () => {
    // Validation
    if (!addUserForm.name.trim()) {
      setSnackbarMessage('Vui lòng nhập tên người dùng');
      setSnackbarOpen(true);
      return;
    }

    if (!addUserForm.email.trim()) {
      setSnackbarMessage('Vui lòng nhập email');
      setSnackbarOpen(true);
      return;
    }

    if (!addUserForm.password.trim()) {
      setSnackbarMessage('Vui lòng nhập mật khẩu');
      setSnackbarOpen(true);
      return;
    }

    if (addUserForm.password !== addUserForm.confirmPassword) {
      setSnackbarMessage('Mật khẩu xác nhận không khớp');
      setSnackbarOpen(true);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(addUserForm.email)) {
      setSnackbarMessage('Email không hợp lệ');
      setSnackbarOpen(true);
      return;
    }

    // Phone validation (optional)
    if (addUserForm.phone && !/^(\+84|0)[3-9]\d{8}$/.test(addUserForm.phone)) {
      setSnackbarMessage('Số điện thoại không hợp lệ');
      setSnackbarOpen(true);
      return;
    }

    // TODO: Call API to create user
    console.log('Creating user:', addUserForm);
    setSnackbarMessage('Tạo tài khoản thành công! (Demo - chưa kết nối API)');
    setSnackbarOpen(true);
    handleCloseAddUserDialog();
    refetch();
  };

  // Handle error state
  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant='h6' color='error' gutterBottom>
          Lỗi khi tải dữ liệu người dùng
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          {error.message || 'Có lỗi xảy ra. Vui lòng thử lại.'}
        </Typography>
        <Button variant='outlined' onClick={() => refetch()}>
          Thử lại
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <People sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Box>
              <Typography variant='h5' fontWeight='bold'>
                {isLoading ? '...' : usersData?.total || 0}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Tổng người dùng
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <Storefront sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
            <Box>
              <Typography variant='h5' fontWeight='bold'>
                {isLoading
                  ? '...'
                  : usersData?.items.filter((u) => u.role === 'seller')
                      .length || 0}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Người bán
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <ShoppingCart sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
            <Box>
              <Typography variant='h5' fontWeight='bold'>
                {isLoading
                  ? '...'
                  : usersData?.items.filter((u) => u.role === 'buyer').length ||
                    0}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Người mua
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <VerifiedUser sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
            <Box>
              <Typography variant='h5' fontWeight='bold'>
                {isLoading
                  ? '...'
                  : usersData?.items.filter(
                      (u) => u.role !== 'admin' && u.isVerified
                    ).length || 0}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Đang hoạt động
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* User Management */}
      <Paper sx={{ p: 3 }}>
        {/* Filters and Search */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 3,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <TextField
            size='small'
            placeholder='Tìm kiếm theo tên, email, số điện thoại...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <Search sx={{ mr: 1, color: 'text.secondary' }} />
              ),
            }}
            sx={{ minWidth: 300, flex: 1 }}
          />

          <FormControl size='small' sx={{ minWidth: 120 }}>
            <InputLabel>Vai trò</InputLabel>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              label='Vai trò'
            >
              <MenuItem value='all'>Tất cả</MenuItem>
              <MenuItem value='buyer'>Người mua</MenuItem>
              <MenuItem value='seller'>Người bán</MenuItem>
            </Select>
          </FormControl>

          <FormControl size='small' sx={{ minWidth: 140 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label='Trạng thái'
            >
              <MenuItem value='all'>Tất cả</MenuItem>
              <MenuItem value='active'>Hoạt động</MenuItem>
              <MenuItem value='inactive'>Ngưng hoạt động</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant='outlined'
            startIcon={<Refresh />}
            onClick={handleReset}
          >
            Đặt lại
          </Button>

          <Button
            variant='outlined'
            onClick={() => refetch()}
            disabled={isLoading}
          >
            {isLoading ? 'Đang tải...' : 'Làm mới'}
          </Button>

          <Button
            variant='contained'
            startIcon={<Add />}
            onClick={() => setAddUserDialogOpen(true)}
          >
            Thêm tài khoản
          </Button>
        </Box>

        {/* Users Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Người dùng</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align='center'>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <Avatar
                          src={user.avatar}
                          alt={user.name}
                          sx={{ width: 40, height: 40 }}
                        >
                          {user.name.charAt(0)}
                        </Avatar>
                        <Typography variant='body2' fontWeight='medium'>
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || 'Chưa có'}</TableCell>
                    <TableCell>
                      <Chip
                        label={getRoleLabel(user.role)}
                        color={getRoleColor(user.role)}
                        size='small'
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          user.isVerified ? 'Hoạt động' : 'Ngưng hoạt động'
                        }
                        color={user.isVerified ? 'success' : 'error'}
                        size='small'
                        variant='outlined'
                      />
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell align='center'>
                      <IconButton
                        onClick={(e) => handleMenuClick(e, user)}
                        size='small'
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={usersData?.total || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage='Số dòng mỗi trang:'
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} trong tổng số ${count}`
          }
        />
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewUser}>
          <Visibility sx={{ mr: 1 }} />
          Xem chi tiết
        </MenuItem>
        <MenuItem onClick={handleEditUser}>
          <Edit sx={{ mr: 1 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleToggleVerification}>
          <VerifiedUser sx={{ mr: 1 }} />
          {selectedUser?.isVerified ? 'Vô hiệu hóa' : 'Kích hoạt'}
        </MenuItem>
        <MenuItem onClick={handleDeleteUser} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Xóa tài khoản
        </MenuItem>
      </Menu>

      {/* User Detail Dialog */}
      <Dialog
        open={userDetailDialogOpen}
        onClose={handleCloseDialog}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>
          {editMode ? 'Chỉnh sửa tài khoản' : 'Chi tiết tài khoản'}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              mt: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
              }}
            >
              <Avatar
                src={selectedUser?.avatar}
                alt={selectedUser?.name || 'User'}
                sx={{ width: 60, height: 60 }}
              >
                {selectedUser?.name?.charAt(0) || '?'}
              </Avatar>
              <Box>
                <Typography variant='h6'>
                  {selectedUser?.name || 'Đang tải...'}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  ID: {selectedUser?.id || 'Đang tải...'}
                </Typography>
              </Box>
            </Box>

            <TextField
              fullWidth
              label='Tên'
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              disabled={!editMode}
            />

            <TextField
              fullWidth
              label='Email'
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              disabled={true} // Email cannot be edited
              helperText='Email không thể chỉnh sửa'
            />

            <TextField
              fullWidth
              label='Số điện thoại'
              value={editForm.phone}
              onChange={(e) =>
                setEditForm({ ...editForm, phone: e.target.value })
              }
              disabled={!editMode}
            />

            <FormControl fullWidth disabled={!editMode}>
              <InputLabel>Vai trò</InputLabel>
              <Select
                value={editForm.role}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    role: e.target.value as 'buyer' | 'seller',
                  })
                }
                label='Vai trò'
              >
                <MenuItem value='buyer'>Người mua</MenuItem>
                <MenuItem value='seller'>Người bán</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={editForm.isActive}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      isActive: e.target.checked,
                    })
                  }
                  disabled={!editMode}
                />
              }
              label='Tài khoản đang hoạt động'
            />

            {!editMode && (
              <Box>
                <Typography variant='body2' color='text.secondary'>
                  Ngày tạo: {formatDate(selectedUser?.createdAt || '')}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Cập nhật lần cuối: {formatDate(selectedUser?.updatedAt || '')}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {editMode ? 'Hủy' : 'Đóng'}
          </Button>
          {editMode ? (
            <Button
              onClick={handleSaveUser}
              variant='contained'
              startIcon={<Save />}
            >
              Lưu thay đổi
            </Button>
          ) : (
            <Button
              onClick={() => setEditMode(true)}
              variant='contained'
              startIcon={<Edit />}
            >
              Chỉnh sửa
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog
        open={addUserDialogOpen}
        onClose={handleCloseAddUserDialog}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant='h6'>Thêm tài khoản mới</Typography>
            <IconButton
              aria-label='close'
              onClick={handleCloseAddUserDialog}
              sx={{ color: 'grey.500' }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              mt: 2,
            }}
          >
            <TextField
              fullWidth
              label='Tên người dùng *'
              value={addUserForm.name}
              onChange={(e) =>
                setAddUserForm({ ...addUserForm, name: e.target.value })
              }
              placeholder='Nhập họ và tên'
            />

            <TextField
              fullWidth
              label='Email *'
              type='email'
              value={addUserForm.email}
              onChange={(e) =>
                setAddUserForm({ ...addUserForm, email: e.target.value })
              }
              placeholder='Nhập địa chỉ email'
            />

            <TextField
              fullWidth
              label='Số điện thoại'
              value={addUserForm.phone}
              onChange={(e) =>
                setAddUserForm({ ...addUserForm, phone: e.target.value })
              }
              placeholder='Nhập số điện thoại (tùy chọn)'
            />

            <TextField
              fullWidth
              label='Mật khẩu *'
              type='password'
              value={addUserForm.password}
              onChange={(e) =>
                setAddUserForm({ ...addUserForm, password: e.target.value })
              }
              placeholder='Nhập mật khẩu'
            />

            <TextField
              fullWidth
              label='Xác nhận mật khẩu *'
              type='password'
              value={addUserForm.confirmPassword}
              onChange={(e) =>
                setAddUserForm({
                  ...addUserForm,
                  confirmPassword: e.target.value,
                })
              }
              placeholder='Nhập lại mật khẩu'
            />

            <FormControl fullWidth>
              <InputLabel>Vai trò *</InputLabel>
              <Select
                value={addUserForm.role}
                onChange={(e) =>
                  setAddUserForm({
                    ...addUserForm,
                    role: e.target.value as 'buyer' | 'seller',
                  })
                }
                label='Vai trò *'
              >
                <MenuItem value='buyer'>Người mua</MenuItem>
                <MenuItem value='seller'>Người bán</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={addUserForm.isActive}
                  onChange={(e) =>
                    setAddUserForm({
                      ...addUserForm,
                      isActive: e.target.checked,
                    })
                  }
                />
              }
              label='Kích hoạt tài khoản ngay'
            />

            <Box sx={{ bgcolor: 'info.light', p: 2, borderRadius: 1, mt: 1 }}>
              <Typography variant='body2' color='info.dark'>
                <strong>Lưu ý:</strong> Tài khoản mới sẽ được tạo với thông tin
                bạn cung cấp. Người dùng có thể đăng nhập bằng email và mật khẩu
                này.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={handleCloseAddUserDialog} variant='outlined'>
            Hủy
          </Button>
          <Button
            onClick={handleAddUser}
            variant='contained'
            startIcon={<Add />}
          >
            Tạo tài khoản
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default UserManagement;
