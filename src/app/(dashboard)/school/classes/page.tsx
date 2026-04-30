'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Loader2, Edit2, Trash2, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useClassrooms, useCreateClassroom, useUpdateClassroom, useDeleteClassroom } from '@/hooks/use-schools';
import { useUsers } from '@/hooks/use-users';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useSchoolConfigs } from '@/hooks/use-school-configs';
import { DEFAULT_ACADEMIC_YEARS } from '@/lib/constants';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  section: z.string().optional().nullable(),
  grade: z.string().min(1, 'Grade is required'),
  academicYear: z.string().min(1, 'Academic year is required'),
  capacity: z.any().optional(),
  roomNumber: z.string().optional().nullable(),
  classTeacherId: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

export default function ClassesPage() {
  const { schoolId } = useAuthStore();
  const { data: classrooms, isLoading } = useClassrooms(schoolId || 0);
  const { data: teachersResponse, isLoading: isLoadingTeachers } = useUsers(
    schoolId ? { schoolId, role: 'TEACHER', size: 100 } : undefined
  );
  const teachers = teachersResponse?.data?.content || [];
  
  const { data: schoolConfigs } = useSchoolConfigs(schoolId || 0);
  const academicYears = schoolConfigs?.ACADEMIC_YEARS || DEFAULT_ACADEMIC_YEARS;
  
  const { mutate: createClass, isPending: isCreating } = useCreateClassroom();
  const { mutate: updateClass, isPending: isUpdating } = useUpdateClassroom();
  const { mutate: deleteClass, isPending: isDeleting } = useDeleteClassroom();
  
  const [open, setOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      academicYear: academicYears[0],
      classTeacherId: '',
    }
  });

  useEffect(() => {
    if (editingClass) {
      reset({
        name: editingClass.name,
        section: editingClass.section || '',
        grade: editingClass.grade,
        academicYear: editingClass.academicYear,
        capacity: editingClass.capacity,
        roomNumber: editingClass.roomNumber || '',
        classTeacherId: editingClass.classTeacherId?.toString() || '',
      });
    } else {
      reset({
        name: '',
        section: '',
        academicYear: academicYears[0],
        capacity: undefined,
        roomNumber: '',
        classTeacherId: '',
      });
    }
  }, [editingClass, reset]);

  const onSubmit = (data: any) => {
    if (!schoolId) return;
    const payload = {
      ...data,
      classTeacherId: data.classTeacherId ? Number(data.classTeacherId) : null,
    };

    if (editingClass) {
      updateClass({ schoolId, classRoomId: editingClass.id, data: payload }, {
        onSuccess: () => {
          setOpen(false);
          setEditingClass(null);
          reset();
        }
      });
    } else {
      createClass({ schoolId, data: payload }, {
        onSuccess: () => {
          setOpen(false);
          reset();
        }
      });
    }
  };

  const handleEdit = (cls: any) => {
    setEditingClass(cls);
    setOpen(true);
  };

  const handleDelete = (classRoomId: number) => {
    if (!schoolId) return;
    deleteClass({ schoolId, classRoomId });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Classes" description="Manage classrooms and sections">
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setEditingClass(null); }}>
          <DialogTrigger render={<button className={cn(buttonVariants({ variant: 'default' }), "gap-2")}><Plus className="h-4 w-4" /> Add Class</button>} />
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingClass ? 'Edit Class' : 'Add New Class'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Class Name</Label>
                  <Input id="name" {...register('name')} placeholder="e.g. Class 10" />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Input id="grade" {...register('grade')} placeholder="e.g. 10" />
                  {errors.grade && <p className="text-xs text-red-500">{errors.grade.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <Input id="section" {...register('section')} placeholder="e.g. A" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Controller
                    name="academicYear"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {academicYears.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.academicYear && <p className="text-xs text-red-500">{errors.academicYear.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input id="capacity" type="number" {...register('capacity')} placeholder="40" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roomNumber">Room Number</Label>
                  <Input id="roomNumber" {...register('roomNumber')} placeholder="101A" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Class Teacher</Label>
                <Controller
                  name="classTeacherId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingTeachers ? "Loading..." : "Select a teacher"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No teacher assigned</SelectItem>
                        {teachers.map((t: any) => (
                          <SelectItem key={t.id} value={t.id.toString()}>
                            {t.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="flex justify-end pt-4 gap-2">
                <Button type="button" variant="outline" onClick={() => { setOpen(false); setEditingClass(null); }}>Cancel</Button>
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingClass ? 'Update Class' : 'Save Class'}
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
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Section</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Grade</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Class Teacher</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Room</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Capacity</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    </td>
                  </tr>
                ) : !classrooms?.data || classrooms.data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center text-muted-foreground">
                      No classes found. Add one to get started.
                    </td>
                  </tr>
                ) : (
                  classrooms.data.map((c: any) => (
                    <tr key={c.id} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{c.name}</td>
                      <td className="px-4 py-3">{c.section || '-'}</td>
                      <td className="px-4 py-3">{c.grade}</td>
                      <td className="px-4 py-3">
                        {c.classTeacherName ? (
                          <div className="flex items-center gap-2">
                            <UserIcon className="h-3 w-3 text-muted-foreground" />
                            <span>{c.classTeacherName}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{c.roomNumber || '-'}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.capacity || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => handleEdit(c)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this classroom?')) {
                                handleDelete(c.id);
                              }
                            }}
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
