import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuthStore } from '../store/authStore';
import PaymentResultComponent from '../components/common/PaymentResult';
import {
  parseVNPayParams,
  processPaymentResult,
  validateVNPayParams,
} from '../utils/vnpayUtils';
import type { PaymentResult } from '../types';

const ReturnUrlPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        setLoading(true);
        setError(null);

        // Parse VNPay parameters from URL
        const vnpayParams = parseVNPayParams(searchParams);

        // Validate parameters
        if (!validateVNPayParams(vnpayParams)) {
          setError('Thông tin thanh toán không hợp lệ. Vui lòng thử lại.');
          setLoading(false);
          return;
        }

        // Process payment result
        const result = processPaymentResult(vnpayParams);
        setPaymentResult(result);

        // If payment is successful, we can optionally call an API to verify
        // and update the post status on the backend
        if (result.success) {
          console.log(
            'Payment successful for transaction:',
            result.transactionRef
          );
          // TODO: Call API to confirm payment on backend if needed
          // await api.post('/payments/confirm', { transactionRef: result.transactionRef });
        }
      } catch (err) {
        console.error('Error processing payment result:', err);
        setError(
          'Có lỗi xảy ra khi xử lý kết quả thanh toán. Vui lòng thử lại.'
        );
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [searchParams]);

  const handleContinue = () => {
    // Navigate to seller dashboard with success parameter
    navigate('/seller-dashboard?payment=success');
  };

  const handleRetry = () => {
    // Navigate back to create listing page
    navigate('/sell');
  };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth='md' sx={{ py: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <CircularProgress size={60} />
          <Typography variant='h6' color='text.secondary'>
            Đang xử lý kết quả thanh toán...
          </Typography>
          <Typography variant='body2' color='text.secondary' textAlign='center'>
            Vui lòng đợi trong giây lát, chúng tôi đang xác nhận giao dịch của
            bạn.
          </Typography>
        </Box>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth='md' sx={{ py: 8 }}>
        <Alert
          severity='error'
          sx={{
            mb: 3,
            '& .MuiAlert-message': {
              width: '100%',
            },
          }}
        >
          <Typography variant='h6' gutterBottom>
            Lỗi xử lý thanh toán
          </Typography>
          <Typography variant='body2'>{error}</Typography>
        </Alert>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant='body1' color='text.secondary' paragraph>
            Bạn có thể thử các cách sau:
          </Typography>
          <ul style={{ textAlign: 'left', display: 'inline-block' }}>
            <li>Kiểm tra lại URL thanh toán</li>
            <li>Quay lại trang tạo bài đăng và thử lại</li>
            <li>Liên hệ hỗ trợ khách hàng nếu vấn đề vẫn tiếp tục</li>
          </ul>
        </Box>
      </Container>
    );
  }

  // Success/Failure result
  if (paymentResult) {
    return (
      <Container maxWidth='md' sx={{ py: 8 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant='h3' gutterBottom>
            Kết quả thanh toán
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Chi tiết giao dịch đăng bài viết của bạn
          </Typography>
        </Box>

        <PaymentResultComponent
          paymentResult={paymentResult}
          onContinue={handleContinue}
          onRetry={handleRetry}
        />

        {/* Additional context for users */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant='body2' color='text.secondary'>
            {user?.role === 'seller'
              ? 'Bạn có thể theo dõi trạng thái bài đăng trong trang quản lý của mình.'
              : 'Vui lòng đăng nhập với tài khoản người bán để tiếp tục.'}
          </Typography>
        </Box>
      </Container>
    );
  }

  // Fallback - should not reach here
  return (
    <Container maxWidth='md' sx={{ py: 8 }}>
      <Alert severity='warning'>
        <Typography variant='h6' gutterBottom>
          Không có thông tin thanh toán
        </Typography>
        <Typography variant='body2'>
          Không tìm thấy thông tin giao dịch. Vui lòng kiểm tra lại hoặc liên hệ
          hỗ trợ.
        </Typography>
      </Alert>
    </Container>
  );
};

export default ReturnUrlPage;
