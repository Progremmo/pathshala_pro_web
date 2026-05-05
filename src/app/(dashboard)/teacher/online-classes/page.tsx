'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Video, ExternalLink, Loader2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useTeacherOnlineClasses, useScheduleClass } from '@/hooks/use-online-classes';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClassrooms } from '@/hooks/use-schools';
import { useSubjects } from '@/hooks/use-subjects';

export default function TeacherOnlineClasses() {
  const { schoolId, userId } = useAuthStore();
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  
  const { data: classesResponse, isLoading } = useTeacherOnlineClasses(schoolId!, userId!);
  const classes = classesResponse?.data?.content || [];

  return (
    <div className="space-y-6">
      <PageHeader title="Online Classes" description="Schedule and manage your virtual sessions">
        <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
          <DialogTrigger render={<Button className="gap-2"><Plus className="h-4 w-4" /> Schedule Class</Button>} />
          <ScheduleClassDialog 
            schoolId={schoolId!} 
            teacherId={userId!} 
            onSuccess={() => setIsScheduleOpen(false)} 
          />
        </Dialog>
      </PageHeader>

      <div className="space-y-3">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : classes.length > 0 ? (
          classes.map((c) => (
            <Card key={c.id} className="group hover:border-primary/50 transition-colors">
              <CardContent className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
                    <Video className="h-6 w-6 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.topic}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" /> {format(new Date(c.scheduledAt), 'MMM d, yyyy')}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {format(new Date(c.scheduledAt), 'hh:mm a')} ({c.durationMinutes}m)
                      </p>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {c.classRoomName} • {c.subjectName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={c.status === 'SCHEDULED' ? 'secondary' : 'default'} className="text-[10px]">
                    {c.status}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="gap-1"
                    onClick={() => window.open(c.meetingLink || undefined, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" /> Start
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl text-muted-foreground">
            <Video className="h-10 w-10 mb-4 opacity-20" />
            <p>No online classes scheduled.</p>
            <Button variant="link" onClick={() => setIsScheduleOpen(true)}>Schedule your first class</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ScheduleClassDialog({ schoolId, teacherId, onSuccess }: { schoolId: number; teacherId: number; onSuccess: () => void }) {
  const scheduleClass = useScheduleClass();
  const { data: classrooms } = useClassrooms(schoolId);
  const { data: subjects } = useSubjects(schoolId);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    classRoomId: '',
    subjectId: '',
    scheduledAt: '',
    durationMinutes: '40',
    meetingLink: '',
    platform: 'GOOGLE_MEET'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleClass.mutate({
      schoolId,
      data: {
        ...formData,
        classRoomId: Number(formData.classRoomId),
        subjectId: Number(formData.subjectId),
        teacherId,
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
        durationMinutes: Number(formData.durationMinutes),
        isRecurring: false
      } as any
    }, {
      onSuccess: () => onSuccess()
    });
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader><DialogTitle>Schedule Online Class</DialogTitle></DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="title">Topic / Title</Label>
          <Input 
            id="title" 
            placeholder="e.g. Algebra Chapter 5 Revision" 
            value={formData.title}
            onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
            required 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Classroom</Label>
            <Select value={formData.classRoomId} onValueChange={v => setFormData(p => ({ ...p, classRoomId: v || '' }))}>
              <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
              <SelectContent>
                {classrooms?.data?.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}-{c.section}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Subject</Label>
            <Select value={formData.subjectId} onValueChange={v => setFormData(p => ({ ...p, subjectId: v || '' }))}>
              <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
              <SelectContent>
                {subjects?.data?.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Scheduled At</Label>
            <Input 
              id="date" 
              type="datetime-local" 
              value={formData.scheduledAt}
              onChange={e => setFormData(p => ({ ...p, scheduledAt: e.target.value }))}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (mins)</Label>
            <Input 
              id="duration" 
              type="number" 
              value={formData.durationMinutes}
              onChange={e => setFormData(p => ({ ...p, durationMinutes: e.target.value }))}
              required 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="link">Meeting Link</Label>
          <Input 
            id="link" 
            placeholder="https://meet.google.com/..." 
            value={formData.meetingLink}
            onChange={e => setFormData(p => ({ ...p, meetingLink: e.target.value }))}
            required 
          />
        </div>

        <Button type="submit" className="w-full" disabled={scheduleClass.isPending}>
          {scheduleClass.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Schedule Class
        </Button>
      </form>
    </DialogContent>
  );
}
