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
  CircularProgress,
} from '@mui/material';
import {
  Cancel,
  Search,
  Refresh,
  MoreVert,
  Visibility,
  Close,
  Block,
  AssignmentInd,
  PersonOutline,
  GpsFixed,
  Description,
  Schedule,
} from '@mui/icons-material';
import { useAdminReports, useUpdateReportStatus } from '../../hooks/useAdmin';
import type { AdminReport } from '../../types';

const ReportManagement: React.FC = () => {
  // Use real API instead of mock data
  const {
    data: apiReports = [],
    isLoading,
    error,
    refetch,
  } = useAdminReports();

  const { mutate: updateReportStatus, isPending: isUpdating } =
    useUpdateReportStatus();

  const [filteredReports, setFilteredReports] = useState<AdminReport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dialog states
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(
    null
  );
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('success');

  // Filter reports
  React.useEffect(() => {
    const filtered = apiReports.filter((report) => {
      const matchesSearch =
        report.reporter.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        report.reported.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        report.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || report.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setFilteredReports(filtered);
    setPage(0);
  }, [searchQuery, statusFilter, apiReports]);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    report: AdminReport
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(report);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // Don't reset selectedReport here to keep it for dialog
    // setSelectedReport(null);
  };

  const handleViewDetail = () => {
    if (selectedReport) {
      setDetailDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleSuspend = () => {
    if (selectedReport && !isUpdating) {
      updateReportStatus(
        { id: selectedReport.id, status: 'SUSPENDED' },
        {
          onSuccess: () => {
            setSnackbarMessage('Đã tạm khóa tài khoản thành công');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setDetailDialogOpen(false); // Close dialog
            refetch(); // Refresh the reports list
          },
          onError: (error) => {
            setSnackbarMessage(`Lỗi khi tạm khóa tài khoản: ${error.message}`);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
          },
        }
      );
    }
    handleMenuClose();
  };

  const handleBan = () => {
    if (selectedReport && !isUpdating) {
      updateReportStatus(
        { id: selectedReport.id, status: 'BANNED' },
        {
          onSuccess: () => {
            setSnackbarMessage('Đã cấm tài khoản vĩnh viễn thành công');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setDetailDialogOpen(false); // Close dialog
            refetch(); // Refresh the reports list
          },
          onError: (error) => {
            setSnackbarMessage(`Lỗi khi cấm tài khoản: ${error.message}`);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
          },
        }
      );
    }
    handleMenuClose();
  };

  const handleReject = () => {
    if (selectedReport && !isUpdating) {
      updateReportStatus(
        { id: selectedReport.id, status: 'REJECTED' },
        {
          onSuccess: () => {
            setSnackbarMessage('Đã từ chối báo cáo thành công');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setDetailDialogOpen(false); // Close dialog
            refetch(); // Refresh the reports list
          },
          onError: (error) => {
            setSnackbarMessage(`Lỗi khi từ chối báo cáo: ${error.message}`);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
          },
        }
      );
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
      case 'suspended':
        return <Chip label='Tạm khóa' color='error' size='small' />;
      case 'banned':
        return <Chip label='Cấm vĩnh viễn' color='error' size='small' />;
      case 'rejected':
        return <Chip label='Từ chối' color='default' size='small' />;
      default:
        return <Chip label={status} color='default' size='small' />;
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
    refetch(); // Refresh data from API
  };

  // Statistics
  const totalReports = apiReports.length;
  const pendingReports = apiReports.filter(
    (r) => r.status === 'pending'
  ).length;
  const suspendedReports = apiReports.filter(
    (r) => r.status === 'suspended'
  ).length;
  const bannedReports = apiReports.filter((r) => r.status === 'banned').length;
  const rejectedReports = apiReports.filter(
    (r) => r.status === 'rejected'
  ).length;

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
            <Typography variant='h4' color='error.main' fontWeight='bold'>
              {suspendedReports}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Tạm khóa
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant='h4' color='error.main' fontWeight='bold'>
              {bannedReports}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Cấm vĩnh viễn
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant='h4' color='default' fontWeight='bold'>
              {rejectedReports}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Từ chối
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Reports Management */}
      <Paper sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography variant='h5' fontWeight='bold'>
            Quản lý báo cáo
          </Typography>
          {isLoading && <CircularProgress size={24} />}
        </Box>

        {/* Error State */}
        {error && (
          <Alert severity='error' sx={{ mb: 3 }}>
            Có lỗi xảy ra khi tải dữ liệu báo cáo. Vui lòng thử lại.
          </Alert>
        )}

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
              <MenuItem value='suspended'>Tạm khóa</MenuItem>
              <MenuItem value='banned'>Cấm vĩnh viễn</MenuItem>
              <MenuItem value='rejected'>Từ chối</MenuItem>
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
                <TableCell>Mô tả</TableCell>
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
                            ID: {report.reporter.id}
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
                            ID: {report.reported.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>{report.reason}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant='body2'
                        sx={{
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {report.description || 'Không có mô tả'}
                      </Typography>
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
          <MenuItem
            onClick={handleSuspend}
            disabled={isUpdating}
            sx={{ color: 'warning.main' }}
          >
            <Block sx={{ mr: 1 }} />
            Tạm khóa tài khoản
          </MenuItem>
        )}
        {selectedReport?.status === 'pending' && (
          <MenuItem
            onClick={handleBan}
            disabled={isUpdating}
            sx={{ color: 'error.main' }}
          >
            <Cancel sx={{ mr: 1 }} />
            Cấm vĩnh viễn
          </MenuItem>
        )}
        {selectedReport?.status === 'pending' && (
          <MenuItem onClick={handleReject} disabled={isUpdating}>
            <Close sx={{ mr: 1 }} />
            Từ chối báo cáo
          </MenuItem>
        )}
      </Menu>

      {/* Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => {
          setDetailDialogOpen(false);
          setSelectedReport(null); // Reset selectedReport when dialog closes
        }}
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
          <IconButton
            onClick={() => {
              setDetailDialogOpen(false);
              setSelectedReport(null);
            }}
          >
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
                  <Typography
                    variant='subtitle1'
                    fontWeight='bold'
                    gutterBottom
                    color='primary'
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <AssignmentInd /> Thông tin báo cáo
                  </Typography>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                  >
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ minWidth: 100, fontWeight: 'medium' }}
                      >
                        Mã báo cáo:
                      </Typography>
                      <Chip
                        label={`#${selectedReport.id}`}
                        size='small'
                        variant='outlined'
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ minWidth: 100, fontWeight: 'medium' }}
                      >
                        Lý do:
                      </Typography>
                      <Typography variant='body2' fontWeight='medium'>
                        {selectedReport.reason}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}
                    >
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ minWidth: 100, fontWeight: 'medium' }}
                      >
                        Mô tả:
                      </Typography>
                      <Typography variant='body2'>
                        {selectedReport.description || 'Không có mô tả'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ minWidth: 100, fontWeight: 'medium' }}
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
                  <Typography
                    variant='subtitle1'
                    fontWeight='bold'
                    gutterBottom
                    color='primary'
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <PersonOutline /> Người báo cáo
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar
                      sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}
                    >
                      <Typography variant='h6' color='white'>
                        {selectedReport.reporter.name.charAt(0)}
                      </Typography>
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant='h6' fontWeight='bold' gutterBottom>
                        {selectedReport.reporter.name}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                        }}
                      >
                        <Typography variant='body2' color='text.secondary'>
                          ID: {selectedReport.reporter.id}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Người bị báo cáo */}
              <Card variant='outlined'>
                <CardContent>
                  <Typography
                    variant='subtitle1'
                    fontWeight='bold'
                    gutterBottom
                    color='error'
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <GpsFixed /> Người bị báo cáo
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar
                      sx={{ width: 56, height: 56, bgcolor: 'error.main' }}
                    >
                      <Typography variant='h6' color='white'>
                        {selectedReport.reported.name.charAt(0)}
                      </Typography>
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant='h6' fontWeight='bold' gutterBottom>
                        {selectedReport.reported.name}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                        }}
                      >
                        <Typography variant='body2' color='text.secondary'>
                          ID: {selectedReport.reported.id}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Mô tả chi tiết */}
              <Card variant='outlined'>
                <CardContent>
                  <Typography
                    variant='subtitle1'
                    fontWeight='bold'
                    gutterBottom
                    color='primary'
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Description /> Mô tả chi tiết
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      backgroundColor: 'grey.50',
                      border: '1px solid',
                      borderColor: 'grey.200',
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant='body2'
                      sx={{
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.6,
                      }}
                    >
                      {selectedReport.description}
                    </Typography>
                  </Paper>
                </CardContent>
              </Card>

              {/* Thông tin xử lý */}
              {selectedReport.handledBy && (
                <Card variant='outlined'>
                  <CardContent>
                    <Typography
                      variant='subtitle1'
                      fontWeight='bold'
                      gutterBottom
                      color='success.main'
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <AssignmentInd /> Thông tin xử lý
                    </Typography>
                    <Box
                      sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                    >
                      <Box
                        sx={{ display: 'flex', gap: 2, alignItems: 'center' }}
                      >
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{ minWidth: 120, fontWeight: 'medium' }}
                        >
                          Người xử lý:
                        </Typography>
                        <Typography variant='body2' fontWeight='medium'>
                          {selectedReport.handledBy.name}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: 'flex', gap: 2, alignItems: 'center' }}
                      >
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{ minWidth: 120, fontWeight: 'medium' }}
                        >
                          Thời gian xử lý:
                        </Typography>
                        <Typography variant='body2'>
                          {selectedReport.handledAt
                            ? formatDate(selectedReport.handledAt)
                            : 'Chưa xử lý'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Thời gian */}
              <Card variant='outlined'>
                <CardContent>
                  <Typography
                    variant='subtitle1'
                    fontWeight='bold'
                    gutterBottom
                    color='primary'
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Schedule /> Thông tin thời gian
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      gap: 3,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        gutterBottom
                      >
                        Ngày tạo báo cáo
                      </Typography>
                      <Typography variant='body1' fontWeight='medium'>
                        {formatDate(selectedReport.createdAt)}
                      </Typography>
                    </Box>
                    {selectedReport.handledAt && (
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          gutterBottom
                        >
                          Thời gian xử lý
                        </Typography>
                        <Typography variant='body1' fontWeight='medium'>
                          {formatDate(selectedReport.handledAt)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}

          {!selectedReport && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
              }}
            >
              <Typography variant='h6' color='text.secondary'>
                Không có báo cáo được chọn
              </Typography>
              <Typography variant='body2' color='text.disabled' mt={1}>
                Vui lòng chọn một báo cáo để xem chi tiết
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => {
              setDetailDialogOpen(false);
              setSelectedReport(null);
            }}
            color='inherit'
          >
            Đóng
          </Button>
          {selectedReport?.status === 'pending' && (
            <>
              <Button
                variant='outlined'
                color='warning'
                onClick={handleSuspend}
                disabled={isUpdating}
                startIcon={<Block />}
              >
                Tạm khóa
              </Button>
              <Button
                variant='outlined'
                color='error'
                onClick={handleBan}
                disabled={isUpdating}
                startIcon={<Cancel />}
              >
                Cấm vĩnh viễn
              </Button>
              <Button
                variant='outlined'
                color='inherit'
                onClick={handleReject}
                disabled={isUpdating}
                startIcon={<Close />}
              >
                Từ chối
              </Button>
            </>
          )}
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
