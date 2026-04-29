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
import { Plus, BookOpen, FileText, Video, Loader2, LinkIcon } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useNotes, useCreateNote } from '@/hooks/use-notes';
import { useSubjects } from '@/hooks/use-subjects';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type React from 'react';

const typeIcons: Record<string, React.ElementType> = {
  PDF: FileText,
  VIDEO: Video,
  LINK: LinkIcon,
  DOC: FileText,
  PPT: FileText,
};

const CONTENT_TYPES = ['PDF', 'VIDEO', 'DOC', 'PPT', 'LINK'];

export default function NotesPage() {
  const { schoolId } = useAuthStore();
  const { data, isLoading } = useNotes(schoolId || 0, { page: 0, size: 50 });
  const notes = data?.data?.content || [];
  const { data: subjectsRes } = useSubjects(schoolId || 0);
  const subjects = subjectsRes?.data || [];
  const { mutate: createNote, isPending } = useCreateNote();
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    contentUrl: '',
    contentType: 'PDF',
    subjectId: '',
    grade: '',
    academicYear: '2024-25',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId || !form.subjectId) return;
    createNote({
      schoolId,
      data: {
        ...form,
        subjectId: Number(form.subjectId),
      },
    }, {
      onSuccess: () => {
        setOpen(false);
        setForm({ title: '', description: '', contentUrl: '', contentType: 'PDF', subjectId: '', grade: '', academicYear: '2024-25' });
      }
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Notes & Content" description="Manage educational resources">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Upload Notes</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload Notes / Resource</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="n-title">Title</Label>
                <Input id="n-title" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Chapter 5 – Quadratic Equations" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Content Type</Label>
                  <Select value={form.contentType} onValueChange={(v) => setForm(f => ({ ...f, contentType: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CONTENT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="n-url">Content URL</Label>
                <Input id="n-url" value={form.contentUrl} onChange={(e) => setForm(f => ({ ...f, contentUrl: e.target.value }))} placeholder="https://..." required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="n-grade">Grade</Label>
                  <Input id="n-grade" value={form.grade} onChange={(e) => setForm(f => ({ ...f, grade: e.target.value }))} placeholder="e.g. 10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="n-year">Academic Year</Label>
                  <Input id="n-year" value={form.academicYear} onChange={(e) => setForm(f => ({ ...f, academicYear: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="n-desc">Description</Label>
                <Textarea id="n-desc" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional description..." rows={2} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isPending || !form.subjectId}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Upload
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
      ) : notes.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground border border-dashed rounded-lg">
          No notes uploaded yet. Upload the first resource!
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((n) => {
            const Icon = typeIcons[n.contentType] || FileText;
            return (
              <Card key={n.id} className="hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {n.grade ? `Grade ${n.grade}` : 'All Grades'} • {n.academicYear || ''}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-[10px]">{n.contentType}</Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
