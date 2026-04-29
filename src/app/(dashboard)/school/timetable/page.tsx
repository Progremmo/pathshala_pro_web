'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2, Edit2, Trash2, Clock, User as UserIcon, BookOpen } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useClassrooms } from '@/hooks/use-schools';
import { useClassTimetable, useCreateTimetable, useUpdateTimetable, useDeleteTimetable } from '@/hooks/use-timetable';
import { useSubjects } from '@/hooks/use-subjects';
import { useUsers } from '@/hooks/use-users';
import { DAYS_OF_WEEK, ACADEMIC_YEARS } from '@/lib/constants';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { DayOfWeek, Timetable } from '@/types/timetable.types';
import { toast } from 'sonner';

const schema = z.object({
  dayOfWeek: z.string().min(1, 'Day is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  periodNumber: z.coerce.number().optional(),
  subjectId: z.coerce.number().min(1, 'Subject is required'),
  teacherId: z.coerce.number().min(1, 'Teacher is required'),
});

type FormData = z.infer<typeof schema>;

export default function TimetablePage() {
  const { schoolId } = useAuthStore();
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>(ACADEMIC_YEARS[0]);
  const [open, setOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Timetable | null>(null);

  const { data: classroomsRes } = useClassrooms(schoolId || 0);
  const classrooms = classroomsRes?.data || [];

  const { data: subjectsRes } = useSubjects(schoolId || 0);
  const subjects = subjectsRes?.data || [];

  const { data: teachersRes } = useUsers({ schoolId: schoolId || 0, role: 'TEACHER', page: 0, size: 100 });
  const teachers = teachersRes?.data?.content || [];

  const { data: timetableRes, isLoading } = useClassTimetable(
    schoolId || 0,
    Number(selectedClassId),
    selectedYear
  );
  const periods = timetableRes?.data || [];

  const { mutate: createEntry, isPending: isCreating } = useCreateTimetable();
  const { mutate: updateEntry, isPending: isUpdating } = useUpdateTimetable();
  const { mutate: deleteEntry } = useDeleteTimetable();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      dayOfWeek: 'MONDAY',
    }
  });

  useEffect(() => {
    if (editingEntry) {
      reset({
        dayOfWeek: editingEntry.dayOfWeek,
        startTime: editingEntry.startTime.substring(0, 5),
        endTime: editingEntry.endTime.substring(0, 5),
        periodNumber: editingEntry.periodNumber || undefined,
        subjectId: editingEntry.subjectId,
        teacherId: editingEntry.teacherId,
      });
    } else {
      reset({
        dayOfWeek: 'MONDAY',
        startTime: '',
        endTime: '',
        periodNumber: undefined,
        subjectId: 0,
        teacherId: 0,
      });
    }
  }, [editingEntry, reset]);

  const onSubmit = (data: FormData) => {
    if (!schoolId || !selectedClassId) return;
    
    const payload = {
      ...data,
      academicYear: selectedYear,
      classRoomId: Number(selectedClassId),
    };

    if (editingEntry) {
      updateEntry({ schoolId, entryId: editingEntry.id, data: payload as any }, {
        onSuccess: () => {
          setOpen(false);
          setEditingEntry(null);
        }
      });
    } else {
      createEntry({ schoolId, data: payload as any }, {
        onSuccess: () => {
          setOpen(false);
        }
      });
    }
  };

  const handleEdit = (entry: Timetable) => {
    setEditingEntry(entry);
    setOpen(true);
  };

  const handleDelete = (entry: Timetable) => {
    if (!schoolId) return;
    if (confirm('Are you sure you want to delete this timetable entry?')) {
      deleteEntry({ 
        schoolId, 
        entryId: entry.id, 
        classRoomId: entry.classRoomId, 
        teacherId: entry.teacherId, 
        academicYear: entry.academicYear 
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Timetable" description="Weekly class schedule">
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setEditingEntry(null); }}>
          <DialogTrigger render={<Button disabled={!selectedClassId} className="gap-2"><Plus className="h-4 w-4" /> Add Period</Button>} />
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingEntry ? 'Edit Timetable Entry' : 'Add Timetable Entry'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Day</Label>
                  <Controller name="dayOfWeek" control={control} render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {DAYS_OF_WEEK.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )} />
                </div>
                <div className="space-y-2">
                  <Label>Period #</Label>
                  <Input type="number" {...register('periodNumber')} placeholder="1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input type="time" {...register('startTime')} required />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input type="time" {...register('endTime')} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Controller name="subjectId" control={control} render={({ field }) => (
                  <Select value={String(field.value)} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                    <SelectContent>
                      {subjects.map((s: any) => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
              </div>
              <div className="space-y-2">
                <Label>Teacher</Label>
                <Controller name="teacherId" control={control} render={({ field }) => (
                  <Select value={String(field.value)} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger>
                    <SelectContent>
                      {teachers.map((t: any) => <SelectItem key={t.id} value={String(t.id)}>{t.fullName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => { setOpen(false); setEditingEntry(null); }}>Cancel</Button>
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingEntry ? 'Update Entry' : 'Save Entry'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="flex items-center gap-4 flex-wrap bg-muted/30 p-4 rounded-lg border">
        <div className="flex items-center gap-2">
          <Label className="text-sm shrink-0 font-bold">Classroom:</Label>
          <Select value={selectedClassId} onValueChange={(v) => v && setSelectedClassId(v)}>
            <SelectTrigger className="w-48 bg-background">
              <SelectValue placeholder="Select classroom" />
            </SelectTrigger>
            <SelectContent>
              {classrooms.map((c: any) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name} {c.section || ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-sm shrink-0 font-bold">Academic Year:</Label>
          <Select value={selectedYear} onValueChange={(v) => v && setSelectedYear(v)}>
            <SelectTrigger className="w-32 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACADEMIC_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!selectedClassId ? (
        <div className="text-center py-24 text-muted-foreground border border-dashed rounded-lg bg-muted/10">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>Select a classroom to view its weekly schedule.</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {DAYS_OF_WEEK.map((day) => {
            const dayPeriods = periods.filter((p: any) => p.dayOfWeek === day);
            return (
              <Card key={day} className="flex flex-col border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="py-3 bg-primary/5 border-b">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider">{day}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-3 space-y-3">
                  {dayPeriods.length > 0 ? dayPeriods
                    .sort((a: any, b: any) => a.startTime.localeCompare(b.startTime))
                    .map((p: any, i: number) => (
                      <div key={i} className="group relative rounded-xl border bg-card p-3 shadow-sm hover:border-primary/30 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 text-primary">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs font-bold">{p.startTime.substring(0, 5)} – {p.endTime.substring(0, 5)}</span>
                          </div>
                          {p.periodNumber && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted font-bold text-muted-foreground uppercase">
                              P{p.periodNumber}
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-1.5">
                          <div className="text-sm font-bold truncate flex items-center gap-2">
                            <BookOpen className="h-3 w-3 text-muted-foreground" />
                            {p.subjectName}
                          </div>
                          <div className="text-xs text-muted-foreground truncate flex items-center gap-2">
                            <UserIcon className="h-3 w-3" />
                            {p.teacherName}
                          </div>
                        </div>

                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-primary hover:bg-primary/10" onClick={() => handleEdit(p)}>
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(p)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )) : (
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground/40 italic text-xs">
                      <Clock className="h-8 w-8 mb-2 opacity-10" />
                      No classes
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
