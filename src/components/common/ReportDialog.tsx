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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import { useReportStore } from '../../store/reportStore';
import { useAuth } from '../../hooks/useAuth';
import { useReportManager } from '../../hooks/useReport';

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  reportedId: string;
  reportedName: string;
  reportedType: 'seller' | 'buyer';
}

const ReportDialog: React.FC<ReportDialogProps> = ({
  open,
  onClose,
  reportedId,
  reportedName,
  reportedType,
}) => {
  const { user } = useAuth();
  const { getReportReasons } = useReportStore();
  const {
    createReportAsync,
    isCreatingReport,
    createReportError,
    isCreateReportSuccess,
    resetCreateReportError,
  } = useReportManager();

  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [buyerInfo, setBuyerInfo] = useState({
    phone: '',
    email: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);

  // Use hook states
  const isSubmitting = isCreatingReport;
  const error = createReportError || localError;
  const success = isCreateReportSuccess;

  const allReportReasons = getReportReasons();

  // Filter reasons based on report type
  const reportReasons = allReportReasons.filter((reason) => {
    if (reportedType === 'seller') {
      // Buyer reporting seller - show seller reasons and other
      return reason.id.startsWith('seller_') || reason.id === 'other';
    } else {
      // Seller reporting buyer - show buyer reasons and other
      return reason.id.startsWith('buyer_') || reason.id === 'other';
    }
  });

  const handleSubmit = async () => {
    if (!user) {
      setLocalError('Bạn cần đăng nhập để báo cáo');
      return;
    }

    // Kiểm tra quyền báo cáo
    if (reportedType === 'seller' && user.role !== 'buyer') {
      setLocalError('Chỉ người mua mới có thể báo cáo người bán');
      return;
    }

    if (reportedType === 'buyer' && user.role !== 'seller') {
      setLocalError('Chỉ người bán mới có thể báo cáo người mua');
      return;
    }

    // Kiểm tra thông tin người bị báo cáo cho trường hợp manual input
    if (reportedType === 'buyer' && !reportedId) {
      if (!buyerInfo.email.trim() && !buyerInfo.phone.trim()) {
        setLocalError('Vui lòng nhập email hoặc số điện thoại người mua');
        return;
      }
    }

    if (!selectedReason) {
      setLocalError('Vui lòng chọn lý do báo cáo');
      return;
    }

    if (!description.trim()) {
      setLocalError('Vui lòng mô tả chi tiết vấn đề');
      return;
    }

    setLocalError(null);
    resetCreateReportError();

    try {
      const baseReportData = {
        reason: selectedReason,
        description: description.trim(),
      };

      if (reportedType === 'seller' && reportedId) {
        // For seller reports, reportedId should contain phone number
        await createReportAsync({
          ...baseReportData,
          reportedUserphone: reportedId,
        });
      } else if (reportedType === 'buyer' && !reportedId) {
        // For buyer reports, use manual input
        if (buyerInfo.email.trim()) {
          await createReportAsync({
            ...baseReportData,
            reportedUserEmail: buyerInfo.email.trim(),
          });
        } else if (buyerInfo.phone.trim()) {
          await createReportAsync({
            ...baseReportData,
            reportedUserphone: buyerInfo.phone.trim(),
          });
        }
      }

      // Auto close after success - success state will be managed by the hook
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      console.error('Report error:', err);
      // Error is handled by the hook, but we can set additional local error if needed
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setDescription('');
    setBuyerInfo({ phone: '', email: '' });
    setLocalError(null);
    resetCreateReportError();
    onClose();
  };

  const selectedReasonObj = reportReasons.find((r) => r.id === selectedReason);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Warning color='warning' />
        Báo cáo {reportedType === 'seller' ? 'người bán' : 'người mua'}
      </DialogTitle>

      <DialogContent>
        {success ? (
          <Box sx={{ py: 2, textAlign: 'center' }}>
            <Alert severity='success' sx={{ mb: 2 }}>
              Báo cáo đã được gửi thành công!
            </Alert>
            <Typography variant='body2' color='text.secondary'>
              Chúng tôi sẽ xem xét báo cáo của bạn trong thời gian sớm nhất.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ py: 1 }}>
            {reportedName ? (
              <Typography variant='body1' gutterBottom>
                Báo cáo cho: <strong>{reportedName}</strong>
              </Typography>
            ) : reportedType === 'buyer' ? (
              <Box sx={{ mb: 3 }}>
                <Typography variant='body1' gutterBottom>
                  Thông tin người mua cần báo cáo:
                </Typography>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ mb: 2 }}
                >
                  Vui lòng nhập email hoặc số điện thoại của người mua (chọn 1
                  trong 2)
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label='Email người mua'
                    value={buyerInfo.email}
                    onChange={(e) =>
                      setBuyerInfo((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    fullWidth
                    size='small'
                    placeholder='example@email.com'
                  />
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ textAlign: 'center' }}
                  >
                    hoặc
                  </Typography>
                  <TextField
                    label='Số điện thoại người mua'
                    value={buyerInfo.phone}
                    onChange={(e) =>
                      setBuyerInfo((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    fullWidth
                    size='small'
                    placeholder='0901234567'
                  />
                </Box>
              </Box>
            ) : null}

            <Alert severity='info' sx={{ my: 2 }}>
              Vui lòng chỉ báo cáo khi có vấn đề thực sự. Báo cáo sai sự thật có
              thể bị xử lý.
            </Alert>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Lý do báo cáo</InputLabel>
              <Select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                label='Lý do báo cáo'
              >
                {reportReasons.map((reason) => (
                  <MenuItem key={reason.id} value={reason.id}>
                    <Box>
                      <Typography variant='body2' fontWeight='medium'>
                        {reason.label}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {reason.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedReasonObj && (
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={selectedReasonObj.label}
                  color='primary'
                  variant='outlined'
                  size='small'
                />
              </Box>
            )}

            <TextField
              label='Mô tả chi tiết'
              multiline
              rows={4}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Vui lòng mô tả chi tiết vấn đề bạn gặp phải với người này...'
              helperText={`${description.length}/500 ký tự`}
              inputProps={{ maxLength: 500 }}
              sx={{ mb: 2 }}
            />

            {error && (
              <Alert severity='error' sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color='inherit'>
          {success ? 'Đóng' : 'Hủy'}
        </Button>
        {!success && (
          <Button
            onClick={handleSubmit}
            variant='contained'
            color='error'
            disabled={isSubmitting || !selectedReason || !description.trim()}
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ReportDialog;
