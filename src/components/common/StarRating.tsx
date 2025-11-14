import React from 'react';
import { Box, Rating, Typography } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
  precision?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  readOnly = false,
  showLabel = false,
  size = 'medium',
  precision = 1,
}) => {
  const getRatingLabel = (rating: number): string => {
    if (rating >= 4.5) return 'Xuất sắc';
    if (rating >= 4) return 'Rất tốt';
    if (rating >= 3) return 'Tốt';
    if (rating >= 2) return 'Bình thường';
    if (rating >= 1) return 'Kém';
    return 'Chưa có đánh giá';
  };

  return (
    <Box display='flex' alignItems='center' gap={1}>
      <Rating
        value={value}
        onChange={(_, newValue) => {
          if (!readOnly && onChange && newValue !== null) {
            onChange(newValue);
          }
        }}
        readOnly={readOnly}
        precision={precision}
        size={size}
        icon={<Star fontSize='inherit' />}
        emptyIcon={<StarBorder fontSize='inherit' />}
        sx={{
          '& .MuiRating-iconFilled': {
            color: '#ffd700',
          },
          '& .MuiRating-iconEmpty': {
            color: '#e0e0e0',
          },
        }}
      />
      {showLabel && (
        <Typography
          variant={size === 'small' ? 'caption' : 'body2'}
          color='text.secondary'
        >
          {getRatingLabel(value)}
        </Typography>
      )}
    </Box>
  );
};

export default StarRating;
