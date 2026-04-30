'use client';

import { useMyNotifications, useMarkAsRead, useMarkAllAsRead } from '@/hooks/use-communication';
import { useAuthStore } from '@/store/auth-store';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, CheckCircle2, Calendar, DollarSign, Megaphone, 
  UserCheck, BookOpen, AlertCircle, Trash2, ExternalLink,
  Inbox, Loader2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getNotificationUrl } from '@/utils/get-notification-url';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NotificationType } from '@/types/communication.types';

const TYPE_CONFIG: Record<NotificationType, { icon: any; color: string; bg: string }> = {
  ANNOUNCEMENT: { icon: Megaphone, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  FEE_REMINDER: { icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  EXAM_SCHEDULE: { icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ATTENDANCE_ALERT: { icon: UserCheck, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  RESULT_PUBLISHED: { icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  CLASS_SCHEDULED: { icon: Calendar, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  GENERAL: { icon: Bell, color: 'text-slate-500', bg: 'bg-slate-500/10' },
};

export default function NotificationsPage() {
  const router = useRouter();
  const { schoolId, roles } = useAuthStore();
  const primaryRole = roles[0];
  
  const { data: notificationsRes, isLoading } = useMyNotifications(schoolId || 0, { page: 0, size: 50 });
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();
  
  const notifications = notificationsRes?.data?.content || [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead && schoolId) {
      markAsRead({ schoolId, notificationId: notification.id });
    }
    
    if (primaryRole) {
      const url = getNotificationUrl(notification, primaryRole);
      router.push(url);
    }
  };

  const handleMarkAllRead = () => {
    if (schoolId) {
      markAllAsRead(schoolId);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Notifications" 
        description="Stay updated with school activities and alerts"
      >
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="gap-2">
            <CheckCircle2 className="h-4 w-4" /> Mark all as read
          </Button>
        )}
      </PageHeader>

      <div className="mx-auto max-w-4xl space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading your notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="grid gap-3">
            {notifications.map((n) => {
              const config = TYPE_CONFIG[n.notificationType] || TYPE_CONFIG.GENERAL;
              return (
                <Card 
                  key={n.id} 
                  className={cn(
                    "group relative overflow-hidden transition-all hover:shadow-md cursor-pointer border-l-4",
                    n.isRead ? "border-l-transparent opacity-80" : "border-l-primary bg-primary/5"
                  )}
                  onClick={() => handleNotificationClick(n)}
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex gap-4">
                      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", config.bg, config.color)}>
                        <config.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h3 className={cn("text-sm font-semibold", !n.isRead && "text-foreground")}>
                              {n.title}
                            </h3>
                            {!n.isRead && <Badge className="h-2 w-2 rounded-full p-0" />}
                          </div>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {n.message}
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                          <Badge variant="outline" className="text-[10px] py-0 h-5">
                            {n.notificationType.replace('_', ' ')}
                          </Badge>
                          <div className="flex items-center gap-1 text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            View details <ExternalLink className="h-2.5 w-2.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-2xl bg-muted/20">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Inbox className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-semibold">No notifications yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              When you receive alerts, announcements or reminders, they will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
