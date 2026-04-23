'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Video, BookOpen } from 'lucide-react';

const notes = [
  { id: 1, title: 'Chapter 5 - Quadratic Equations', type: 'PDF', subject: 'Mathematics', grade: '10' },
  { id: 2, title: 'Newton\'s Laws Video', type: 'VIDEO', subject: 'Physics', grade: '11' },
];
const icons: Record<string, React.ElementType> = { PDF: FileText, VIDEO: Video, LINK: BookOpen };

export default function TeacherNotes() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Notes" description="Upload and manage teaching resources">
        <Button className="gap-2"><Plus className="h-4 w-4" /> Upload</Button>
      </PageHeader>
      <div className="grid gap-4 sm:grid-cols-2">
        {notes.map((n) => {
          const Icon = icons[n.type] || FileText;
          return (
            <Card key={n.id} className="hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <CardContent className="flex items-start gap-3 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"><Icon className="h-5 w-5 text-primary" /></div>
                <div><p className="text-sm font-medium">{n.title}</p><p className="text-xs text-muted-foreground mt-1">{n.subject} • Grade {n.grade}</p>
                  <Badge variant="secondary" className="mt-2 text-[10px]">{n.type}</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
