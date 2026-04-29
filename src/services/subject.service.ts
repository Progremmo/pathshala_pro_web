import api from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';

export const subjectService = {
  getAll: (schoolId: number) =>
    api.get<ApiResponse<any[]>>(`/schools/${schoolId}/subjects`).then((r) => r.data),

  create: (schoolId: number, data: any) =>
    api.post<ApiResponse<any>>(`/schools/${schoolId}/subjects`, data).then((r) => r.data),

  update: (schoolId: number, subjectId: number, data: any) =>
    api.put<ApiResponse<any>>(`/schools/${schoolId}/subjects/${subjectId}`, data).then((r) => r.data),

  delete: (schoolId: number, subjectId: number) =>
    api.delete<ApiResponse<void>>(`/schools/${schoolId}/subjects/${subjectId}`).then((r) => r.data),
};
