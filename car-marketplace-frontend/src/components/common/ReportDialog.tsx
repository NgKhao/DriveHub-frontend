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
import { useAuthStore } from '../../store/authStore';
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
  const { user } = useAuthStore();
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
    name: '',
    phone: '',
    email: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);

  // Use hook states
  const isSubmitting = isCreatingReport;
  const error = createReportError || localError;
  const success = isCreateReportSuccess;

  const reportReasons = getReportReasons();

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
      if (!buyerInfo.name.trim()) {
        setLocalError('Vui lòng nhập tên người mua');
        return;
      }
      if (!buyerInfo.phone.trim()) {
        setLocalError('Vui lòng nhập số điện thoại người mua');
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
      // For now, we assume reportedId is the user ID we want to report
      // In real scenario, you might need to map seller post ID to user ID
      const reportedUserId = parseInt(reportedId);

      if (isNaN(reportedUserId)) {
        setLocalError('ID người dùng không hợp lệ');
        return;
      }

      const finalDescription =
        description.trim() +
        (reportedType === 'buyer' && !reportedId
          ? `\n\nThông tin người mua:\nTên: ${buyerInfo.name}\nSĐT: ${
              buyerInfo.phone
            }${buyerInfo.email ? `\nEmail: ${buyerInfo.email}` : ''}`
          : '');

      await createReportAsync({
        reportedUserId,
        reason: selectedReason,
        description: finalDescription,
      });

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
    setBuyerInfo({ name: '', phone: '', email: '' });
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label='Tên người mua *'
                    value={buyerInfo.name}
                    onChange={(e) =>
                      setBuyerInfo((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    fullWidth
                    size='small'
                  />
                  <TextField
                    label='Số điện thoại *'
                    value={buyerInfo.phone}
                    onChange={(e) =>
                      setBuyerInfo((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    fullWidth
                    size='small'
                  />
                  <TextField
                    label='Email (tùy chọn)'
                    value={buyerInfo.email}
                    onChange={(e) =>
                      setBuyerInfo((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    fullWidth
                    size='small'
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
