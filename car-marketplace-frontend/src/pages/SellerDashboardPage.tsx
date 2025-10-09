import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  TextField,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  Visibility,
  DirectionsCar,
  Warning,
  Save,
  Cancel,
  CloudUpload,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { formatCurrency, formatDate } from '../utils/helpers';
import { validateCarForm } from '../utils/validation';
import { useSellerPosts, useSeller } from '../hooks/useSeller';
import type { SellerPost, CreatePostData } from '../types';
import type { ValidationError } from '../utils/validation';

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

// Using real API data now - mockListings removed

const SellerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();

  // API hooks
  const { data: sellerPosts, isLoading, error, refetch } = useSellerPosts();
  const { deletePost, updatePost, updatePostError, isUpdatePostLoading } =
    useSeller();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<SellerPost | null>(
    null
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [editErrors, setEditErrors] = useState<ValidationError[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // Check for payment success from VNPay redirect
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      setSnackbarMessage(
        'Thanh toán thành công! Bài đăng của bạn đang chờ quản trị viên duyệt.'
      );
      setSnackbarOpen(true);

      // Clean up URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

  // Form states for editing
  const [editForm, setEditForm] = useState({
    title: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    fuelType: 'gasoline' as 'gasoline' | 'diesel' | 'hybrid' | 'electric',
    transmission: 'automatic' as 'manual' | 'automatic',
    color: '',
    condition: 'used' as 'new' | 'used',
    description: '',
    location: '',
    sellerPhone: '',
    sellerType: 'individual' as 'individual' | 'dealer',
    features: [] as string[],
    images: [] as File[],
  });

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

  const handleEdit = () => {
    if (selectedListing) {
      // Check if post status is APPROVED
      if (selectedListing.status === 'approved') {
        setSnackbarMessage(
          'Bài đăng ở trạng thái APPROVED không thể chỉnh sửa'
        );
        setSnackbarOpen(true);
        handleMenuClose();
        return;
      }

      setEditForm({
        title: selectedListing.title,
        brand: selectedListing.carDetail.make, // Map from carDetail.make
        model: selectedListing.carDetail.model,
        year: selectedListing.carDetail.year,
        price: selectedListing.price.toString(),
        mileage: selectedListing.carDetail.mileage.toString(),
        fuelType: selectedListing.carDetail.fuelType as
          | 'gasoline'
          | 'diesel'
          | 'hybrid'
          | 'electric',
        transmission: selectedListing.carDetail.transmission as
          | 'manual'
          | 'automatic',
        color: selectedListing.carDetail.color,
        condition: selectedListing.carDetail.condition as 'new' | 'used',
        description: selectedListing.description,
        location: selectedListing.location,
        sellerPhone: selectedListing.phoneContact,
        sellerType:
          selectedListing.sellerType === 'agency' ? 'dealer' : 'individual', // Map agency to dealer
        features: [], // SellerPost doesn't have features, so empty array
        images: [], // Start with empty for edit (existing images will be shown separately)
      });
      // Initialize preview images from existing images URLs
      setPreviewImages(selectedListing.images || []);
      setEditErrors([]); // Clear previous errors
      setEditDialogOpen(true);
    }
    // Only close menu without resetting selectedListing
    setAnchorEl(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length + editForm.images.length + previewImages.length > 10) {
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

    setEditForm((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));

    // Create preview URLs for new files
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const handleImageRemove = (index: number) => {
    const isExistingImage = index < (selectedListing?.images?.length || 0);

    if (isExistingImage) {
      // Remove from preview (existing images)
      setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Remove from new uploaded files
      const newImageIndex = index - (selectedListing?.images?.length || 0);
      setEditForm((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== newImageIndex),
      }));

      // Clean up object URL if it's a new upload
      if (previewImages[index]?.startsWith('blob:')) {
        URL.revokeObjectURL(previewImages[index]);
      }
      setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSaveEdit = () => {
    // Validate form data
    const formDataToValidate = {
      title: editForm.title,
      brand: editForm.brand,
      model: editForm.model,
      year: editForm.year,
      price: parseInt(editForm.price),
      mileage: parseInt(editForm.mileage),
      description: editForm.description,
      location: editForm.location,
    };

    const validationErrors = validateCarForm(formDataToValidate);

    // Additional validations for phone and images
    if (!editForm.sellerPhone.trim()) {
      validationErrors.push({
        field: 'sellerPhone',
        message: 'Số điện thoại là bắt buộc',
      });
    }

    // Check if we have at least one image (existing or new)
    const totalImages = previewImages.length;
    if (totalImages === 0) {
      validationErrors.push({
        field: 'images',
        message: 'Cần ít nhất 1 hình ảnh',
      });
    }

    if (validationErrors.length > 0) {
      setEditErrors(validationErrors);
      setSnackbarMessage('Vui lòng kiểm tra lại thông tin');
      setSnackbarOpen(true);
      return;
    }

    // Clear errors if validation passes
    setEditErrors([]);

    if (!selectedListing) return;

    // Map form data to CreatePostData format
    const updateData: CreatePostData = {
      title: editForm.title,
      description: editForm.description,
      price: parseInt(editForm.price),
      location: editForm.location,
      phoneContact: editForm.sellerPhone,
      sellerType: editForm.sellerType === 'dealer' ? 'agency' : 'individual',
      make: editForm.brand,
      model: editForm.model,
      year: editForm.year,
      mileage: parseInt(editForm.mileage),
      fuelType: editForm.fuelType,
      transmission: editForm.transmission,
      color: editForm.color,
      condition: editForm.condition,
      images: editForm.images,
    };

    // Call the API to update the post
    updatePost(
      { postId: selectedListing.id, postData: updateData },
      {
        onSuccess: () => {
          setSnackbarMessage('Bài đăng đã được cập nhật thành công!');
          setSnackbarOpen(true);
          setEditDialogOpen(false);
          setSelectedListing(null);
          refetch(); // Refresh the posts list
        },
        onError: (error) => {
          // Handle specific error for APPROVED posts
          if (error?.response?.status === 400) {
            setSnackbarMessage(
              error?.message ||
                'Bài đăng ở trạng thái APPROVED không thể chỉnh sửa'
            );
          } else {
            setSnackbarMessage(
              error?.message || 'Có lỗi xảy ra khi cập nhật bài đăng'
            );
          }
          setSnackbarOpen(true);
        },
      }
    );
  };

  const handleView = () => {
    if (selectedListing) {
      navigate(`/seller-dashboard/cars/${selectedListing.id}`);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    // Only close menu without resetting selectedListing
    setAnchorEl(null);
  };

  const confirmDelete = () => {
    if (selectedListing) {
      deletePost(selectedListing.id, {
        onSuccess: () => {
          setSnackbarMessage('Bài đăng đã được xóa thành công!');
          setSnackbarOpen(true);
          setDeleteDialogOpen(false);
          setSelectedListing(null);
          refetch(); // Refresh the posts list
        },
        onError: (error) => {
          setSnackbarMessage(
            error?.message || 'Có lỗi xảy ra khi xóa bài đăng'
          );
          setSnackbarOpen(true);
        },
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'draft':
        return 'info';
      case 'blocked':
        return 'error';
      case 'hidden':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'pending':
        return 'Chờ duyệt';
      case 'rejected':
        return 'Bị từ chối';
      case 'draft':
        return 'Nháp';
      case 'blocked':
        return 'Bị chặn';
      case 'hidden':
        return 'Đã ẩn';
      default:
        return status;
    }
  };

  const getErrorMessage = (field: string) => {
    const error = editErrors.find((e) => e.field === field);
    return error ? error.message : '';
  };

  const hasError = (field: string) => {
    return editErrors.some((e) => e.field === field);
  };

  if (!user || user.role !== 'seller') {
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Alert severity='error'>
          Bạn cần đăng nhập với tài khoản người bán để truy cập trang này.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Box>
          <Typography variant='h4' component='h1' gutterBottom>
            Bảng điều khiển người bán
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Quản lý các bài đăng xe và theo dõi hiệu suất
          </Typography>
        </Box>
        <Button
          variant='contained'
          startIcon={<Add />}
          onClick={() => navigate('/sell')}
          size='large'
        >
          Đăng bài mới
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <DirectionsCar
              sx={{ fontSize: 40, color: 'primary.main', mr: 2 }}
            />
            <Box>
              <Typography variant='h5' fontWeight='bold'>
                {sellerPosts?.length || 0}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Tổng bài đăng
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <Warning sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
            <Box>
              <Typography variant='h5' fontWeight='bold'>
                {sellerPosts?.filter((post) => post.status === 'pending')
                  .length || 0}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Chờ duyệt
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Listings */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography>Đang tải...</Typography>
        </Box>
      ) : error ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography color='error'>
            Có lỗi xảy ra khi tải danh sách bài đăng
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {(sellerPosts || []).map((listing) => (
            <Card key={listing.id} sx={{ width: 350, mb: 2 }}>
              <CardMedia
                component='img'
                height='200'
                image={listing.images[0]}
                alt={listing.title}
              />
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography
                    variant='h6'
                    component='h3'
                    noWrap
                    sx={{ flex: 1 }}
                  >
                    {listing.title}
                  </Typography>
                  <IconButton
                    onClick={(e) => handleMenuClick(e, listing)}
                    size='small'
                  >
                    <MoreVert />
                  </IconButton>
                </Box>

                <Typography variant='h6' color='primary' gutterBottom>
                  {formatCurrency(listing.price)}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    label={getStatusText(listing.status)}
                    color={getStatusColor(listing.status)}
                    size='small'
                  />
                </Box>

                <Typography variant='body2' color='text.secondary' gutterBottom>
                  Đăng: {formatDate(listing.createdAt)}
                </Typography>

                <Typography variant='body2' color='text.secondary'>
                  {listing.location}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <Visibility sx={{ mr: 1 }} />
          Xem chi tiết
        </MenuItem>
        <MenuItem
          onClick={handleEdit}
          disabled={selectedListing?.status === 'approved'}
        >
          <Edit sx={{ mr: 1 }} />
          Chỉnh sửa
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Xóa bài đăng
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedListing(null);
        }}
        maxWidth='lg'
        fullWidth
        disableRestoreFocus
        disableAutoFocus
        sx={{
          '& .MuiDialog-paper': {
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle>Chỉnh sửa bài đăng</DialogTitle>
        <DialogContent>
          <Box
            component='form'
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSaveEdit();
            }}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}
          >
            {/* Tiêu đề */}
            <TextField
              fullWidth
              label='Tiêu đề bài đăng *'
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
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
                  value={editForm.brand}
                  onChange={(e) =>
                    setEditForm({ ...editForm, brand: e.target.value })
                  }
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
                value={editForm.model}
                onChange={(e) =>
                  setEditForm({ ...editForm, model: e.target.value })
                }
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
                value={editForm.year}
                onChange={(e) =>
                  setEditForm({ ...editForm, year: parseInt(e.target.value) })
                }
                error={hasError('year')}
                helperText={getErrorMessage('year')}
                inputProps={{ min: 1990, max: new Date().getFullYear() + 1 }}
              />

              <TextField
                fullWidth
                type='number'
                label='Giá bán (VND) *'
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({ ...editForm, price: e.target.value })
                }
                error={hasError('price')}
                helperText={
                  getErrorMessage('price') ||
                  (parseInt(editForm.price) > 0
                    ? formatCurrency(parseInt(editForm.price))
                    : '')
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
                value={editForm.mileage}
                onChange={(e) =>
                  setEditForm({ ...editForm, mileage: e.target.value })
                }
                error={hasError('mileage')}
                helperText={getErrorMessage('mileage')}
                inputProps={{ min: 0 }}
              />

              <TextField
                fullWidth
                label='Màu sắc *'
                value={editForm.color}
                onChange={(e) =>
                  setEditForm({ ...editForm, color: e.target.value })
                }
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
                  value={editForm.fuelType}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      fuelType: e.target.value as
                        | 'gasoline'
                        | 'diesel'
                        | 'hybrid'
                        | 'electric',
                    })
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
                  value={editForm.transmission}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      transmission: e.target.value as 'manual' | 'automatic',
                    })
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
                  value={editForm.condition}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      condition: e.target.value as 'new' | 'used',
                    })
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
                  value={editForm.sellerType}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      sellerType: e.target.value as 'individual' | 'dealer',
                    })
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
                value={editForm.location}
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
                error={hasError('location')}
                helperText={getErrorMessage('location')}
                placeholder='VD: Quận 1, Hồ Chí Minh'
              />

              <TextField
                fullWidth
                label='Số điện thoại liên hệ *'
                value={editForm.sellerPhone}
                onChange={(e) =>
                  setEditForm({ ...editForm, sellerPhone: e.target.value })
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
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
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
                id='edit-image-upload'
                multiple
                type='file'
                onChange={handleImageUpload}
              />
              <label htmlFor='edit-image-upload'>
                <Button
                  variant='outlined'
                  component='span'
                  startIcon={<CloudUpload />}
                  sx={{ mb: 2 }}
                >
                  Thêm hình ảnh ({previewImages.length}/10)
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
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setEditDialogOpen(false);
              setSelectedListing(null);
            }}
            startIcon={<Cancel />}
            size='large'
          >
            Hủy
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSaveEdit();
            }}
            variant='contained'
            startIcon={<Save />}
            disabled={isUpdatePostLoading}
            size='large'
            type='button'
          >
            {isUpdatePostLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedListing(null);
        }}
        disableRestoreFocus
        disableAutoFocus
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa bài đăng "{selectedListing?.title}"?
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDeleteDialogOpen(false);
              setSelectedListing(null);
            }}
            size='large'
          >
            Hủy
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              confirmDelete();
            }}
            color='error'
            variant='contained'
            size='large'
            type='button'
          >
            Xóa
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
    </Container>
  );
};

export default SellerDashboardPage;
