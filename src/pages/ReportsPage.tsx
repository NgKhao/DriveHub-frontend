import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { Report, Visibility, Person, Info } from '@mui/icons-material';
import { useReportStore } from '../store/reportStore';
import { useAuthStore } from '../store/authStore';
import { useMyReports } from '../hooks/useReport';
import ReportDialog from '../components/common/ReportDialog';
import type { Report as ReportType } from '../types';

const ReportsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { getReportReasons } = useReportStore();
  const [reportDetailOpen, setReportDetailOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);

  // Fetch user's reports from API
  const {
    data: userReports = [],
    isLoading: isLoadingReports,
    error: reportsError,
  } = useMyReports(!!user);

  const reportReasons = getReportReasons();

  const getStatusColor = (status: ReportType['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'investigating':
        return 'info';
      case 'resolved':
        return 'success';
      case 'dismissed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: ReportType['status']) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'investigating':
        return 'Tạm khóa tài khoản'; // SUSPENDED status
      case 'resolved':
        return 'Cấm vĩnh viễn'; // BANNED status
      case 'dismissed':
        return 'Báo cáo bị từ chối'; // REJECTED status
      default:
        return 'Không xác định';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getReasonLabel = (reasonId: string) => {
    const reason = reportReasons.find((r) => r.id === reasonId);
    return reason ? reason.label : reasonId;
  };

  const handleViewReport = (report: ReportType) => {
    setSelectedReport(report);
    setReportDetailOpen(true);
  };

  if (!user) {
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Alert severity='warning'>
          Bạn cần đăng nhập để truy cập trang này.
        </Alert>
      </Container>
    );
  }

  // Logic riêng biệt cho từng role
  if (user.role === 'buyer') {
    // BUYER: Không được phép xem trang báo cáo, chuyển hướng về trang chủ
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Alert severity='warning' sx={{ mb: 3 }}>
          <Typography variant='h6' gutterBottom>
            Bạn không có quyền truy cập trang này
          </Typography>
          <Typography variant='body2'>
            Để báo cáo người bán, vui lòng truy cập trang chi tiết xe và sử dụng
            nút "Báo cáo người bán"
          </Typography>
        </Alert>

        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Report sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant='h6' gutterBottom>
              Cách báo cáo người bán
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              Để báo cáo người bán, vui lòng truy cập trang chi tiết xe và sử
              dụng nút "Báo cáo người bán"
            </Typography>
            <Alert severity='info' sx={{ mt: 2 }}>
              <Typography variant='body2'>
                💡 <strong>Hướng dẫn:</strong> Truy cập danh sách xe → Chọn xe
                muốn xem → Tìm nút "Báo cáo người bán" ở phần thông tin liên hệ
              </Typography>
            </Alert>
            <Button
              variant='contained'
              sx={{ mt: 2 }}
              onClick={() => (window.location.href = '/cars')}
            >
              Xem danh sách xe
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (user.role === 'seller') {
    // SELLER: Xem được báo cáo đã gửi và trạng thái xử lý, không xem được báo cáo nhận
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant='h4' gutterBottom>
            Báo cáo đã gửi
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Theo dõi trạng thái xử lý các báo cáo bạn đã gửi
          </Typography>
        </Box>

        {/* Report Buyer Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
              <Typography variant='h6'>Báo cáo người mua</Typography>
              <Button
                variant='contained'
                color='warning'
                startIcon={<Report />}
                onClick={() => setReportDialogOpen(true)}
              >
                Báo cáo người mua
              </Button>
            </Box>
            <Typography variant='body2' color='text.secondary'>
              Nếu bạn gặp vấn đề với người mua (không liên lạc được, hủy hẹn,
              v.v.), bạn có thể báo cáo để chúng tôi xử lý.
            </Typography>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoadingReports ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant='body2' color='text.secondary'>
                Đang tải danh sách báo cáo...
              </Typography>
            </CardContent>
          </Card>
        ) : reportsError ? (
          /* Error State */
          <Card>
            <CardContent>
              <Alert severity='error' sx={{ mb: 2 }}>
                Không thể tải danh sách báo cáo. Vui lòng thử lại sau.
              </Alert>
            </CardContent>
          </Card>
        ) : userReports.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Info sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant='h6' gutterBottom>
                Chưa có báo cáo nào
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Bạn chưa gửi báo cáo nào. Báo cáo sẽ hiển thị tại đây sau khi
                bạn báo cáo người mua.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Danh sách báo cáo đã gửi ({userReports.length})
              </Typography>
              <List>
                {userReports.map((report, index) => (
                  <React.Fragment key={report.id}>
                    <ListItem
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'grey.50' },
                      }}
                      onClick={() => handleViewReport(report)}
                    >
                      <ListItemIcon>
                        <Person />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <Typography variant='subtitle2'>
                              Báo cáo{' '}
                              {report.reportedUser.role === 'buyer'
                                ? 'người mua'
                                : 'người bán'}
                              : {report.reportedUser.name}
                            </Typography>
                            <Chip
                              label={getStatusText(report.status)}
                              color={getStatusColor(report.status)}
                              size='small'
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant='body2' color='text.secondary'>
                              Lý do: {getReasonLabel(report.reason)}
                            </Typography>
                            <Typography
                              variant='caption'
                              color='text.secondary'
                            >
                              {formatDate(report.createdAt)}
                            </Typography>
                          </Box>
                        }
                      />
                      <Visibility color='action' />
                    </ListItem>
                    {index < userReports.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {/* Report Detail Dialog for Seller */}
        <Dialog
          open={reportDetailOpen}
          onClose={() => setReportDetailOpen(false)}
          maxWidth='sm'
          fullWidth
        >
          <DialogTitle>Chi tiết báo cáo</DialogTitle>
          <DialogContent>
            {selectedReport && (
              <Box sx={{ py: 2 }}>
                <Card variant='outlined' sx={{ mb: 2 }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <Typography variant='h6'>
                        Báo cáo{' '}
                        {selectedReport.reportedUser.role === 'buyer'
                          ? 'người mua'
                          : 'người bán'}
                      </Typography>
                      <Chip
                        label={getStatusText(selectedReport.status)}
                        color={getStatusColor(selectedReport.status)}
                        size='small'
                      />
                    </Box>

                    <Typography
                      variant='body2'
                      color='text.secondary'
                      gutterBottom
                    >
                      <strong>Người bị báo cáo:</strong>{' '}
                      {selectedReport.reportedUser.name} ({selectedReport.reportedUser.email})
                    </Typography>

                    <Typography
                      variant='body2'
                      color='text.secondary'
                      gutterBottom
                    >
                      <strong>Thời gian:</strong>{' '}
                      {formatDate(selectedReport.createdAt)}
                    </Typography>

                    <Typography
                      variant='body2'
                      color='text.secondary'
                      gutterBottom
                    >
                      <strong>Mô tả:</strong>
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{ mt: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}
                    >
                      {selectedReport.description}
                    </Typography>

                    {selectedReport.status === 'resolved' && (
                      <Alert severity='success' sx={{ mt: 2 }}>
                        Báo cáo đã được xử lý và giải quyết thành công.
                      </Alert>
                    )}

                    {selectedReport.status === 'dismissed' && (
                      <Alert severity='info' sx={{ mt: 2 }}>
                        Báo cáo đã được xem xét nhưng không có vi phạm.
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReportDetailOpen(false)}>Đóng</Button>
          </DialogActions>
        </Dialog>

        {/* Report Buyer Dialog */}
        <ReportDialog
          open={reportDialogOpen}
          onClose={() => setReportDialogOpen(false)}
          reportedId=''
          reportedName=''
          reportedType='buyer'
        />
      </Container>
    );
  }

  // Default fallback
  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Alert severity='error'>Bạn không có quyền truy cập trang này.</Alert>
    </Container>
  );
};

export default ReportsPage;
