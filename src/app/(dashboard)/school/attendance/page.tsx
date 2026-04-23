'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ATTENDANCE_STATUS_COLORS } from '@/lib/constants';

const records = [
  { student: 'Arjun Kumar', status: 'PRESENT', remarks: '' },
  { student: 'Priya Singh', status: 'ABSENT', remarks: 'Sick' },
  { student: 'Rahul Verma', status: 'LATE', remarks: '15 mins late' },
  { student: 'Sneha Patel', status: 'PRESENT', remarks: '' },
];

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" description="View and mark daily attendance" />
      <Card>
        <CardHeader><CardTitle className="text-base">Today&apos;s Attendance - Class 10-A</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {records.map((r, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border/50 p-3 hover:bg-accent/30 transition-colors">
              <span className="text-sm font-medium">{r.student}</span>
              <div className="flex items-center gap-2">
                {r.remarks && <span className="text-xs text-muted-foreground">{r.remarks}</span>}
                <Badge className={`text-[10px] ${ATTENDANCE_STATUS_COLORS[r.status] || ''}`}>{r.status}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
