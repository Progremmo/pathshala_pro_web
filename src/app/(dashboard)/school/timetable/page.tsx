'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useClassrooms } from '@/hooks/use-schools';
import { useClassTimetable, useCreateTimetable } from '@/hooks/use-timetable';
import { useSubjects } from '@/hooks/use-subjects';
import { useUsers } from '@/hooks/use-users';
import { DAYS_OF_WEEK, ACADEMIC_YEARS } from '@/lib/constants';
import { useState } from 'react';
import type { DayOfWeek } from '@/types/timetable.types';
import type React from 'react';

export default function TimetablePage() {
  const { schoolId } = useAuthStore();

  const { data: classroomsRes } = useClassrooms(schoolId || 0);
  const classrooms = classroomsRes?.data || [];

  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>(ACADEMIC_YEARS[0]);
  const [open, setOpen] = useState(false);

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

  const { mutate: createEntry, isPending } = useCreateTimetable();

  const [form, setForm] = useState({
    dayOfWeek: 'MONDAY' as DayOfWeek,
    startTime: '',
    endTime: '',
    periodNumber: '',
    subjectId: '',
    teacherId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId || !selectedClassId || !form.subjectId || !form.teacherId) return;
    createEntry({
      schoolId,
      data: {
        dayOfWeek: form.dayOfWeek,
        startTime: form.startTime,
        endTime: form.endTime,
        periodNumber: form.periodNumber ? Number(form.periodNumber) : undefined,
        academicYear: selectedYear,
        classRoomId: Number(selectedClassId),
        subjectId: Number(form.subjectId),
        teacherId: Number(form.teacherId),
      },
    }, {
      onSuccess: () => {
        setOpen(false);
        setForm({ dayOfWeek: 'MONDAY', startTime: '', endTime: '', periodNumber: '', subjectId: '', teacherId: '' });
      }
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Timetable" description="Weekly class schedule">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={!selectedClassId}>
              <Plus className="h-4 w-4" /> Add Period
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Timetable Entry</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Day</Label>
                  <Select value={form.dayOfWeek} onValueChange={(v) => setForm(f => ({ ...f, dayOfWeek: v as DayOfWeek }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Period #</Label>
                  <Input type="number" value={form.periodNumber} onChange={(e) => setForm(f => ({ ...f, periodNumber: e.target.value }))} placeholder="1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input type="time" value={form.startTime} onChange={(e) => setForm(f => ({ ...f, startTime: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input type="time" value={form.endTime} onChange={(e) => setForm(f => ({ ...f, endTime: e.target.value }))} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={form.subjectId} onValueChange={(v) => setForm(f => ({ ...f, subjectId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                  <SelectContent>
                    {subjects.map((s: any) => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Teacher</Label>
                <Select value={form.teacherId} onValueChange={(v) => setForm(f => ({ ...f, teacherId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger>
                  <SelectContent>
                    {teachers.map((t: any) => <SelectItem key={t.id} value={String(t.id)}>{t.fullName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isPending || !form.subjectId || !form.teacherId}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Entry
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Label className="text-sm shrink-0">Classroom</Label>
          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
            <SelectTrigger className="w-48">
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
          <Label className="text-sm shrink-0">Year</Label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACADEMIC_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Timetable Grid */}
      {!selectedClassId ? (
        <div className="text-center py-24 text-muted-foreground border border-dashed rounded-lg">
          Select a classroom to view its timetable.
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {DAYS_OF_WEEK.map((day) => {
            const dayPeriods = periods.filter((p: any) => p.dayOfWeek === day);
            return (
              <Card key={day}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">{day}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {dayPeriods.length > 0 ? dayPeriods
                    .sort((a: any, b: any) => a.startTime.localeCompare(b.startTime))
                    .map((p: any, i: number) => (
                      <div key={i} className="rounded-lg border border-border/50 p-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Period {p.periodNumber || i + 1}</span>
                          <span className="text-xs text-muted-foreground">{p.startTime} – {p.endTime}</span>
                        </div>
                      </div>
                    )) : (
                    <p className="text-xs text-muted-foreground text-center py-4">No classes</p>
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
