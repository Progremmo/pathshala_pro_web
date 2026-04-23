'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const teachers = [
  { id: 1, name: 'Priya Gupta', email: 'priya.gupta@dps.edu', qualification: 'M.Sc Physics', employeeId: 'EMP001' },
  { id: 2, name: 'Amit Sharma', email: 'amit.sharma@dps.edu', qualification: 'M.A English', employeeId: 'EMP002' },
];

export default function TeachersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Teachers" description="Manage teaching staff">
        <Button className="gap-2"><Plus className="h-4 w-4" /> Add Teacher</Button>
      </PageHeader>
      <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-sm">
        <thead><tr className="border-b bg-muted/30">
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Qualification</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
        </tr></thead>
        <tbody>{teachers.map((t) => (
          <tr key={t.id} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
            <td className="px-4 py-3 font-medium">{t.name}</td>
            <td className="px-4 py-3 text-muted-foreground">{t.email}</td>
            <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">{t.qualification}</Badge></td>
            <td className="px-4 py-3 font-mono text-xs">{t.employeeId}</td>
          </tr>
        ))}</tbody>
      </table></div></CardContent></Card>
    </div>
  );
}
