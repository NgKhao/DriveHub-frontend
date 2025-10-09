import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Report, ReportReason } from '../types';

interface ReportState {
  reports: Report[];
  reportReasons: ReportReason[];

  // Actions
  submitReport: (
    reportedId: string,
    reportedType: 'seller' | 'buyer',
    reason: string,
    description: string
  ) => Promise<void>;
  getUserReports: (userId: string) => Report[];
  getReportsAgainstUser: (userId: string) => Report[];
  updateReportStatus: (
    reportId: string,
    status: Report['status']
  ) => Promise<void>;
  getReportReasons: () => ReportReason[];
}

// Default report reasons
const defaultReportReasons: ReportReason[] = [
  // Reasons for reporting sellers (used by buyers)
  {
    id: 'seller_fraud',
    label: 'Lừa đảo',
    description:
      'Người bán có hành vi lừa đảo, không giao xe sau khi nhận tiền',
    category: 'fraud',
  },
  {
    id: 'seller_wrong_info',
    label: 'Thông tin xe sai lệch',
    description: 'Thông tin xe không đúng với thực tế',
    category: 'content',
  },
  {
    id: 'seller_price_change',
    label: 'Thay đổi giá bán',
    description: 'Thay đổi giá bán sau khi thỏa thuận',
    category: 'fraud',
  },
  {
    id: 'seller_bad_attitude',
    label: 'Thái độ không phù hợp',
    description: 'Có thái độ xấu, không tôn trọng khách hàng',
    category: 'behavior',
  },
  {
    id: 'seller_no_response',
    label: 'Không phản hồi',
    description: 'Không trả lời tin nhắn hoặc cuộc gọi sau khi liên hệ',
    category: 'behavior',
  },
  {
    id: 'seller_technical_issue',
    label: 'Xe có vấn đề kỹ thuật',
    description: 'Xe có lỗi kỹ thuật nhưng không thông báo trước',
    category: 'content',
  },

  // Reasons for reporting buyers (used by sellers)
  {
    id: 'buyer_no_show',
    label: 'Không đến xem xe',
    description: 'Hẹn xem xe nhưng không đến và không báo trước',
    category: 'behavior',
  },
  {
    id: 'buyer_no_response',
    label: 'Không phản hồi',
    description: 'Liên hệ nhưng không trả lời tin nhắn hoặc cuộc gọi',
    category: 'behavior',
  },
  {
    id: 'buyer_bargain_unreasonable',
    label: 'Trả giá không hợp lý',
    description: 'Trả giá quá thấp hoặc không nghiêm túc trong việc mua xe',
    category: 'behavior',
  },
  {
    id: 'buyer_time_wasting',
    label: 'Làm mất thời gian',
    description: 'Hẹn nhiều lần nhưng không có ý định mua thực sự',
    category: 'behavior',
  },
  {
    id: 'buyer_bad_attitude',
    label: 'Thái độ không phù hợp',
    description: 'Có thái độ xấu, không tôn trọng người bán',
    category: 'behavior',
  },
  {
    id: 'buyer_fraud_attempt',
    label: 'Nghi vấn lừa đảo',
    description: 'Có dấu hiệu lừa đảo hoặc hành vi đáng ngờ',
    category: 'fraud',
  },

  {
    id: 'other',
    label: 'Lý do khác',
    description: 'Lý do khác (vui lòng mô tả chi tiết)',
    category: 'other',
  },
];

export const useReportStore = create<ReportState>()(
  persist(
    (set, get) => ({
      reports: [],
      reportReasons: defaultReportReasons,

      submitReport: async (
        reportedId: string,
        reportedType: 'seller' | 'buyer',
        reason: string,
        description: string
      ) => {
        try {
          // TODO: Replace with actual API call
          const newReport: Report = {
            id: Math.random().toString(36).substr(2, 9),
            reporterId: 'current-user-id', // This would come from auth store
            reportedId,
            reportedType,
            reason,
            description,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            reports: [...state.reports, newReport],
          }));
        } catch (error) {
          console.error('Failed to submit report:', error);
          throw error;
        }
      },

      getUserReports: (userId: string) => {
        const { reports } = get();
        return reports.filter((report) => report.reporterId === userId);
      },

      getReportsAgainstUser: (userId: string) => {
        const { reports } = get();
        return reports.filter((report) => report.reportedId === userId);
      },

      updateReportStatus: async (
        reportId: string,
        status: Report['status']
      ) => {
        try {
          // TODO: Replace with actual API call
          set((state) => ({
            reports: state.reports.map((report) =>
              report.id === reportId
                ? {
                    ...report,
                    status,
                    updatedAt: new Date().toISOString(),
                  }
                : report
            ),
          }));
        } catch (error) {
          console.error('Failed to update report status:', error);
          throw error;
        }
      },

      getReportReasons: () => {
        const { reportReasons } = get();
        return reportReasons;
      },
    }),
    {
      name: 'report-store',
      partialize: (state) => ({
        reports: state.reports,
        reportReasons: state.reportReasons,
      }),
    }
  )
);
