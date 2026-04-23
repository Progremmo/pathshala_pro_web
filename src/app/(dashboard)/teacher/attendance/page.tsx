'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ATTENDANCE_STATUS_COLORS } from '@/lib/constants';
import { Check, X, Clock } from 'lucide-react';

const students = [
  { id: 1, name: 'Arjun Kumar', admNo: 'DPS/2024/001' },
  { id: 2, name: 'Priya Singh', admNo: 'DPS/2024/002' },
  { id: 3, name: 'Rahul Verma', admNo: 'DPS/2024/003' },
  { id: 4, name: 'Sneha Patel', admNo: 'DPS/2024/004' },
];

export default function TeacherAttendance() {
  return (
    <div className="space-y-6">
      <PageHeader title="Mark Attendance" description="Select class and mark attendance" />
      <Card>
        <CardHeader><CardTitle className="text-base">Class 10-A — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {students.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
              <div><p className="text-sm font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.admNo}</p></div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="gap-1 text-emerald-500 hover:bg-emerald-500/10"><Check className="h-3 w-3" /> P</Button>
                <Button size="sm" variant="outline" className="gap-1 text-red-500 hover:bg-red-500/10"><X className="h-3 w-3" /> A</Button>
                <Button size="sm" variant="outline" className="gap-1 text-amber-500 hover:bg-amber-500/10"><Clock className="h-3 w-3" /> L</Button>
              </div>
            </div>
          ))}
          <Button className="w-full mt-4">Submit Attendance</Button>
        </CardContent>
      </Card>
    </div>
  );
}
