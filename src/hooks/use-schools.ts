import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { schoolService } from '@/services/school.service';
import { SchoolRequest } from '@/types/school.types';
import { PaginationParams } from '@/types/api.types';
import { toast } from 'sonner';

export const schoolKeys = {
  all: ['schools'] as const,
  lists: () => [...schoolKeys.all, 'list'] as const,
  list: (params: PaginationParams) => [...schoolKeys.lists(), params] as const,
  details: () => [...schoolKeys.all, 'detail'] as const,
  detail: (id: number) => [...schoolKeys.details(), id] as const,
};

export function useSchools(params?: PaginationParams) {
  return useQuery({
    queryKey: schoolKeys.list(params || {}),
    queryFn: () => schoolService.getAll(params),
  });
}

export function useSchool(id: number) {
  return useQuery({
    queryKey: schoolKeys.detail(id),
    queryFn: () => schoolService.getById(id),
    enabled: !!id,
  });
}

export function useCreateSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SchoolRequest) => schoolService.create(data),
    onSuccess: () => {
      toast.success('School created successfully');
      queryClient.invalidateQueries({ queryKey: schoolKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create school');
    },
  });
}

export function useUpdateSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SchoolRequest }) => schoolService.update(id, data),
    onSuccess: (res, variables) => {
      toast.success('School updated successfully');
      queryClient.invalidateQueries({ queryKey: schoolKeys.lists() });
      queryClient.invalidateQueries({ queryKey: schoolKeys.detail(variables.id) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update school');
    },
  });
}

export function useDeleteSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => schoolService.delete(id),
    onSuccess: () => {
      toast.success('School deleted successfully');
      queryClient.invalidateQueries({ queryKey: schoolKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete school');
    },
  });
}

export function useClassrooms(schoolId: number) {
  return useQuery({
    queryKey: ['classrooms', schoolId],
    queryFn: () => schoolService.getClassrooms(schoolId),
    enabled: !!schoolId,
  });
}
