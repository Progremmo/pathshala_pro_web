'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, ClipboardList } from 'lucide-react';

const exams = [
  { id: 1, name: 'Unit Test 2 - Mathematics', class: 'Class 10-A', date: '2026-04-15', marks: 50, status: 'MARKS_PENDING' },
  { id: 2, name: 'Quiz 3 - Physics', class: 'Class 12-B', date: '2026-04-20', marks: 20, status: 'COMPLETED' },
];

export default function TeacherExams() {
  return (
    <div className="space-y-6">
      <PageHeader title="Exams & Marks" description="Enter marks and manage examinations" />
      <div className="space-y-3">
        {exams.map((e) => (
          <Card key={e.id}>
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><ClipboardList className="h-5 w-5 text-primary" /></div>
                <div><p className="text-sm font-medium">{e.name}</p><p className="text-xs text-muted-foreground">{e.class} • {e.date} • {e.marks} marks</p></div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={e.status === 'COMPLETED' ? 'default' : 'destructive'} className="text-[10px]">{e.status.replace('_', ' ')}</Badge>
                {e.status === 'MARKS_PENDING' && <Button size="sm">Enter Marks</Button>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
