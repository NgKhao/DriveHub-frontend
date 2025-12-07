import api from './api';
import {
  mapFrontendCreateReportToBackend,
  mapBackendCreateReportResponseToReport,
  mapBackendMyReportsResponseToReports,
} from '../types';
import type {
  BackendCreateReportResponse,
  BackendMyReportsResponse,
  CreateReportData,
  Report,
} from '../types';

export const reportService = {
  /**
   * Create a report for a post (buyer reports seller)
   * @param postId Post ID to report
   * @param reportData Report data (reason, description)
   * @returns Promise<Report>
   */
  reportPost: async (postId: string, reportData: Omit<CreateReportData, 'postId'>): Promise<Report> => {
    try {
      const backendRequest = mapFrontendCreateReportToBackend(reportData);

      const response = await api.post<BackendCreateReportResponse>(
        `/posts/${postId}/report`,
        backendRequest
      );

      // Transform backend response to frontend format
      return mapBackendCreateReportResponseToReport(response.data);
    } catch (error) {
      console.error('Error reporting post:', error);
      throw error;
    }
  },

  /**
   * Create a report for a buyer (seller reports buyer)
   * @param reportData Report data including buyer email/phone
   * @returns Promise<Report>
   */
  reportBuyer: async (reportData: CreateReportData): Promise<Report> => {
    try {
      // Backend expects buyer_identifier (email or phone)
      const buyer_identifier = reportData.reportedUserEmail || reportData.reportedUserphone;
      
      if (!buyer_identifier) {
        throw new Error('buyer_identifier (email or phone) is required');
      }

      const backendRequest = {
        ...mapFrontendCreateReportToBackend(reportData),
        buyer_identifier,
      };

      const response = await api.post<BackendCreateReportResponse>(
        '/reports/report-buyer',
        backendRequest
      );

      // Transform backend response to frontend format
      return mapBackendCreateReportResponseToReport(response.data);
    } catch (error) {
      console.error('Error reporting buyer:', error);
      throw error;
    }
  },

  /**
   * Get all reports submitted by the current user
   * @returns Promise<Report[]>
   */
  getMyReports: async (): Promise<Report[]> => {
    try {
      const response = await api.get<BackendMyReportsResponse>(
        '/reports/my-reports'
      );

      // Transform backend response to frontend format
      return mapBackendMyReportsResponseToReports(response.data.detail.reports);
    } catch (error) {
      console.error('Error fetching my reports:', error);
      throw error;
    }
  },
};
