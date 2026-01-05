import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import {
  Phone,
  LocationOn,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { formatCurrency } from '../../utils/helpers';
import { useAuthStore } from '../../store/authStore';
import { useFavoritesManager } from '../../hooks/useFavorites';
import { toast } from 'react-toastify';
import type { Car } from '../../types';

interface CarCardProps {
  car: Car;
  showFavorite?: boolean;
}

const CarCard: React.FC<CarCardProps> = ({ car, showFavorite = true }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  
  // Chỉ khởi tạo favorites manager khi user là buyer
  const isBuyer = user?.role === 'buyer';
  const shouldShowFavorite = showFavorite && isAuthenticated && isBuyer;
  
  const { 
    isFavorite, 
    toggleFavorite, 
    isTogglingFavorite 
  } = useFavoritesManager();

  const isCarFavorite = shouldShowFavorite ? isFavorite(car.id) : false;

  const handleCardClick = () => {
    navigate(`/cars/${car.id}`);
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info(`Liên hệ: ${car.sellerPhone}`);
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Check if user is logged in
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để sử dụng tính năng yêu thích');
      navigate('/login');
      return;
    }

    // Check if user is buyer
    if (!isBuyer) {
      toast.warning('Chỉ người mua mới có thể lưu xe yêu thích');
      return;
    }

    try {
      await toggleFavorite(car.id, isCarFavorite);
      toast.success(
        isCarFavorite 
          ? 'Đã xóa khỏi danh sách yêu thích' 
          : 'Đã thêm vào danh sách yêu thích'
      );
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={handleCardClick}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component='img'
          height='200'
          image={car.images[0] || '/api/placeholder/400/300'}
          alt={car.title}
          sx={{ backgroundColor: 'grey.200' }}
        />

        {/* Status Badge */}
        <Chip
          label={car.condition === 'new' ? 'Xe mới' : 'Xe cũ'}
          color={car.condition === 'new' ? 'success' : 'primary'}
          size='small'
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
          }}
        />

        {/* Favorite Button - Only show for authenticated buyers */}
        {shouldShowFavorite && (
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
            }}
            onClick={handleFavoriteClick}
            disabled={isTogglingFavorite}
          >
            {isCarFavorite ? <Favorite color='error' /> : <FavoriteBorder />}
          </IconButton>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant='h6'
          component='h3'
          gutterBottom
          noWrap
          sx={{ fontWeight: 600 }}
        >
          {car.title}
        </Typography>

        <Typography
          variant='h5'
          color='primary'
          fontWeight='bold'
          gutterBottom
          sx={{ mb: 2 }}
        >
          {formatCurrency(car.price)}
        </Typography>

        {/* Car Details */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip label={`${car.year}`} size='small' variant='outlined' />
          <Chip
            label={`${car.mileage.toLocaleString()} km`}
            size='small'
            variant='outlined'
          />
          <Chip
            label={car.transmission === 'automatic' ? 'Tự động' : 'Số sàn'}
            size='small'
            variant='outlined'
          />
        </Box>

        <Chip
          label={
            car.fuelType === 'gasoline'
              ? 'Xăng'
              : car.fuelType === 'diesel'
              ? 'Dầu'
              : car.fuelType === 'hybrid'
              ? 'Hybrid'
              : 'Điện'
          }
          size='small'
          variant='outlined'
          sx={{ mb: 2 }}
        />

        {/* Location */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'text.secondary',
          }}
        >
          <LocationOn fontSize='small' />
          <Typography variant='body2'>{car.location}</Typography>
        </Box>

        {/* Seller Info */}
        <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
          Người bán: {car.sellerName}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
        <Button
          size='small'
          startIcon={<Phone />}
          onClick={handleContactClick}
          variant='outlined'
        >
          Liên hệ
        </Button>
        <Button size='small' color='primary' variant='text'>
          Xem chi tiết
        </Button>
      </CardActions>
    </Card>
  );
};

export default CarCard;