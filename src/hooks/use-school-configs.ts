import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { configService } from '@/services/config.service';
import { toast } from 'sonner';

export const configKeys = {
  all: ['configs'] as const,
  school: (schoolId: number) => [...configKeys.all, schoolId] as const,
};

export function useSchoolConfigs(schoolId: number) {
  return useQuery({
    queryKey: configKeys.school(schoolId),
    queryFn: () => configService.getConfigs(schoolId),
    enabled: !!schoolId,
    select: (res) => {
      const data = res.data || {};
      return {
        ACADEMIC_YEARS: JSON.parse(data.ACADEMIC_YEARS || '[]') as string[],
        FEE_TYPES: JSON.parse(data.FEE_TYPES || '[]') as string[],
        FEE_FREQUENCIES: JSON.parse(data.FEE_FREQUENCIES || '[]') as string[],
        EXAM_TYPES: JSON.parse(data.EXAM_TYPES || '{}') as Record<string, string>,
      };
    }
  });
}

export function useUpdateSchoolConfigs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, configs }: { schoolId: number; configs: Record<string, string> }) => 
      configService.updateConfigs(schoolId, configs),
    onSuccess: (res, variables) => {
      toast.success('Settings updated successfully');
      queryClient.invalidateQueries({ queryKey: configKeys.school(variables.schoolId) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update settings');
    },
  });
}
