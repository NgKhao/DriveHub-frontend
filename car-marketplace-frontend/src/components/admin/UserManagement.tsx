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
} from '@mui/icons-material';
import { formatDate } from '../../utils/helpers';
import type { User } from '../../types';

const UserManagement: React.FC = () => {
  // User management states
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dialog states
  const [userDetailDialogOpen, setUserDetailDialogOpen] = useState(false);
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

  const filterUsers = React.useCallback(() => {
    // Filter out admin users and then apply other filters
    const nonAdminUsers = users.filter((user) => user.role !== 'admin');

    const filtered = nonAdminUsers.filter((user) => {
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

    setFilteredUsers(filtered);
    setPage(0); // Reset to first page when filtering
  }, [searchQuery, roleFilter, statusFilter, users]);

  React.useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    user: User
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
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
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id
          ? { ...user, isVerified: !user.isVerified }
          : user
      );
      setUsers(updatedUsers);
      setSnackbarMessage(
        selectedUser.isVerified
          ? 'Đã vô hiệu hóa tài khoản'
          : 'Đã kích hoạt tài khoản'
      );
      setSnackbarOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
      setUsers(updatedUsers);
      setSnackbarMessage('Đã xóa người dùng thành công');
      setSnackbarOpen(true);
    }
    handleMenuClose();
  };

  const handleSaveUser = () => {
    if (selectedUser) {
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              name: editForm.name,
              email: editForm.email,
              phone: editForm.phone,
              role: editForm.role,
              isVerified: editForm.isActive, // Mapping isActive back to isVerified
              updatedAt: new Date().toISOString(),
            }
          : user
      );
      setUsers(updatedUsers);
      setSnackbarMessage('Đã cập nhật thông tin người dùng');
      setSnackbarOpen(true);
      setUserDetailDialogOpen(false);
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

  return (
    <Box>
      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <People sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Box>
              <Typography variant='h5' fontWeight='bold'>
                {users.filter((u) => u.role !== 'admin').length}
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
                {users.filter((u) => u.role === 'seller').length}
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
                {users.filter((u) => u.role === 'buyer').length}
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
                {users.filter((u) => u.role !== 'admin' && u.isVerified).length}
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
              <MenuItem value='admin'>Quản trị viên</MenuItem>
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
          count={filteredUsers.length}
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
        onClose={() => setUserDetailDialogOpen(false)}
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
                alt={selectedUser?.name}
                sx={{ width: 60, height: 60 }}
              >
                {selectedUser?.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant='h6'>{selectedUser?.name}</Typography>
                <Typography variant='body2' color='text.secondary'>
                  ID: {selectedUser?.id}
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
              disabled={!editMode}
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
          <Button onClick={() => setUserDetailDialogOpen(false)}>
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
