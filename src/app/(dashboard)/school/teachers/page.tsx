'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { useUsers } from '@/hooks/use-users';
import { useAuthStore } from '@/store/auth-store';
import { Loader2, Mail } from 'lucide-react';
import Link from 'next/link';

export default function TeachersPage() {
  const { schoolId } = useAuthStore();
  const { data, isLoading } = useUsers({ schoolId: schoolId || 0, role: 'TEACHER', page: 0, size: 50 });
  const teachers = data?.data?.content || [];

  return (
    <div className="space-y-6">
      <PageHeader title="Teachers" description="Manage teaching staff">
        <Link href="/school/teachers/create">
          <Button className="gap-2"><Plus className="h-4 w-4" /> Add Teacher</Button>
        </Link>
      </PageHeader>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Qualification</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    </td>
                  </tr>
                ) : teachers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-muted-foreground">
                      No teachers found for this school.
                    </td>
                  </tr>
                ) : (
                  teachers.map((t) => (
                    <tr key={t.id} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{t.fullName}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Mail className="h-3 w-3" />
                          {t.email}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="text-[10px]">
                          {t.qualification || 'N/A'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{t.employeeId || 'N/A'}</td>
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
