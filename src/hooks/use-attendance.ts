import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceService } from '@/services/attendance.service';
import { AttendanceRequest } from '@/types/attendance.types';
import { toast } from 'sonner';

export const attendanceKeys = {
  all: ['attendance'] as const,
  class: (schoolId: number, classRoomId: number, date: string) => [...attendanceKeys.all, 'class', schoolId, classRoomId, date] as const,
  student: (schoolId: number, studentId: number) => [...attendanceKeys.all, 'student', schoolId, studentId] as const,
  studentStats: (schoolId: number, studentId: number) => [...attendanceKeys.all, 'stats', schoolId, studentId] as const,
};

export function useClassAttendance(schoolId: number, classRoomId: number, date: string) {
  return useQuery({
    queryKey: attendanceKeys.class(schoolId, classRoomId, date),
    queryFn: () => attendanceService.getClassAttendance(schoolId, classRoomId, date),
    enabled: !!schoolId && !!classRoomId && !!date,
  });
}

export function useStudentAttendance(schoolId: number, studentId: number, startDate: string, endDate: string) {
  return useQuery({
    queryKey: [...attendanceKeys.student(schoolId, studentId), { startDate, endDate }],
    queryFn: () => attendanceService.getStudentAttendance(schoolId, studentId, startDate, endDate),
    enabled: !!schoolId && !!studentId && !!startDate && !!endDate,
  });
}

export function useStudentAttendanceStats(schoolId: number, studentId: number, startDate: string, endDate: string) {
  return useQuery({
    queryKey: [...attendanceKeys.studentStats(schoolId, studentId), { startDate, endDate }],
    queryFn: () => attendanceService.getStudentStats(schoolId, studentId, startDate, endDate),
    enabled: !!schoolId && !!studentId && !!startDate && !!endDate,
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, data }: { schoolId: number; data: AttendanceRequest }) =>
      attendanceService.markBulk(schoolId, data),
    onSuccess: (res, variables) => {
      toast.success('Attendance marked successfully');
      queryClient.invalidateQueries({ queryKey: attendanceKeys.class(variables.schoolId, variables.data.classRoomId, variables.data.attendanceDate) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to mark attendance');
    },
  });
}
