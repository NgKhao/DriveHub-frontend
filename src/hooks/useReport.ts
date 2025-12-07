import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
    return 'Không tìm thấy bài đăng hoặc người dùng';
  } else if (error.response?.status === 400) {
    return 'Dữ liệu báo cáo không hợp lệ';
  } else if (error.response?.status === 409) {
    return 'Bạn đã báo cáo rồi';
  } else if (error.message?.includes('Network')) {
    return 'Không thể kết nối đến server';
  } else {
    return 'Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại.';
  }
};

/**
 * Hook để báo cáo post (buyer report seller)
 */
export const useReportPost = () => {
  const queryClient = useQueryClient();

  return useMutation<Report, ReportError, { postId: string; reportData: Omit<CreateReportData, 'postId'> }>({
    mutationFn: ({ postId, reportData }) => {
      return reportService.reportPost(postId, reportData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reports'],
      });
    },
    onError: (error: ReportError) => {
      console.error('Report post error:', error);
    },
  });
};

/**
 * Hook để báo cáo buyer (seller report buyer)
 */
export const useReportBuyer = () => {
  const queryClient = useQueryClient();

  return useMutation<Report, ReportError, CreateReportData>({
    mutationFn: (reportData: CreateReportData) => {
      return reportService.reportBuyer(reportData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reports'],
      });
    },
    onError: (error: ReportError) => {
      console.error('Report buyer error:', error);
    },
  });
};

/**
 * Hook để lấy danh sách báo cáo đã gửi của user hiện tại
 */
export const useMyReports = (enabled: boolean = true) => {
  return useQuery<Report[], ReportError>({
    queryKey: ['reports', 'my-reports'],
    queryFn: () => reportService.getMyReports(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    enabled,
  });
};

/**
 * Main report management hook
 */
export const useReportManager = () => {
  const reportPostMutation = useReportPost();
  const reportBuyerMutation = useReportBuyer();

  return {
    // Report post (buyer → seller)
    reportPost: reportPostMutation.mutate,
    reportPostAsync: reportPostMutation.mutateAsync,
    isReportingPost: reportPostMutation.isPending,
    reportPostError: reportPostMutation.error
      ? getErrorMessage(reportPostMutation.error)
      : null,
    isReportPostSuccess: reportPostMutation.isSuccess,

    // Report buyer (seller → buyer)
    reportBuyer: reportBuyerMutation.mutate,
    reportBuyerAsync: reportBuyerMutation.mutateAsync,
    isReportingBuyer: reportBuyerMutation.isPending,
    reportBuyerError: reportBuyerMutation.error
      ? getErrorMessage(reportBuyerMutation.error)
      : null,
    isReportBuyerSuccess: reportBuyerMutation.isSuccess,

    // Reset mutations
    resetReportPost: reportPostMutation.reset,
    resetReportBuyer: reportBuyerMutation.reset,
  };
};
