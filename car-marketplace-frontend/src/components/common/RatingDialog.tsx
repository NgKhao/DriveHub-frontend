import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import StarRating from './StarRating';
import { useRatingStore } from '../../store/ratingStore';
import { useAuthStore } from '../../store/authStore';

interface RatingDialogProps {
  open: boolean;
  onClose: () => void;
  sellerId: string;
  sellerName: string;
  existingRating?: {
    id: string;
    rating: number;
    review?: string;
  };
}

const RatingDialog: React.FC<RatingDialogProps> = ({
  open,
  onClose,
  sellerId,
  sellerName,
  existingRating,
}) => {
  const { user } = useAuthStore();
  const { rateSeller, updateRating } = useRatingStore();

  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [review, setReview] = useState(existingRating?.review || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!user) {
      setError('Bạn cần đăng nhập để đánh giá');
      return;
    }

    // Chỉ cho phép buyer đánh giá
    if (user.role !== 'buyer') {
      setError('Chỉ người mua mới có thể đánh giá người bán');
      return;
    }

    if (rating === 0) {
      setError('Vui lòng chọn số sao');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (existingRating) {
        await updateRating(existingRating.id, rating, review);
      } else {
        await rateSeller(sellerId, rating, review);
      }

      handleClose();
    } catch (err) {
      setError('Có lỗi xảy ra khi gửi đánh giá');
      console.error('Rating error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(existingRating?.rating || 0);
    setReview(existingRating?.review || '');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        {existingRating ? 'Chỉnh sửa đánh giá' : 'Đánh giá người bán'}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant='body1' gutterBottom>
            Đánh giá cho: <strong>{sellerName}</strong>
          </Typography>

          <Box sx={{ my: 3 }}>
            <Typography variant='body2' color='text.secondary' gutterBottom>
              Đánh giá của bạn:
            </Typography>
            <StarRating
              value={rating}
              onChange={setRating}
              size='large'
              showLabel
            />
          </Box>

          <TextField
            label='Nhận xét (tùy chọn)'
            multiline
            rows={4}
            fullWidth
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder='Chia sẻ trải nghiệm của bạn với người bán này...'
            sx={{ mt: 2 }}
          />

          {error && (
            <Alert severity='error' sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color='inherit'>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant='contained'
          disabled={isSubmitting || rating === 0}
        >
          {isSubmitting
            ? 'Đang gửi...'
            : existingRating
            ? 'Cập nhật'
            : 'Gửi đánh giá'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RatingDialog;
