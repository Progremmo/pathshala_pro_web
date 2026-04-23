'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Video, BookOpen } from 'lucide-react';
const notes = [
  { id: 1, title: 'Chapter 5 - Quadratic Equations', type: 'PDF', subject: 'Mathematics' },
  { id: 2, title: 'Newton\'s Laws of Motion', type: 'VIDEO', subject: 'Physics' },
  { id: 3, title: 'Shakespeare - Merchant of Venice', type: 'PDF', subject: 'English' },
];
const icons: Record<string, React.ElementType> = { PDF: FileText, VIDEO: Video, LINK: BookOpen };
export default function StudentNotes() {
  return (
    <div className="space-y-6">
      <PageHeader title="Notes & Materials" description="Access your study materials" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((n) => { const Icon = icons[n.type] || FileText; return (
          <Card key={n.id} className="hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
            <CardContent className="flex items-start gap-3 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"><Icon className="h-5 w-5 text-primary" /></div>
              <div><p className="text-sm font-medium">{n.title}</p><p className="text-xs text-muted-foreground mt-1">{n.subject}</p>
                <Badge variant="secondary" className="mt-2 text-[10px]">{n.type}</Badge></div>
            </CardContent></Card>
        );})}
      </div>
    </div>
  );
}
