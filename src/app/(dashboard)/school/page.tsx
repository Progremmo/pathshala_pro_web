'use client';

import { GraduationCap, Users, DollarSign, UserCheck, Megaphone, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/shared/stat-card';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth-store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAnnouncements } from '@/hooks/use-communication';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

const feeData = [
  { month: 'Jan', collected: 450000, pending: 85000 },
  { month: 'Feb', collected: 520000, pending: 65000 },
  { month: 'Mar', collected: 480000, pending: 90000 },
  { month: 'Apr', collected: 610000, pending: 40000 },
];

const attendancePie = [
  { name: 'Present', value: 85, color: '#10b981' },
  { name: 'Absent', value: 8, color: '#ef4444' },
  { name: 'Late', value: 5, color: '#f59e0b' },
  { name: 'Leave', value: 2, color: '#8b5cf6' },
];

export default function SchoolDashboard() {
  const { fullName, schoolName, schoolId } = useAuthStore();
  const { data: announcementsData, isLoading } = useAnnouncements(schoolId || 0, undefined, { page: 0, size: 5 });
  const announcements = announcementsData?.data?.content || [];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome, ${fullName?.split(' ')[0] || 'Admin'}`}
        description={schoolName || 'Manage your school efficiently'}
      >
        <Link href="/school/students/create">
          <Button variant="outline" className="gap-2"><GraduationCap className="h-4 w-4" /> Add Student</Button>
        </Link>
        <Link href="/school/announcements">
          <Button className="gap-2"><Megaphone className="h-4 w-4" /> New Announcement</Button>
        </Link>
      </PageHeader>

      <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={856} subtitle="Class 1-12" icon={GraduationCap}
          trend={{ value: 5, label: '' }} iconClassName="bg-gradient-to-br from-blue-500 to-cyan-500" />
        <StatCard title="Total Teachers" value={42} subtitle="All departments" icon={Users}
          trend={{ value: 2, label: '' }} iconClassName="bg-gradient-to-br from-emerald-500 to-teal-500" />
        <StatCard title="Fee Collection" value="₹6.1L" subtitle="This month" icon={DollarSign}
          trend={{ value: 18, label: '' }} iconClassName="bg-gradient-to-br from-amber-500 to-orange-500" />
        <StatCard title="Attendance Today" value="92%" subtitle="Present students" icon={UserCheck}
          trend={{ value: 3, label: '' }} iconClassName="bg-gradient-to-br from-violet-500 to-purple-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fee Collection Trend</CardTitle>
            <CardDescription>Monthly collection vs pending</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={feeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${v / 1000}K`} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="collected" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Today&apos;s Attendance</CardTitle>
            <CardDescription>School-wide distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={attendancePie} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={3} dataKey="value">
                  {attendancePie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-4">
              {attendancePie.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Announcements</CardTitle>
            <Link href="/school/announcements">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center p-4"><div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" /></div>
          ) : announcements.length > 0 ? (
            announcements.map((ann) => (
              <div key={ann.id} className="flex items-center justify-between rounded-lg border border-border/50 p-4 hover:bg-accent/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                    <Megaphone className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{ann.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {ann.createdAt ? formatDistanceToNow(new Date(ann.createdAt), { addSuffix: true }) : 'Recently'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {ann.isPinned && <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-500">Pinned</Badge>}
                  <Badge variant="secondary" className="text-[10px]">{ann.targetAudience}</Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-lg">No announcements found</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
