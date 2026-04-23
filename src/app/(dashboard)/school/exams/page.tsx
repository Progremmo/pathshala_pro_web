'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EXAM_TYPE_LABELS } from '@/lib/constants';

const exams = [
  { id: 1, name: 'Mathematics - Unit Test 1', type: 'UNIT_TEST', date: '2024-05-20', totalMarks: 50, published: true },
  { id: 2, name: 'Physics - Mid Term', type: 'MID_TERM', date: '2024-06-15', totalMarks: 100, published: false },
];

export default function ExamsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Exams" description="Create and manage examinations">
        <Button className="gap-2"><Plus className="h-4 w-4" /> Create Exam</Button>
      </PageHeader>
      <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-sm">
        <thead><tr className="border-b bg-muted/30">
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Exam</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Marks</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
        </tr></thead>
        <tbody>{exams.map((e) => (
          <tr key={e.id} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
            <td className="px-4 py-3 font-medium">{e.name}</td>
            <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">{EXAM_TYPE_LABELS[e.type]}</Badge></td>
            <td className="px-4 py-3 text-muted-foreground">{e.date}</td>
            <td className="px-4 py-3">{e.totalMarks}</td>
            <td className="px-4 py-3"><Badge variant={e.published ? 'default' : 'outline'} className="text-[10px]">{e.published ? 'Published' : 'Draft'}</Badge></td>
          </tr>
        ))}</tbody>
      </table></div></CardContent></Card>
    </div>
  );
}
