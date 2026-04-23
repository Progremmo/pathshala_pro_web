'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText } from 'lucide-react';

const results = [
  { exam: 'Mathematics - Unit Test 2', score: 42, total: 50, pct: 84, grade: 'A', type: 'UNIT_TEST' },
  { exam: 'Physics - Unit Test 2', score: 38, total: 50, pct: 76, grade: 'B+', type: 'UNIT_TEST' },
  { exam: 'English - Assignment 1', score: 28, total: 30, pct: 93, grade: 'A+', type: 'ASSIGNMENT' },
  { exam: 'Chemistry - Quiz 1', score: 16, total: 20, pct: 80, grade: 'A', type: 'QUIZ' },
];

export default function StudentResults() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Results" description="View your exam performance" />
      <Card>
        <CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/30">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Exam</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Score</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Percentage</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Grade</th>
          </tr></thead>
          <tbody>{results.map((r, i) => (
            <tr key={i} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
              <td className="px-4 py-3"><div className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /><div><p className="font-medium">{r.exam}</p><Badge variant="secondary" className="text-[9px] mt-0.5">{r.type.replace('_', ' ')}</Badge></div></div></td>
              <td className="px-4 py-3 font-semibold">{r.score}/{r.total}</td>
              <td className="px-4 py-3"><div className="flex items-center gap-2"><Progress value={r.pct} className="h-2 w-20" /><span className={`text-sm font-bold ${r.pct >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{r.pct}%</span></div></td>
              <td className="px-4 py-3"><Badge variant="outline" className="text-[10px]">{r.grade}</Badge></td>
            </tr>
          ))}</tbody>
        </table></div></CardContent>
      </Card>
    </div>
  );
}
