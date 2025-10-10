import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Chip,
  Divider,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Payment,
  Receipt,
  Schedule,
  ArrowForward,
} from '@mui/icons-material';
import type { PaymentResult } from '../../types';
import { formatPaymentAmount } from '../../utils/vnpayUtils';

interface PaymentResultProps {
  paymentResult: PaymentResult;
  onContinue?: () => void;
  onRetry?: () => void;
}

const PaymentResultComponent: React.FC<PaymentResultProps> = ({
  paymentResult,
  onContinue,
  onRetry,
}) => {
  const { success, amount, payDate, transactionRef, message } = paymentResult;

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto' }}>
      <CardContent sx={{ p: 4 }}>
        {/* Status Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          {success ? (
            <CheckCircle color='success' sx={{ fontSize: 80, mb: 2 }} />
          ) : (
            <Error color='error' sx={{ fontSize: 80, mb: 2 }} />
          )}

          <Typography
            variant='h4'
            gutterBottom
            color={success ? 'success.main' : 'error.main'}
          >
            {success ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
          </Typography>

          <Chip
            label={success ? 'Thành công' : 'Thất bại'}
            color={success ? 'success' : 'error'}
            size='medium'
            sx={{ px: 2, py: 1, fontSize: '1rem', minHeight: 40 }}
          />
        </Box>

        {/* Status Message */}
        <Alert
          severity={success ? 'success' : 'error'}
          sx={{ mb: 3 }}
          icon={success ? <CheckCircle /> : <Error />}
        >
          <Typography variant='body1' fontWeight='medium'>
            {message}
          </Typography>
          {success && (
            <Typography variant='body2' sx={{ mt: 1 }}>
              Bài đăng của bạn đang chờ quản trị viên duyệt. Bạn có thể theo dõi
              trạng thái trong trang quản lý bài đăng.
            </Typography>
          )}
        </Alert>

        <Divider sx={{ my: 3 }} />

        {/* Payment Details */}
        <Typography variant='h6' gutterBottom sx={{ mb: 2 }}>
          Chi tiết giao dịch
        </Typography>

        <List dense>
          <ListItem>
            <ListItemIcon>
              <Payment color='primary' />
            </ListItemIcon>
            <ListItemText
              primary='Số tiền'
              secondary={formatPaymentAmount(amount)}
            />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <Receipt color='primary' />
            </ListItemIcon>
            <ListItemText primary='Mã giao dịch' secondary={transactionRef} />
          </ListItem>

          <ListItem>
            <ListItemIcon>
              <Schedule color='primary' />
            </ListItemIcon>
            <ListItemText primary='Thời gian' secondary={payDate} />
          </ListItem>
        </List>

        <Divider sx={{ my: 3 }} />

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {success ? (
            <>
              <Button
                variant='contained'
                size='large'
                startIcon={<ArrowForward />}
                onClick={onContinue}
                sx={{ minWidth: 200 }}
              >
                Tiếp tục
              </Button>
              <Button
                variant='outlined'
                size='large'
                href='/seller-dashboard'
                sx={{ minWidth: 200 }}
              >
                Quản lý bài đăng
              </Button>
            </>
          ) : (
            <>
              <Button
                variant='contained'
                color='primary'
                size='large'
                onClick={onRetry}
                sx={{ minWidth: 200 }}
              >
                Thử lại
              </Button>
              <Button
                variant='outlined'
                size='large'
                href='/sell'
                sx={{ minWidth: 200 }}
              >
                Tạo bài mới
              </Button>
            </>
          )}
        </Box>

        {/* Additional Info */}
        {success && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
            <Typography variant='body2' color='success.dark' textAlign='center'>
              💡 <strong>Lưu ý:</strong> Bài đăng sẽ được hiển thị công khai sau
              khi được quản trị viên phê duyệt. Thời gian duyệt thường từ 2-24
              giờ.
            </Typography>
          </Box>
        )}

        {!success && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'error.50', borderRadius: 1 }}>
            <Typography variant='body2' color='error.dark' textAlign='center'>
              ❗ Nếu bạn gặp sự cố, vui lòng liên hệ hỗ trợ khách hàng hoặc thử
              lại sau ít phút.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentResultComponent;
