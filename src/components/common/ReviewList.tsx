import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Rating,
  Avatar,
  Pagination,
  Stack,
} from '@mui/material';
import { Star, Person } from '@mui/icons-material';
import { formatRelativeTime } from '../../utils/helpers';
import type { Review } from '../../types';

interface ReviewListProps {
  reviews: Review[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Đang tải đánh giá...</Typography>
      </Box>
    );
  }

  if (reviews.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">Chưa có đánh giá nào</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Stack spacing={2}>
        {reviews.map((review) => (
          <Card key={review.id} variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Person />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {review.reviewer.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      • {formatRelativeTime(review.createdAt)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating
                      value={review.rating}
                      readOnly
                      size="small"
                      icon={<Star fontSize="inherit" />}
                      emptyIcon={<Star fontSize="inherit" />}
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {review.rating}/5
                    </Typography>
                  </Box>

                  {review.comment && (
                    <Typography variant="body2" color="text.secondary">
                      {review.comment}
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default ReviewList;
