import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Search,
  DirectionsCar,
  TrendingUp,
  Security,
  Speed,
  Phone,
  LocationOn,
  Favorite,
} from '@mui/icons-material';
import { formatCurrency } from '../utils/helpers';
import logo from '../assets/logo.png';

// Mock data for featured cars
const featuredCars = [
  {
    id: '1',
    title: 'Hyundai Veloster 1.6 AT - 2011',
    brand: 'Hyundai',
    model: 'Veloster',
    year: 2011,
    price: 293000000,
    mileage: 12000,
    fuelType: 'gasoline' as const,
    transmission: 'automatic' as const,
    location: 'Hồ Chí Minh',
    images: [
      'https://s.bonbanh.com/uploads/users/744077/car/6444417/s_1758599223.880.jpg',
    ],
    sellerName: 'Nguyễn Văn A',
    condition: 'used' as const,
  },
  {
    id: '2',
    title: 'Honda Civic 2023 - Mới 100%',
    brand: 'Honda',
    model: 'Civic',
    year: 2023,
    price: 850000000,
    mileage: 0,
    fuelType: 'gasoline' as const,
    transmission: 'automatic' as const,
    location: 'Hà Nội',
    images: ['/api/placeholder/400/300'],
    sellerName: 'Trần Thị B',
    condition: 'new' as const,
  },
  {
    id: '3',
    title: 'Mazda CX-5 2021 - SUV 7 chỗ',
    brand: 'Mazda',
    model: 'CX-5',
    year: 2021,
    price: 950000000,
    mileage: 25000,
    fuelType: 'gasoline' as const,
    transmission: 'automatic' as const,
    location: 'Đà Nẵng',
    images: ['/api/placeholder/400/300'],
    sellerName: 'Lê Văn C',
    condition: 'used' as const,
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/cars?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/cars');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `url(${logo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
          py: 8,
          textAlign: 'center',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        }}
      >
        <Container maxWidth='lg'>
          <Typography
            variant='h2'
            component='h1'
            gutterBottom
            fontWeight='bold'
            sx={{ mb: 3 }}
          >
            Tìm chiếc xe mơ ước của bạn
          </Typography>
          <Typography variant='h5' component='p' sx={{ mb: 4 }}>
            Nền tảng mua bán xe hàng đầu Việt Nam với hàng nghìn lựa chọn
          </Typography>

          {/* Search Bar */}
          <Box sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
            <TextField
              fullWidth
              placeholder='Tìm kiếm xe theo hãng, mẫu xe...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                backgroundColor: 'white',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { border: 'none' },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <Button
                      variant='contained'
                      onClick={handleSearch}
                      sx={{
                        minWidth: 120,
                        height: 48,
                        borderRadius: 1.5,
                      }}
                      startIcon={<Search />}
                    >
                      Tìm kiếm
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Quick Actions */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant='contained'
              size='large'
              onClick={() => navigate('/cars')}
            >
              Xem tất cả xe
            </Button>
            <Button
              variant='outlined'
              size='large'
              onClick={() => navigate('/sell')}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Đăng bán xe
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth='lg' sx={{ py: 6 }}>
        <Typography variant='h4' component='h2' textAlign='center' gutterBottom>
          Tại sao chọn Car Marketplace?
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            mt: 4,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Paper sx={{ p: 3, textAlign: 'center', flex: 1, minWidth: 250 }}>
            <Security sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant='h6' gutterBottom>
              An toàn & Tin cậy
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Tất cả bài đăng được kiểm duyệt kỹ lưỡng
            </Typography>
          </Paper>
          <Paper sx={{ p: 3, textAlign: 'center', flex: 1, minWidth: 250 }}>
            <Speed sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant='h6' gutterBottom>
              Nhanh chóng
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Tìm kiếm và liên hệ trực tiếp với người bán
            </Typography>
          </Paper>
          <Paper sx={{ p: 3, textAlign: 'center', flex: 1, minWidth: 250 }}>
            <TrendingUp sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant='h6' gutterBottom>
              Đa dạng
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Hàng nghìn lựa chọn từ xe mới đến xe cũ
            </Typography>
          </Paper>
        </Box>
      </Container>

      {/* Featured Cars Section */}
      <Box sx={{ backgroundColor: 'grey.50', py: 6 }}>
        <Container maxWidth='lg'>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Typography variant='h4' component='h2'>
              Xe nổi bật
            </Typography>
            <Button
              variant='outlined'
              onClick={() => navigate('/cars')}
              endIcon={<DirectionsCar />}
            >
              Xem tất cả
            </Button>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 3,
              overflowX: 'auto',
              pb: 2,
              '&::-webkit-scrollbar': { height: 8 },
              '&::-webkit-scrollbar-track': { backgroundColor: 'grey.200' },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'grey.400',
                borderRadius: 4,
              },
            }}
          >
            {featuredCars.map((car) => (
              <Card
                key={car.id}
                sx={{
                  minWidth: 320,
                  maxWidth: 320,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
                onClick={() => navigate(`/cars/${car.id}`)}
              >
                <CardMedia
                  component='img'
                  height='200'
                  image={car.images[0]}
                  alt={car.title}
                  sx={{ backgroundColor: 'grey.200' }}
                />
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      mb: 1,
                    }}
                  >
                    <Chip
                      label={car.condition === 'new' ? 'Xe mới' : 'Xe cũ'}
                      color={car.condition === 'new' ? 'success' : 'primary'}
                      size='small'
                    />
                    <IconButton size='small'>
                      <Favorite />
                    </IconButton>
                  </Box>

                  <Typography variant='h6' component='h3' gutterBottom noWrap>
                    {car.title}
                  </Typography>

                  <Typography
                    variant='h5'
                    color='primary'
                    fontWeight='bold'
                    gutterBottom
                  >
                    {formatCurrency(car.price)}
                  </Typography>

                  <Box
                    sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}
                  >
                    <Chip
                      label={`${car.year}`}
                      size='small'
                      variant='outlined'
                    />
                    <Chip
                      label={`${car.mileage.toLocaleString()} km`}
                      size='small'
                      variant='outlined'
                    />
                    <Chip
                      label={
                        car.transmission === 'automatic' ? 'Tự động' : 'Số sàn'
                      }
                      size='small'
                      variant='outlined'
                    />
                  </Box>

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
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    size='small'
                    startIcon={<Phone />}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle contact seller
                    }}
                  >
                    Liên hệ
                  </Button>
                  <Button size='small' color='primary'>
                    Xem chi tiết
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Call to Action */}
      <Container maxWidth='lg' sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant='h4' component='h2' gutterBottom>
          Bán xe của bạn ngay hôm nay
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>
          Đăng tin miễn phí và tiếp cận hàng triệu khách hàng tiềm năng
        </Typography>
        <Button
          variant='contained'
          size='large'
          onClick={() => navigate('/sell')}
          sx={{ px: 4, py: 1.5 }}
        >
          Đăng bán xe ngay
        </Button>
      </Container>
    </Box>
  );
};

export default HomePage;
