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
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Report,
  Warning,
  CheckCircle,
  Cancel,
  Search,
  Refresh,
  MoreVert,
  Visibility,
  Phone,
  Email,
  Close,
  Block,
  Gavel,
  DirectionsCar,
  Edit,
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

      return (
        matchesSearch && matchesStatus && matchesCategory
      );
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
        return <Chip label='Đang xử lý' color='info' size='small' />;
      case 'resolved':
        return <Chip label='Đã giải quyết' color='success' size='small' />;
      case 'dismissed':
        return <Chip label='Đã bỏ qua' color='default' size='small' />;
      default:
        return <Chip label={status} color='default' size='small' />;
    }
  };



  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'fraud':
        return 'Gian lận';
      case 'behavior':
        return 'Hành vi';
      case 'content':
        return 'Nội dung';
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
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <Report sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Box>
              <Typography variant='h5' fontWeight='bold'>
                {totalReports}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Tổng báo cáo
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <Warning sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
            <Box>
              <Typography variant='h5' fontWeight='bold'>
                {pendingReports}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Chờ xử lý
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <Gavel sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
            <Box>
              <Typography variant='h5' fontWeight='bold'>
                {investigatingReports}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Đang xử lý
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircle sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
            <Box>
              <Typography variant='h5' fontWeight='bold'>
                {resolvedReports}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Đã giải quyết
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Reports Management */}
      <Paper sx={{ p: 3 }}>
        {/* Filters and Search */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 3,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <TextField
            size='small'
            placeholder='Tìm kiếm theo người báo cáo, bị báo cáo, lý do...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <Search sx={{ mr: 1, color: 'text.secondary' }} />
              ),
            }}
            sx={{ minWidth: 300, flex: 1 }}
          />

          <FormControl size='small' sx={{ minWidth: 140 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label='Trạng thái'
            >
              <MenuItem value='all'>Tất cả</MenuItem>
              <MenuItem value='pending'>Chờ xử lý</MenuItem>
              <MenuItem value='investigating'>Đang xử lý</MenuItem>
              <MenuItem value='resolved'>Đã giải quyết</MenuItem>
              <MenuItem value='dismissed'>Đã bỏ qua</MenuItem>
            </Select>
          </FormControl>

          <FormControl size='small' sx={{ minWidth: 140 }}>
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              label='Danh mục'
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
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Người báo cáo</TableCell>
                <TableCell>Bị báo cáo</TableCell>
                <TableCell>Lý do</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
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
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
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
                      <Typography variant='body2'>
                        {getCategoryLabel(report.category)}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(report.status)}</TableCell>
                    <TableCell>
                      <Typography variant='body2'>
                        {formatDate(report.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size='small'
                        onClick={(e) => handleMenuClick(e, report)}
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
            <Gavel sx={{ mr: 1, color: 'info.main' }} />
            Bắt đầu điều tra
          </MenuItem>
        )}
        {(selectedReport?.status === 'pending' ||
          selectedReport?.status === 'investigating') && (
          <>
            <MenuItem onClick={handleResolve}>
              <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
              Giải quyết
            </MenuItem>
            <MenuItem onClick={handleDismiss}>
              <Cancel sx={{ mr: 1, color: 'warning.main' }} />
              Bỏ qua
            </MenuItem>
          </>
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
        maxWidth='md'
        fullWidth
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant='h6'>Chi tiết báo cáo</Typography>
          <IconButton onClick={() => setDetailDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Report Info */}
              <Box>
                <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                  Thông tin báo cáo
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{ minWidth: 100 }}
                    >
                      Loại báo cáo:
                    </Typography>
                    <Typography variant='body2'>
                      {selectedReport.reportedType === 'seller' ? 'Báo cáo người bán' : 'Báo cáo người mua'}
                    </Typography>
                  </Box>
                  {selectedReport.carTitle && (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ minWidth: 100 }}
                      >
                        Xe liên quan:
                      </Typography>
                      <Typography variant='body2'>
                        {selectedReport.carTitle}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              <Divider />

              {/* Reporter Info */}
              <Box>
                <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                  Người báo cáo
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 48, height: 48 }}>
                    {selectedReport.reporter.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant='body1' fontWeight='medium'>
                      {selectedReport.reporter.name}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Email sx={{ fontSize: 16 }} />
                      <Typography variant='body2' color='text.secondary'>
                        {selectedReport.reporter.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone sx={{ fontSize: 16 }} />
                      <Typography variant='body2' color='text.secondary'>
                        {selectedReport.reporter.phone}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Divider />

              {/* Reported User Info */}
              <Box>
                <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                  Người bị báo cáo
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 48, height: 48 }}>
                    {selectedReport.reported.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant='body1' fontWeight='medium'>
                      {selectedReport.reported.name}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Email sx={{ fontSize: 16 }} />
                      <Typography variant='body2' color='text.secondary'>
                        {selectedReport.reported.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone sx={{ fontSize: 16 }} />
                      <Typography variant='body2' color='text.secondary'>
                        {selectedReport.reported.phone}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Divider />

              {/* Description */}
              <Box>
                <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                  Mô tả chi tiết
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedReport.description}
                  </Typography>
                </Paper>
              </Box>

              {/* Car Information if applicable */}
              {selectedReport.carId && selectedReport.carTitle && (
                <>
                  <Divider />
                  <Box>
                    <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                      Xe liên quan
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <DirectionsCar sx={{ color: 'primary.main' }} />
                      <Box>
                        <Typography variant='body1' fontWeight='medium'>
                          {selectedReport.carTitle}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          ID: {selectedReport.carId}
                        </Typography>
                        <Button
                          size='small'
                          variant='outlined'
                          sx={{ mt: 1 }}
                          onClick={() => window.open(`/cars/${selectedReport.carId}`, '_blank')}
                        >
                          Xem bài đăng
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </>
              )}

              {/* Report Statistics */}
              <Divider />
              <Box>
                <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                  Thống kê và Lịch sử người dùng
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                  <Paper sx={{ p: 2, textAlign: 'center', border: 1, borderColor: 'warning.light' }}>
                    <Typography variant='h6' color='warning.main'>
                      {reports.filter(r => r.reported.id === selectedReport.reported.id).length}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      Tổng báo cáo nhận được
                    </Typography>
                    <Typography variant='body2' color='text.primary' sx={{ mt: 0.5 }}>
                      {selectedReport.reported.name}
                    </Typography>
                  </Paper>
                  <Paper sx={{ p: 2, textAlign: 'center', border: 1, borderColor: 'info.light' }}>
                    <Typography variant='h6' color='info.main'>
                      {reports.filter(r => r.reporter.id === selectedReport.reporter.id).length}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      Báo cáo đã gửi
                    </Typography>
                    <Typography variant='body2' color='text.primary' sx={{ mt: 0.5 }}>
                      {selectedReport.reporter.name}
                    </Typography>
                  </Paper>
                </Box>
                
                {/* Detailed Statistics */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1 }}>
                  <Box sx={{ p: 1.5, bgcolor: 'error.50', borderRadius: 1, textAlign: 'center' }}>
                    <Typography variant='body2' fontWeight='bold' color='error.main'>
                      {reports.filter(r => r.reported.id === selectedReport.reported.id && r.status === 'resolved').length}
                    </Typography>
                    <Typography variant='caption'>Đã giải quyết</Typography>
                  </Box>
                  <Box sx={{ p: 1.5, bgcolor: 'warning.50', borderRadius: 1, textAlign: 'center' }}>
                    <Typography variant='body2' fontWeight='bold' color='warning.main'>
                      {reports.filter(r => r.reported.id === selectedReport.reported.id && r.status === 'investigating').length}
                    </Typography>
                    <Typography variant='caption'>Đang xử lý</Typography>
                  </Box>
                  <Box sx={{ p: 1.5, bgcolor: 'info.50', borderRadius: 1, textAlign: 'center' }}>
                    <Typography variant='body2' fontWeight='bold' color='info.main'>
                      {reports.filter(r => r.reported.id === selectedReport.reported.id && r.status === 'pending').length}
                    </Typography>
                    <Typography variant='caption'>Chờ xử lý</Typography>
                  </Box>
                </Box>

                {/* Risk Assessment */}
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant='body2' fontWeight='medium' gutterBottom>
                    Đánh giá rủi ro:
                  </Typography>
                  {(() => {
                    const reportCount = reports.filter(r => r.reported.id === selectedReport.reported.id).length;
                    const fraudReports = reports.filter(r => r.reported.id === selectedReport.reported.id && r.category === 'fraud').length;
                    
                    if (fraudReports > 0 || reportCount >= 3) {
                      return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Warning sx={{ color: 'error.main', fontSize: 20 }} />
                          <Typography variant='body2' color='error.main'>
                            Rủi ro cao - Cần xem xét khóa tài khoản
                          </Typography>
                        </Box>
                      );
                    } else if (reportCount >= 2) {
                      return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Warning sx={{ color: 'warning.main', fontSize: 20 }} />
                          <Typography variant='body2' color='warning.main'>
                            Rủi ro trung bình - Theo dõi chặt chẽ
                          </Typography>
                        </Box>
                      );
                    } else {
                      return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                          <Typography variant='body2' color='success.main'>
                            Rủi ro thấp - Người dùng đáng tin cậy
                          </Typography>
                        </Box>
                      );
                    }
                  })()}
                </Box>
              </Box>

              {/* Admin Notes */}
              {selectedReport.adminNotes && (
                <>
                  <Divider />
                  <Box>
                    <Typography
                      variant='subtitle1'
                      fontWeight='bold'
                      gutterBottom
                    >
                      Ghi chú admin
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: 'info.50', border: 1, borderColor: 'info.200' }}>
                      <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap' }}>
                        {selectedReport.adminNotes}
                      </Typography>
                    </Paper>
                  </Box>
                </>
              )}

              {/* Report Context & Evidence */}
              <Divider />
              <Box>
                <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                  Bối cảnh và Bằng chứng
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant='body2' fontWeight='medium' color='text.primary' gutterBottom>
                      Mô tả sự việc:
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {selectedReport.description}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant='body2' fontWeight='medium' color='primary.main' gutterBottom>
                        Loại vi phạm
                      </Typography>
                      <Chip 
                        label={getCategoryLabel(selectedReport.category)} 
                        color={
                          selectedReport.category === 'fraud' ? 'error' :
                          selectedReport.category === 'behavior' ? 'warning' :
                          selectedReport.category === 'content' ? 'info' : 'default'
                        }
                        variant='outlined'
                        size='small'
                      />
                    </Box>
                    
                    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Typography variant='body2' fontWeight='medium' color='primary.main' gutterBottom>
                        Mức độ nghiêm trọng
                      </Typography>
                      <Chip 
                        label={
                          selectedReport.category === 'fraud' ? 'Nghiêm trọng' :
                          selectedReport.category === 'behavior' ? 'Trung bình' :
                          'Nhẹ'
                        }
                        color={
                          selectedReport.category === 'fraud' ? 'error' :
                          selectedReport.category === 'behavior' ? 'warning' : 'success'
                        }
                        size='small'
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Action Recommendations */}
              <Divider />
              <Box>
                <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                  Khuyến nghị xử lý
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {selectedReport.category === 'fraud' && (
                    <Alert severity='error' sx={{ mb: 1 }}>
                      <Typography variant='body2' fontWeight='medium'>
                        Báo cáo gian lận - Cần xử lý ngay lập tức
                      </Typography>
                      <Typography variant='caption'>
                        • Điều tra chi tiết thông tin xe và người bán<br/>
                        • Xác minh tài liệu và lịch sử giao dịch<br/>
                        • Có thể cần tạm khóa tài khoản để bảo vệ người dùng khác
                      </Typography>
                    </Alert>
                  )}
                  
                  {selectedReport.category === 'behavior' && (
                    <Alert severity='warning' sx={{ mb: 1 }}>
                      <Typography variant='body2' fontWeight='medium'>
                        Hành vi không phù hợp - Cần can thiệp
                      </Typography>
                      <Typography variant='caption'>
                        • Gửi cảnh báo đến người bị báo cáo<br/>
                        • Theo dõi hành vi trong thời gian tới<br/>
                        • Có thể hạn chế một số tính năng nếu tái phạm
                      </Typography>
                    </Alert>
                  )}
                  
                  {selectedReport.category === 'content' && (
                    <Alert severity='info' sx={{ mb: 1 }}>
                      <Typography variant='body2' fontWeight='medium'>
                        Nội dung không phù hợp - Yêu cầu chỉnh sửa
                      </Typography>
                      <Typography variant='caption'>
                        • Liên hệ yêu cầu chỉnh sửa bài đăng<br/>
                        • Ẩn bài đăng tạm thời cho đến khi được sửa<br/>
                        • Hướng dẫn tuân thủ quy định đăng bài
                      </Typography>
                    </Alert>
                  )}
                  
                  {selectedReport.category === 'other' && (
                    <Alert severity='info'>
                      <Typography variant='body2' fontWeight='medium'>
                        Vấn đề khác - Xem xét cụ thể
                      </Typography>
                      <Typography variant='caption'>
                        • Đánh giá tình huống cụ thể<br/>
                        • Tư vấn và hỗ trợ cả hai bên<br/>
                        • Ghi nhận để theo dõi xu hướng
                      </Typography>
                    </Alert>
                  )}
                </Box>
              </Box>

              {/* Timeline & History */}
              <Divider />
              <Box>
                <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
                  Lịch sử xử lý chi tiết
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Report Created */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: 2, bgcolor: 'warning.50', borderRadius: 1, border: 1, borderColor: 'warning.200' }}>
                    <Report sx={{ color: 'warning.main', fontSize: 24, mt: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant='body1' fontWeight='bold' color='warning.dark'>
                        Báo cáo được tạo
                      </Typography>
                      <Typography variant='body2' color='text.primary' sx={{ mt: 0.5 }}>
                        <strong>Thời gian:</strong> {formatDate(selectedReport.createdAt)}
                      </Typography>
                      <Typography variant='body2' color='text.primary'>
                        <strong>Người báo cáo:</strong> {selectedReport.reporter.name} ({selectedReport.reporter.role === 'buyer' ? 'Người mua' : 'Người bán'})
                      </Typography>
                      <Typography variant='body2' color='text.primary'>
                        <strong>Lý do:</strong> {selectedReport.reason}
                      </Typography>
                      <Typography variant='body2' color='text.primary'>
                        <strong>Danh mục:</strong> {getCategoryLabel(selectedReport.category)}
                      </Typography>
                      {selectedReport.carTitle && (
                        <Typography variant='body2' color='text.primary'>
                          <strong>Xe liên quan:</strong> {selectedReport.carTitle}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Status Updates */}
                  {selectedReport.updatedAt !== selectedReport.createdAt && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: 2, bgcolor: 'info.50', borderRadius: 1, border: 1, borderColor: 'info.200' }}>
                      <Edit sx={{ color: 'info.main', fontSize: 24, mt: 0.5 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant='body1' fontWeight='bold' color='info.dark'>
                          Cập nhật trạng thái
                        </Typography>
                        <Typography variant='body2' color='text.primary' sx={{ mt: 0.5 }}>
                          <strong>Thời gian:</strong> {formatDate(selectedReport.updatedAt)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <Typography variant='body2' color='text.primary'>
                            <strong>Trạng thái hiện tại:</strong>
                          </Typography>
                          {getStatusChip(selectedReport.status)}
                        </Box>
                        
                        {/* Action taken description */}
                        <Typography variant='body2' color='text.secondary' sx={{ mt: 1, fontStyle: 'italic' }}>
                          {selectedReport.status === 'investigating' && 'Admin đã bắt đầu quá trình điều tra báo cáo này.'}
                          {selectedReport.status === 'resolved' && 'Báo cáo đã được xử lý và giải quyết thành công.'}
                          {selectedReport.status === 'dismissed' && 'Báo cáo đã được xem xét và quyết định bỏ qua.'}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* Resolution Details */}
                  {selectedReport.status === 'resolved' && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: 2, bgcolor: 'success.50', borderRadius: 1, border: 1, borderColor: 'success.200' }}>
                      <CheckCircle sx={{ color: 'success.main', fontSize: 24, mt: 0.5 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant='body1' fontWeight='bold' color='success.dark'>
                          Báo cáo đã được giải quyết
                        </Typography>
                        <Typography variant='body2' color='text.primary' sx={{ mt: 0.5 }}>
                          <strong>Kết quả xử lý:</strong> Đã thực hiện các biện pháp cần thiết
                        </Typography>
                        {selectedReport.adminNotes && (
                          <Box sx={{ mt: 1, p: 1.5, bgcolor: 'success.100', borderRadius: 1 }}>
                            <Typography variant='body2' fontWeight='medium' color='success.dark'>
                              Ghi chú từ admin:
                            </Typography>
                            <Typography variant='body2' color='text.primary' sx={{ mt: 0.5 }}>
                              {selectedReport.adminNotes}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* Dismissal Details */}
                  {selectedReport.status === 'dismissed' && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1, border: 1, borderColor: 'grey.300' }}>
                      <Cancel sx={{ color: 'grey.600', fontSize: 24, mt: 0.5 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant='body1' fontWeight='bold' color='grey.700'>
                          Báo cáo đã bị bỏ qua
                        </Typography>
                        <Typography variant='body2' color='text.primary' sx={{ mt: 0.5 }}>
                          <strong>Lý do:</strong> Không đủ bằng chứng hoặc không vi phạm quy định
                        </Typography>
                        {selectedReport.adminNotes && (
                          <Box sx={{ mt: 1, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant='body2' fontWeight='medium' color='grey.700'>
                              Ghi chú từ admin:
                            </Typography>
                            <Typography variant='body2' color='text.primary' sx={{ mt: 0.5 }}>
                              {selectedReport.adminNotes}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* Next Steps for Pending/Investigating */}
                  {(selectedReport.status === 'pending' || selectedReport.status === 'investigating') && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1, border: 1, borderColor: 'grey.300', borderStyle: 'dashed' }}>
                      <Gavel sx={{ color: 'grey.600', fontSize: 24, mt: 0.5 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant='body1' fontWeight='bold' color='grey.700'>
                          Các bước tiếp theo
                        </Typography>
                        <Box component="ul" sx={{ mt: 1, pl: 2, m: 0 }}>
                          <li>
                            <Typography variant='body2' color='text.primary'>
                              Xem xét chi tiết mô tả và bằng chứng
                            </Typography>
                          </li>
                          <li>
                            <Typography variant='body2' color='text.primary'>
                              Liên hệ với các bên liên quan nếu cần
                            </Typography>
                          </li>
                          <li>
                            <Typography variant='body2' color='text.primary'>
                              Quyết định hành động phù hợp (giải quyết, bỏ qua, hoặc khóa tài khoản)
                            </Typography>
                          </li>
                          <li>
                            <Typography variant='body2' color='text.primary'>
                              Ghi chú lý do quyết định để tham khảo sau này
                            </Typography>
                          </li>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setDetailDialogOpen(false)} color="inherit">
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
