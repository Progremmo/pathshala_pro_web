'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRegisterUser } from '@/hooks/use-auth';
import { useAuthStore } from '@/store/auth-store';
import { useClassrooms } from '@/hooks/use-schools';

const schema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  classRoomId: z.string().min(1, 'Classroom is required'),
  admissionNo: z.string().optional(),
  parentId: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CreateStudentPage() {
  const router = useRouter();
  const { schoolId } = useAuthStore();
  const { mutate: registerStudent, isPending } = useRegisterUser();
  const { data: classroomsResponse, isLoading: isLoadingClasses } = useClassrooms(schoolId || 0);
  const classrooms = classroomsResponse?.data || [];

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: 'MALE',
    }
  });

  const onSubmit = (data: FormData) => {
    if (!schoolId) return;
    registerStudent({
      ...data,
      classRoomId: Number(data.classRoomId),
      parentId: data.parentId ? Number(data.parentId) : undefined,
      role: 'STUDENT',
      schoolId: schoolId,
    }, {
      onSuccess: () => {
        router.push('/school/students');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader title="Add New Student" description="Register a new student to your school" />
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" {...register('firstName')} placeholder="John" />
                  {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" {...register('lastName')} placeholder="Doe" />
                  {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" {...register('email')} placeholder="john.doe@example.com" />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" {...register('phone')} placeholder="+919876543210" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register('address')} placeholder="123 Main St, City, State, ZIP" />
              </div>
            </div>

            <hr className="my-6" />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Academic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="classRoomId">Assigned Classroom</Label>
                  <Controller
                    name="classRoomId"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingClasses ? "Loading classes..." : "Select classroom"} />
                        </SelectTrigger>
                        <SelectContent>
                          {classrooms.map((c: any) => (
                            <SelectItem key={c.id} value={c.id.toString()}>
                              {c.name} {c.section ? `(${c.section})` : ''} - Grade {c.grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.classRoomId && <p className="text-xs text-red-500">{errors.classRoomId.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admissionNo">Admission Number</Label>
                  <Input id="admissionNo" {...register('admissionNo')} placeholder="ADM-2024-501" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Register Student
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              The student will receive an email with their auto-generated login credentials.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
