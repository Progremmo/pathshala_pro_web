import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { PaginationParams } from '@/types/api.types';
import { toast } from 'sonner';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: any) => [...userKeys.lists(), params] as const,
};

export function useUsers(params?: PaginationParams & { schoolId?: number; role?: string }) {
  return useQuery({
    queryKey: userKeys.list(params || {}),
    queryFn: () => userService.getAll(params),
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) => 
      userService.toggleStatus(id, active),
    onSuccess: (res) => {
      toast.success(`User ${res.data.isActive ? 'activated' : 'deactivated'} successfully`);
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update user status');
    },
  });
}
