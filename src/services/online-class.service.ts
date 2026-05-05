import api from '@/lib/axios';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';
import { OnlineClass, OnlineClassRequest } from '@/types/online-class.types';

export const onlineClassService = {
  schedule: (schoolId: number, data: OnlineClassRequest) =>
    api.post<ApiResponse<OnlineClass>>(`/schools/${schoolId}/online-classes`, data).then((r) => r.data),

  getAll: (schoolId: number, params?: PaginationParams) =>
    api.get<ApiResponse<PaginatedResponse<OnlineClass>>>(`/schools/${schoolId}/online-classes`, { params }).then((r) => r.data),

  getUpcoming: (schoolId: number, days: number = 7) =>
    api.get<ApiResponse<OnlineClass[]>>(`/schools/${schoolId}/online-classes/upcoming`, {
      params: { days },
    }).then((r) => r.data),

  updateStatus: (schoolId: number, classId: number, status: string) =>
    api.patch<ApiResponse<OnlineClass>>(`/schools/${schoolId}/online-classes/${classId}/status`, null, {
      params: { status },
    }).then((r) => r.data),

  delete: (schoolId: number, classId: number) =>
    api.delete<ApiResponse<void>>(`/schools/${schoolId}/online-classes/${classId}`).then((r) => r.data),

  getByTeacher: (schoolId: number, teacherId: number, params?: PaginationParams) =>
    api.get<ApiResponse<PaginatedResponse<OnlineClass>>>(`/schools/${schoolId}/online-classes/teacher/${teacherId}`, { params }).then((r) => r.data),
};
