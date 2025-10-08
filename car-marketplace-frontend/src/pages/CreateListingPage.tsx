import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  IconButton,
  Card,
  CardMedia,
} from '@mui/material';
import { CloudUpload, Delete, Save, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { validateCarForm } from '../utils/validation';
import { formatCurrency } from '../utils/helpers';
import type { ValidationError } from '../utils/validation';

interface CarFormData {
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  transmission: 'manual' | 'automatic';
  color: string;
  condition: 'new' | 'used';
  description: string;
  location: string;
  sellerPhone: string;
  sellerType: 'individual' | 'dealer';
  features: string[];
  images: File[];
}

const INITIAL_FORM_DATA: CarFormData = {
  title: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  price: 0,
  mileage: 0,
  fuelType: 'gasoline',
  transmission: 'automatic',
  color: '',
  condition: 'used',
  description: '',
  location: '',
  sellerPhone: '',
  sellerType: 'individual',
  features: [],
  images: [],
};

const CAR_BRANDS = [
  'Toyota',
  'Honda',
  'Hyundai',
  'Kia',
  'Mazda',
  'Mitsubishi',
  'Nissan',
  'Ford',
  'Chevrolet',
  'Volkswagen',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Lexus',
  'Vinfast',
];

const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState<CarFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleInputChange = (
    field: keyof CarFormData,
    value: string | number | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear errors for this field
    setErrors((prev) => prev.filter((error) => error.field !== field));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length + formData.images.length > 10) {
      setSnackbarMessage('Tối đa 10 hình ảnh');
      setSnackbarOpen(true);
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        setSnackbarMessage('Chỉ chấp nhận file hình ảnh');
        setSnackbarOpen(true);
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        setSnackbarMessage('Kích thước file tối đa 5MB');
        setSnackbarOpen(true);
        return false;
      }

      return true;
    });

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));

    // Create preview URLs
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const handleImageRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    URL.revokeObjectURL(previewImages[index]);
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate form
    const validationErrors = validateCarForm(formData);

    // Additional validations
    if (formData.images.length === 0) {
      validationErrors.push({
        field: 'images',
        message: 'Cần ít nhất 1 hình ảnh',
      });
    }

    if (!formData.sellerPhone) {
      validationErrors.push({
        field: 'sellerPhone',
        message: 'Số điện thoại là bắt buộc',
      });
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement API call to create listing
      console.log('Creating listing:', formData);

      // Simulate API call to create listing and get listing ID
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock listing ID from API response
      const newListingId = `listing_${Date.now()}`;

      // Redirect to VNPay payment gateway
      // In real implementation, you would get the VNPay payment URL from your backend
      const vnpayUrl =
        `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?` +
        `vnp_Version=2.1.0&` +
        `vnp_Command=pay&` +
        `vnp_TmnCode=YOUR_TMN_CODE&` +
        `vnp_Amount=${50000 * 100}&` + // VNPay amount in VND * 100
        `vnp_CurrCode=VND&` +
        `vnp_TxnRef=${newListingId}&` +
        `vnp_OrderInfo=Thanh toan dang tin xe ${formData.title}&` +
        `vnp_OrderType=other&` +
        `vnp_Locale=vn&` +
        `vnp_ReturnUrl=${encodeURIComponent(
          window.location.origin + '/seller-dashboard?payment=success'
        )}&` +
        `vnp_IpAddr=127.0.0.1&` +
        `vnp_CreateDate=${new Date()
          .toISOString()
          .replace(/[-:]/g, '')
          .slice(0, 14)}`;

      // Redirect to VNPay
      window.location.href = vnpayUrl;
    } catch {
      setSnackbarMessage('Có lỗi xảy ra, vui lòng thử lại');
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const getErrorMessage = (field: string) => {
    const error = errors.find((e) => e.field === field);
    return error ? error.message : '';
  };

  const hasError = (field: string) => {
    return errors.some((e) => e.field === field);
  };

  if (!user || user.role !== 'seller') {
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Alert severity='error'>
          Bạn cần đăng nhập với tài khoản người bán để đăng bài.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Đăng bán xe
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Điền thông tin chi tiết để tạo bài đăng bán xe
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Tiêu đề */}
            <TextField
              fullWidth
              label='Tiêu đề bài đăng *'
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={hasError('title')}
              helperText={getErrorMessage('title')}
              placeholder='VD: Toyota Camry 2022 - Xe gia đình sang trọng'
            />

            {/* Row 1: Hãng xe và Dòng xe */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', md: 'row' },
              }}
            >
              <FormControl fullWidth error={hasError('brand')}>
                <InputLabel>Hãng xe *</InputLabel>
                <Select
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  label='Hãng xe *'
                >
                  {CAR_BRANDS.map((brand) => (
                    <MenuItem key={brand} value={brand}>
                      {brand}
                    </MenuItem>
                  ))}
                </Select>
                {hasError('brand') && (
                  <Typography variant='caption' color='error' sx={{ ml: 2 }}>
                    {getErrorMessage('brand')}
                  </Typography>
                )}
              </FormControl>

              <TextField
                fullWidth
                label='Dòng xe *'
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                error={hasError('model')}
                helperText={getErrorMessage('model')}
                placeholder='VD: Camry, Civic, Accent...'
              />
            </Box>

            {/* Row 2: Năm sản xuất và Giá */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', md: 'row' },
              }}
            >
              <TextField
                fullWidth
                type='number'
                label='Năm sản xuất *'
                value={formData.year}
                onChange={(e) =>
                  handleInputChange('year', parseInt(e.target.value))
                }
                error={hasError('year')}
                helperText={getErrorMessage('year')}
                inputProps={{ min: 1990, max: new Date().getFullYear() + 1 }}
              />

              <TextField
                fullWidth
                type='number'
                label='Giá bán (VND) *'
                value={formData.price}
                onChange={(e) =>
                  handleInputChange('price', parseInt(e.target.value))
                }
                error={hasError('price')}
                helperText={
                  getErrorMessage('price') ||
                  (formData.price > 0 ? formatCurrency(formData.price) : '')
                }
                inputProps={{ min: 0 }}
              />
            </Box>

            {/* Row 3: Số km và Màu sắc */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', md: 'row' },
              }}
            >
              <TextField
                fullWidth
                type='number'
                label='Số km đã đi *'
                value={formData.mileage}
                onChange={(e) =>
                  handleInputChange('mileage', parseInt(e.target.value))
                }
                error={hasError('mileage')}
                helperText={getErrorMessage('mileage')}
                inputProps={{ min: 0 }}
              />

              <TextField
                fullWidth
                label='Màu sắc *'
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                error={hasError('color')}
                helperText={getErrorMessage('color')}
                placeholder='VD: Trắng, Đen, Bạc...'
              />
            </Box>

            {/* Row 4: Nhiên liệu và Hộp số */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', md: 'row' },
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Loại nhiên liệu *</InputLabel>
                <Select
                  value={formData.fuelType}
                  onChange={(e) =>
                    handleInputChange('fuelType', e.target.value)
                  }
                  label='Loại nhiên liệu *'
                >
                  <MenuItem value='gasoline'>Xăng</MenuItem>
                  <MenuItem value='diesel'>Dầu diesel</MenuItem>
                  <MenuItem value='hybrid'>Hybrid</MenuItem>
                  <MenuItem value='electric'>Điện</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Hộp số *</InputLabel>
                <Select
                  value={formData.transmission}
                  onChange={(e) =>
                    handleInputChange('transmission', e.target.value)
                  }
                  label='Hộp số *'
                >
                  <MenuItem value='automatic'>Tự động</MenuItem>
                  <MenuItem value='manual'>Số sàn</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Row 5: Tình trạng và Loại người bán */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', md: 'row' },
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Tình trạng xe *</InputLabel>
                <Select
                  value={formData.condition}
                  onChange={(e) =>
                    handleInputChange('condition', e.target.value)
                  }
                  label='Tình trạng xe *'
                >
                  <MenuItem value='new'>Xe mới</MenuItem>
                  <MenuItem value='used'>Xe đã qua sử dụng</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Loại người bán *</InputLabel>
                <Select
                  value={formData.sellerType}
                  onChange={(e) =>
                    handleInputChange('sellerType', e.target.value)
                  }
                  label='Loại người bán *'
                >
                  <MenuItem value='individual'>Cá nhân</MenuItem>
                  <MenuItem value='dealer'>Đại lý</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Row 6: Địa điểm và Số điện thoại */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', md: 'row' },
              }}
            >
              <TextField
                fullWidth
                label='Địa điểm *'
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                error={hasError('location')}
                helperText={getErrorMessage('location')}
                placeholder='VD: Quận 1, Hồ Chí Minh'
              />

              <TextField
                fullWidth
                label='Số điện thoại liên hệ *'
                value={formData.sellerPhone}
                onChange={(e) =>
                  handleInputChange('sellerPhone', e.target.value)
                }
                error={hasError('sellerPhone')}
                helperText={getErrorMessage('sellerPhone')}
                placeholder='VD: 0901234567'
              />
            </Box>

            {/* Mô tả */}
            <TextField
              fullWidth
              multiline
              rows={6}
              label='Mô tả chi tiết *'
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              error={hasError('description')}
              helperText={getErrorMessage('description')}
              placeholder='Mô tả chi tiết về xe, tình trạng, lịch sử sử dụng, trang bị...'
            />

            {/* Hình ảnh */}
            <Box>
              <Typography variant='h6' gutterBottom>
                Hình ảnh xe *
              </Typography>

              <input
                accept='image/*'
                style={{ display: 'none' }}
                id='image-upload'
                multiple
                type='file'
                onChange={handleImageUpload}
              />
              <label htmlFor='image-upload'>
                <Button
                  variant='outlined'
                  component='span'
                  startIcon={<CloudUpload />}
                  sx={{ mb: 2 }}
                >
                  Thêm hình ảnh ({formData.images.length}/10)
                </Button>
              </label>

              {hasError('images') && (
                <Typography
                  variant='caption'
                  color='error'
                  display='block'
                  sx={{ mb: 2 }}
                >
                  {getErrorMessage('images')}
                </Typography>
              )}

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {previewImages.map((preview, index) => (
                  <Card
                    key={index}
                    sx={{ position: 'relative', width: 150, height: 150 }}
                  >
                    <CardMedia
                      component='img'
                      height='150'
                      image={preview}
                      alt={`Preview ${index + 1}`}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      }}
                      onClick={() => handleImageRemove(index)}
                    >
                      <Delete />
                    </IconButton>
                  </Card>
                ))}
              </Box>
            </Box>

            {/* Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant='outlined'
                startIcon={<Cancel />}
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                type='submit'
                variant='contained'
                startIcon={<Save />}
                disabled={loading}
              >
                {loading ? 'Đang đăng...' : 'Đăng bài'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default CreateListingPage;
