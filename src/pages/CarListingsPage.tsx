import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Pagination,
  Chip,
  InputAdornment,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  Slider,
  Divider,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import { Search, Clear, TuneRounded } from '@mui/icons-material';
import CarCard from '../components/car/CarCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useCarStore } from '../store/carStore';
import { formatCurrency } from '../utils/helpers';
import { CAR_BRANDS } from '../types';
import type { CarFilters, SellerPost, Car, PublicSearchParams } from '../types';
import { usePublicPosts, usePublicPostsSearch } from '../hooks/usePublic';
import { mapFrontendFiltersToBackendSearchParams } from '../types';

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
    sellerId: sellerPost.id, // Using post id as seller id for now
    sellerName: 'Seller', // Default name since not available in SellerPost
    sellerPhone: sellerPost.phoneContact,
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

// Remove mock data - using real API now

const CarListingsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();

  const { filters, setFilters, clearFilters } = useCarStore();
  const [localFilters, setLocalFilters] = useState<CarFilters>({});
  const [searchQuery, setSearchQuery] = useState(
    urlSearchParams.get('search') || ''
  );
  // Separate state for applied search query (only updates on button click)
  const [appliedSearchQuery, setAppliedSearchQuery] = useState(
    urlSearchParams.get('search') || ''
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const carsPerPage = 12;

  // Determine if we should use search API or regular API
  // Only use appliedSearchQuery (not searchQuery) to prevent auto-search while typing
  const hasFiltersOrSearch =
    Object.keys(filters).length > 0 || appliedSearchQuery.trim() !== '';

  // Convert frontend filters to backend search params (include pagination)
  // Use appliedSearchQuery instead of searchQuery
  const backendSearchParams: PublicSearchParams = {
    ...mapFrontendFiltersToBackendSearchParams(filters as CarFilters, appliedSearchQuery),
    page,
    perPage: carsPerPage,
  };

  // Use public posts API (regular pagination)
  const {
    data: publicPostsData,
    isLoading: isLoadingPosts,
    error: postsError,
  } = usePublicPosts(page, carsPerPage);

  // Use search API when filters or search query is present
  const {
    data: searchResults,
    isLoading: isLoadingSearch,
    error: searchError,
  } = usePublicPostsSearch(backendSearchParams, hasFiltersOrSearch);

  // Combine loading and error states
  const isLoading = hasFiltersOrSearch ? isLoadingSearch : isLoadingPosts;
  const error = hasFiltersOrSearch ? searchError : postsError;

  // Price range state
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000000000]);

  useEffect(() => {
    // Initialize filters from URL params
    const initialFilters: CarFilters = {};
    if (urlSearchParams.get('brand'))
      initialFilters.brand = urlSearchParams.get('brand')!;
    if (urlSearchParams.get('minPrice'))
      initialFilters.minPrice = Number(urlSearchParams.get('minPrice'));
    if (urlSearchParams.get('maxPrice'))
      initialFilters.maxPrice = Number(urlSearchParams.get('maxPrice'));
    if (urlSearchParams.get('condition'))
      initialFilters.condition = urlSearchParams.get('condition') as 'new' | 'used';

    // Initialize price range from URL
    if (initialFilters.minPrice || initialFilters.maxPrice) {
      setPriceRange([
        initialFilters.minPrice || 0,
        initialFilters.maxPrice || 5000000000,
      ]);
    }

    setLocalFilters(initialFilters);
    setFilters(initialFilters);
    
    // Also set applied search query from URL
    const searchFromUrl = urlSearchParams.get('search') || '';
    setAppliedSearchQuery(searchFromUrl);
  }, [urlSearchParams, setFilters]);

  const handleSearch = () => {
    // Update applied search query when button is clicked
    setAppliedSearchQuery(searchQuery.trim());
    applyFilters(localFilters);
  };

  const applyFilters = (newFilters: CarFilters) => {
    setFilters(newFilters);
    setPage(1);

    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString());
      }
    });
    if (searchQuery) params.set('search', searchQuery);
    setUrlSearchParams(params);
  };

  const handleFilterChange = (
    key: keyof CarFilters,
    value: string | number | undefined
  ) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    setSearchQuery('');
    setAppliedSearchQuery('');
    setPriceRange([0, 5000000000]);
    clearFilters();
    setUrlSearchParams({});
  };

  const handlePriceRangeChange = (
    _event: Event,
    newValue: number | number[]
  ) => {
    setPriceRange(newValue as number[]);
    setLocalFilters({
      ...localFilters,
      minPrice: (newValue as number[])[0],
      maxPrice: (newValue as number[])[1],
    });
  };

  // Filter UI Component
  const FilterContent = () => (
    <Box sx={{ p: 3, minWidth: isMobile ? 'auto' : 300 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant='h6'>Bộ lọc</Typography>
        <Button size='small' onClick={handleClearFilters} startIcon={<Clear />}>
          Xóa bộ lọc
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Brand Filter */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Hãng xe</InputLabel>
        <Select
          value={localFilters.brand || ''}
          label='Hãng xe'
          onChange={(e) => handleFilterChange('brand', e.target.value)}
        >
          <MenuItem value=''>Tất cả</MenuItem>
          {CAR_BRANDS.map((brand) => (
            <MenuItem key={brand} value={brand}>
              {brand}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Khoảng giá</Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceRangeChange}
          valueLabelDisplay='auto'
          min={0}
          max={5000000000}
          step={100000000}
          valueLabelFormat={(value) => formatCurrency(value)}
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant='caption'>
            {formatCurrency(priceRange[0])}
          </Typography>
          <Typography variant='caption'>
            {formatCurrency(priceRange[1])}
          </Typography>
        </Box>
      </Box>

      {/* Condition */}
      <FormGroup sx={{ mb: 3 }}>
        <Typography gutterBottom>Tình trạng</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={localFilters.condition === 'new'}
              onChange={(e) =>
                handleFilterChange(
                  'condition',
                  e.target.checked ? 'new' : undefined
                )
              }
            />
          }
          label='Xe mới'
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={localFilters.condition === 'used'}
              onChange={(e) =>
                handleFilterChange(
                  'condition',
                  e.target.checked ? 'used' : undefined
                )
              }
            />
          }
          label='Xe cũ'
        />
      </FormGroup>

      <Button
        fullWidth
        variant='contained'
        onClick={() => {
          applyFilters(localFilters);
          if (isMobile) setDrawerOpen(false);
        }}
      >
        Áp dụng bộ lọc
      </Button>
    </Box>
  );

  // Calculate pagination from API data - both APIs now return PaginatedResponse
  const currentData = hasFiltersOrSearch ? searchResults : publicPostsData;
  const totalCars = currentData?.total || 0;
  const totalPages = currentData?.totalPages || 0;

  // Get displayed cars from paginated response
  const displayedCars = (currentData?.items || []).map(mapSellerPostToCar);

  return (
    <Container maxWidth='xl' sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Danh sách xe ({totalCars} kết quả)
        </Typography>

        {/* Search Bar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder='Tìm kiếm theo tên xe, hãng...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant='contained'
            onClick={handleSearch}
            sx={{ minWidth: 120 }}
          >
            Tìm kiếm
          </Button>
          {isMobile && (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ border: 1, borderColor: 'divider' }}
            >
              <TuneRounded />
            </IconButton>
          )}
        </Box>

        {/* Active Filters */}
        {Object.keys(filters).length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              let label = '';

              switch (key) {
                case 'brand':
                  label = `Hãng: ${value}`;
                  break;
                case 'minPrice':
                  label = `Từ: ${formatCurrency(value as number)}`;
                  break;
                case 'maxPrice':
                  label = `Đến: ${formatCurrency(value as number)}`;
                  break;
                case 'fuelType':
                  label = `Nhiên liệu: ${value}`;
                  break;
                default:
                  label = `${key}: ${value}`;
              }

              return (
                <Chip
                  key={key}
                  label={label}
                  onDelete={() => {
                    const newFilters = { ...filters };
                    const filterKey = key as keyof typeof newFilters;
                    if (filterKey in newFilters) {
                      delete newFilters[filterKey];
                    }
                    setFilters(newFilters);
                  }}
                  color='primary'
                  variant='outlined'
                />
              );
            })}
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Desktop Filters Sidebar */}
        {!isMobile && (
          <Paper sx={{ height: 'fit-content', position: 'sticky', top: 20 }}>
            <FilterContent />
          </Paper>
        )}

        {/* Mobile Filters Drawer */}
        <Drawer
          anchor='left'
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{ display: { md: 'none' } }}
        >
          <FilterContent />
        </Drawer>

        {/* Cars Grid */}
        <Box sx={{ flex: 1 }}>
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant='h6' gutterBottom color='error'>
                Có lỗi xảy ra khi tải dữ liệu
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Vui lòng thử lại sau
              </Typography>
            </Paper>
          ) : displayedCars.length > 0 ? (
            <>
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
                  mb: 4,
                }}
              >
                {displayedCars.map((car: Car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </Box>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_event, value) => setPage(value)}
                    color='primary'
                    size='large'
                  />
                </Box>
              )}
            </>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant='h6' gutterBottom>
                Không tìm thấy xe nào
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default CarListingsPage;
