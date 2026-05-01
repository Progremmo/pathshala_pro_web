'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button, buttonVariants } from '@/components/ui/button';
import { Plus, Loader2, Edit2, Trash2, Calendar, Clock, ClipboardList } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useExams, useCreateExam, useUpdateExam, useDeleteExam, usePublishResults } from '@/hooks/use-exams';
import { useClassrooms } from '@/hooks/use-schools';
import { useSubjects } from '@/hooks/use-subjects';
import { useAuthStore } from '@/store/auth-store';
import { DEFAULT_EXAM_TYPE_LABELS, DEFAULT_ACADEMIC_YEARS } from '@/lib/constants';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useSchoolConfigs } from '@/hooks/use-school-configs';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  examType: z.string().min(1, 'Type is required'),
  examDate: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  durationMinutes: z.coerce.number().min(1, 'Duration is required'),
  totalMarks: z.coerce.number().min(1, 'Total marks required'),
  passingMarks: z.coerce.number().min(1, 'Passing marks required'),
  academicYear: z.string().min(1, 'Academic year required'),
  classRoomId: z.coerce.number().min(1, 'Classroom is required'),
  subjectId: z.coerce.number().min(1, 'Subject is required'),
  instructions: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ExamsPage() {
  const { schoolId } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<any>(null);

  const { data, isLoading } = useExams({ schoolId: schoolId || 0, page: 0, size: 50 });
  const { data: classroomsData } = useClassrooms(schoolId || 0);
  const { data: subjectsData } = useSubjects(schoolId || 0);
  const { data: schoolConfigs } = useSchoolConfigs(schoolId || 0);
  
  const exams = data?.data?.content || [];
  const classrooms = classroomsData?.data || [];
  const subjects = subjectsData?.data || [];

  const examTypeLabels = schoolConfigs?.EXAM_TYPES || DEFAULT_EXAM_TYPE_LABELS;
  const academicYears = schoolConfigs?.ACADEMIC_YEARS || DEFAULT_ACADEMIC_YEARS;

  const { mutate: createExam, isPending: isCreating } = useCreateExam(schoolId || 0);
  const { mutate: updateExam, isPending: isUpdating } = useUpdateExam(schoolId || 0);
  const { mutate: deleteExam } = useDeleteExam(schoolId || 0);
  const { mutate: publishResults } = usePublishResults(schoolId || 0);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      examType: 'FINAL',
      academicYear: '2024-25',
    }
  });

  useEffect(() => {
    if (editingExam) {
      reset({
        name: editingExam.name,
        examType: editingExam.type,
        examDate: editingExam.examDate,
        startTime: editingExam.startTime,
        durationMinutes: editingExam.durationMinutes,
        totalMarks: editingExam.totalMarks,
        passingMarks: editingExam.passingMarks,
        academicYear: editingExam.academicYear,
        classRoomId: editingExam.classRoomId,
        subjectId: editingExam.subjectId,
        instructions: editingExam.instructions || '',
      });
    } else {
      reset({
        name: '',
        examType: 'FINAL',
        examDate: '',
        startTime: '',
        durationMinutes: 60,
        totalMarks: 100,
        passingMarks: 35,
        academicYear: '2024-25',
        classRoomId: 0,
        subjectId: 0,
        instructions: '',
      });
    }
  }, [editingExam, reset]);

  const onSubmit = (data: FormData) => {
    if (!schoolId) return;
    if (editingExam) {
      updateExam({ id: editingExam.id, data: data as any }, {
        onSuccess: () => {
          setOpen(false);
          setEditingExam(null);
          reset();
        }
      });
    } else {
      createExam(data as any, {
        onSuccess: () => {
          setOpen(false);
          reset();
        }
      });
    }
  };

  const handleEdit = (exam: any) => {
    setEditingExam(exam);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (!schoolId) return;
    if (confirm('Are you sure you want to delete this exam?')) {
      deleteExam(id);
    }
  };

  const handlePublish = (id: number) => {
    if (!schoolId) return;
    if (confirm('Are you sure you want to publish results? This cannot be undone.')) {
      publishResults(id);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Exams" description="Create and manage examinations">
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setEditingExam(null); }}>
          <DialogTrigger render={<button className={cn(buttonVariants({ variant: 'default' }), "gap-2")}><Plus className="h-4 w-4" /> Create Exam</button>} />
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{editingExam ? 'Edit Exam' : 'Schedule New Exam'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Exam Name</Label><Input {...register('name')} placeholder="e.g. Annual Exam 2024" />{errors.name && <p className="text-xs text-red-500">{(errors.name as any).message}</p>}</div>
                <div className="space-y-2"><Label>Type</Label>
                  <Controller name="examType" control={control} render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{Object.entries(examTypeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                    </Select>
                  )} />
                </div>
                <div className="space-y-2"><Label>Classroom</Label>
                  <Controller name="classRoomId" control={control} render={({ field }) => (
                    <Select value={String(field.value)} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                      <SelectContent>{classrooms.map((c: any) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  )} />
                </div>
                <div className="space-y-2"><Label>Subject</Label>
                  <Controller name="subjectId" control={control} render={({ field }) => (
                    <Select value={String(field.value)} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                      <SelectContent>{subjects.map((s: any) => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}</SelectContent>
                    </Select>
                  )} />
                </div>
                <div className="space-y-2"><Label>Exam Date</Label><Input type="date" {...register('examDate')} /></div>
                <div className="space-y-2"><Label>Start Time</Label><Input type="time" {...register('startTime')} /></div>
                <div className="space-y-2"><Label>Duration (Min)</Label><Input type="number" {...register('durationMinutes')} /></div>
                <div className="space-y-2"><Label>Academic Year</Label>
                  <Controller name="academicYear" control={control} render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{academicYears.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                    </Select>
                  )} />
                </div>
                <div className="space-y-2"><Label>Total Marks</Label><Input type="number" {...register('totalMarks')} /></div>
                <div className="space-y-2"><Label>Passing Marks</Label><Input type="number" {...register('passingMarks')} /></div>
              </div>
              <div className="space-y-2"><Label>Instructions</Label><Textarea {...register('instructions')} rows={3} /></div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={() => { setOpen(false); setEditingExam(null); }}>Cancel</Button>
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingExam ? 'Update' : 'Schedule'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Exam</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Class & Subject</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Schedule</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></td></tr>
                ) : exams.length === 0 ? (
                  <tr><td colSpan={5} className="py-20 text-center text-muted-foreground">No exams scheduled.</td></tr>
                ) : (
                  exams.map((e: any) => (
                    <tr key={e.id} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        <div>{e.name}</div>
                        <Badge variant="outline" className="text-[10px] mt-1">{examTypeLabels[e.type as keyof typeof examTypeLabels] || e.type}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <div className="flex items-center gap-1 text-foreground font-medium"><ClipboardList className="h-3 w-3" /> {e.subjectName}</div>
                        <div className="text-xs">Class: {e.classRoomName}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {e.examDate ? format(new Date(e.examDate), 'MMM dd, yyyy') : 'N/A'}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {e.startTime} ({e.durationMinutes}m)</div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={e.isPublished ? 'default' : 'secondary'} className="text-[10px]">
                          {e.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          {!e.isPublished && <Button variant="ghost" size="sm" className="text-xs h-8 text-primary" onClick={() => handlePublish(e.id)}>Publish</Button>}
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => handleEdit(e)}><Edit2 className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(e.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
