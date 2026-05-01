'use client';
import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, X, Clock, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useClassrooms } from '@/hooks/use-schools';
import { useClassStudents } from '@/hooks/use-users';
import { useMarkAttendance } from '@/hooks/use-attendance';
import { AttendanceStatus, StudentAttendance } from '@/types/attendance.types';
import { format } from 'date-fns';

export default function TeacherAttendance() {
  const { schoolId } = useAuthStore();
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [attendanceData, setAttendanceData] = useState<Record<number, AttendanceStatus>>({});

  const { data: classrooms, isLoading: loadingClasses } = useClassrooms(schoolId!);
  const { data: studentsResponse, isLoading: loadingStudents } = useClassStudents(Number(selectedClassId));
  const students = studentsResponse?.data || [];

  const markAttendance = useMarkAttendance(schoolId!);

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = () => {
    if (!selectedClassId || students.length === 0) return;

    const records: StudentAttendance[] = students.map(s => ({
      studentId: s.id,
      status: attendanceData[s.id] || 'PRESENT', // Default to Present if not marked
    }));

    markAttendance.mutate({
      classRoomId: Number(selectedClassId),
      attendanceDate: format(new Date(), 'yyyy-MM-dd'),
      records
    });
  };

  const selectedClass = classrooms?.data?.find(c => c.id.toString() === selectedClassId);

  return (
    <div className="space-y-6">
      <PageHeader title="Mark Attendance" description="Select class and mark daily attendance" />
      
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Select Class</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedClassId} onValueChange={(val) => setSelectedClassId(val || '')}>
              <SelectTrigger>
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classrooms?.data?.map((c: any) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.name} - {c.section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">
              {selectedClass ? `${selectedClass.name}-${selectedClass.section}` : 'Select a class to view students'}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                — {format(new Date(), 'EEEE, do MMMM')}
              </span>
            </CardTitle>
            {selectedClass && (
              <Button 
                onClick={handleSubmit} 
                disabled={markAttendance.isPending || students.length === 0}
                size="sm"
              >
                {markAttendance.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Attendance
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {loadingStudents ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : students.length > 0 ? (
              students.map((s) => {
                const currentStatus = attendanceData[s.id] || 'PRESENT';
                return (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border border-border/50 p-3 hover:bg-accent/5 transition-colors">
                    <div>
                      <p className="text-sm font-medium">{s.fullName}</p>
                      <p className="text-xs text-muted-foreground">{s.admissionNo || 'N/A'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant={currentStatus === 'PRESENT' ? 'default' : 'outline'}
                        className={currentStatus === 'PRESENT' ? 'bg-emerald-500 hover:bg-emerald-600' : 'text-emerald-500 hover:bg-emerald-500/10'}
                        onClick={() => handleStatusChange(s.id, 'PRESENT')}
                      >
                        <Check className="h-3 w-3 mr-1" /> P
                      </Button>
                      <Button 
                        size="sm" 
                        variant={currentStatus === 'ABSENT' ? 'destructive' : 'outline'}
                        className={currentStatus !== 'ABSENT' ? 'text-red-500 hover:bg-red-500/10' : ''}
                        onClick={() => handleStatusChange(s.id, 'ABSENT')}
                      >
                        <X className="h-3 w-3 mr-1" /> A
                      </Button>
                      <Button 
                        size="sm" 
                        variant={currentStatus === 'LATE' ? 'default' : 'outline'}
                        className={currentStatus === 'LATE' ? 'bg-amber-500 hover:bg-amber-600' : 'text-amber-500 hover:bg-amber-500/10'}
                        onClick={() => handleStatusChange(s.id, 'LATE')}
                      >
                        <Clock className="h-3 w-3 mr-1" /> L
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : selectedClass ? (
              <div className="flex h-32 flex-col items-center justify-center text-muted-foreground">
                <p>No students found in this class.</p>
              </div>
            ) : (
              <div className="flex h-32 flex-col items-center justify-center text-muted-foreground">
                <p>Please select a classroom to mark attendance.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
