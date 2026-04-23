'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const students = [
  { id: 1, name: 'Arjun Kumar', admissionNo: 'DPS/2024/001', class: 'Class 10-A', gender: 'Male' },
  { id: 2, name: 'Priya Singh', admissionNo: 'DPS/2024/002', class: 'Class 10-A', gender: 'Female' },
  { id: 3, name: 'Rahul Verma', admissionNo: 'DPS/2024/003', class: 'Class 10-B', gender: 'Male' },
];

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Students" description="Manage enrolled students">
        <Button className="gap-2"><Plus className="h-4 w-4" /> Add Student</Button>
      </PageHeader>
      <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-sm">
        <thead><tr className="border-b bg-muted/30">
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Admission No.</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Class</th>
          <th className="px-4 py-3 text-left font-medium text-muted-foreground">Gender</th>
        </tr></thead>
        <tbody>{students.map((s) => (
          <tr key={s.id} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
            <td className="px-4 py-3 font-medium">{s.name}</td>
            <td className="px-4 py-3 font-mono text-xs">{s.admissionNo}</td>
            <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">{s.class}</Badge></td>
            <td className="px-4 py-3 text-muted-foreground">{s.gender}</td>
          </tr>
        ))}</tbody>
      </table></div></CardContent></Card>
    </div>
  );
}
