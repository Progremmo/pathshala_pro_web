'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Megaphone } from 'lucide-react';

import { useAnnouncements } from '@/hooks/use-communication';
import { useAuthStore } from '@/store/auth-store';
import { Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function AnnouncementsPage() {
  const { schoolId } = useAuthStore();
  const { data, isLoading } = useAnnouncements(schoolId || 0, undefined, { page: 0, size: 50 });
  const announcements = data?.data?.content || [];

  return (
    <div className="space-y-6">
      <PageHeader title="Announcements" description="Manage school-wide announcements">
        <Button className="gap-2"><Plus className="h-4 w-4" /> New Announcement</Button>
      </PageHeader>
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground border border-dashed rounded-lg">
            No announcements found.
          </div>
        ) : (
          announcements.map((a) => (
            <Card key={a.id} className={a.isPinned ? 'border-amber-500/30 bg-amber-500/5' : ''}>
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                  <Megaphone className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{a.title}</p>
                    {a.isPinned && (
                      <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-500">
                        Pinned
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{a.content}</p>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    {a.createdAt ? formatDistanceToNow(new Date(a.createdAt), { addSuffix: true }) : ''}
                  </p>
                </div>
                <Badge variant="secondary" className="text-[10px] shrink-0 uppercase">
                  {a.targetAudience}
                </Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
