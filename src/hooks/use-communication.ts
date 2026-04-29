import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communicationService } from '@/services/communication.service';
import { NotificationRequest, AnnouncementRequest } from '@/types/communication.types';
import { PaginationParams } from '@/types/api.types';
import { toast } from 'sonner';

export const communicationKeys = {
  all: ['communication'] as const,
  notifications: (schoolId: number, params?: PaginationParams) => [...communicationKeys.all, 'notifications', schoolId, params] as const,
  unreadCount: (schoolId: number) => [...communicationKeys.all, 'unreadCount', schoolId] as const,
  announcements: (schoolId: number, audience?: string, params?: PaginationParams) => [...communicationKeys.all, 'announcements', schoolId, audience, params] as const,
};

// --- Queries ---

export function useMyNotifications(schoolId: number, params?: PaginationParams) {
  return useQuery({
    queryKey: communicationKeys.notifications(schoolId, params),
    queryFn: () => communicationService.getMyNotifications(schoolId, params),
    enabled: !!schoolId,
  });
}

export function useUnreadCount(schoolId: number) {
  return useQuery({
    queryKey: communicationKeys.unreadCount(schoolId),
    queryFn: () => communicationService.getUnreadCount(schoolId),
    enabled: !!schoolId,
    refetchInterval: 60000, // Refetch every minute
  });
}

export function useAnnouncements(schoolId: number, audience?: string, params?: PaginationParams) {
  return useQuery({
    queryKey: communicationKeys.announcements(schoolId, audience, params),
    queryFn: () => communicationService.getAnnouncements(schoolId, audience, params),
    enabled: !!schoolId,
  });
}

// --- Mutations ---

export function useSendNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, data }: { schoolId: number; data: NotificationRequest }) =>
      communicationService.sendNotification(schoolId, data),
    onSuccess: (res, variables) => {
      toast.success('Notification sent successfully');
      // Invalidate if sending to self, but generally sending is to others
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to send notification');
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, notificationId }: { schoolId: number; notificationId: number }) =>
      communicationService.markAsRead(schoolId, notificationId),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: communicationKeys.notifications(variables.schoolId) });
      queryClient.invalidateQueries({ queryKey: communicationKeys.unreadCount(variables.schoolId) });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (schoolId: number) => communicationService.markAllAsRead(schoolId),
    onSuccess: (res, schoolId) => {
      queryClient.invalidateQueries({ queryKey: communicationKeys.notifications(schoolId) });
      queryClient.invalidateQueries({ queryKey: communicationKeys.unreadCount(schoolId) });
    },
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, data }: { schoolId: number; data: AnnouncementRequest }) =>
      communicationService.createAnnouncement(schoolId, data),
    onSuccess: (res, variables) => {
      toast.success('Announcement created successfully');
      queryClient.invalidateQueries({ queryKey: communicationKeys.all });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create announcement');
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, announcementId, data }: { schoolId: number; announcementId: number; data: AnnouncementRequest }) =>
      communicationService.updateAnnouncement(schoolId, announcementId, data),
    onSuccess: (res, variables) => {
      toast.success('Announcement updated successfully');
      queryClient.invalidateQueries({ queryKey: communicationKeys.all });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update announcement');
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, announcementId }: { schoolId: number; announcementId: number }) =>
      communicationService.deleteAnnouncement(schoolId, announcementId),
    onSuccess: (res, variables) => {
      toast.success('Announcement deleted successfully');
      queryClient.invalidateQueries({ queryKey: communicationKeys.all });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete announcement');
    },
  });
}
