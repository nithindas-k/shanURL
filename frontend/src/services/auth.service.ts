import axiosInstance from '../lib/axios';
import type { ApiResponse } from '../types/api.types';
import type { RegisterPayload, LoginPayload, UserResponse, AuthDataResponse } from '../types/auth.types';

export const authService = {
  register: (data: RegisterPayload) =>
    axiosInstance.post<ApiResponse<UserResponse>>('/auth/register', data),

  login: (data: LoginPayload) =>
    axiosInstance.post<ApiResponse<AuthDataResponse>>('/auth/login', data),
};
