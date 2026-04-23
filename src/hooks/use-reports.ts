import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/services/report.service';

export const reportKeys = {
  all: ['reports'] as const,
  studentPerformance: (schoolId: number, studentId: number) => [...reportKeys.all, 'student-performance', schoolId, studentId] as const,
  fees: (schoolId: number, year: number) => [...reportKeys.all, 'fees', schoolId, year] as const,
  classAttendance: (schoolId: number, classRoomId: number) => [...reportKeys.all, 'class-attendance', schoolId, classRoomId] as const,
};

export function useStudentPerformanceReport(
  schoolId: number,
  studentId: number,
  classRoomId: number,
  academicYear: string,
  startDate: string,
  endDate: string
) {
  return useQuery({
    queryKey: [...reportKeys.studentPerformance(schoolId, studentId), { classRoomId, academicYear, startDate, endDate }],
    queryFn: () => reportService.getStudentPerformance(schoolId, studentId, classRoomId, academicYear, startDate, endDate),
    enabled: !!schoolId && !!studentId && !!classRoomId && !!academicYear && !!startDate && !!endDate,
  });
}

export function useFeeReport(schoolId: number, year: number) {
  return useQuery({
    queryKey: reportKeys.fees(schoolId, year),
    queryFn: () => reportService.getFeeReport(schoolId, year),
    enabled: !!schoolId && !!year,
  });
}

export function useClassAttendanceReport(schoolId: number, classRoomId: number, startDate: string, endDate: string) {
  return useQuery({
    queryKey: [...reportKeys.classAttendance(schoolId, classRoomId), { startDate, endDate }],
    queryFn: () => reportService.getClassAttendanceReport(schoolId, classRoomId, startDate, endDate),
    enabled: !!schoolId && !!classRoomId && !!startDate && !!endDate,
  });
}
