import api from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { Attendance, AttendanceRequest, AttendanceStats } from '@/types/attendance.types';

export const attendanceService = {
  markBulk: (schoolId: number, data: AttendanceRequest) =>
    api.post<ApiResponse<Attendance[]>>(`/schools/${schoolId}/attendance`, data).then((r) => r.data),

  getClassAttendance: (schoolId: number, classRoomId: number, date: string) =>
    api.get<ApiResponse<Attendance[]>>(`/schools/${schoolId}/attendance/class/${classRoomId}`, {
      params: { date },
    }).then((r) => r.data),

  getStudentAttendance: (schoolId: number, studentId: number, startDate: string, endDate: string) =>
    api.get<ApiResponse<Attendance[]>>(`/schools/${schoolId}/attendance/student/${studentId}`, {
      params: { startDate, endDate },
    }).then((r) => r.data),

  getStudentStats: (schoolId: number, studentId: number, startDate: string, endDate: string) =>
    api.get<ApiResponse<AttendanceStats>>(`/schools/${schoolId}/attendance/student/${studentId}/stats`, {
      params: { startDate, endDate },
    }).then((r) => r.data),
};
