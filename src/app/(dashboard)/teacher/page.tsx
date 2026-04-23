'use client';

import { Calendar, UserCheck, BookOpen, Video, ClipboardList, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/shared/stat-card';
import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { useTeacherTimetable } from '@/hooks/use-timetable';
import { useUpcomingClasses } from '@/hooks/use-online-classes';
import Link from 'next/link';
import { format } from 'date-fns';

export default function TeacherDashboard() {
  const { fullName, schoolId, userId } = useAuthStore();
  const currentYear = new Date().getFullYear().toString() + '-' + (new Date().getFullYear() + 1).toString();
  const { data: timetableData, isLoading: isTimetableLoading } = useTeacherTimetable(schoolId || 0, userId || 0, currentYear);
  const { data: upcomingClassesData, isLoading: isClassesLoading } = useUpcomingClasses(schoolId || 0, 7);

  const todaySchedule = timetableData?.data || [];
  const upcomingClasses = upcomingClassesData?.data || [];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Good morning, ${fullName?.split(' ')[0] || 'Teacher'}`}
        description="Here's your schedule and pending tasks for today."
      />

      <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Classes Today" value={todaySchedule.length} subtitle="Scheduled" icon={Calendar}
          iconClassName="bg-gradient-to-br from-blue-500 to-cyan-500" />
        <StatCard title="Pending Attendance" value={0} subtitle="Classes to mark" icon={UserCheck}
          iconClassName="bg-gradient-to-br from-amber-500 to-orange-500" />
        <StatCard title="Notes Uploaded" value={18} subtitle="This semester" icon={BookOpen}
          iconClassName="bg-gradient-to-br from-emerald-500 to-teal-500" />
        <StatCard title="Upcoming Classes" value={upcomingClasses.length} subtitle="Online sessions" icon={Video}
          iconClassName="bg-gradient-to-br from-violet-500 to-purple-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Today&apos;s Timetable</CardTitle>
                <CardDescription>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</CardDescription>
              </div>
              <Link href="/teacher/timetable">
                <Button variant="ghost" size="sm">View Timetable</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {isTimetableLoading ? (
               <div className="flex justify-center p-4"><div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" /></div>
            ) : todaySchedule.length > 0 ? (
              todaySchedule.map((slot) => (
                <div key={slot.id} className="flex items-center gap-4 rounded-lg border border-border/50 p-3 hover:bg-accent/30 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    {format(new Date(`2000-01-01T${slot.startTime}`), 'hh:mm a')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Subject #{slot.subjectId}</p>
                    <p className="text-xs text-muted-foreground">Class #{slot.classRoomId} • {slot.dayOfWeek}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {format(new Date(`2000-01-01T${slot.startTime}`), 'HH:mm')} - {format(new Date(`2000-01-01T${slot.endTime}`), 'HH:mm')}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-lg">No classes scheduled for today</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pending Tasks</CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: 'Mark attendance for Class 10-A', type: 'Attendance', urgent: true, icon: UserCheck },
              { title: 'Mark attendance for Class 12-B', type: 'Attendance', urgent: true, icon: UserCheck },
              { title: 'Enter marks for Unit Test 2 - Maths', type: 'Marks', urgent: false, icon: ClipboardList },
              { title: 'Upload Chapter 7 notes', type: 'Notes', urgent: false, icon: BookOpen },
            ].map((task, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border/50 p-3 hover:bg-accent/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <task.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm">{task.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  {task.urgent && <Badge variant="destructive" className="text-[10px]">Urgent</Badge>}
                  <Badge variant="secondary" className="text-[10px]">{task.type}</Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2">View All Tasks</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
