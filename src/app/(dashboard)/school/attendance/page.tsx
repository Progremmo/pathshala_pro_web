'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Calendar as CalendarIcon, CheckCircle2, Save } from 'lucide-react';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/auth-store';
import { useClassrooms } from '@/hooks/use-schools';
import { useClassAttendance, useMarkAttendance } from '@/hooks/use-attendance';
import { useClassStudents } from '@/hooks/use-users';
import { ATTENDANCE_STATUS_COLORS } from '@/lib/constants';
import { toast } from 'sonner';

type AttendanceRecord = {
  studentId: number;
  studentName: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
};

export default function AttendancePage() {
  const { schoolId } = useAuthStore();
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [isMarking, setIsMarking] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const { data: classroomsData } = useClassrooms(schoolId || 0);
  const classrooms = classroomsData?.data || [];
  
  const { data: existingAttendanceData, isLoading: isLoadingExisting } = useClassAttendance(
    schoolId || 0, 
    Number(selectedClass), 
    today
  );
  
  const { data: studentsData, isLoading: isLoadingStudents } = useClassStudents(Number(selectedClass));
  const { mutate: markAttendance, isPending: isSubmitting } = useMarkAttendance(schoolId || 0);

  useEffect(() => {
    const existing = existingAttendanceData?.data || [];
    if (existing.length > 0) {
      setAttendanceRecords(existing.map((r: any) => ({
        studentId: r.studentId,
        studentName: r.studentName,
        status: r.status,
        remarks: r.remarks || '',
      })));
      setIsMarking(false);
    } else if (studentsData?.data) {
      setAttendanceRecords(studentsData.data.map((s: any) => ({
        studentId: s.id,
        studentName: s.fullName,
        status: 'PRESENT',
        remarks: '',
      })));
      setIsMarking(true);
    }
  }, [existingAttendanceData, studentsData]);

  const handleStatusChange = (studentId: number, status: any) => {
    setAttendanceRecords(prev => prev.map(r => 
      r.studentId === studentId ? { ...r, status } : r
    ));
  };

  const handleRemarksChange = (studentId: number, remarks: string) => {
    setAttendanceRecords(prev => prev.map(r => 
      r.studentId === studentId ? { ...r, remarks } : r
    ));
  };

  const onSave = () => {
    if (!schoolId || !selectedClass) return;
    
    markAttendance({
      classRoomId: Number(selectedClass),
      attendanceDate: today,
      records: attendanceRecords.map(r => ({
        studentId: r.studentId,
        status: r.status,
        remarks: r.remarks,
      })),
    }, {
      onSuccess: () => {
        setIsMarking(false);
      }
    });
  };

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
            <SelectTrigger><SelectValue placeholder="Select Classroom" /></SelectTrigger>
            <SelectContent>
              {classrooms.map((c: any) => (
                <SelectItem key={c.id} value={c.id.toString()}>{c.name} - {c.section}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedClass && !isMarking && (
          <Button onClick={() => setIsMarking(true)} variant="outline" className="gap-2">
            <Edit2 className="h-4 w-4" /> Re-mark Attendance
          </Button>
        )}
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {selectedClass ? `Attendance: ${classrooms.find((c:any) => c.id === Number(selectedClass))?.name || ''}` : 'Please select a classroom'}
            </CardTitle>
            {!isMarking && attendanceRecords.length > 0 && (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1 px-2 py-1">
                <CheckCircle2 className="h-3 w-3" /> Marked for today
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {!selectedClass ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground italic">
              Select a classroom to view or mark attendance
            </div>
          ) : (isLoadingExisting || isLoadingStudents) ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : attendanceRecords.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground italic">
              No students found in this classroom.
            </div>
          ) : (
            <div className="divide-y">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-muted/10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <div className="col-span-4">Student Name</div>
                <div className="col-span-5 text-center">Status</div>
                <div className="col-span-3">Remarks</div>
              </div>
              {attendanceRecords.map((r) => (
                <div key={r.studentId} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-accent/5 transition-colors">
                  <div className="col-span-4 font-medium text-sm">{r.studentName}</div>
                  <div className="col-span-5 flex justify-center">
                    {isMarking ? (
                      <RadioGroup 
                        value={r.status} 
                        onValueChange={(val) => handleStatusChange(r.studentId, val)}
                        className="flex items-center gap-3"
                      >
                        <div className="flex items-center gap-1.5">
                          <RadioGroupItem value="PRESENT" id={`p-${r.studentId}`} className="text-emerald-500 border-emerald-500" />
                          <Label htmlFor={`p-${r.studentId}`} className="text-[10px] font-bold cursor-pointer text-emerald-600">P</Label>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <RadioGroupItem value="ABSENT" id={`a-${r.studentId}`} className="text-rose-500 border-rose-500" />
                          <Label htmlFor={`a-${r.studentId}`} className="text-[10px] font-bold cursor-pointer text-rose-600">A</Label>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <RadioGroupItem value="LATE" id={`l-${r.studentId}`} className="text-amber-500 border-amber-500" />
                          <Label htmlFor={`l-${r.studentId}`} className="text-[10px] font-bold cursor-pointer text-amber-600">L</Label>
                        </div>
                      </RadioGroup>
                    ) : (
                      <Badge className={`text-[10px] ${ATTENDANCE_STATUS_COLORS[r.status] || ''}`}>
                        {r.status}
                      </Badge>
                    )}
                  </div>
                  <div className="col-span-3">
                    {isMarking ? (
                      <Input 
                        placeholder="Optional remarks" 
                        className="h-8 text-xs" 
                        value={r.remarks}
                        onChange={(e) => handleRemarksChange(r.studentId, e.target.value)}
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">{r.remarks || '—'}</span>
                    )}
                  </div>
                </div>
              ))}
              {isMarking && (
                <div className="p-6 bg-muted/20 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsMarking(false)} disabled={isSubmitting}>Cancel</Button>
                  <Button onClick={onSave} disabled={isSubmitting} className="gap-2">
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Attendance
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { Edit2 } from 'lucide-react';
