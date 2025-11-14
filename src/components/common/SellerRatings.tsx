import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Divider,
  Button,
  Chip,
} from '@mui/material';
import { Person, RateReview } from '@mui/icons-material';
import StarRating from './StarRating';
import RatingDialog from './RatingDialog';
import { useRatingStore } from '../../store/ratingStore';
import { useAuth } from '../../hooks/useAuth';

interface SellerRatingsProps {
  sellerId: string;
  sellerName: string;
}

const SellerRatings: React.FC<SellerRatingsProps> = ({
  sellerId,
  sellerName,
}) => {
  const { user, isAuthenticated } = useAuth();
  const { getSellerRating, getUserRatingForSeller, fetchSellerRatings } =
    useRatingStore();

  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sellerRating = getSellerRating(sellerId);
  const userRating =
    isAuthenticated && user ? getUserRatingForSeller(sellerId, user.id) : null;

  useEffect(() => {
    const loadRatings = async () => {
      setIsLoading(true);
      try {
        await fetchSellerRatings(sellerId);
      } catch (error) {
        console.error('Failed to load seller ratings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRatings();
  }, [sellerId, fetchSellerRatings]);

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'vừa xong';
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    if (diffInSeconds < 31536000)
      return `${Math.floor(diffInSeconds / 2592000)} tháng trước`;
    return `${Math.floor(diffInSeconds / 31536000)} năm trước`;
  };

  const getRatingStats = () => {
    if (!sellerRating) return null;

    const stats = [5, 4, 3, 2, 1].map((star) => {
      const count = sellerRating.ratings.filter(
        (r) => Math.floor(r.rating) === star
      ).length;
      const percentage =
        sellerRating.totalRatings > 0
          ? Math.round((count / sellerRating.totalRatings) * 100)
          : 0;
      return { star, count, percentage };
    });

    return stats;
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Đang tải đánh giá...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Rating Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant='h6'>Đánh giá người bán</Typography>
            {/* Chỉ buyer mới có thể đánh giá và không phải chính seller đó */}
            {isAuthenticated &&
              user?.role === 'buyer' &&
              user?.id !== sellerId && (
                <Button
                  variant='outlined'
                  size='small'
                  startIcon={<RateReview />}
                  onClick={() => setShowRatingDialog(true)}
                >
                  {userRating ? 'Chỉnh sửa đánh giá' : 'Đánh giá'}
                </Button>
              )}
          </Box>

          {sellerRating ? (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 3,
                }}
              >
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <Typography
                    variant='h3'
                    component='div'
                    sx={{ fontWeight: 'bold' }}
                  >
                    {sellerRating.averageRating.toFixed(1)}
                  </Typography>
                  <StarRating value={sellerRating.averageRating} readOnly />
                  <Typography variant='body2' color='text.secondary'>
                    {sellerRating.totalRatings} đánh giá
                  </Typography>
                </Box>

                <Box sx={{ flex: 1 }}>
                  {getRatingStats()?.map(({ star, count, percentage }) => (
                    <Box
                      key={star}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Typography variant='body2' sx={{ minWidth: '20px' }}>
                        {star}
                      </Typography>
                      <StarRating value={1} readOnly size='small' />
                      <Box
                        sx={{
                          flexGrow: 1,
                          height: 8,
                          bgcolor: 'grey.200',
                          borderRadius: 1,
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            bgcolor: 'primary.main',
                            width: `${percentage}%`,
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </Box>
                      <Typography variant='body2' sx={{ minWidth: '30px' }}>
                        {count}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography color='text.secondary'>
                Chưa có đánh giá nào cho người bán này
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Individual Reviews */}
      {sellerRating && sellerRating.ratings.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              Nhận xét từ khách hàng
            </Typography>

            {sellerRating.ratings.map((rating, index) => (
              <Box key={rating.id}>
                <Box sx={{ display: 'flex', gap: 2, py: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Person />
                  </Avatar>

                  <Box sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 1,
                      }}
                    >
                      <Typography variant='subtitle2'>
                        Khách hàng #{rating.userId.slice(-4)}
                      </Typography>
                      <StarRating value={rating.rating} readOnly size='small' />
                      <Typography variant='caption' color='text.secondary'>
                        {formatTimeAgo(rating.createdAt)}
                      </Typography>
                      {rating.userId === user?.id && (
                        <Chip
                          label='Đánh giá của bạn'
                          size='small'
                          color='primary'
                          variant='outlined'
                        />
                      )}
                    </Box>

                    {rating.review && (
                      <Typography variant='body2' color='text.secondary'>
                        {rating.review}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {index < sellerRating.ratings.length - 1 && <Divider />}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Rating Dialog */}
      <RatingDialog
        open={showRatingDialog}
        onClose={() => setShowRatingDialog(false)}
        sellerId={sellerId}
        sellerName={sellerName}
        existingRating={
          userRating
            ? {
                id: userRating.id,
                rating: userRating.rating,
                review: userRating.review,
              }
            : undefined
        }
      />
    </Box>
  );
};

export default SellerRatings;
