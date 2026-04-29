'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Video, ExternalLink, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useOnlineClasses, useScheduleClass } from '@/hooks/use-online-classes';
import { useClassrooms } from '@/hooks/use-schools';
import { useUsers } from '@/hooks/use-users';
import { useState } from 'react';
import type React from 'react';

const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  ONGOING: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  COMPLETED: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const PLATFORMS = ['GOOGLE_MEET', 'ZOOM', 'MICROSOFT_TEAMS', 'AGORA', 'OTHER'];

export default function OnlineClassesPage() {
  const { schoolId } = useAuthStore();
  const { data, isLoading } = useOnlineClasses(schoolId || 0, { page: 0, size: 50 });
  const classes = data?.data?.content || [];
  const { data: classroomsRes } = useClassrooms(schoolId || 0);
  const classrooms = classroomsRes?.data || [];
  const { data: teachersRes } = useUsers({ schoolId: schoolId || 0, role: 'TEACHER', page: 0, size: 100 });
  const teachers = teachersRes?.data?.content || [];
  const { mutate: scheduleClass, isPending } = useScheduleClass();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: '',
    meetingLink: '',
    platform: 'GOOGLE_MEET',
    scheduledAt: '',
    durationMinutes: '60',
    classRoomId: '',
    teacherId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId || !form.classRoomId || !form.teacherId) return;
    scheduleClass({
      schoolId,
      data: {
        ...form,
        durationMinutes: Number(form.durationMinutes),
        classRoomId: Number(form.classRoomId),
        teacherId: Number(form.teacherId),
      },
    }, {
      onSuccess: () => {
        setOpen(false);
        setForm({ title: '', meetingLink: '', platform: 'GOOGLE_MEET', scheduledAt: '', durationMinutes: '60', classRoomId: '', teacherId: '' });
      }
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Online Classes" description="Schedule and manage virtual sessions">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Schedule Class</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Schedule Online Class</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Quadratic Equations Live" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Classroom</Label>
                  <Select value={form.classRoomId} onValueChange={(v) => setForm(f => ({ ...f, classRoomId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                    <SelectContent>
                      {classrooms.map((c: any) => <SelectItem key={c.id} value={String(c.id)}>{c.name} {c.section || ''}</SelectItem>)}
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Select value={form.platform} onValueChange={(v) => setForm(f => ({ ...f, platform: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PLATFORMS.map(p => <SelectItem key={p} value={p}>{p.replace('_', ' ')}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Duration (min)</Label>
                  <Input type="number" value={form.durationMinutes} onChange={(e) => setForm(f => ({ ...f, durationMinutes: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Scheduled At</Label>
                <Input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm(f => ({ ...f, scheduledAt: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Meeting Link</Label>
                <Input value={form.meetingLink} onChange={(e) => setForm(f => ({ ...f, meetingLink: e.target.value }))} placeholder="https://meet.google.com/..." />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isPending || !form.classRoomId || !form.teacherId}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
        <div className="text-center py-24 text-muted-foreground border border-dashed rounded-lg">
          No online classes scheduled yet.
        </div>
      ) : (
        <div className="space-y-3">
          {classes.map((c) => (
            <Card key={c.id} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
                    <Video className="h-6 w-6 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(c.scheduledAt).toLocaleString('en-IN')}
                      {c.durationMinutes ? ` • ${c.durationMinutes} min` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {c.platform && (
                    <Badge variant="secondary" className="text-[10px]">{c.platform.replace('_', ' ')}</Badge>
                  )}
                  <Badge variant="outline" className={`text-[10px] ${STATUS_COLORS[c.status] || ''}`}>
                    {c.status}
                  </Badge>
                  {c.meetingLink && (
                    <Button size="sm" variant="outline" className="gap-1" asChild>
                      <a href={c.meetingLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" /> Join
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
