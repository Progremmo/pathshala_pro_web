'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Megaphone, Loader2 } from 'lucide-react';
import { useAnnouncements, useCreateAnnouncement } from '@/hooks/use-communication';
import { useAuthStore } from '@/store/auth-store';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import type React from 'react';

const AUDIENCES = ['ALL', 'STUDENT', 'TEACHER', 'PARENT'];

export default function AnnouncementsPage() {
  const { schoolId } = useAuthStore();
  const { data, isLoading } = useAnnouncements(schoolId || 0, undefined, { page: 0, size: 50 });
  const announcements = data?.data?.content || [];
  const { mutate: createAnnouncement, isPending } = useCreateAnnouncement();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: '',
    content: '',
    targetAudience: 'ALL',
    isPinned: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) return;
    createAnnouncement({ schoolId, data: form }, {
      onSuccess: () => {
        setOpen(false);
        setForm({ title: '', content: '', targetAudience: 'ALL', isPinned: false });
      }
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Announcements" description="Manage school-wide announcements">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> New Announcement</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. School Holiday Notice" required />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea value={form.content} onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Write the full announcement message..." rows={4} required />
              </div>
              <div className="flex items-center gap-4">
                <div className="space-y-2 flex-1">
                  <Label>Target Audience</Label>
                  <Select value={form.targetAudience} onValueChange={(v) => setForm(f => ({ ...f, targetAudience: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {AUDIENCES.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 flex items-center gap-2 pt-6">
                  <Switch
                    id="pinned"
                    checked={form.isPinned}
                    onCheckedChange={(v) => setForm(f => ({ ...f, isPinned: v }))}
                  />
                  <Label htmlFor="pinned">Pin</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Publish
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground border border-dashed rounded-lg">
            No announcements found.
          </div>
        ) : (
          announcements.map((a) => (
            <Card key={a.id} className={a.isPinned ? 'border-amber-500/30 bg-amber-500/5' : ''}>
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                  <Megaphone className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{a.title}</p>
                    {a.isPinned && (
                      <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-500">
                        Pinned
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{a.content}</p>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    {a.createdAt ? formatDistanceToNow(new Date(a.createdAt), { addSuffix: true }) : ''}
                  </p>
                </div>
                <Badge variant="secondary" className="text-[10px] shrink-0 uppercase">
                  {a.targetAudience}
                </Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
