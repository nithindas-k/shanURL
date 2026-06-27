import axiosInstance from '../lib/axios';
import type { ApiResponse } from '../types/api.types';
import type { UrlResponse } from '../types/url.types';

export const urlService = {
  createUrl: (originalUrl: string) =>
    axiosInstance.post<ApiResponse<UrlResponse>>('/urls', { originalUrl }),

  getUserUrls: () =>
    axiosInstance.get<ApiResponse<UrlResponse[]>>('/urls'),
};
