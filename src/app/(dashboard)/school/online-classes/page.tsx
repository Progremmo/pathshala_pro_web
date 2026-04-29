'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, Video, ExternalLink, Loader2, Calendar, Clock, 
  User as UserIcon, BookOpen, Trash2, CheckCircle2, XCircle, AlertCircle 
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useOnlineClasses, useScheduleClass, useUpdateClassStatus, useDeleteClass } from '@/hooks/use-online-classes';
import { useClassrooms } from '@/hooks/use-schools';
import { useUsers } from '@/hooks/use-users';
import { useSubjects } from '@/hooks/use-subjects';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { toast } from 'sonner';

const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  ONGOING: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  COMPLETED: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const PLATFORMS = ['GOOGLE_MEET', 'ZOOM', 'MICROSOFT_TEAMS', 'AGORA', 'OTHER'];

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  meetingLink: z.string().url('Invalid URL'),
  platform: z.string().min(1, 'Platform is required'),
  scheduledAt: z.string().min(1, 'Schedule date/time is required'),
  durationMinutes: z.coerce.number().min(1, 'Duration is required'),
  classRoomId: z.coerce.number().min(1, 'Classroom is required'),
  teacherId: z.coerce.number().min(1, 'Teacher is required'),
  subjectId: z.coerce.number().optional(),
});

type FormData = z.infer<typeof schema>;

export default function OnlineClassesPage() {
  const { schoolId } = useAuthStore();
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useOnlineClasses(schoolId || 0, { page: 0, size: 50 });
  const classes = data?.data?.content || [];
  const { data: classroomsRes } = useClassrooms(schoolId || 0);
  const classrooms = classroomsRes?.data || [];
  const { data: teachersRes } = useUsers({ schoolId: schoolId || 0, role: 'TEACHER', page: 0, size: 100 });
  const teachers = teachersRes?.data?.content || [];
  const { data: subjectsRes } = useSubjects(schoolId || 0);
  const subjects = subjectsRes?.data || [];

  const { mutate: scheduleClass, isPending: isScheduling } = useScheduleClass();
  const { mutate: updateStatus } = useUpdateClassStatus();
  const { mutate: deleteClass } = useDeleteClass();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      platform: 'GOOGLE_MEET',
      durationMinutes: 60,
    }
  });

  const onSubmit = (data: FormData) => {
    if (!schoolId) return;
    scheduleClass({ schoolId, data: data as any }, {
      onSuccess: () => {
        setOpen(false);
        reset();
      }
    });
  };

  const handleStatusUpdate = (classId: number, status: string) => {
    if (!schoolId) return;
    updateStatus({ schoolId, classId, status });
  };

  const handleDelete = (classId: number) => {
    if (!schoolId) return;
    if (confirm('Are you sure you want to cancel and delete this online class?')) {
      deleteClass({ schoolId, classId });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Online Classes" description="Schedule and manage virtual sessions">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="gap-2"><Plus className="h-4 w-4" /> Schedule Class</Button>} />
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Schedule Online Class</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title / Topic</Label>
                <Input {...register('title')} placeholder="e.g. Quadratic Equations Live" />
                {errors.title && <p className="text-xs text-red-500">{(errors.title as any).message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Classroom</Label>
                  <Controller name="classRoomId" control={control} render={({ field }) => (
                    <Select value={String(field.value)} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                      <SelectContent>
                        {classrooms.map((c: any) => <SelectItem key={c.id} value={String(c.id)}>{c.name} {c.section || ''}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )} />
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Controller name="platform" control={control} render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {PLATFORMS.map(p => <SelectItem key={p} value={p}>{p.replace('_', ' ')}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )} />
                </div>
                <div className="space-y-2">
                  <Label>Duration (min)</Label>
                  <Input type="number" {...register('durationMinutes')} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Scheduled At</Label>
                <Input type="datetime-local" {...register('scheduledAt')} />
              </div>
              <div className="space-y-2">
                <Label>Meeting Link</Label>
                <Input {...register('meetingLink')} placeholder="https://meet.google.com/..." />
                {errors.meetingLink && <p className="text-xs text-red-500">{(errors.meetingLink as any).message}</p>}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isScheduling}>
                  {isScheduling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Schedule
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground border border-dashed rounded-lg bg-muted/10">
          <Video className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>No online classes scheduled yet. Schedule your first virtual session!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {classes.map((c: any) => (
            <Card key={c.id} className="group relative overflow-hidden hover:shadow-md transition-all border-l-4 border-l-primary">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Video className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold">{c.topic || c.title}</h3>
                        <Badge variant="outline" className={`text-[10px] ${STATUS_COLORS[c.status] || ''}`}>
                          {c.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(c.scheduledAt), 'PPP')}
                        </div>
                        <div className="flex items-center gap-1 font-medium text-foreground">
                          <Clock className="h-3 w-3" />
                          {format(new Date(c.scheduledAt), 'p')} ({c.durationMinutes} min)
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {c.subjectName} • {c.classRoomName}
                        </div>
                        <div className="flex items-center gap-1">
                          <UserIcon className="h-3 w-3" />
                          {c.teacherName}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <div className="flex items-center gap-1 mr-2 border-r pr-2">
                      {c.status === 'SCHEDULED' && (
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={() => handleStatusUpdate(c.id, 'ONGOING')}>
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Start
                        </Button>
                      )}
                      {c.status === 'ONGOING' && (
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] text-gray-600 hover:text-gray-700 hover:bg-gray-50" onClick={() => handleStatusUpdate(c.id, 'COMPLETED')}>
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Finish
                        </Button>
                      )}
                      {['SCHEDULED', 'ONGOING'].includes(c.status) && (
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleStatusUpdate(c.id, 'CANCELLED')}>
                          <XCircle className="h-3 w-3 mr-1" /> Cancel
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(c.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {c.meetingLink && (
                      <Button size="sm" className="gap-2 px-4 shadow-sm" render={
                        <a href={c.meetingLink} target="_blank" rel="noopener noreferrer" />
                      }>
                        Join Session <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
