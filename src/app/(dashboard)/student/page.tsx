'use client';

import { Calendar, FileText, CreditCard, Clock, Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/shared/stat-card';
import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth-store';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useExams } from '@/hooks/use-exams';
import { useStudentAttendanceStats } from '@/hooks/use-attendance';
import { useStudentInvoices } from '@/hooks/use-fees';
import { useUnreadCount } from '@/hooks/use-communication';
import Link from 'next/link';

export default function StudentDashboard() {
  const { fullName, schoolId, userId } = useAuthStore();
  
  // Dates for attendance
  const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];

  // Fetch Data
  const { data: attendanceData } = useStudentAttendanceStats(schoolId || 0, userId || 0, startOfYear, today);
  const { data: examsData, isLoading: isExamsLoading } = useExams(schoolId || 0, { page: 0, size: 5 });
  const { data: invoicesData } = useStudentInvoices(schoolId || 0, userId || 0, { page: 0, size: 50 });
  const { data: notificationsData } = useUnreadCount(schoolId || 0);

  const stats = attendanceData?.data;
  const attendancePercentage = stats ? Math.round((stats.present / stats.totalDays) * 100) : 0;
  
  const chartData = [
    { name: 'Present', value: stats?.present || 0, color: '#10b981' },
    { name: 'Absent', value: (stats?.totalDays || 0) - (stats?.present || 0), color: '#ef4444' },
  ];

  // Calculate pending fees
  const invoices = invoicesData?.data?.content || [];
  const pendingFees = invoices
    .filter(inv => inv.paymentStatus !== 'PAID')
    .reduce((sum, inv) => sum + (inv.netAmount - inv.paidAmount), 0);

  // Upcoming exams
  const upcomingExams = (examsData?.data?.content || [])
    .filter(exam => new Date(exam.examDate) >= new Date())
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <PageHeader title={`Hello, ${fullName?.split(' ')[0] || 'Student'}`} description="Stay updated with your academics." />

      <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Attendance" value={`${attendancePercentage}%`} subtitle="This year" icon={Clock} iconClassName="bg-gradient-to-br from-emerald-500 to-teal-500" />
        <StatCard title="Upcoming Exams" value={upcomingExams.length} subtitle="Scheduled" icon={FileText} iconClassName="bg-gradient-to-br from-amber-500 to-orange-500" />
        <StatCard title="Pending Fees" value={`₹${pendingFees.toLocaleString('en-IN')}`} subtitle="Total due" icon={CreditCard} iconClassName="bg-gradient-to-br from-red-500 to-rose-500" />
        <StatCard title="Notifications" value={notificationsData?.data?.unreadCount || 0} subtitle="Unread" icon={Bell} iconClassName="bg-gradient-to-br from-violet-500 to-purple-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-base">Attendance Overview</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center">
            {stats?.totalDays ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart><Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} startAngle={90} endAngle={-270} dataKey="value">
                    {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie></PieChart>
                </ResponsiveContainer>
                <p className="text-3xl font-bold text-emerald-500">{attendancePercentage}%</p>
                <p className="text-xs text-muted-foreground mt-1">{stats.present}/{stats.totalDays} days present</p>
              </>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-muted-foreground text-sm">No attendance data</div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Upcoming Exams</CardTitle>
              <Link href="/student/exams"><Button variant="ghost" size="sm">View All</Button></Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {isExamsLoading ? (
              <div className="flex justify-center p-4"><div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" /></div>
            ) : upcomingExams.length > 0 ? (
              upcomingExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between rounded-lg border border-border/50 p-4 hover:bg-accent/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10"><FileText className="h-5 w-5 text-amber-500" /></div>
                    <div><p className="text-sm font-medium">{exam.name}</p><p className="text-xs text-muted-foreground">{new Date(exam.examDate).toLocaleDateString()}</p></div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{exam.examType}</Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-lg">No upcoming exams</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
