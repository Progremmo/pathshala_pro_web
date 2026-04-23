'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, FileText, Video } from 'lucide-react';

const notes = [
  { id: 1, title: 'Chapter 5 - Quadratic Equations', subject: 'Mathematics', type: 'PDF', grade: '10', uploadedBy: 'Priya Gupta' },
  { id: 2, title: 'Newton\'s Laws of Motion', subject: 'Physics', type: 'VIDEO', grade: '11', uploadedBy: 'Amit Sharma' },
  { id: 3, title: 'Shakespeare - Merchant of Venice', subject: 'English', type: 'PDF', grade: '10', uploadedBy: 'Sneha Das' },
];

const typeIcons: Record<string, React.ElementType> = { PDF: FileText, VIDEO: Video, LINK: BookOpen, DOC: FileText };

export default function NotesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Notes & Content" description="Manage educational resources">
        <Button className="gap-2"><Plus className="h-4 w-4" /> Upload Notes</Button>
      </PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((n) => {
          const Icon = typeIcons[n.type] || FileText;
          return (
            <Card key={n.id} className="hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"><Icon className="h-5 w-5 text-primary" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{n.subject} • Grade {n.grade}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-[10px]">{n.type}</Badge>
                      <span className="text-[10px] text-muted-foreground">by {n.uploadedBy}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
