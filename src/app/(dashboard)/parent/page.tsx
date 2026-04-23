'use client';

import { BarChart3, CreditCard, Clock, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/shared/stat-card';
import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth-store';

export default function ParentDashboard() {
  const { fullName } = useAuthStore();

  return (
    <div className="space-y-8">
      <PageHeader title={`Welcome, ${fullName?.split(' ')[0] || 'Parent'}`} description="Monitor your child's academic progress." />

      <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Child's Attendance" value="88%" subtitle="This semester" icon={Clock} iconClassName="bg-gradient-to-br from-emerald-500 to-teal-500" />
        <StatCard title="Avg. Score" value="82%" subtitle="All subjects" icon={BarChart3} iconClassName="bg-gradient-to-br from-blue-500 to-cyan-500" />
        <StatCard title="Fee Due" value="₹5,000" subtitle="Due May 10" icon={CreditCard} iconClassName="bg-gradient-to-br from-red-500 to-rose-500" />
        <StatCard title="Notifications" value={3} subtitle="1 unread" icon={Bell} iconClassName="bg-gradient-to-br from-violet-500 to-purple-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Results</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { subject: 'Mathematics', score: '42/50', pct: 84, grade: 'A' },
              { subject: 'Physics', score: '38/50', pct: 76, grade: 'B+' },
              { subject: 'English', score: '28/30', pct: 93, grade: 'A+' },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                <div><p className="text-sm font-medium">{r.subject}</p><p className="text-xs text-muted-foreground">{r.score}</p></div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${r.pct >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{r.pct}%</span>
                  <Badge variant="secondary" className="text-[10px]">{r.grade}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Fee Payment History</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { month: 'April 2026', amount: '₹5,000', status: 'PAID' },
              { month: 'March 2026', amount: '₹5,000', status: 'PAID' },
              { month: 'May 2026', amount: '₹5,000', status: 'PENDING' },
            ].map((fee, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                <div><p className="text-sm font-medium">{fee.month}</p><p className="text-xs text-muted-foreground">{fee.amount}</p></div>
                <Badge variant={fee.status === 'PAID' ? 'default' : 'destructive'} className="text-[10px]">{fee.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
