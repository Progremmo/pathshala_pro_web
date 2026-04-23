import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timetableService } from '@/services/timetable.service';
import { TimetableRequest } from '@/types/timetable.types';
import { toast } from 'sonner';

export const timetableKeys = {
  all: ['timetable'] as const,
  class: (schoolId: number, classRoomId: number, academicYear: string) => [...timetableKeys.all, 'class', schoolId, classRoomId, academicYear] as const,
  teacher: (schoolId: number, teacherId: number, academicYear: string) => [...timetableKeys.all, 'teacher', schoolId, teacherId, academicYear] as const,
};

export function useClassTimetable(schoolId: number, classRoomId: number, academicYear: string) {
  return useQuery({
    queryKey: timetableKeys.class(schoolId, classRoomId, academicYear),
    queryFn: () => timetableService.getClassTimetable(schoolId, classRoomId, academicYear),
    enabled: !!schoolId && !!classRoomId && !!academicYear,
  });
}

export function useTeacherTimetable(schoolId: number, teacherId: number, academicYear: string) {
  return useQuery({
    queryKey: timetableKeys.teacher(schoolId, teacherId, academicYear),
    queryFn: () => timetableService.getTeacherTimetable(schoolId, teacherId, academicYear),
    enabled: !!schoolId && !!teacherId && !!academicYear,
  });
}

export function useCreateTimetable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, data }: { schoolId: number; data: TimetableRequest }) =>
      timetableService.create(schoolId, data),
    onSuccess: (res, variables) => {
      toast.success('Timetable entry created successfully');
      queryClient.invalidateQueries({ queryKey: timetableKeys.class(variables.schoolId, variables.data.classRoomId, variables.data.academicYear) });
      queryClient.invalidateQueries({ queryKey: timetableKeys.teacher(variables.schoolId, variables.data.teacherId, variables.data.academicYear) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create timetable entry');
    },
  });
}

export function useUpdateTimetable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, entryId, data }: { schoolId: number; entryId: number; data: TimetableRequest }) =>
      timetableService.update(schoolId, entryId, data),
    onSuccess: (res, variables) => {
      toast.success('Timetable entry updated successfully');
      queryClient.invalidateQueries({ queryKey: timetableKeys.class(variables.schoolId, variables.data.classRoomId, variables.data.academicYear) });
      queryClient.invalidateQueries({ queryKey: timetableKeys.teacher(variables.schoolId, variables.data.teacherId, variables.data.academicYear) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update timetable entry');
    },
  });
}

export function useDeleteTimetable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, entryId, classRoomId, teacherId, academicYear }: { schoolId: number; entryId: number; classRoomId: number; teacherId: number; academicYear: string }) =>
      timetableService.delete(schoolId, entryId),
    onSuccess: (res, variables) => {
      toast.success('Timetable entry deleted successfully');
      queryClient.invalidateQueries({ queryKey: timetableKeys.class(variables.schoolId, variables.classRoomId, variables.academicYear) });
      queryClient.invalidateQueries({ queryKey: timetableKeys.teacher(variables.schoolId, variables.teacherId, variables.academicYear) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete timetable entry');
    },
  });
}
