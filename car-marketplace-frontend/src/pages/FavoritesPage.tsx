import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Favorite } from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';
import { useFavoritesManager } from '../hooks/useFavorites';
import CarCard from '../components/car/CarCard';
import type { Car, SellerPost } from '../types';

// Helper function to convert SellerPost to Car format for CarCard component
const mapSellerPostToCar = (sellerPost: SellerPost): Car => {
  return {
    id: sellerPost.id,
    title: sellerPost.title,
    brand: sellerPost.carDetail.make,
    model: sellerPost.carDetail.model,
    year: sellerPost.carDetail.year,
    price: sellerPost.price,
    mileage: sellerPost.carDetail.mileage,
    fuelType: sellerPost.carDetail.fuelType.toLowerCase() as
      | 'gasoline'
      | 'diesel'
      | 'hybrid'
      | 'electric',
    transmission: sellerPost.carDetail.transmission.toLowerCase() as
      | 'manual'
      | 'automatic',
    color: sellerPost.carDetail.color,
    description: sellerPost.description,
    images: sellerPost.images,
    sellerId: sellerPost.id,
    sellerName: 'Seller',
    sellerPhone: sellerPost.phoneContact,
    sellerType: sellerPost.sellerType === 'agency' ? 'dealer' : 'individual',
    location: sellerPost.location,
    status:
      sellerPost.status === 'approved'
        ? 'active'
        : (sellerPost.status as 'pending' | 'sold' | 'rejected'),
    condition: sellerPost.carDetail.condition.toLowerCase() as 'new' | 'used',
    createdAt: sellerPost.createdAt,
    updatedAt: sellerPost.updatedAt || sellerPost.createdAt,
  };
};

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { favorites, isLoadingFavorites, favoritesError } =
    useFavoritesManager();

  // Only buyers can access favorites
  if (!isAuthenticated || user?.role !== 'buyer') {
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Alert severity='warning'>
          Chỉ người mua mới có thể sử dụng tính năng yêu thích.
        </Alert>
      </Container>
    );
  }

  if (isLoadingFavorites) {
    return (
      <Container maxWidth='lg' sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant='body1' sx={{ mt: 2 }}>
          Đang tải danh sách yêu thích...
        </Typography>
      </Container>
    );
  }

  if (favoritesError) {
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Alert severity='error'>{favoritesError}</Alert>
      </Container>
    );
  }

  const favoriteCars = favorites.map(mapSellerPostToCar);

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Favorite sx={{ fontSize: 32, color: 'error.main', mr: 2 }} />
        <Typography
          variant='h4'
          component='h1'
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Xe yêu thích
        </Typography>
      </Box>

      {favoriteCars.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant='h6' color='text.secondary' gutterBottom>
            Bạn chưa có xe nào trong danh sách yêu thích
          </Typography>
          <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
            Khám phá và thêm những chiếc xe bạn quan tâm vào danh sách yêu thích
          </Typography>
          <Typography
            variant='body2'
            color='primary'
            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => navigate('/cars')}
          >
            Khám phá xe ngay
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
              xl: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          {favoriteCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default FavoritesPage;
