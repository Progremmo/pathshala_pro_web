'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSchool, useUpdateSchool } from '@/hooks/use-schools';
import { useRegisterAdmin } from '@/hooks/use-auth';
import { useUsers, userKeys } from '@/hooks/use-users';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Building, UserPlus, Phone, Mail, MapPin, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const adminSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});

const schoolSchema = z.object({
  name: z.string().min(1, 'School name is required'),
  code: z.string().min(1, 'School code is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(6, 'Invalid pincode'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type AdminFormValues = z.infer<typeof adminSchema>;
type SchoolFormValues = z.infer<typeof schoolSchema>;

export default function SchoolDetailsPage() {
  const { id } = useParams();
  const schoolId = parseInt(id as string, 10);

  const { data: response, isLoading } = useSchool(schoolId);
  const school = response?.data;
  const updateSchool = useUpdateSchool();
  const registerAdmin = useRegisterAdmin();
  const queryClient = useQueryClient();

  const { data: adminData, isLoading: isAdminLoading } = useUsers({ schoolId, role: 'SCHOOL_ADMIN' });
  const admins = adminData?.data?.content || [];

  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const { register: registerAdminForm, handleSubmit: handleAdminSubmit, formState: { errors: adminErrors }, reset: resetAdminForm } = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema)
  });

  const { register: registerSchoolForm, handleSubmit: handleSchoolSubmit, formState: { errors: schoolErrors }, reset: resetSchoolForm } = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema)
  });

  useEffect(() => {
    if (school) {
      resetSchoolForm({
        name: school.name || '',
        code: school.code || '',
        email: school.email || '',
        phone: school.phone || '',
        address: school.address || '',
        city: school.city || '',
        state: school.state || '',
        pincode: school.pincode || '',
        website: school.website || '',
      });
    }
  }, [school, resetSchoolForm]);

  if (isLoading) {
    return <div className="flex h-[400px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!school) {
    return <div>School not found</div>;
  }

  const onAddAdmin = (data: AdminFormValues) => {
    registerAdmin.mutate(
      { ...data, schoolId },
      {
        onSuccess: () => {
          setAdminDialogOpen(false);
          resetAdminForm();
          queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        }
      }
    );
  };

  const onUpdateSchool = (data: SchoolFormValues) => {
    updateSchool.mutate({ id: schoolId, data: data as any });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={school.name}
        description={`School Code: ${school.code}`}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview"><Building className="mr-2 h-4 w-4" /> Overview</TabsTrigger>
          <TabsTrigger value="admins"><UserPlus className="mr-2 h-4 w-4" /> Administrators</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>School Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground mb-1">Status</p><Badge variant={school.isActive ? "default" : "destructive"}>{school.isActive ? "Active" : "Inactive"}</Badge></div>
                  <div><p className="text-muted-foreground mb-1">Subscription</p><Badge variant="secondary">{school.subscriptionStatus}</Badge></div>
                  <div className="col-span-2 flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> {school.email || 'N/A'}</div>
                  <div className="col-span-2 flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {school.phone || 'N/A'}</div>
                  <div className="col-span-2 flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> {school.address}, {school.city}, {school.state} {school.pincode}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Edit School Details</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleSchoolSubmit(onUpdateSchool)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>School Name</Label>
                      <Input {...registerSchoolForm('name')} />
                    </div>
                    <div className="space-y-2">
                      <Label>School Code</Label>
                      <Input {...registerSchoolForm('code')} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input {...registerSchoolForm('email')} />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input {...registerSchoolForm('phone')} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input {...registerSchoolForm('address')} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input {...registerSchoolForm('city')} />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input {...registerSchoolForm('state')} />
                    </div>
                    <div className="space-y-2">
                      <Label>Pincode</Label>
                      <Input {...registerSchoolForm('pincode')} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={updateSchool.isPending}>
                    {updateSchool.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="admins">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>School Administrators</CardTitle>
              <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
                <DialogTrigger render={<Button size="sm" className="gap-2" />}>
                  <Plus className="h-4 w-4" /> Add Admin
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add School Administrator</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAdminSubmit(onAddAdmin)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input {...registerAdminForm('firstName')} />
                        {adminErrors.firstName && <p className="text-xs text-destructive">{adminErrors.firstName.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input {...registerAdminForm('lastName')} />
                        {adminErrors.lastName && <p className="text-xs text-destructive">{adminErrors.lastName.message}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" {...registerAdminForm('email')} />
                      {adminErrors.email && <p className="text-xs text-destructive">{adminErrors.email.message}</p>}
                      <p className="text-xs text-muted-foreground">Login credentials will be sent to this email automatically.</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Phone (Optional)</Label>
                      <Input {...registerAdminForm('phone')} />
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={registerAdmin.isPending}>
                        {registerAdmin.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Admin
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {isAdminLoading ? (
                <div className="flex h-32 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : admins.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg bg-muted/20">
                  No administrators found for this school.
                  <br />
                  Click "Add Admin" to create one.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Phone</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map((admin) => (
                        <tr key={admin.id} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
                          <td className="px-4 py-3 font-medium">{admin.fullName}</td>
                          <td className="px-4 py-3 text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {admin.email}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {admin.phone ? (
                              <div className="flex items-center gap-1"><Phone className="h-3 w-3" /> {admin.phone}</div>
                            ) : '-'}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={admin.isActive ? "default" : "secondary"} className="text-[10px]">
                              {admin.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
