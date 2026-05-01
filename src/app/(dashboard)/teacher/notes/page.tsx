'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesService } from '@/services/notes.service';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function TeacherNotes() {
  const { schoolId } = useAuthStore();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data: notesResponse, isLoading } = useQuery({
    queryKey: ['notes', schoolId],
    queryFn: () => notesService.getAll(schoolId!),
    enabled: !!schoolId,
  });

  const deleteNote = useMutation({
    mutationFn: (noteId: number) => notesService.delete(schoolId!, noteId),
    onSuccess: () => {
      toast.success('Note deleted');
      queryClient.invalidateQueries({ queryKey: ['notes', schoolId] });
    },
  });

  const notes = notesResponse?.data?.content || [];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Study Material" 
        description="Upload and manage class notes, documents and resources"
      >
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Upload Note</Button>
          </DialogTrigger>
          <AddNoteDialog schoolId={schoolId!} onSuccess={() => setIsAddOpen(false)} />
        </Dialog>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex h-32 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : notes.length > 0 ? (
          notes.map((note: any) => (
            <Card key={note.id} className="group hover:border-primary/50 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive"
                      onClick={() => deleteNote.mutate(note.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-medium text-sm line-clamp-1">{note.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[2rem]">
                    {note.description || 'No description provided.'}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <div>
                    <p className="text-[10px] font-medium text-primary uppercase">{note.subjectName}</p>
                    <p className="text-[10px] text-muted-foreground">{format(new Date(note.uploadedDate), 'MMM d, yyyy')}</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={() => window.open(note.fileUrl, '_blank')}>
                    <ExternalLink className="h-3 w-3" /> View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full p-10 text-center text-muted-foreground border-2 border-dashed rounded-xl">
            <p>No study material uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AddNoteDialog({ schoolId, onSuccess }: { schoolId: number; onSuccess: () => void }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileUrl: '',
    subjectId: ''
  });

  const createNote = useMutation({
    mutationFn: (data: any) => notesService.create(schoolId, data),
    onSuccess: () => {
      toast.success('Note uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['notes', schoolId] });
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to upload note');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.fileUrl || !formData.subjectId) return;
    createNote.mutate({
      ...formData,
      subjectId: Number(formData.subjectId)
    });
  };

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Upload Study Material</DialogTitle></DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input 
            id="title" 
            placeholder="e.g. Algebra Basics Notes" 
            value={formData.title}
            onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
            required 
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject ID</Label>
            <Input 
              id="subject" 
              type="number" 
              value={formData.subjectId}
              onChange={e => setFormData(p => ({ ...p, subjectId: e.target.value }))}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">File URL</Label>
            <Input 
              id="url" 
              placeholder="https://..." 
              value={formData.fileUrl}
              onChange={e => setFormData(p => ({ ...p, fileUrl: e.target.value }))}
              required 
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea 
            id="desc" 
            placeholder="Briefly describe the content..." 
            value={formData.description}
            onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
          />
        </div>
        <Button type="submit" className="w-full" disabled={createNote.isPending}>
          {createNote.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Upload Note
        </Button>
      </form>
    </DialogContent>
  );
}
