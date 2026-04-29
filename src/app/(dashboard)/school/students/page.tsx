'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { useUsers, useToggleUserStatus } from '@/hooks/use-users';
import { useAuthStore } from '@/store/auth-store';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';

export default function StudentsPage() {
  const { schoolId } = useAuthStore();
  const { data, isLoading } = useUsers({ schoolId: schoolId || 0, role: 'STUDENT', page: 0, size: 50 });
  const { mutate: toggleStatus, isPending: isToggling } = useToggleUserStatus();
  const students = data?.data?.content || [];

  return (
    <div className="space-y-6">
      <PageHeader title="Students" description="Manage enrolled students">
        <Link href="/school/students/create">
          <Button className="gap-2"><Plus className="h-4 w-4" /> Add Student</Button>
        </Link>
      </PageHeader>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Admission No.</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Class</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Gender</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
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
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-muted-foreground">
                      No students found for this school.
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr key={s.id} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{s.fullName}</td>
                      <td className="px-4 py-3 font-mono text-xs">{s.admissionNo || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="text-[10px]">
                          {s.classRoomName || 'Unassigned'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground capitalize">{s.gender?.toLowerCase() || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <Switch 
                          checked={s.isActive} 
                          onCheckedChange={(checked) => toggleStatus({ id: s.id, active: checked })}
                          disabled={isToggling}
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/school/students/${s.id}/edit`}>
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                            Edit
                          </Button>
                        </Link>
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
