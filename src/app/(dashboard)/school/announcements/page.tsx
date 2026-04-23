'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Megaphone } from 'lucide-react';

const announcements = [
  { id: 1, title: 'School Annual Sports Day', content: 'Annual Sports Day will be held on 25th April 2026.', audience: 'ALL', pinned: true },
  { id: 2, title: 'Parent-Teacher Meeting', content: 'PTM scheduled for 30th April.', audience: 'PARENT', pinned: false },
  { id: 3, title: 'Mid-Term Exam Schedule', content: 'Mid-term exams start from May 12.', audience: 'STUDENT', pinned: false },
];

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Announcements" description="Manage school-wide announcements">
        <Button className="gap-2"><Plus className="h-4 w-4" /> New Announcement</Button>
      </PageHeader>
      <div className="space-y-3">
        {announcements.map((a) => (
          <Card key={a.id} className={a.pinned ? 'border-amber-500/30 bg-amber-500/5' : ''}>
            <CardContent className="flex items-start gap-4 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10"><Megaphone className="h-5 w-5 text-amber-500" /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{a.title}</p>
                  {a.pinned && <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-500">Pinned</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{a.content}</p>
              </div>
              <Badge variant="secondary" className="text-[10px] shrink-0">{a.audience}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
