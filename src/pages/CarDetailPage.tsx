import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Chip,
  Divider,
  IconButton,
  Breadcrumbs,
  Link,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  Phone,
  LocationOn,
  CalendarToday,
  Speed,
  LocalGasStation,
  Settings,
  Palette,
  ArrowBack,
  Share,
  Favorite,
  FavoriteBorder,
  NavigateNext,
  Report,
  Person,
} from '@mui/icons-material';
import { formatCurrency, formatRelativeTime } from '../utils/helpers';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SellerInfoDialog from '../components/common/SellerInfoDialog';
import ReportDialog from '../components/common/ReportDialog';
import { useAuthStore } from '../store/authStore';
import { useSellerPostDetail } from '../hooks/useSeller';
import { useAdminPostDetail } from '../hooks/useAdmin';
import { usePublicPostDetail } from '../hooks/usePublic';
import { useFavoritesManager } from '../hooks/useFavorites';

const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Determine which API to use based on URL context
  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  // Determine context based on current URL path
  const currentPath = window.location.pathname;
  const isAdminContext = currentPath.startsWith('/admin');
  const isSellerContext = currentPath.startsWith('/seller-dashboard');

  // For public routes (/cars/:id from HomePage, CarListingsPage), always use public API
  // This ensures that posts viewed from public listings use public/posts/{id} API
  // Only use admin/seller APIs when specifically in admin/seller dashboard contexts
  const shouldUsePublicAPI = !isAdminContext && !isSellerContext;

  console.log('CarDetailPage Context:', {
    currentPath,
    isAdminContext,
    isSellerContext,
    shouldUsePublicAPI,
    userRole: user?.role,
  });

  // Conditionally call hooks based on context to avoid unnecessary API calls
  // that would trigger 401 redirects
  const adminPostQuery = useAdminPostDetail(
    id || '',
    isAdminContext && isAuthenticated && isAdmin
  );
  const sellerPostQuery = useSellerPostDetail(
    id || '',
    isSellerContext && isAuthenticated
  );
  const publicPostQuery = usePublicPostDetail(id || '', shouldUsePublicAPI);

  // Use appropriate data based on context
  let sellerPost, loading, error;
  if (shouldUsePublicAPI) {
    // Use public API for all public routes (default for /cars/:id)
    ({ data: sellerPost, isLoading: loading, error } = publicPostQuery);
  } else if (isAdminContext && isAuthenticated && isAdmin) {
    // Use admin API only when in admin dashboard context
    ({ data: sellerPost, isLoading: loading, error } = adminPostQuery);
  } else if (isSellerContext && isAuthenticated) {
    // Use seller API only when in seller dashboard context
    ({ data: sellerPost, isLoading: loading, error } = sellerPostQuery);
  } else {
    // Fallback to public API for any other case
    ({ data: sellerPost, isLoading: loading, error } = publicPostQuery);
  }

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [sellerInfoDialogOpen, setSellerInfoDialogOpen] = useState(false);

  // Favorites management
  const {
    isFavorite: isPostFavorite,
    toggleFavorite,
    isTogglingFavorite,
  } = useFavoritesManager();

  const isCarFavorite =
    isAuthenticated && user?.role === 'buyer' && sellerPost
      ? isPostFavorite(sellerPost.id)
      : false;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: sellerPost?.title,
        text: `Xem xe ${sellerPost?.title} - ${formatCurrency(
          sellerPost?.price || 0
        )}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <LoadingSpinner />
      </Container>
    );
  }

  if (error || !sellerPost) {
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Alert severity='error'>
          {error?.message || 'Không tìm thấy thông tin xe'}
        </Alert>
      </Container>
    );
  }

  // Dynamic breadcrumbs based on context
  const getBreadcrumbs = () => {
    if (isAdminContext) {
      return (
        <Breadcrumbs
          separator={<NavigateNext fontSize='small' />}
          sx={{ mb: 3 }}
        >
          <Link
            component='button'
            onClick={() => navigate('/admin')}
            underline='hover'
            color='inherit'
          >
            Admin Dashboard
          </Link>
          <Link
            component='button'
            onClick={() => navigate('/admin/cars')}
            underline='hover'
            color='inherit'
          >
            Quản lý xe
          </Link>
          <Typography color='text.primary'>Chi tiết xe</Typography>
        </Breadcrumbs>
      );
    } else if (isSellerContext) {
      return (
        <Breadcrumbs
          separator={<NavigateNext fontSize='small' />}
          sx={{ mb: 3 }}
        >
          <Link
            component='button'
            onClick={() => navigate('/seller-dashboard')}
            underline='hover'
            color='inherit'
          >
            Seller Dashboard
          </Link>
          <Typography color='text.primary'>Chi tiết xe</Typography>
        </Breadcrumbs>
      );
    } else {
      return (
        <Breadcrumbs
          separator={<NavigateNext fontSize='small' />}
          sx={{ mb: 3 }}
        >
          <Link
            component='button'
            onClick={() => navigate('/')}
            underline='hover'
            color='inherit'
          >
            Trang chủ
          </Link>
          <Link
            component='button'
            onClick={() => navigate('/cars')}
            underline='hover'
            color='inherit'
          >
            Danh sách xe
          </Link>
          <Typography color='text.primary'>Chi tiết xe</Typography>
        </Breadcrumbs>
      );
    }
  };

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      {/* Dynamic Breadcrumbs */}
      {getBreadcrumbs()}

      {/* Header Actions */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          variant='outlined'
        >
          Quay lại
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Chỉ buyer mới có thể favorite */}
          {isAuthenticated && user?.role === 'buyer' && (
            <IconButton
              onClick={async () => {
                if (sellerPost) {
                  try {
                    await toggleFavorite(sellerPost.id, isCarFavorite);
                  } catch (error) {
                    console.error('Error toggling favorite:', error);
                  }
                }
              }}
              disabled={isTogglingFavorite}
            >
              {isCarFavorite ? <Favorite color='error' /> : <FavoriteBorder />}
            </IconButton>
          )}
          <IconButton onClick={handleShare}>
            <Share />
          </IconButton>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          gap: 4,
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Left Column - Images and Details */}
        <Box sx={{ flex: 2 }}>
          {/* Image Gallery */}
          <Paper sx={{ mb: 3 }}>
            <Box sx={{ position: 'relative' }}>
              <img
                src={sellerPost.images[selectedImageIndex]}
                alt={sellerPost.title}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  backgroundColor: '#f5f5f5',
                }}
              />
              <Chip
                label={
                  sellerPost.carDetail.condition === 'NEW' ? 'Xe mới' : 'Xe cũ'
                }
                color={
                  sellerPost.carDetail.condition === 'NEW'
                    ? 'success'
                    : 'primary'
                }
                sx={{ position: 'absolute', top: 16, left: 16 }}
              />
            </Box>

            {sellerPost.images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, p: 2, overflowX: 'auto' }}>
                {sellerPost.images.map((image, index) => (
                  <Box
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    sx={{
                      minWidth: 80,
                      height: 60,
                      cursor: 'pointer',
                      border: selectedImageIndex === index ? 2 : 1,
                      borderColor:
                        selectedImageIndex === index
                          ? 'primary.main'
                          : 'divider',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={image}
                      alt={`${sellerPost.title} ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>

          {/* Car Details */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant='h5' gutterBottom fontWeight='bold'>
              Thông số kỹ thuật
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday fontSize='small' color='action' />
                  <Typography>Năm sản xuất:</Typography>
                </Box>
                <Typography fontWeight='medium'>
                  {sellerPost.carDetail.year}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Speed fontSize='small' color='action' />
                  <Typography>Số km đã đi:</Typography>
                </Box>
                <Typography fontWeight='medium'>
                  {sellerPost.carDetail.mileage.toLocaleString()} km
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalGasStation fontSize='small' color='action' />
                  <Typography>Nhiên liệu:</Typography>
                </Box>
                <Typography fontWeight='medium'>
                  {sellerPost.carDetail.fuelType === 'GASOLINE'
                    ? 'Xăng'
                    : sellerPost.carDetail.fuelType === 'DIESEL'
                    ? 'Dầu'
                    : sellerPost.carDetail.fuelType === 'HYBRID'
                    ? 'Hybrid'
                    : 'Điện'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Settings fontSize='small' color='action' />
                  <Typography>Hộp số:</Typography>
                </Box>
                <Typography fontWeight='medium'>
                  {sellerPost.carDetail.transmission === 'AUTOMATIC'
                    ? 'Tự động'
                    : 'Số sàn'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Palette fontSize='small' color='action' />
                  <Typography>Màu sắc:</Typography>
                </Box>
                <Typography fontWeight='medium'>
                  {sellerPost.carDetail.color}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn fontSize='small' color='action' />
                  <Typography>Vị trí:</Typography>
                </Box>
                <Typography fontWeight='medium'>
                  {sellerPost.location}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Description */}
          <Paper sx={{ p: 3 }}>
            <Typography variant='h6' gutterBottom>
              Mô tả chi tiết
            </Typography>
            <Typography
              variant='body1'
              sx={{
                whiteSpace: 'pre-line',
                lineHeight: 1.7,
              }}
            >
              {sellerPost.description}
            </Typography>
          </Paper>
        </Box>

        {/* Right Column - Price and Contact */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant='h4' gutterBottom fontWeight='bold'>
              {sellerPost.title}
            </Typography>

            <Typography
              variant='h3'
              color='primary'
              fontWeight='bold'
              gutterBottom
            >
              {formatCurrency(sellerPost.price)}
            </Typography>

            <Typography variant='body2' color='text.secondary' gutterBottom>
              Đăng {formatRelativeTime(sellerPost.createdAt)}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Seller Info */}
            <Typography variant='h6' gutterBottom>
              Thông tin người bán
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant='body1' fontWeight='medium'>
                {sellerPost.sellerInfo?.sellerName || 'Người bán'}
              </Typography>
            </Box>

            {/* Contact Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant='contained'
                size='large'
                startIcon={<Phone />}
                href={`tel:${sellerPost.phoneContact}`}
                fullWidth
              >
                Gọi {sellerPost.phoneContact}
              </Button>

              {/* Show login prompt for unauthenticated users */}
              {!isAuthenticated && (
                <Button
                  variant='outlined'
                  size='large'
                  onClick={() => navigate('/login')}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Đăng nhập để xem thêm tính năng
                </Button>
              )}

              {/* Chỉ buyer mới có thể báo cáo */}
              {isAuthenticated && user?.role === 'buyer' && (
                <Button
                  variant='text'
                  size='small'
                  startIcon={<Report />}
                  onClick={() => setReportDialogOpen(true)}
                  color='error'
                  sx={{ mt: 1 }}
                >
                  Báo cáo người bán
                </Button>
              )}
            </Box>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant='body2' color='text.secondary'>
                💡 Lưu ý: Hãy kiểm tra kỹ xe trước khi giao dịch. Tránh thanh
                toán trước khi nhận xe và kiểm tra giấy tờ.
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Seller Info Section */}
      <Box sx={{ mt: 4 }}>
        <Card
          sx={{
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box>
                <Typography variant='h6' gutterBottom>
                  👤 Thông tin người bán
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Xem chi tiết và đánh giá từ khách hàng khác
                </Typography>
              </Box>
              <Button
                variant='contained'
                size='large'
                startIcon={<Person />}
                onClick={() => setSellerInfoDialogOpen(true)}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                }}
              >
                Xem thông tin & đánh giá
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Seller Info Dialog */}
      <SellerInfoDialog
        open={sellerInfoDialogOpen}
        onClose={() => setSellerInfoDialogOpen(false)}
        sellerPost={sellerPost}
      />

      {/* Report Dialog */}
      <ReportDialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        reportedId={
          sellerPost.sellerInfo?.sellerPhone || sellerPost.phoneContact
        }
        reportedName={sellerPost.sellerInfo?.sellerName || 'Người bán'}
        reportedType='seller'
        postId={id}
      />
    </Container>
  );
};

export default CarDetailPage;
