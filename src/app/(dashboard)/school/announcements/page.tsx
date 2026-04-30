'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Megaphone, Loader2, Edit2, Trash2, Calendar, User as UserIcon, Pin } from 'lucide-react';
import { useAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement } from '@/hooks/use-communication';
import { useAuthStore } from '@/store/auth-store';
import { formatDistanceToNow, format } from 'date-fns';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Announcement } from '@/types/communication.types';

const AUDIENCES = ['ALL', 'STUDENT', 'TEACHER', 'PARENT'];

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  targetAudience: z.string().min(1, 'Audience is required'),
  isPinned: z.boolean().default(false),
  expiresAt: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function AnnouncementsPage() {
  const { schoolId } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const { data, isLoading } = useAnnouncements(schoolId || 0, undefined, { page: 0, size: 50 });
  const announcements = data?.data?.content || [];
  
  const { mutate: createAnnouncement, isPending: isCreating } = useCreateAnnouncement();
  const { mutate: updateAnnouncement, isPending: isUpdating } = useUpdateAnnouncement();
  const { mutate: deleteAnnouncement } = useDeleteAnnouncement();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      targetAudience: 'ALL',
      isPinned: false,
    }
  });

  useEffect(() => {
    if (editingAnnouncement) {
      reset({
        title: editingAnnouncement.title,
        content: editingAnnouncement.content,
        targetAudience: editingAnnouncement.targetAudience,
        isPinned: editingAnnouncement.isPinned,
        expiresAt: editingAnnouncement.expiresAt ? format(new Date(editingAnnouncement.expiresAt), "yyyy-MM-dd'T'HH:mm") : undefined,
      });
    } else {
      reset({
        title: '',
        content: '',
        targetAudience: 'ALL',
        isPinned: false,
        expiresAt: undefined,
      });
    }
  }, [editingAnnouncement, reset]);

  const onSubmit = (data: FormData) => {
    if (!schoolId) return;
    if (editingAnnouncement) {
      updateAnnouncement({ schoolId, announcementId: editingAnnouncement.id, data: data as any }, {
        onSuccess: () => {
          setOpen(false);
          setEditingAnnouncement(null);
        }
      });
    } else {
      createAnnouncement({ schoolId, data: data as any }, {
        onSuccess: () => {
          setOpen(false);
        }
      });
    }
  };

  const handleEdit = (ann: Announcement) => {
    setEditingAnnouncement(ann);
    setOpen(true);
  };

  const handleDelete = (ann: Announcement) => {
    if (!schoolId) return;
    if (confirm('Are you sure you want to delete this announcement?')) {
      deleteAnnouncement({ schoolId, announcementId: ann.id });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Announcements" description="Manage school-wide announcements">
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setEditingAnnouncement(null); }}>
          <DialogTrigger render={<button className={cn(buttonVariants({ variant: 'default' }), "gap-2")}><Plus className="h-4 w-4" /> New Announcement</button>} />
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input {...register('title')} placeholder="e.g. School Holiday Notice" />
                {errors.title && <p className="text-xs text-red-500">{(errors.title as any).message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea {...register('content')} placeholder="Write the full announcement message..." rows={4} />
                {errors.content && <p className="text-xs text-red-500">{(errors.content as any).message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Controller name="targetAudience" control={control} render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {AUDIENCES.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )} />
                </div>
                <div className="space-y-2">
                  <Label>Expires At (Optional)</Label>
                  <Input type="datetime-local" {...register('expiresAt')} />
                </div>
              </div>
              <div className="flex items-center gap-2 py-2">
                <Controller name="isPinned" control={control} render={({ field }) => (
                  <Switch
                    id="pinned"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )} />
                <Label htmlFor="pinned" className="cursor-pointer">Pin this announcement to the top</Label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => { setOpen(false); setEditingAnnouncement(null); }}>Cancel</Button>
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingAnnouncement ? 'Update' : 'Publish'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground border border-dashed rounded-lg bg-muted/10">
            <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No announcements found. Create your first school-wide notice!</p>
          </div>
        ) : (
          announcements.map((a: any) => (
            <Card key={a.id} className={`group relative overflow-hidden transition-all hover:shadow-md ${a.isPinned ? 'border-amber-500/30 bg-amber-500/5' : ''}`}>
              <CardContent className="p-0">
                <div className="p-5 flex gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${a.isPinned ? 'bg-amber-500/20 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                    <Megaphone className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm">{a.title}</h3>
                          {a.isPinned && (
                            <Badge variant="outline" className="text-[10px] bg-amber-500/10 border-amber-500/20 text-amber-600 font-bold">
                              <Pin className="h-2 w-2 mr-1" /> PINNED
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">
                            {a.targetAudience}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {a.content}
                        </p>
                      </div>
                      
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={() => handleEdit(a)}>
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(a)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 pt-3 border-t">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <UserIcon className="h-3 w-3" />
                        <span>{a.createdByUserName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{a.createdAt ? formatDistanceToNow(new Date(a.createdAt), { addSuffix: true }) : ''}</span>
                      </div>
                      {a.expiresAt && (
                        <div className="flex items-center gap-1.5 text-[10px] text-red-500 font-medium">
                          <Calendar className="h-3 w-3" />
                          <span>Expires {format(new Date(a.expiresAt), 'PPP')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
