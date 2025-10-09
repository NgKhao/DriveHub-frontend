import api from './api';
import {
  mapFrontendCreateReportToBackend,
  mapBackendCreateReportResponseToReport,
} from '../types';
import type {
  BackendCreateReportResponse,
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
};
