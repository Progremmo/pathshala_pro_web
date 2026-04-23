'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DAYS_OF_WEEK } from '@/lib/constants';
const schedule = [
  { day: 'MONDAY', period: 1, time: '09:00-09:45', subject: 'Mathematics', teacher: 'Priya Gupta' },
  { day: 'MONDAY', period: 2, time: '09:45-10:30', subject: 'Physics', teacher: 'Amit Sharma' },
  { day: 'TUESDAY', period: 1, time: '09:00-09:45', subject: 'English', teacher: 'Sneha Das' },
];
export default function StudentTimetable() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Timetable" description="Weekly class schedule" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {DAYS_OF_WEEK.map((day) => {
          const slots = schedule.filter((s) => s.day === day);
          return (<Card key={day}>
            <CardHeader className="pb-3"><CardTitle className="text-sm">{day}</CardTitle></CardHeader>
            <CardContent className="space-y-2">{slots.length > 0 ? slots.map((s, i) => (
              <div key={i} className="rounded-lg border border-border/50 p-3">
                <div className="flex justify-between"><span className="text-sm font-medium">{s.subject}</span><span className="text-xs text-muted-foreground">P{s.period}</span></div>
                <p className="text-xs text-muted-foreground mt-1">{s.teacher} • {s.time}</p>
              </div>
            )) : <p className="text-xs text-muted-foreground text-center py-4">No classes</p>}</CardContent>
          </Card>);
        })}
      </div>
    </div>
  );
}
