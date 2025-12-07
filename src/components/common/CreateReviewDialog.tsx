import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { Star } from '@mui/icons-material';

interface CreateReviewDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  isLoading?: boolean;
  error?: string | null;
  sellerName: string;
}

const CreateReviewDialog: React.FC<CreateReviewDialogProps> = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
  error = null,
  sellerName,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');

  const handleSubmit = () => {
    if (rating === 0) {
      return;
    }
    onSubmit(rating, comment.trim());
  };

  const handleClose = () => {
    if (!isLoading) {
      setRating(5);
      setComment('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Đánh giá người bán</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Đánh giá cho: <strong>{sellerName}</strong>
          </Typography>

          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography component="legend" gutterBottom>
              Đánh giá của bạn *
            </Typography>
            <Rating
              name="rating"
              value={rating}
              onChange={(_, newValue) => {
                setRating(newValue || 0);
              }}
              size="large"
              icon={<Star fontSize="inherit" />}
              emptyIcon={<Star fontSize="inherit" />}
            />
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Nhận xét (tùy chọn)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn với người bán này..."
            variant="outlined"
            sx={{ mt: 2 }}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading || rating === 0}
        >
          {isLoading ? 'Đang gửi...' : 'Gửi đánh giá'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateReviewDialog;
