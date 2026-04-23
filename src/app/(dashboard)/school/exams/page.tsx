'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EXAM_TYPE_LABELS } from '@/lib/constants';

import { useExams } from '@/hooks/use-exams';
import { useAuthStore } from '@/store/auth-store';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function ExamsPage() {
  const { schoolId } = useAuthStore();
  const { data, isLoading } = useExams({ schoolId: schoolId || 0, page: 0, size: 50 });
  const exams = data?.data?.content || [];

  return (
    <div className="space-y-6">
      <PageHeader title="Exams" description="Create and manage examinations">
        <Button className="gap-2"><Plus className="h-4 w-4" /> Create Exam</Button>
      </PageHeader>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Exam</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Marks</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    </td>
                  </tr>
                ) : exams.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-muted-foreground">
                      No exams scheduled.
                    </td>
                  </tr>
                ) : (
                  exams.map((e) => (
                    <tr key={e.id} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{e.name}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="text-[10px]">
                          {EXAM_TYPE_LABELS[e.type as keyof typeof EXAM_TYPE_LABELS]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {e.examDate ? format(new Date(e.examDate), 'MMM dd, yyyy') : 'N/A'}
                      </td>
                      <td className="px-4 py-3">{e.totalMarks}</td>
                      <td className="px-4 py-3">
                        <Badge variant={e.isPublished ? 'default' : 'outline'} className="text-[10px]">
                          {e.isPublished ? 'Published' : 'Draft'}
                        </Badge>
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
