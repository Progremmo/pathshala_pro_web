'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Video, ExternalLink } from 'lucide-react';

const classes = [
  { id: 1, title: 'Quadratic Equations Live', subject: 'Mathematics', platform: 'GOOGLE_MEET', scheduledAt: '2026-04-24T10:00', status: 'SCHEDULED', teacher: 'Priya Gupta' },
  { id: 2, title: 'Physics Lab Demo', subject: 'Physics', platform: 'ZOOM', scheduledAt: '2026-04-25T14:00', status: 'SCHEDULED', teacher: 'Amit Sharma' },
];

export default function OnlineClassesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Online Classes" description="Schedule and manage virtual sessions">
        <Button className="gap-2"><Plus className="h-4 w-4" /> Schedule Class</Button>
      </PageHeader>
      <div className="space-y-3">
        {classes.map((c) => (
          <Card key={c.id} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10"><Video className="h-6 w-6 text-violet-500" /></div>
                <div>
                  <p className="text-sm font-medium">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.subject} • {c.teacher} • {new Date(c.scheduledAt).toLocaleString('en-IN')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px]">{c.platform.replace('_', ' ')}</Badge>
                <Badge variant="outline" className="text-[10px]">{c.status}</Badge>
                <Button size="sm" variant="outline" className="gap-1"><ExternalLink className="h-3 w-3" /> Join</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
