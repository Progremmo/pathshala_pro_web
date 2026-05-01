'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ClipboardList, Loader2, Save } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useExams, useEnterMarks } from '@/hooks/use-exams';
import { useClassStudents } from '@/hooks/use-users';
import { ExamResponse } from '@/types/exam.types';
import { format } from 'date-fns';

export default function TeacherExams() {
  const { schoolId } = useAuthStore();
  const { data: examsResponse, isLoading: loadingExams } = useExams(schoolId!);
  const exams = examsResponse?.data?.content || [];

  const [selectedExam, setSelectedExam] = useState<ExamResponse | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader title="Exams & Marks" description="Manage examinations and record student marks" />
      
      <div className="space-y-4">
        {loadingExams ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : exams.length > 0 ? (
          exams.map((exam) => (
            <Card key={exam.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <ClipboardList className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{exam.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {exam.classRoomName} • {exam.subjectName} • {format(new Date(exam.examDate), 'MMM d, yyyy')}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Max Marks: {exam.maxMarks} • Pass Marks: {exam.passMarks}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={exam.published ? 'default' : 'outline'} className="text-[10px]">
                    {exam.published ? 'PUBLISHED' : 'PENDING'}
                  </Badge>
                  
                  <Dialog onOpenChange={(open) => !open && setSelectedExam(null)}>
                    <DialogTrigger>
                      <Button size="sm" variant="outline" onClick={() => setSelectedExam(exam)}>
                        Enter Marks
                      </Button>
                    </DialogTrigger>
                    {selectedExam && (
                      <MarksEntryDialog 
                        exam={selectedExam} 
                        schoolId={schoolId!} 
                      />
                    )}
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              No exams scheduled yet.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function MarksEntryDialog({ exam, schoolId }: { exam: ExamResponse; schoolId: number }) {
  const { data: studentsResponse, isLoading: loadingStudents } = useClassStudents(exam.classRoomId);
  const students = studentsResponse?.data || [];
  
  const [marksData, setMarksData] = useState<Record<number, string>>({});
  const [isAbsentData, setIsAbsentData] = useState<Record<number, boolean>>({});
  
  const enterMarks = useEnterMarks(schoolId, exam.id);

  const handleSaveMarks = async (studentId: number) => {
    const marks = parseFloat(marksData[studentId]);
    if (isNaN(marks) && !isAbsentData[studentId]) return;

    enterMarks.mutate({
      examId: exam.id,
      studentId,
      marksObtained: isAbsentData[studentId] ? 0 : marks,
      isAbsent: isAbsentData[studentId] || false,
    });
  };

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>Enter Marks: {exam.title}</DialogTitle>
        <p className="text-sm text-muted-foreground">
          {exam.classRoomName} • Max Marks: {exam.maxMarks}
        </p>
      </DialogHeader>
      
      <div className="flex-1 overflow-y-auto pr-2 mt-4 space-y-3">
        {loadingStudents ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : students.length > 0 ? (
          students.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex-1">
                <p className="text-sm font-medium">{s.fullName}</p>
                <p className="text-xs text-muted-foreground">{s.admissionNo || 'No Admission No'}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id={`absent-${s.id}`}
                    checked={isAbsentData[s.id] || false}
                    onChange={(e) => setIsAbsentData(prev => ({ ...prev, [s.id]: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor={`absent-${s.id}`} className="text-xs font-medium text-red-500">Absent</label>
                </div>
                
                <Input
                  className="w-20 h-8"
                  type="number"
                  placeholder="Marks"
                  disabled={isAbsentData[s.id]}
                  value={marksData[s.id] || ''}
                  onChange={(e) => setMarksData(prev => ({ ...prev, [s.id]: e.target.value }))}
                />
                
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0"
                  disabled={enterMarks.isPending}
                  onClick={() => handleSaveMarks(s.id)}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-muted-foreground py-10">No students found.</p>
        )}
      </div>
    </DialogContent>
  );
}
