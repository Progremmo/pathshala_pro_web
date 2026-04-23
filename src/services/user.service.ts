import api from '@/lib/axios';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';
import { UserResponse } from '@/types/user.types';

export const userService = {
  getAll: (params?: PaginationParams & { schoolId?: number; role?: string }) =>
    api.get<ApiResponse<PaginatedResponse<UserResponse>>>('/users', { params }).then((r) => r.data),

  getById: (userId: number) =>
    api.get<ApiResponse<UserResponse>>(`/users/${userId}`).then((r) => r.data),

  toggleStatus: (userId: number, active: boolean) =>
    api.patch<ApiResponse<UserResponse>>(`/users/${userId}/status?active=${active}`).then((r) => r.data),
};
