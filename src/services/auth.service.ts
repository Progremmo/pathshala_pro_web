import api from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { AuthResponse, LoginRequest, RegisterUserRequest, RegisterAdminRequest, ForgotPasswordRequest, ResetPasswordRequest } from '@/types/auth.types';
import { UserResponse } from '@/types/user.types';

export const authService = {
  login: (data: LoginRequest) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', data).then((r) => r.data),

  register: (data: RegisterUserRequest) =>
    api.post<ApiResponse<UserResponse>>('/auth/register', data).then((r) => r.data),

  registerAdmin: (data: RegisterAdminRequest) =>
    api.post<ApiResponse<UserResponse>>('/auth/register-admin', data).then((r) => r.data),

  forgotPassword: (data: ForgotPasswordRequest) =>
    api.post<ApiResponse<void>>('/auth/forgot-password', data).then((r) => r.data),

  resetPassword: (data: ResetPasswordRequest) =>
    api.post<ApiResponse<void>>('/auth/reset-password', data).then((r) => r.data),

  refreshToken: (refreshToken: string) =>
    api.post<ApiResponse<AuthResponse>>('/auth/refresh', { refreshToken }).then((r) => r.data),

  changePassword: (userId: number, currentPassword: string, newPassword: string) =>
    api.post<ApiResponse<void>>(`/auth/change-password?userId=${userId}`, { currentPassword, newPassword }).then((r) => r.data),
};
