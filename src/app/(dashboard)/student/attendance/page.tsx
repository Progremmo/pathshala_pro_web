'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ATTENDANCE_STATUS_COLORS } from '@/lib/constants';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const stats = [
  { name: 'Present', value: 22, color: '#10b981' },
  { name: 'Absent', value: 2, color: '#ef4444' },
  { name: 'Late', value: 1, color: '#f59e0b' },
];
const recent = [
  { date: '2026-04-23', status: 'PRESENT' }, { date: '2026-04-22', status: 'PRESENT' },
  { date: '2026-04-21', status: 'ABSENT' }, { date: '2026-04-20', status: 'LATE' },
  { date: '2026-04-19', status: 'PRESENT' },
];

export default function StudentAttendance() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Attendance" description="View your attendance record" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">This Month</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart><Pie data={stats} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value">
                {stats.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie></PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">{stats.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} /><span className="text-xs text-muted-foreground">{s.name} ({s.value})</span></div>
            ))}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Records</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {recent.map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                <span className="text-sm">{r.date}</span>
                <Badge className={`text-[10px] ${ATTENDANCE_STATUS_COLORS[r.status] || ''}`}>{r.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
