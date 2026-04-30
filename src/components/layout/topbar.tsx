'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Bell, LogOut, Moon, Sun, Menu, Search, User } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth-store';
import { useUIStore } from '@/store/ui-store';
import { useUnreadCount, useMyNotifications, useMarkAsRead } from '@/hooks/use-communication';
import { getInitials } from '@/utils/format';
import { ROLE_LABELS } from '@/lib/constants';
import { getNotificationUrl } from '@/utils/get-notification-url';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';


export function Topbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { fullName, email, roles, schoolId, logout } = useAuthStore();
  const { setMobileSidebar } = useUIStore();
  const primaryRole = roles[0];

  const { data: unreadRes } = useUnreadCount(schoolId || 0);
  const { data: notificationsRes } = useMyNotifications(schoolId || 0, { page: 0, size: 5 });
  const { mutate: markAsRead } = useMarkAsRead();

  const unreadCount = unreadRes?.data?.unreadCount || 0;
  const recentNotifications = notificationsRes?.data?.content || [];

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead && schoolId) {
      markAsRead({ schoolId, notificationId: notification.id });
    }

    if (primaryRole) {
      const url = getNotificationUrl(notification, primaryRole);
      router.push(url);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-4 md:px-6">
      {/* Mobile menu */}
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileSidebar(true)}>
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search */}
      <div className="relative hidden flex-1 md:flex md:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search anything..."
          className="h-9 w-full bg-muted/50 pl-9 text-sm border-0 focus-visible:ring-1"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), "relative h-9 w-9 text-muted-foreground")}>
                <Bell className="h-[18px] w-[18px]" />
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-white ring-2 ring-background">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            }
          />
          <DropdownMenuContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b px-4 py-2.5">
              <span className="text-sm font-semibold">Notifications</span>
              {unreadCount > 0 && <Badge variant="secondary" className="text-[10px]">{unreadCount} new</Badge>}
            </div>
            <div className="max-h-[350px] overflow-y-auto">
              {recentNotifications.length > 0 ? (
                recentNotifications.map((n) => (
                  <DropdownMenuItem
                    key={n.id}
                    className={cn(
                      "flex flex-col items-start gap-1 border-b px-4 py-3 last:border-0 cursor-pointer",
                      !n.isRead && "bg-primary/5"
                    )}
                    onClick={() => handleNotificationClick(n)}
                  >
                    <div className="flex w-full items-start justify-between gap-2">
                      <span className={cn("text-xs font-semibold line-clamp-1", !n.isRead && "text-primary")}>
                        {n.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground/20 mb-2" />
                  <p className="text-xs text-muted-foreground">No new notifications</p>
                </div>
              )}
            </div>
            <DropdownMenuSeparator className="m-0" />
            <Button
              variant="ghost"
              className="w-full justify-center rounded-none py-2 text-xs font-medium text-primary hover:text-primary hover:bg-primary/5"
              onClick={() => router.push('/notifications')}
            >
              View all notifications
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className={cn(buttonVariants({ variant: 'ghost' }), "flex items-center gap-2 px-2 py-1.5 h-auto")}>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {fullName ? getInitials(fullName) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex md:flex-col md:items-start">
                  <span className="text-sm font-medium leading-none">{fullName}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {primaryRole ? ROLE_LABELS[primaryRole] : ''}
                  </span>
                </div>
              </button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-1.5 py-2">
              <div className="flex flex-col">
                <span className="text-sm font-medium">{fullName}</span>
                <span className="text-xs text-muted-foreground">{email}</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <User className="h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Badge variant="secondary" className="text-[10px]">
                {primaryRole ? ROLE_LABELS[primaryRole] : 'User'}
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2" variant="destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
