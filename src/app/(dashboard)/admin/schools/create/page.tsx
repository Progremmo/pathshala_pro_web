'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateSchool } from '@/hooks/use-schools';
import { SchoolRequest } from '@/types/school.types';

export default function CreateSchoolPage() {
  const router = useRouter();
  const createSchool = useCreateSchool();
  const [formData, setFormData] = useState<SchoolRequest>({
    name: '',
    code: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    website: '',
    logoUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSchool.mutate(formData, {
      onSuccess: () => {
        router.push('/admin/schools');
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Add New School" 
        description="Register a new school on the platform."
      />

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>School Information</CardTitle>
          <CardDescription>Enter the basic details for the new school.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">School Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Delhi Public School" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">School Code</Label>
                <Input id="code" name="code" value={formData.code} onChange={handleChange} required placeholder="DPS001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="admin@dps.edu" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 9876543210" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} required placeholder="123 Education Lane" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} required placeholder="New Delhi" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" value={formData.state} onChange={handleChange} required placeholder="Delhi" />
              </div>
            </div>
            
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={createSchool.isPending}>
                {createSchool.isPending ? 'Creating...' : 'Create School'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
