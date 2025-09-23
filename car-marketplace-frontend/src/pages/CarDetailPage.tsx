import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Breadcrumbs,
  Link,
  Alert,
} from '@mui/material';
import {
  Phone,
  Email,
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
} from '@mui/icons-material';
import { formatCurrency, formatRelativeTime } from '../utils/helpers';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SellerRatings from '../components/common/SellerRatings';
import ReportDialog from '../components/common/ReportDialog';
import { useAuthStore } from '../store/authStore';
import type { Car, ContactInfo } from '../types';

// Mock car data
const mockCar: Car = {
  id: '1',
  title: 'Toyota Camry 2022 - Xe gia đình sang trọng',
  brand: 'Toyota',
  model: 'Camry',
  year: 2022,
  price: 1200000000,
  mileage: 15000,
  fuelType: 'gasoline',
  transmission: 'automatic',
  color: 'Đen',
  description: `Xe Toyota Camry 2022 màu đen, nội thất kem sang trọng. 
  
Thông tin xe:
- Xe gia đình 5 chỗ
- Bảo dưỡng định kỳ tại Toyota
- Không tai nạn, không ngập nước
- Còn bảo hành chính hãng
- Xe chạy ít, chủ yêu thương
- Giấy tờ đầy đủ, sang tên ngay

Trang bị:
- Hệ thống âm thanh cao cấp
- Camera lùi, cảm biến va chạm
- Điều hòa tự động 2 vùng
- Ghế da cao cấp
- Hệ thống an toàn Toyota Safety Sense

Liên hệ để xem xe và thương lượng giá!`,
  images: [
    'https://s.bonbanh.com/uploads/users/782831/car/6429100/s_1757733616.907.jpg',
    'https://s.bonbanh.com/uploads/users/782831/car/6429100/s_1757733617.117.jpg',
    'https://s.bonbanh.com/uploads/users/782831/car/6429100/s_1757733619.332.jpg',
    'https://s.bonbanh.com/uploads/users/782831/car/6429100/s_1757733620.971.jpg',
  ],
  sellerId: '1',
  sellerName: 'Nguyễn Văn A',
  sellerPhone: '0901234567',
  sellerType: 'individual',
  location: 'Quận 1, Hồ Chí Minh',
  status: 'active',
  features: [
    'ABS',
    'Airbag',
    'Điều hòa tự động',
    'Camera lùi',
    'Cảm biến lùi',
    'Bluetooth',
  ],
  condition: 'used',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const CarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [contactForm, setContactForm] = useState<ContactInfo>({
    buyerName: '',
    buyerPhone: '',
    buyerEmail: '',
    message: '',
    carId: id || '',
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCar(mockCar);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleContactSubmit = () => {
    // TODO: Implement contact API call
    console.log('Contact form:', contactForm);
    setContactDialogOpen(false);
    // Show success message
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: car?.title,
        text: `Xem xe ${car?.title} - ${formatCurrency(car?.price || 0)}`,
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

  if (error || !car) {
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Alert severity='error'>{error || 'Không tìm thấy thông tin xe'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNext fontSize='small' />} sx={{ mb: 3 }}>
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
          {user?.role === 'buyer' && (
            <IconButton onClick={() => setIsFavorite(!isFavorite)}>
              {isFavorite ? <Favorite color='error' /> : <FavoriteBorder />}
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
                src={car.images[selectedImageIndex]}
                alt={car.title}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  backgroundColor: '#f5f5f5',
                }}
              />
              <Chip
                label={car.condition === 'new' ? 'Xe mới' : 'Xe cũ'}
                color={car.condition === 'new' ? 'success' : 'primary'}
                sx={{ position: 'absolute', top: 16, left: 16 }}
              />
            </Box>

            {car.images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, p: 2, overflowX: 'auto' }}>
                {car.images.map((image, index) => (
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
                      alt={`${car.title} ${index + 1}`}
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
                <Typography fontWeight='medium'>{car.year}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Speed fontSize='small' color='action' />
                  <Typography>Số km đã đi:</Typography>
                </Box>
                <Typography fontWeight='medium'>
                  {car.mileage.toLocaleString()} km
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalGasStation fontSize='small' color='action' />
                  <Typography>Nhiên liệu:</Typography>
                </Box>
                <Typography fontWeight='medium'>
                  {car.fuelType === 'gasoline'
                    ? 'Xăng'
                    : car.fuelType === 'diesel'
                    ? 'Dầu'
                    : car.fuelType === 'hybrid'
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
                  {car.transmission === 'automatic' ? 'Tự động' : 'Số sàn'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Palette fontSize='small' color='action' />
                  <Typography>Màu sắc:</Typography>
                </Box>
                <Typography fontWeight='medium'>{car.color}</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn fontSize='small' color='action' />
                  <Typography>Vị trí:</Typography>
                </Box>
                <Typography fontWeight='medium'>{car.location}</Typography>
              </Box>
            </Box>
          </Paper>

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant='h6' gutterBottom>
                Trang bị
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {car.features.map((feature, index) => (
                  <Chip key={index} label={feature} variant='outlined' />
                ))}
              </Box>
            </Paper>
          )}

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
              {car.description}
            </Typography>
          </Paper>
        </Box>

        {/* Right Column - Price and Contact */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant='h4' gutterBottom fontWeight='bold'>
              {car.title}
            </Typography>

            <Typography
              variant='h3'
              color='primary'
              fontWeight='bold'
              gutterBottom
            >
              {formatCurrency(car.price)}
            </Typography>

            <Typography variant='body2' color='text.secondary' gutterBottom>
              Đăng {formatRelativeTime(car.createdAt)}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Seller Info */}
            <Typography variant='h6' gutterBottom>
              Thông tin người bán
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant='body1' fontWeight='medium'>
                {car.sellerName}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {car.sellerType === 'individual' ? 'Cá nhân' : 'Đại lý'}
              </Typography>
            </Box>

            {/* Contact Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant='contained'
                size='large'
                startIcon={<Phone />}
                href={`tel:${car.sellerPhone}`}
                fullWidth
              >
                Gọi {car.sellerPhone}
              </Button>

              <Button
                variant='outlined'
                size='large'
                startIcon={<Email />}
                onClick={() => setContactDialogOpen(true)}
                fullWidth
              >
                Gửi tin nhắn
              </Button>

              {/* Chỉ buyer mới có thể báo cáo */}
              {user?.role === 'buyer' && (
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

      {/* Seller Ratings Section */}
      <Box sx={{ mt: 4 }}>
        <SellerRatings sellerId={car.sellerId} sellerName={car.sellerName} />
      </Box>

      {/* Contact Dialog */}
      <Dialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Liên hệ người bán</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label='Họ tên của bạn'
            margin='normal'
            value={contactForm.buyerName}
            onChange={(e) =>
              setContactForm({ ...contactForm, buyerName: e.target.value })
            }
          />
          <TextField
            fullWidth
            label='Số điện thoại'
            margin='normal'
            value={contactForm.buyerPhone}
            onChange={(e) =>
              setContactForm({ ...contactForm, buyerPhone: e.target.value })
            }
          />
          <TextField
            fullWidth
            label='Email'
            type='email'
            margin='normal'
            value={contactForm.buyerEmail}
            onChange={(e) =>
              setContactForm({ ...contactForm, buyerEmail: e.target.value })
            }
          />
          <TextField
            fullWidth
            label='Tin nhắn'
            multiline
            rows={4}
            margin='normal'
            placeholder='Tôi quan tâm đến chiếc xe này...'
            value={contactForm.message}
            onChange={(e) =>
              setContactForm({ ...contactForm, message: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handleContactSubmit}
            variant='contained'
            disabled={!contactForm.buyerName || !contactForm.buyerPhone}
          >
            Gửi tin nhắn
          </Button>
        </DialogActions>
      </Dialog>

      {/* Report Dialog */}
      <ReportDialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        reportedId={car.sellerId}
        reportedName={car.sellerName}
        reportedType='seller'
      />
    </Container>
  );
};

export default CarDetailPage;
