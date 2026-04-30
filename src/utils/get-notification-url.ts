import { Notification } from '@/types/communication.types';
import { ROLE_ROUTES } from '@/lib/constants';

/**
 * Returns the target URL for a notification based on its type and the user's role.
 */
export function getNotificationUrl(notification: Notification, primaryRole: keyof typeof ROLE_ROUTES): string {
  const prefix = ROLE_ROUTES[primaryRole] || '';
  
  switch (notification.notificationType) {
    case 'FEE_REMINDER':
      return `${prefix}/fees`;
    case 'EXAM_SCHEDULE':
    case 'RESULT_PUBLISHED':
      return `${prefix}/exams`;
    case 'ATTENDANCE_ALERT':
      return `${prefix}/attendance`;
    case 'CLASS_SCHEDULED':
      return `${prefix}/online-classes`;
    case 'ANNOUNCEMENT':
      return `${prefix}/announcements`;
    case 'GENERAL':
    default:
      return `${prefix}`;
  }
}
