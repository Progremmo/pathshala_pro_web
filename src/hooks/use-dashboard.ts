import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: (schoolId: number) => [...dashboardKeys.all, 'stats', schoolId] as const,
  teacherStats: (schoolId: number, teacherId: number) => [...dashboardKeys.all, 'teacher-stats', schoolId, teacherId] as const,
};

export function useDashboardStats(schoolId: number) {
  return useQuery({
    queryKey: dashboardKeys.stats(schoolId),
    queryFn: () => dashboardService.getStats(schoolId),
    enabled: !!schoolId,
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
}

export function useTeacherDashboardStats(schoolId: number, teacherId: number) {
  return useQuery({
    queryKey: dashboardKeys.teacherStats(schoolId, teacherId),
    queryFn: () => dashboardService.getTeacherStats(schoolId, teacherId),
    enabled: !!schoolId && !!teacherId,
    refetchInterval: 1000 * 60 * 5,
  });
}
