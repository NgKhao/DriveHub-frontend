import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportService } from '../services/reportService';
import type { CreateReportData, Report } from '../types';

interface ReportError {
  response?: { status: number };
  message?: string;
}

// Helper function to get user-friendly error message
const getErrorMessage = (error: ReportError): string => {
  if (error.response?.status === 401) {
    return 'Vui lòng đăng nhập để báo cáo';
  } else if (error.response?.status === 403) {
    return 'Không có quyền truy cập';
  } else if (error.response?.status === 404) {
    return 'Không tìm thấy người dùng được báo cáo';
  } else if (error.response?.status === 400) {
    return 'Dữ liệu báo cáo không hợp lệ';
  } else if (error.response?.status === 409) {
    return 'Bạn đã báo cáo người dùng này rồi';
  } else if (error.message?.includes('Network')) {
    return 'Không thể kết nối đến server';
  } else {
    return 'Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại.';
  }
};

/**
 * Hook để tạo báo cáo mới
 */
export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation<Report, ReportError, CreateReportData>({
    mutationFn: (reportData: CreateReportData) => {
      return reportService.createReport(reportData);
    },
    onSuccess: () => {
      // Invalidate any report-related queries if we add them later
      queryClient.invalidateQueries({
        queryKey: ['reports'],
      });
    },
    onError: (error: ReportError) => {
      console.error('Create report error:', error);
    },
  });
};

/**
 * Main report management hook
 */
export const useReportManager = () => {
  const createReportMutation = useCreateReport();

  return {
    // Create report
    createReport: createReportMutation.mutate,
    createReportAsync: createReportMutation.mutateAsync,
    isCreatingReport: createReportMutation.isPending,
    createReportError: createReportMutation.error
      ? getErrorMessage(createReportMutation.error)
      : null,
    isCreateReportSuccess: createReportMutation.isSuccess,

    // Reset mutations
    resetCreateReportError: createReportMutation.reset,
  };
};
