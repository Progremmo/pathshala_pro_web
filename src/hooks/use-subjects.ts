import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectService } from '@/services/subject.service';
import { toast } from 'sonner';

export function useSubjects(schoolId: number) {
  return useQuery({
    queryKey: ['subjects', schoolId],
    queryFn: () => subjectService.getAll(schoolId),
    enabled: !!schoolId,
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, data }: { schoolId: number; data: any }) => subjectService.create(schoolId, data),
    onSuccess: (res, variables) => {
      toast.success('Subject created successfully');
      queryClient.invalidateQueries({ queryKey: ['subjects', variables.schoolId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create subject');
    },
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, subjectId, data }: { schoolId: number; subjectId: number; data: any }) => subjectService.update(schoolId, subjectId, data),
    onSuccess: (res, variables) => {
      toast.success('Subject updated successfully');
      queryClient.invalidateQueries({ queryKey: ['subjects', variables.schoolId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update subject');
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, subjectId }: { schoolId: number; subjectId: number }) => subjectService.delete(schoolId, subjectId),
    onSuccess: (res, variables) => {
      toast.success('Subject deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['subjects', variables.schoolId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete subject');
    },
  });
}
