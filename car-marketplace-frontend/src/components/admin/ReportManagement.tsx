import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  IconButton,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Search,
  Refresh,
  MoreVert,
  Visibility,
  Close,
  Block,
  Gavel,
  DirectionsCar,
} from '@mui/icons-material';

interface ReportItem {
  id: string;
  reporter: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    role: 'buyer' | 'seller';
  };
  reported: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    role: 'buyer' | 'seller';
  };
  reportedType: 'seller' | 'buyer';
  reason: string;
  category: 'fraud' | 'behavior' | 'content' | 'other';
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  carId?: string;
  carTitle?: string;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
}

// Mock data for reports
const mockReports: ReportItem[] = [
  {
    id: '1',
    reporter: {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'nguyen.van.a@gmail.com',
      phone: '0901234567',
      role: 'buyer',
    },
    reported: {
      id: '2',
      name: 'Trần Thị B',
      email: 'tran.thi.b@gmail.com',
      phone: '0987654321',
      role: 'seller',
    },
    reportedType: 'seller',
    reason: 'Gian lận',
    category: 'fraud',
    description:
      'Người bán cung cấp thông tin sai về tình trạng xe, che giấu tai nạn',
    status: 'pending',
    carId: '1',
    carTitle: 'Toyota Camry 2022',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
  {
    id: '2',
    reporter: {
      id: '3',
      name: 'Lê Văn C',
      email: 'le.van.c@gmail.com',
      phone: '0912345678',
      role: 'seller',
    },
    reported: {
      id: '4',
      name: 'Phạm Thị D',
      email: 'pham.thi.d@gmail.com',
      phone: '0923456789',
      role: 'buyer',
    },
    reportedType: 'buyer',
    reason: 'Hành vi không phù hợp',
    category: 'behavior',
    description:
      'Người mua liên tục gọi điện quấy rối, sử dụng ngôn từ không phù hợp',
    status: 'investigating',
    createdAt: '2024-02-10T16:20:00Z',
    updatedAt: '2024-02-12T10:30:00Z',
  },
  {
    id: '3',
    reporter: {
      id: '5',
      name: 'Hoàng Văn E',
      email: 'hoang.van.e@gmail.com',
      phone: '0934567890',
      role: 'buyer',
    },
    reported: {
      id: '6',
      name: 'Vũ Thị F',
      email: 'vu.thi.f@gmail.com',
      phone: '0945678901',
      role: 'seller',
    },
    reportedType: 'seller',
    reason: 'Nội dung không phù hợp',
    category: 'content',
    description: 'Bài đăng chứa hình ảnh không liên quan, thông tin sai lệch',
    status: 'resolved',
    carId: '3',
    carTitle: 'Honda Civic 2023',
    createdAt: '2024-02-05T09:45:00Z',
    updatedAt: '2024-02-15T14:20:00Z',
    adminNotes: 'Đã xử lý và cảnh báo người bán. Yêu cầu chỉnh sửa bài đăng.',
  },
  {
    id: '4',
    reporter: {
      id: '7',
      name: 'Đinh Văn G',
      email: 'dinh.van.g@gmail.com',
      phone: '0956789012',
      role: 'seller',
    },
    reported: {
      id: '8',
      name: 'Bùi Thị H',
      email: 'bui.thi.h@gmail.com',
      phone: '0967890123',
      role: 'buyer',
    },
    reportedType: 'buyer',
    reason: 'Khác',
    category: 'other',
    description: 'Người mua hẹn gặp nhưng không đến, lặp lại nhiều lần',
    status: 'dismissed',
    createdAt: '2024-01-20T11:15:00Z',
    updatedAt: '2024-01-25T16:45:00Z',
    adminNotes: 'Không đủ bằng chứng để xử lý. Khuyến cáo cả hai bên.',
  },
];

const ReportManagement: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>(mockReports);
  const [filteredReports, setFilteredReports] =
    useState<ReportItem[]>(mockReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dialog states
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('success');

  // Filter reports
  React.useEffect(() => {
    const filtered = reports.filter((report) => {
      const matchesSearch =
        report.reporter.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        report.reported.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        report.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (report.carTitle &&
          report.carTitle.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all' || report.status === statusFilter;
      const matchesCategory =
        categoryFilter === 'all' || report.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    setFilteredReports(filtered);
    setPage(0);
  }, [searchQuery, statusFilter, categoryFilter, reports]);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    report: ReportItem
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(report);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReport(null);
  };

  const handleViewDetail = () => {
    if (selectedReport) {
      setDetailDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleInvestigate = () => {
    if (selectedReport) {
      const updatedReports = reports.map((report) =>
        report.id === selectedReport.id
          ? {
              ...report,
              status: 'investigating' as const,
              updatedAt: new Date().toISOString(),
            }
          : report
      );
      setReports(updatedReports);
      setSnackbarMessage('Đã chuyển báo cáo sang trạng thái điều tra');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
    }
    handleMenuClose();
  };

  const handleResolve = () => {
    if (selectedReport) {
      const updatedReports = reports.map((report) =>
        report.id === selectedReport.id
          ? {
              ...report,
              status: 'resolved' as const,
              updatedAt: new Date().toISOString(),
            }
          : report
      );
      setReports(updatedReports);
      setSnackbarMessage('Đã giải quyết báo cáo');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }
    handleMenuClose();
  };

  const handleDismiss = () => {
    if (selectedReport) {
      const updatedReports = reports.map((report) =>
        report.id === selectedReport.id
          ? {
              ...report,
              status: 'dismissed' as const,
              updatedAt: new Date().toISOString(),
            }
          : report
      );
      setReports(updatedReports);
      setSnackbarMessage('Đã bỏ qua báo cáo');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
    }
    handleMenuClose();
  };

  const handleBlockUser = () => {
    if (selectedReport) {
      setSnackbarMessage(`Đã khóa tài khoản ${selectedReport.reported.name}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    handleMenuClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip label='Chờ xử lý' color='warning' size='small' />;
      case 'investigating':
        return <Chip label='Đang điều tra' color='info' size='small' />;
      case 'resolved':
        return <Chip label='Đã giải quyết' color='success' size='small' />;
      case 'dismissed':
        return <Chip label='Bỏ qua' color='default' size='small' />;
      default:
        return <Chip label={status} color='default' size='small' />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'fraud':
        return 'Gian lận';
      case 'behavior':
        return 'Hành vi không phù hợp';
      case 'content':
        return 'Nội dung không phù hợp';
      case 'other':
        return 'Khác';
      default:
        return category;
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleReset = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
  };

  // Statistics
  const totalReports = reports.length;
  const pendingReports = reports.filter((r) => r.status === 'pending').length;
  const investigatingReports = reports.filter(
    (r) => r.status === 'investigating'
  ).length;
  const resolvedReports = reports.filter((r) => r.status === 'resolved').length;

  return (
    <Box>
      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant='h4' color='primary.main' fontWeight='bold'>
              {totalReports}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Tổng báo cáo
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant='h4' color='warning.main' fontWeight='bold'>
              {pendingReports}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Chờ xử lý
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant='h4' color='info.main' fontWeight='bold'>
              {investigatingReports}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Đang điều tra
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant='h4' color='success.main' fontWeight='bold'>
              {resolvedReports}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Đã giải quyết
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Reports Management */}
      <Paper sx={{ p: 3 }}>
        <Typography variant='h5' fontWeight='bold' gutterBottom>
          Quản lý báo cáo
        </Typography>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            placeholder='Tìm kiếm báo cáo...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <Search sx={{ mr: 1, color: 'text.secondary' }} />
              ),
            }}
            sx={{ minWidth: 300, flex: 1 }}
          />

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label='Trạng thái'
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value='all'>Tất cả</MenuItem>
              <MenuItem value='pending'>Chờ xử lý</MenuItem>
              <MenuItem value='investigating'>Đang điều tra</MenuItem>
              <MenuItem value='resolved'>Đã giải quyết</MenuItem>
              <MenuItem value='dismissed'>Bỏ qua</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={categoryFilter}
              label='Danh mục'
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value='all'>Tất cả</MenuItem>
              <MenuItem value='fraud'>Gian lận</MenuItem>
              <MenuItem value='behavior'>Hành vi</MenuItem>
              <MenuItem value='content'>Nội dung</MenuItem>
              <MenuItem value='other'>Khác</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant='outlined'
            startIcon={<Refresh />}
            onClick={handleReset}
          >
            Đặt lại
          </Button>
        </Box>

        {/* Reports Table */}
        <TableContainer
          component={Paper}
          sx={{ border: 1, borderColor: 'divider' }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell>Người báo cáo</TableCell>
                <TableCell>Người bị báo cáo</TableCell>
                <TableCell>Lý do</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell align='center'>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((report) => (
                  <TableRow key={report.id} hover>
                    <TableCell>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {report.reporter.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant='body2' fontWeight='medium'>
                            {report.reporter.name}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {report.reporter.role === 'buyer'
                              ? 'Người mua'
                              : 'Người bán'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {report.reported.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant='body2' fontWeight='medium'>
                            {report.reported.name}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {report.reported.role === 'buyer'
                              ? 'Người mua'
                              : 'Người bán'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>{report.reason}</Typography>
                      {report.carTitle && (
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          display='block'
                        >
                          Xe: {report.carTitle}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getCategoryLabel(report.category)}
                        color={
                          report.category === 'fraud'
                            ? 'error'
                            : report.category === 'behavior'
                            ? 'warning'
                            : report.category === 'content'
                            ? 'info'
                            : 'default'
                        }
                        variant='outlined'
                        size='small'
                      />
                    </TableCell>
                    <TableCell>{getStatusChip(report.status)}</TableCell>
                    <TableCell>
                      <Typography variant='body2'>
                        {formatDate(report.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align='center'>
                      <IconButton
                        onClick={(e) => handleMenuClick(e, report)}
                        size='small'
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={filteredReports.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage='Số dòng mỗi trang:'
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} trong tổng số ${count}`
          }
        />
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetail}>
          <Visibility sx={{ mr: 1 }} />
          Xem chi tiết
        </MenuItem>
        {selectedReport?.status === 'pending' && (
          <MenuItem onClick={handleInvestigate}>
            <Gavel sx={{ mr: 1 }} />
            Bắt đầu điều tra
          </MenuItem>
        )}
        {selectedReport?.status === 'pending' && (
          <MenuItem onClick={handleResolve} sx={{ color: 'success.main' }}>
            <CheckCircle sx={{ mr: 1 }} />
            Giải quyết
          </MenuItem>
        )}
        {selectedReport?.status === 'pending' && (
          <MenuItem onClick={handleDismiss} sx={{ color: 'warning.main' }}>
            <Cancel sx={{ mr: 1 }} />
            Bỏ qua
          </MenuItem>
        )}
        {selectedReport?.status === 'investigating' && (
          <MenuItem onClick={handleResolve} sx={{ color: 'success.main' }}>
            <CheckCircle sx={{ mr: 1 }} />
            Giải quyết
          </MenuItem>
        )}
        {selectedReport?.status === 'investigating' && (
          <MenuItem onClick={handleDismiss} sx={{ color: 'warning.main' }}>
            <Cancel sx={{ mr: 1 }} />
            Bỏ qua
          </MenuItem>
        )}
        <MenuItem onClick={handleBlockUser} sx={{ color: 'error.main' }}>
          <Block sx={{ mr: 1 }} />
          Khóa tài khoản
        </MenuItem>
      </Menu>

      {/* Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth='lg'
        fullWidth
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          Chi tiết báo cáo
          <IconButton onClick={() => setDetailDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{ minHeight: '60vh', maxHeight: '80vh', overflow: 'auto' }}
        >
          {selectedReport && (
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}
            >
              {/* Thông tin cơ bản */}
              <Card variant='outlined'>
                <CardContent>
                  <Typography variant='subtitle1' component='h3' fontWeight='bold' gutterBottom color='primary'>
                    📋 Thông tin báo cáo
                  </Typography>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ minWidth: 100 }}
                      >
                        Lý do:
                      </Typography>
                      <Typography variant='body2'>
                        {selectedReport.reason}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ minWidth: 100 }}
                      >
                        Danh mục:
                      </Typography>
                      <Typography variant='body2'>
                        {getCategoryLabel(selectedReport.category)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ minWidth: 100 }}
                      >
                        Trạng thái:
                      </Typography>
                      {getStatusChip(selectedReport.status)}
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Người báo cáo */}
              <Card variant='outlined'>
                <CardContent>
                  <Typography variant='subtitle1' component='h3' fontWeight='bold' gutterBottom color='primary'>
                    👤 Người báo cáo
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 48, height: 48 }}>
                      {selectedReport.reporter.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant='body1' fontWeight='medium'>
                        {selectedReport.reporter.name}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        📧 {selectedReport.reporter.email}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        📞 {selectedReport.reporter.phone}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Người bị báo cáo */}
              <Card variant='outlined'>
                <CardContent>
                  <Typography variant='subtitle1' component='h3' fontWeight='bold' gutterBottom color='error'>
                    🎯 Người bị báo cáo
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 48, height: 48 }}>
                      {selectedReport.reported.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant='body1' fontWeight='medium'>
                        {selectedReport.reported.name}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        📧 {selectedReport.reported.email}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        📞 {selectedReport.reported.phone}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Mô tả chi tiết */}
              <Card variant='outlined'>
                <CardContent>
                  <Typography variant='subtitle1' component='h3' fontWeight='bold' gutterBottom color='primary'>
                    📝 Mô tả chi tiết
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      whiteSpace: 'pre-wrap',
                      backgroundColor: 'grey.50',
                      p: 2,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'grey.200',
                    }}
                  >
                    {selectedReport.description}
                  </Typography>
                </CardContent>
              </Card>

              {/* Xe liên quan (nếu có) */}
              {selectedReport.carTitle && (
                <Card variant='outlined'>
                  <CardContent>
                    <Typography variant='subtitle1' component='h3' fontWeight='bold' gutterBottom color='info.main'>
                      🚗 Xe liên quan
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <DirectionsCar color='info' />
                      <Typography variant='body1'>
                        {selectedReport.carTitle}
                      </Typography>
                      <Button
                        size='small'
                        variant='outlined'
                        onClick={() =>
                          window.open(`/cars/${selectedReport.carId}`, '_blank')
                        }
                      >
                        Xem bài đăng
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Ghi chú admin */}
              {selectedReport.adminNotes && (
                <Card variant='outlined'>
                  <CardContent>
                    <Typography variant='subtitle1' component='h3' fontWeight='bold' gutterBottom color='success.main'>
                      🔧 Ghi chú admin
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{
                        backgroundColor: 'success.50',
                        p: 2,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'success.200',
                      }}
                    >
                      {selectedReport.adminNotes}
                    </Typography>
                  </CardContent>
                </Card>
              )}

              {/* Timestamps */}
              <Card variant='outlined'>
                <CardContent>
                  <Typography variant='subtitle1' component='h3' fontWeight='bold' gutterBottom color='primary'>
                    ⏰ Thời gian
                  </Typography>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}
                  >
                    <Typography variant='body2' color='text.secondary'>
                      📅 Ngày tạo: {formatDate(selectedReport.createdAt)}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      🔄 Cập nhật cuối: {formatDate(selectedReport.updatedAt)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setDetailDialogOpen(false)} color='inherit'>
            Đóng
          </Button>
          {selectedReport?.status === 'pending' && (
            <Button
              variant='outlined'
              color='info'
              onClick={handleInvestigate}
              startIcon={<Gavel />}
            >
              Bắt đầu điều tra
            </Button>
          )}
          {(selectedReport?.status === 'pending' ||
            selectedReport?.status === 'investigating') && (
            <>
              <Button
                variant='contained'
                color='success'
                onClick={handleResolve}
                startIcon={<CheckCircle />}
              >
                Giải quyết
              </Button>
              <Button
                variant='outlined'
                color='warning'
                onClick={handleDismiss}
                startIcon={<Cancel />}
              >
                Bỏ qua
              </Button>
            </>
          )}
          <Button
            variant='outlined'
            color='error'
            onClick={handleBlockUser}
            startIcon={<Block />}
          >
            Khóa tài khoản
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReportManagement;
