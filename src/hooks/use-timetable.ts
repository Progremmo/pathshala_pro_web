import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timetableService } from '@/services/timetable.service';
import { TimetableRequest } from '@/types/timetable.types';
import { toast } from 'sonner';

export const timetableKeys = {
  all: ['timetable'] as const,
  class: (schoolId: number, classId: number, academicYear: string) => [...timetableKeys.all, 'class', schoolId, classId, academicYear] as const,
  teacher: (schoolId: number, teacherId: number, academicYear: string) => [...timetableKeys.all, 'teacher', schoolId, teacherId, academicYear] as const,
};

export function useClassTimetable(schoolId: number, classId: number, academicYear: string) {
  return useQuery({
    queryKey: timetableKeys.class(schoolId, classId, academicYear),
    queryFn: () => timetableService.getByClass(schoolId, classId, academicYear),
    enabled: !!schoolId && !!classId && !!academicYear,
  });
}

export function useTeacherTimetable(schoolId: number, teacherId: number, academicYear: string) {
  return useQuery({
    queryKey: timetableKeys.teacher(schoolId, teacherId, academicYear),
    queryFn: () => timetableService.getByTeacher(schoolId, teacherId, academicYear),
    enabled: !!schoolId && !!teacherId && !!academicYear,
  });
}

export function useCreateTimetable(schoolId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TimetableRequest) => timetableService.create(schoolId, data),
    onSuccess: () => {
      toast.success('Timetable entry created');
      queryClient.invalidateQueries({ queryKey: timetableKeys.all });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create timetable entry');
    },
  });
}

export function useUpdateTimetable(schoolId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TimetableRequest }) => 
      timetableService.update(schoolId, id, data),
    onSuccess: () => {
      toast.success('Timetable updated');
      queryClient.invalidateQueries({ queryKey: timetableKeys.all });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update timetable');
    },
  });
}

export function useDeleteTimetable(schoolId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => timetableService.delete(schoolId, id),
    onSuccess: () => {
      toast.success('Timetable entry deleted');
      queryClient.invalidateQueries({ queryKey: timetableKeys.all });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete timetable entry');
    },
  });
}
