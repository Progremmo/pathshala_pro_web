import api from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';

export const reportService = {
  getStudentPerformance: (
    schoolId: number,
    studentId: number,
    classRoomId: number,
    academicYear: string,
    startDate: string,
    endDate: string
  ) =>
    api.get<ApiResponse<Record<string, unknown>>>(`/schools/${schoolId}/reports/student/${studentId}/performance`, {
      params: { classRoomId, academicYear, startDate, endDate },
    }).then((r) => r.data),

  getFeeReport: (schoolId: number, year: number) =>
    api.get<ApiResponse<Record<string, unknown>>>(`/schools/${schoolId}/reports/fees`, {
      params: { year },
    }).then((r) => r.data),

  getClassAttendanceReport: (schoolId: number, classRoomId: number, startDate: string, endDate: string) =>
    api.get<ApiResponse<Record<string, unknown>>>(`/schools/${schoolId}/reports/attendance/class/${classRoomId}`, {
      params: { startDate, endDate },
    }).then((r) => r.data),
};
