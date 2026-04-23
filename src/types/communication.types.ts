export type NotificationType = 'ANNOUNCEMENT' | 'FEE_REMINDER' | 'EXAM_SCHEDULE' | 'ATTENDANCE_ALERT' | 'RESULT_PUBLISHED' | 'CLASS_SCHEDULED' | 'GENERAL';

// Matches NotificationRequest.java
export interface NotificationRequest {
  title: string;
  message: string;
  notificationType: NotificationType;
  recipientId?: number;
  scheduledAt?: string;
  referenceId?: number;
  referenceType?: string;
}

// Notification entity
export interface Notification {
  id: number;
  title: string;
  message: string;
  notificationType: NotificationType;
  isRead: boolean;
  readAt: string | null;
  scheduledAt: string | null;
  sentAt: string | null;
  isSent: boolean;
  referenceId: number | null;
  referenceType: string | null;
  schoolId: number;
  recipientId: number | null;
  senderId: number | null;
  createdAt: string;
}

// Matches AnnouncementRequest.java
export interface AnnouncementRequest {
  title: string;
  content: string;
  targetAudience?: string;
  targetGrade?: string;
  isPinned?: boolean;
  expiresAt?: string;
  attachmentUrl?: string;
}

// Announcement entity
export interface Announcement {
  id: number;
  title: string;
  content: string;
  targetAudience: string;
  targetGrade: string | null;
  isPinned: boolean;
  publishedAt: string | null;
  expiresAt: string | null;
  attachmentUrl: string | null;
  schoolId: number;
  createdByUser: number;
  createdAt: string;
}
