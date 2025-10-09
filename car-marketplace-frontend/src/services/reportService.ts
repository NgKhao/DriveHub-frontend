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
   * Create a new report against a user
   * @param reportData Report data to create
   * @returns Promise<Report>
   */
  createReport: async (reportData: CreateReportData): Promise<Report> => {
    try {
      const backendRequest = mapFrontendCreateReportToBackend(reportData);

      const response = await api.post<BackendCreateReportResponse>(
        '/reports/create',
        backendRequest
      );

      // Transform backend response to frontend format
      return mapBackendCreateReportResponseToReport(response.data.detail);
    } catch (error) {
      console.error('Error creating report:', error);
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
      return mapBackendMyReportsResponseToReports(response.data.detail);
    } catch (error) {
      console.error('Error fetching my reports:', error);
      throw error;
    }
  },
};
