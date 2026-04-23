'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ATTENDANCE_STATUS_COLORS } from '@/lib/constants';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useClassrooms } from '@/hooks/use-schools';
import { useClassAttendance } from '@/hooks/use-attendance';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

export default function AttendancePage() {
  const { schoolId } = useAuthStore();
  const [selectedClass, setSelectedClass] = useState<string>('');
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const { data: classroomsData } = useClassrooms(schoolId || 0);
  const classrooms = classroomsData?.data || [];
  
  const { data: attendanceData, isLoading } = useClassAttendance(
    schoolId || 0, 
    Number(selectedClass), 
    today
  );
  const records = attendanceData?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" description="View and mark daily attendance">
        <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-md border text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          {format(new Date(), 'MMMM dd, yyyy')}
        </div>
      </PageHeader>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:w-64">
          <Select value={selectedClass} onValueChange={(val) => setSelectedClass(val || '')}>
            <SelectTrigger>
              <SelectValue placeholder="Select Classroom" />
            </SelectTrigger>
            <SelectContent>
              {classrooms.map((c: any) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name} - {c.section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {selectedClass ? 'Students Attendance' : 'Please select a classroom'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 min-h-[200px]">
          {!selectedClass ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground italic">
              Select a classroom to view attendance
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground border border-dashed rounded-lg">
              No attendance records found for today.
            </div>
          ) : (
            records.map((r: any, i: number) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border/50 p-3 hover:bg-accent/30 transition-colors">
                <span className="text-sm font-medium">{r.studentName || `Student #${r.studentId}`}</span>
                <div className="flex items-center gap-2">
                  {r.remarks && <span className="text-xs text-muted-foreground">{r.remarks}</span>}
                  <Badge className={`text-[10px] ${ATTENDANCE_STATUS_COLORS[r.status] || ''}`}>
                    {r.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
