import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { attendanceService } from '@/services/attendance.service';
import { AttendanceRequest } from '@/types/attendance.types';
import { toast } from 'sonner';

export const attendanceKeys = {
  all: ['attendance'] as const,
  class: (schoolId: number, classId: number, date: string) => [...attendanceKeys.all, 'class', schoolId, classId, date] as const,
  student: (schoolId: number, studentId: number) => [...attendanceKeys.all, 'student', schoolId, studentId] as const,
  stats: (schoolId: number, studentId: number) => [...attendanceKeys.all, 'stats', schoolId, studentId] as const,
};

export function useMarkAttendance(schoolId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AttendanceRequest) => attendanceService.mark(schoolId, data),
    onSuccess: () => {
      toast.success('Attendance marked successfully');
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to mark attendance');
    },
  });
}

export function useClassAttendance(schoolId: number, classId: number, date: string) {
  return useQuery({
    queryKey: attendanceKeys.class(schoolId, classId, date),
    queryFn: () => attendanceService.getByClass(schoolId, classId, date),
    enabled: !!schoolId && !!classId && !!date,
  });
}

export function useStudentAttendance(schoolId: number, studentId: number, startDate: string, endDate: string) {
  return useQuery({
    queryKey: [...attendanceKeys.student(schoolId, studentId), startDate, endDate],
    queryFn: () => attendanceService.getByStudent(schoolId, studentId, startDate, endDate),
    enabled: !!schoolId && !!studentId && !!startDate && !!endDate,
  });
}

export function useAttendanceStats(schoolId: number, studentId: number, startDate: string, endDate: string) {
  return useQuery({
    queryKey: [...attendanceKeys.stats(schoolId, studentId), startDate, endDate],
    queryFn: () => attendanceService.getStats(schoolId, studentId, startDate, endDate),
    enabled: !!schoolId && !!studentId && !!startDate && !!endDate,
  });
}

export const useStudentAttendanceStats = useAttendanceStats;
