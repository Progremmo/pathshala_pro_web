import api from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  monthlyCollection: number;
  monthlyPending: number;
  todayAttendancePercentage: number;
  feeTrend: {
    month: string;
    collected: number;
    pending: number;
  }[];
  attendanceDistribution: {
    name: string;
    value: number;
    color: string;
  }[];
}

export const dashboardService = {
  getStats: (schoolId: number) =>
    api.get<ApiResponse<DashboardStats>>(`/schools/${schoolId}/dashboard/stats`).then((r) => r.data),
};
