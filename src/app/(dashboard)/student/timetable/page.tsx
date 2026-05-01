'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DAYS_OF_WEEK } from '@/lib/constants';
import { useAuthStore } from '@/store/auth-store';
import { useClassTimetable } from '@/hooks/use-timetable';
import { Loader2, Clock, User } from 'lucide-react';

export default function StudentTimetable() {
  const { schoolId, classRoomId } = useAuthStore();
  
  const { data: timetableResponse, isLoading } = useClassTimetable(
    schoolId!, 
    classRoomId!, 
    '2024-25'
  );
  
  const schedule = timetableResponse?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader title="My Timetable" description="Weekly class schedule and timings" />
      
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {DAYS_OF_WEEK.map((day) => {
            const slots = schedule
              .filter((s) => s.dayOfWeek === day)
              .sort((a, b) => a.periodNumber - b.periodNumber);
              
            return (
              <Card key={day} className="h-full">
                <CardHeader className="pb-3 border-b bg-muted/20">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider">{day}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  {slots.length > 0 ? (
                    slots.map((s) => (
                      <div key={s.id} className="rounded-lg border border-border/50 p-3 bg-card hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-bold text-primary">{s.subjectName}</span>
                          <span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                            Period {s.periodNumber}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center text-[11px] text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {s.startTime} - {s.endTime}
                          </div>
                          <div className="flex items-center text-[11px] text-muted-foreground">
                            <User className="h-3 w-3 mr-1" />
                            {s.teacherName}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground italic">
                      <p className="text-xs">No classes scheduled</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
