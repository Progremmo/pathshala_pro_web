'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DAYS_OF_WEEK } from '@/lib/constants';

const periods = [
  { day: 'MONDAY', period: 1, time: '09:00-09:45', subject: 'Mathematics', teacher: 'Priya Gupta' },
  { day: 'MONDAY', period: 2, time: '09:45-10:30', subject: 'Physics', teacher: 'Amit Sharma' },
  { day: 'TUESDAY', period: 1, time: '09:00-09:45', subject: 'English', teacher: 'Sneha Das' },
  { day: 'TUESDAY', period: 2, time: '09:45-10:30', subject: 'Chemistry', teacher: 'Raj Kumar' },
];

export default function TimetablePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Timetable" description="Weekly class schedule" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {DAYS_OF_WEEK.map((day) => {
          const dayPeriods = periods.filter((p) => p.day === day);
          return (
            <Card key={day}>
              <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold">{day}</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {dayPeriods.length > 0 ? dayPeriods.map((p, i) => (
                  <div key={i} className="rounded-lg border border-border/50 p-3">
                    <div className="flex justify-between"><span className="text-sm font-medium">{p.subject}</span><span className="text-xs text-muted-foreground">P{p.period}</span></div>
                    <p className="text-xs text-muted-foreground mt-1">{p.teacher} • {p.time}</p>
                  </div>
                )) : <p className="text-xs text-muted-foreground text-center py-4">No classes</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
