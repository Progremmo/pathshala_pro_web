'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser, useUpdateUser } from '@/hooks/use-users';
import { useClassrooms } from '@/hooks/use-schools';
import { useAuthStore } from '@/store/auth-store';
import { useEffect } from 'react';

const schema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  classRoomId: z.string().min(1, 'Classroom is required'),
  admissionNo: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const userId = Number(params.id);
  const { schoolId } = useAuthStore();

  const { data: userResponse, isLoading: isLoadingUser } = useUser(userId);
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { data: classroomsResponse, isLoading: isLoadingClasses } = useClassrooms(schoolId || 0);
  const classrooms = classroomsResponse?.data || [];

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: '',
      dateOfBirth: '',
      address: '',
      classRoomId: '',
      admissionNo: '',
      parentId: '',
    }
  });

  useEffect(() => {
    if (userResponse?.data) {
      const user = userResponse.data;
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        classRoomId: user.classRoomId?.toString() || '',
        admissionNo: user.admissionNo,
        parentId: user.parentId?.toString() || '',
      });
    }
  }, [userResponse, reset]);

  const onSubmit = (data: FormData) => {
    updateUser({
      id: userId,
      data: {
        ...data,
        classRoomId: Number(data.classRoomId),
        parentId: data.parentId ? Number(data.parentId) : undefined,
      },
    }, {
      onSuccess: () => {
        router.push('/school/students');
      }
    });
  };

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader title="Edit Student" description={`Update details for ${userResponse?.data?.fullName}`} />
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" {...register('firstName')} />
                  {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" {...register('lastName')} />
                  {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" {...register('email')} />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" {...register('phone')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value || ""}>
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
                <Input id="address" {...register('address')} />
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
                      <Select onValueChange={field.onChange} value={field.value || ""}>
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
                  <Input id="admissionNo" {...register('admissionNo')} />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
