import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  IconButton,
  Menu,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  People,
  Storefront,
  ShoppingCart,
  VerifiedUser,
  Search,
  Refresh,
  MoreVert,
  Visibility,
  CheckCircle,
  Cancel,
  Delete,
} from '@mui/icons-material';
import { useAdminPosts, useUpdatePostStatus } from '../../hooks/useAdmin';
import { formatCurrency, formatRelativeTime } from '../../utils/helpers';
import type { SellerPost } from '../../types';

// Component sử dụng SellerPost từ API thay vì interface riêng

const CarManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // API data
  const {
    data: postsData,
    isLoading,
    error,
    refetch,
  } = useAdminPosts(page, rowsPerPage);

  // Update post status mutation
  const updatePostStatusMutation = useUpdatePostStatus();

  // Menu states
  const [selectedListing, setSelectedListing] = useState<SellerPost | null>(
    null
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('success');

  // Filter listings (client-side filtering for now)
  const filteredListings = React.useMemo(() => {
    if (!postsData?.items) return [];

    return postsData.items.filter((listing) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.phoneContact
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        listing.carDetail.make
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        listing.carDetail.model
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || listing.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [postsData?.items, searchQuery, statusFilter]);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    listing: SellerPost
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedListing(listing);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedListing(null);
  };

  const handleViewDetail = () => {
    if (selectedListing) {
      navigate(`/cars/${selectedListing.id}`);
    }
    handleMenuClose();
  };

  const handleApprove = () => {
    if (selectedListing) {
      updatePostStatusMutation.mutate(
        {
          id: selectedListing.id,
          status: 'APPROVED',
        },
        {
          onSuccess: () => {
            setSnackbarMessage('Đã duyệt bài đăng thành công');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            refetch(); // Refresh data
          },
          onError: () => {
            setSnackbarMessage('Có lỗi xảy ra khi duyệt bài đăng');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
          },
        }
      );
    }
    handleMenuClose();
  };

  const handleReject = () => {
    if (selectedListing) {
      updatePostStatusMutation.mutate(
        {
          id: selectedListing.id,
          status: 'REJECTED',
        },
        {
          onSuccess: () => {
            setSnackbarMessage('Đã từ chối bài đăng');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            refetch(); // Refresh data
          },
          onError: () => {
            setSnackbarMessage('Có lỗi xảy ra khi từ chối bài đăng');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
          },
        }
      );
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedListing) {
      // TODO: Implement API call to delete post
      setSnackbarMessage('Đã xóa bài đăng');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    handleMenuClose();
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip label='Chờ duyệt' color='warning' size='small' />;
      case 'approved':
        return <Chip label='Đã duyệt' color='success' size='small' />;
      case 'rejected':
        return <Chip label='Bị từ chối' color='error' size='small' />;
      case 'draft':
        return <Chip label='Nháp' color='info' size='small' />;
      case 'blocked':
        return <Chip label='Bị chặn' color='error' size='small' />;
      case 'hidden':
        return <Chip label='Đã ẩn' color='default' size='small' />;
      default:
        return <Chip label={status} color='default' size='small' />;
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
    setStatusFilter('all');
  };

  // Statistics from API data
  const totalListings = postsData?.total || 0;
  const allPosts = postsData?.items || [];
  const pendingListings = allPosts.filter((l) => l.status === 'pending').length;
  const approvedListings = allPosts.filter(
    (l) => l.status === 'approved'
  ).length;
  const rejectedListings = allPosts.filter(
    (l) => l.status === 'rejected'
  ).length;

  return (
    <Box>
      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <People sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Box>
              <Typography variant='h5' fontWeight='bold'>
                {totalListings}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Tổng bài đăng
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <Storefront sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
            <Box>
              <Typography variant='h5' fontWeight='bold'>
                {pendingListings}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Chờ duyệt
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <ShoppingCart sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
            <Box>
              <Typography variant='h5' fontWeight='bold'>
                {approvedListings}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Đã duyệt
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <VerifiedUser sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
            <Box>
              <Typography variant='h5' fontWeight='bold'>
                {rejectedListings}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Bị từ chối
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Car Listings Management */}
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
            placeholder='Tìm kiếm theo tiêu đề, người bán, hãng xe...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <Search sx={{ mr: 1, color: 'text.secondary' }} />
              ),
            }}
            sx={{ minWidth: 300, flex: 1 }}
          />

          <FormControl size='small' sx={{ minWidth: 140 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label='Trạng thái'
            >
              <MenuItem value='all'>Tất cả</MenuItem>
              <MenuItem value='pending'>Chờ duyệt</MenuItem>
              <MenuItem value='approved'>Đã duyệt</MenuItem>
              <MenuItem value='rejected'>Bị từ chối</MenuItem>
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

        {/* Car Listings Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Thông tin xe</TableCell>
                <TableCell>Người bán</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày đăng</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align='center'>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} align='center'>
                    <Alert severity='error'>
                      Có lỗi xảy ra khi tải dữ liệu: {error.message}
                    </Alert>
                  </TableCell>
                </TableRow>
              ) : filteredListings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align='center'>
                    <Typography color='text.secondary'>
                      Không có dữ liệu
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredListings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>
                      <Box
                        component='img'
                        sx={{
                          width: 60,
                          height: 45,
                          objectFit: 'cover',
                          borderRadius: 1,
                        }}
                        src={listing.images[0] || '/placeholder-car.jpg'}
                        alt={listing.title}
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant='body2' fontWeight='medium'>
                          {listing.title}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {listing.carDetail.transmission === 'automatic'
                            ? 'Tự động'
                            : 'Số sàn'}{' '}
                          •
                          {listing.carDetail.fuelType === 'gasoline'
                            ? ' Xăng'
                            : listing.carDetail.fuelType === 'diesel'
                            ? ' Dầu'
                            : listing.carDetail.fuelType === 'electric'
                            ? ' Điện'
                            : ' Hybrid'}{' '}
                          • {listing.carDetail.mileage?.toLocaleString() || 0}{' '}
                          km
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant='body2'>
                          {listing.sellerType === 'individual'
                            ? 'Cá nhân'
                            : 'Đại lý'}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {listing.phoneContact || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' fontWeight='medium'>
                        {formatCurrency(listing.price)}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(listing.status)}</TableCell>
                    <TableCell>
                      <Typography variant='body2'>
                        {formatRelativeTime(listing.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size='small'
                        onClick={(e) => handleMenuClick(e, listing)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={postsData?.total || 0}
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
        <MenuItem onClick={handleViewDetail}>
          <Visibility sx={{ mr: 1 }} />
          Xem chi tiết
        </MenuItem>
        {selectedListing?.status === 'pending' && (
          <>
            <MenuItem
              onClick={handleApprove}
              disabled={updatePostStatusMutation.isPending}
            >
              <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
              {updatePostStatusMutation.isPending
                ? 'Đang duyệt...'
                : 'Duyệt bài đăng'}
            </MenuItem>
            <MenuItem
              onClick={handleReject}
              disabled={updatePostStatusMutation.isPending}
            >
              <Cancel sx={{ mr: 1, color: 'warning.main' }} />
              {updatePostStatusMutation.isPending
                ? 'Đang từ chối...'
                : 'Từ chối'}
            </MenuItem>
          </>
        )}
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Xóa bài đăng
        </MenuItem>
      </Menu>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CarManagement;
