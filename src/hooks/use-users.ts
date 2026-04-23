import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { PaginationParams } from '@/types/api.types';

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
