import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { onlineClassService } from '@/services/online-class.service';
import { OnlineClassRequest } from '@/types/online-class.types';
import { PaginationParams } from '@/types/api.types';
import { toast } from 'sonner';

export const onlineClassKeys = {
  all: ['online-classes'] as const,
  lists: (schoolId: number) => [...onlineClassKeys.all, 'list', schoolId] as const,
  list: (schoolId: number, params?: PaginationParams) => [...onlineClassKeys.lists(schoolId), params] as const,
  upcoming: (schoolId: number, days?: number) => [...onlineClassKeys.all, 'upcoming', schoolId, days] as const,
};

export function useOnlineClasses(schoolId: number, params?: PaginationParams) {
  return useQuery({
    queryKey: onlineClassKeys.list(schoolId, params),
    queryFn: () => onlineClassService.getAll(schoolId, params),
    enabled: !!schoolId,
  });
}

export function useUpcomingClasses(schoolId: number, days: number = 7) {
  return useQuery({
    queryKey: onlineClassKeys.upcoming(schoolId, days),
    queryFn: () => onlineClassService.getUpcoming(schoolId, days),
    enabled: !!schoolId,
  });
}

export function useScheduleClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, data }: { schoolId: number; data: OnlineClassRequest }) =>
      onlineClassService.schedule(schoolId, data),
    onSuccess: (res, variables) => {
      toast.success('Online class scheduled successfully');
      queryClient.invalidateQueries({ queryKey: onlineClassKeys.lists(variables.schoolId) });
      queryClient.invalidateQueries({ queryKey: onlineClassKeys.upcoming(variables.schoolId) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to schedule class');
    },
  });
}

export function useUpdateClassStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, classId, status }: { schoolId: number; classId: number; status: string }) =>
      onlineClassService.updateStatus(schoolId, classId, status),
    onSuccess: (res, variables) => {
      toast.success('Class status updated');
      queryClient.invalidateQueries({ queryKey: onlineClassKeys.lists(variables.schoolId) });
      queryClient.invalidateQueries({ queryKey: onlineClassKeys.upcoming(variables.schoolId) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update class status');
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, classId }: { schoolId: number; classId: number }) =>
      onlineClassService.delete(schoolId, classId),
    onSuccess: (res, variables) => {
      toast.success('Class deleted successfully');
      queryClient.invalidateQueries({ queryKey: onlineClassKeys.lists(variables.schoolId) });
      queryClient.invalidateQueries({ queryKey: onlineClassKeys.upcoming(variables.schoolId) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete class');
    },
  });
}
