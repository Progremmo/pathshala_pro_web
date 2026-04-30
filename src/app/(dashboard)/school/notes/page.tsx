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
import { Plus, BookOpen, FileText, Video, Loader2, LinkIcon, Edit2, Trash2, Calendar, User as UserIcon, ExternalLink } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote } from '@/hooks/use-notes';
import { useSubjects } from '@/hooks/use-subjects';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Notes } from '@/types/notes.types';
import { toast } from 'sonner';

const typeIcons: Record<string, React.ElementType> = {
  PDF: FileText,
  VIDEO: Video,
  LINK: LinkIcon,
  DOC: FileText,
  PPT: FileText,
};

const CONTENT_TYPES = ['PDF', 'VIDEO', 'DOC', 'PPT', 'LINK'];

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  contentUrl: z.string().url('Invalid URL'),
  contentType: z.string().min(1, 'Type is required'),
  subjectId: z.coerce.number().min(1, 'Subject is required'),
  grade: z.string().optional(),
  academicYear: z.string().min(1, 'Academic year is required'),
  isVisible: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

export default function NotesPage() {
  const { schoolId } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Notes | null>(null);

  const { data, isLoading } = useNotes(schoolId || 0, { page: 0, size: 50 });
  const notes = data?.data?.content || [];
  const { data: subjectsRes } = useSubjects(schoolId || 0);
  const subjects = subjectsRes?.data || [];

  const { mutate: createNote, isPending: isCreating } = useCreateNote();
  const { mutate: updateNote, isPending: isUpdating } = useUpdateNote();
  const { mutate: deleteNote } = useDeleteNote();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      contentType: 'PDF',
      academicYear: '2024-25',
      isVisible: true,
    }
  });

  useEffect(() => {
    if (editingNote) {
      reset({
        title: editingNote.title,
        description: editingNote.description || '',
        contentUrl: editingNote.contentUrl,
        contentType: editingNote.contentType,
        subjectId: editingNote.subjectId,
        grade: editingNote.grade || '',
        academicYear: editingNote.academicYear || '2024-25',
        isVisible: editingNote.isVisible,
      });
    } else {
      reset({
        title: '',
        description: '',
        contentUrl: '',
        contentType: 'PDF',
        subjectId: 0,
        grade: '',
        academicYear: '2024-25',
        isVisible: true,
      });
    }
  }, [editingNote, reset]);

  const onSubmit = (data: FormData) => {
    if (!schoolId) return;
    if (editingNote) {
      updateNote({ schoolId, noteId: editingNote.id, data: data as any }, {
        onSuccess: () => {
          setOpen(false);
          setEditingNote(null);
        }
      });
    } else {
      createNote({ schoolId, data: data as any }, {
        onSuccess: () => {
          setOpen(false);
        }
      });
    }
  };

  const handleEdit = (note: Notes) => {
    setEditingNote(note);
    setOpen(true);
  };

  const handleDelete = (note: Notes) => {
    if (!schoolId) return;
    if (confirm('Are you sure you want to delete this resource?')) {
      deleteNote({ schoolId, noteId: note.id, subjectId: note.subjectId });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Notes & Content" description="Manage educational resources">
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setEditingNote(null); }}>
          <DialogTrigger render={<button className={cn(buttonVariants({ variant: 'default' }), "gap-2")}><Plus className="h-4 w-4" /> New Resource</button>} />
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingNote ? 'Edit Notes / Resource' : 'Upload Notes / Resource'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input {...register('title')} placeholder="e.g. Chapter 5 – Quadratic Equations" />
                {errors.title?.message && <p className="text-xs text-red-500">{String(errors.title.message)}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Content Type</Label>
                  <Controller name="contentType" control={control} render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CONTENT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
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
                  {errors.subjectId && <p className="text-xs text-red-500">{(errors.subjectId as any).message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Content URL</Label>
                <Input {...register('contentUrl')} placeholder="https://..." />
                {errors.contentUrl?.message && <p className="text-xs text-red-500">{String(errors.contentUrl.message)}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Grade</Label>
                  <Input {...register('grade')} placeholder="e.g. 10" />
                </div>
                <div className="space-y-2">
                  <Label>Academic Year</Label>
                  <Input {...register('academicYear')} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea {...register('description')} placeholder="Optional description..." rows={2} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => { setOpen(false); setEditingNote(null); }}>Cancel</Button>
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingNote ? 'Update' : 'Upload'}
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
        <div className="text-center py-24 text-muted-foreground border border-dashed rounded-lg bg-muted/10">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>No notes uploaded yet. Upload the first resource!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notes.map((n) => {
            const Icon = typeIcons[n.contentType] || FileText;
            return (
              <Card key={n.id} className="group relative overflow-hidden border-primary/10 hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Button variant="secondary" size="icon" className="h-7 w-7 shadow-sm" onClick={() => handleEdit(n)}>
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button variant="destructive" size="icon" className="h-7 w-7 shadow-sm" onClick={() => handleDelete(n)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                
                <CardContent className="p-0">
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold truncate">{n.title}</h3>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                          {n.subjectName}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 h-8">
                      {n.description || 'No description provided.'}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-[10px] bg-muted/30">
                        <Calendar className="h-3 w-3 mr-1" /> {n.academicYear}
                      </Badge>
                      {n.grade && (
                        <Badge variant="outline" className="text-[10px] bg-muted/30">
                          Grade {n.grade}
                        </Badge>
                      )}
                    </div>

                    <div className="pt-4 border-t flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <UserIcon className="h-3 w-3" />
                        <span className="truncate max-w-[100px]">{n.uploadedByName}</span>
                      </div>
                      <a 
                        href={n.contentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-[10px] font-bold flex items-center gap-1"
                      >
                        View Resource <ExternalLink className="h-3 w-3" />
                      </a>
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
