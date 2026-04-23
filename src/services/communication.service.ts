import api from '@/lib/axios';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';
import { Notification, NotificationRequest, Announcement, AnnouncementRequest } from '@/types/communication.types';

export const communicationService = {
  // Notifications
  sendNotification: (schoolId: number, data: NotificationRequest) =>
    api.post<ApiResponse<Notification>>(`/schools/${schoolId}/communication/notifications`, data).then((r) => r.data),

  getMyNotifications: (schoolId: number, params?: PaginationParams) =>
    api.get<ApiResponse<PaginatedResponse<Notification>>>(`/schools/${schoolId}/communication/notifications/my`, { params }).then((r) => r.data),

  getUnreadCount: (schoolId: number) =>
    api.get<ApiResponse<{ unreadCount: number }>>(`/schools/${schoolId}/communication/notifications/unread-count`).then((r) => r.data),

  markAsRead: (schoolId: number, notificationId: number) =>
    api.patch<ApiResponse<void>>(`/schools/${schoolId}/communication/notifications/${notificationId}/read`).then((r) => r.data),

  markAllAsRead: (schoolId: number) =>
    api.patch<ApiResponse<void>>(`/schools/${schoolId}/communication/notifications/mark-all-read`).then((r) => r.data),

  // Announcements
  createAnnouncement: (schoolId: number, data: AnnouncementRequest) =>
    api.post<ApiResponse<Announcement>>(`/schools/${schoolId}/communication/announcements`, data).then((r) => r.data),

  getAnnouncements: (schoolId: number, audience?: string, params?: PaginationParams) =>
    api.get<ApiResponse<PaginatedResponse<Announcement>>>(`/schools/${schoolId}/communication/announcements`, {
      params: { audience, ...params },
    }).then((r) => r.data),
};
