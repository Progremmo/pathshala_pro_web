import api from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { AttendanceRequest, AttendanceResponse, AttendanceStats } from '@/types/attendance.types';

export const attendanceService = {
  mark: (schoolId: number, data: AttendanceRequest) =>
    api.post<ApiResponse<AttendanceResponse[]>>(`/schools/${schoolId}/attendance`, data).then((r) => r.data),

  getByClass: (schoolId: number, classRoomId: number, date: string) =>
    api.get<ApiResponse<AttendanceResponse[]>>(`/schools/${schoolId}/attendance/class/${classRoomId}`, {
      params: { date }
    }).then((r) => r.data),

  getByStudent: (schoolId: number, studentId: number, startDate: string, endDate: string) =>
    api.get<ApiResponse<AttendanceResponse[]>>(`/schools/${schoolId}/attendance/student/${studentId}`, {
      params: { startDate, endDate }
    }).then((r) => r.data),

  getStats: (schoolId: number, studentId: number, startDate: string, endDate: string) =>
    api.get<ApiResponse<AttendanceStats>>(`/schools/${schoolId}/attendance/student/${studentId}/stats`, {
      params: { startDate, endDate }
    }).then((r) => r.data),
};
