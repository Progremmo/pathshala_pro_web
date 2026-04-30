'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Loader2, Edit2, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject } from '@/hooks/use-subjects';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
  grade: z.string().optional(),
  creditHours: z.preprocess((val) => (val === "" ? undefined : val), z.coerce.number().optional()),
});

type FormData = z.infer<typeof schema>;

export default function SubjectsPage() {
  const { schoolId } = useAuthStore();
  const { data: response, isLoading } = useSubjects(schoolId || 0);
  const subjects = response?.data || [];
  
  const { mutate: createSubject, isPending: isCreating } = useCreateSubject();
  const { mutate: updateSubject, isPending: isUpdating } = useUpdateSubject();
  const { mutate: deleteSubject, isPending: isDeleting } = useDeleteSubject();
  
  const [open, setOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<any>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (editingSubject) {
      reset({
        name: editingSubject.name,
        code: editingSubject.code,
        description: editingSubject.description || '',
        grade: editingSubject.grade || '',
        creditHours: editingSubject.creditHours,
      });
    } else {
      reset({
        name: '',
        code: '',
        description: '',
        grade: '',
        creditHours: undefined,
      });
    }
  }, [editingSubject, reset]);

  const onSubmit = (data: FormData) => {
    if (!schoolId) return;
    
    if (editingSubject) {
      updateSubject({ schoolId, subjectId: editingSubject.id, data }, {
        onSuccess: () => {
          setOpen(false);
          setEditingSubject(null);
          reset();
        }
      });
    } else {
      createSubject({ schoolId, data }, {
        onSuccess: () => {
          setOpen(false);
          reset();
        }
      });
    }
  };

  const handleEdit = (subject: any) => {
    setEditingSubject(subject);
    setOpen(true);
  };

  const handleDelete = (subjectId: number) => {
    if (!schoolId) return;
    if (confirm('Are you sure you want to delete this subject?')) {
      deleteSubject({ schoolId, subjectId });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Subjects" description="Manage subjects taught at your school">
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setEditingSubject(null); }}>
          <DialogTrigger render={<button className={cn(buttonVariants({ variant: 'default' }), "gap-2")}><Plus className="h-4 w-4" /> Add Subject</button>} />
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Subject Name</Label>
                  <Input id="name" {...register('name')} placeholder="e.g. Mathematics" />
                  {errors.name?.message && <p className="text-xs text-red-500">{String(errors.name.message)}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Subject Code</Label>
                  <Input id="code" {...register('code')} placeholder="e.g. MATH101" />
                  {errors.code?.message && <p className="text-xs text-red-500">{String(errors.code.message)}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade (Optional)</Label>
                  <Input id="grade" {...register('grade')} placeholder="e.g. 10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="creditHours">Credit Hours</Label>
                  <Input id="creditHours" type="number" {...register('creditHours')} placeholder="3" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register('description')} placeholder="Brief description of the subject..." rows={3} />
              </div>
              <div className="flex justify-end pt-4 gap-2">
                <Button type="button" variant="outline" onClick={() => { setOpen(false); setEditingSubject(null); }}>Cancel</Button>
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingSubject ? 'Update Subject' : 'Save Subject'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Code</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Grade</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Credits</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    </td>
                  </tr>
                ) : subjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-muted-foreground">
                      No subjects found. Add one to get started.
                    </td>
                  </tr>
                ) : (
                  subjects.map((s: any) => (
                    <tr key={s.id} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-bold text-primary">{s.code}</td>
                      <td className="px-4 py-3 font-medium">{s.name}</td>
                      <td className="px-4 py-3">{s.grade || '-'}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.creditHours || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => handleEdit(s)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(s.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
