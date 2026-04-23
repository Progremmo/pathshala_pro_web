'use client';
import { School, Plus } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/empty-state';
import { useSchools } from '@/hooks/use-schools';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminSchoolsPage() {
  const router = useRouter();
  const { data, isLoading } = useSchools({ page: 0, size: 50 });
  const schools = data?.data?.content || [];

  return (
    <div className="space-y-6">
      <PageHeader title="All Schools" description="Manage registered schools">
        <Link href="/admin/schools/create">
          <Button className="gap-2"><Plus className="h-4 w-4" /> Add School</Button>
        </Link>
      </PageHeader>
      <Card><CardContent className="p-0">
        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/30">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">School</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Code</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">City</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
          </tr></thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="p-8 text-center"><div className="flex justify-center"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" /></div></td></tr>
            ) : schools.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No schools found</td></tr>
            ) : (
              schools.map((s) => (
                <tr 
                  key={s.id} 
                  className="border-b last:border-0 hover:bg-accent/30 transition-colors cursor-pointer"
                  onClick={() => router.push(`/admin/schools/${s.id}`)}
                >
                  <td className="px-4 py-3 font-medium flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <School className="h-4 w-4 text-primary" />
                    </div>
                    {s.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{s.code}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.city}</td>
                  <td className="px-4 py-3"><Badge variant={s.subscriptionStatus === 'ACTIVE' ? 'default' : 'secondary'} className="text-[10px]">{s.subscriptionStatus}</Badge></td>
                </tr>
              ))
            )}
          </tbody>
        </table></div>
      </CardContent></Card>
    </div>
  );
}
