import api from '@/lib/axios';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';
import { SchoolRequest, SchoolResponse } from '@/types/school.types';

export const schoolService = {
  create: (data: SchoolRequest) =>
    api.post<ApiResponse<SchoolResponse>>('/schools', data).then((r) => r.data),

  getAll: (params?: PaginationParams) =>
    api.get<ApiResponse<PaginatedResponse<SchoolResponse>>>('/schools', { params }).then((r) => r.data),

  getById: (schoolId: number) =>
    api.get<ApiResponse<SchoolResponse>>(`/schools/${schoolId}`).then((r) => r.data),

  update: (schoolId: number, data: SchoolRequest) =>
    api.put<ApiResponse<SchoolResponse>>(`/schools/${schoolId}`, data).then((r) => r.data),

  delete: (schoolId: number) =>
    api.delete<ApiResponse<void>>(`/schools/${schoolId}`).then((r) => r.data),

  getClassrooms: (schoolId: number) =>
    api.get<ApiResponse<any[]>>(`/schools/${schoolId}/classrooms`).then((r) => r.data),

  createClassroom: (schoolId: number, data: any) =>
    api.post<ApiResponse<any>>(`/schools/${schoolId}/classrooms`, data).then((r) => r.data),

  updateClassroom: (schoolId: number, classRoomId: number, data: any) =>
    api.put<ApiResponse<any>>(`/schools/${schoolId}/classrooms/${classRoomId}`, data).then((r) => r.data),

  deleteClassroom: (schoolId: number, classRoomId: number) =>
    api.delete<ApiResponse<void>>(`/schools/${schoolId}/classrooms/${classRoomId}`).then((r) => r.data),
};
