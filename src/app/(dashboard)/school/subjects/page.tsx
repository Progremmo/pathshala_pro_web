'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useSubjects, useCreateSubject } from '@/hooks/use-subjects';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
  grade: z.string().optional(),
  creditHours: z.coerce.number().optional(),
});

type FormData = z.infer<typeof schema>;

export default function SubjectsPage() {
  const { schoolId } = useAuthStore();
  const { data: response, isLoading } = useSubjects(schoolId || 0);
  const subjects = response?.data || [];
  const { mutate: createSubject, isPending } = useCreateSubject();
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    if (!schoolId) return;
    createSubject({ schoolId, data }, {
      onSuccess: () => {
        setOpen(false);
        reset();
      }
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Subjects" description="Manage subjects taught at your school">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Subject</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Subject Name</Label>
                  <Input id="name" {...register('name')} placeholder="e.g. Mathematics" />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Subject Code</Label>
                  <Input id="code" {...register('code')} placeholder="e.g. MATH101" />
                  {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
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
                <Textarea id="description" {...register('description')} placeholder="Brief description of the subject..." />
              </div>
              <div className="flex justify-end pt-4 gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Subject
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
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    </td>
                  </tr>
                ) : subjects.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-muted-foreground">
                      No subjects found. Add one to get started.
                    </td>
                  </tr>
                ) : (
                  subjects.map((s: any) => (
                    <tr key={s.id} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">{s.code}</td>
                      <td className="px-4 py-3 font-medium">{s.name}</td>
                      <td className="px-4 py-3">{s.grade || '-'}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.creditHours || '-'}</td>
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
