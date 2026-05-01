'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useStudentResults } from '@/hooks/use-exams';

export default function StudentResults() {
  const { schoolId, userId, classRoomId } = useAuthStore();
  
  const { data: resultsResponse, isLoading } = useStudentResults(
    schoolId!, 
    userId!, 
    classRoomId!, 
    '2024-25' // Default academic year, could be a state/selector
  );
  
  const results = resultsResponse?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader title="My Results" description="View your exam performance and grades" />
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left">
                  <th className="px-4 py-3 font-medium text-muted-foreground">Exam / Subject</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground text-center">Score</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Performance</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground text-center">Grade</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="h-32 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                    </td>
                  </tr>
                ) : results.length > 0 ? (
                  results.map((r) => {
                    const pct = r.marksObtained && r.maxMarks ? Math.round((r.marksObtained / r.maxMarks) * 100) : 0;
                    return (
                      <tr key={r.id} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <div>
                              <p className="font-medium">{r.examTitle}</p>
                              <Badge variant="secondary" className="text-[9px] mt-0.5">{r.subjectName}</Badge>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-center">
                          {r.isAbsent ? <span className="text-red-500">ABSENT</span> : `${r.marksObtained}/${r.maxMarks}`}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Progress value={pct} className="h-2 w-20" />
                            <span className={`text-sm font-bold ${pct >= 80 ? 'text-emerald-500' : pct >= 40 ? 'text-amber-500' : 'text-red-500'}`}>
                              {pct}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant="outline" className="text-[10px] font-bold">{r.grade || 'N/A'}</Badge>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="h-32 text-center text-muted-foreground">
                      No results published yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
