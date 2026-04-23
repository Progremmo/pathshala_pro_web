'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DAYS_OF_WEEK } from '@/lib/constants';
import { Clock } from 'lucide-react';

const schedule = [
  { day: 'MONDAY', period: 1, time: '09:00-09:45', subject: 'Mathematics', class: 'Class 10-A' },
  { day: 'MONDAY', period: 2, time: '09:45-10:30', subject: 'Physics', class: 'Class 12-B' },
  { day: 'TUESDAY', period: 1, time: '09:00-09:45', subject: 'Mathematics', class: 'Class 11-A' },
  { day: 'WEDNESDAY', period: 1, time: '09:00-09:45', subject: 'Physics', class: 'Class 10-B' },
];

export default function TeacherTimetable() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Timetable" description="Your weekly class schedule" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {DAYS_OF_WEEK.map((day) => {
          const daySlots = schedule.filter((s) => s.day === day);
          return (
            <Card key={day}>
              <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold">{day}</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {daySlots.length > 0 ? daySlots.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">P{s.period}</div>
                    <div className="flex-1"><p className="text-sm font-medium">{s.subject}</p><p className="text-xs text-muted-foreground">{s.class}</p></div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{s.time}</span>
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
