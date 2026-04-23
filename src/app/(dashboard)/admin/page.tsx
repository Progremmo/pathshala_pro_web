'use client';

import { School, Users, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/shared/stat-card';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth-store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useSchools } from '@/hooks/use-schools';
import { StatCardSkeleton } from '@/components/shared/loading-skeleton';
import Link from 'next/link';

const planData = [
  { name: 'Starter', value: 15, color: '#6366f1' },
  { name: 'Pro', value: 18, color: '#8b5cf6' },
  { name: 'Enterprise', value: 5, color: '#a78bfa' },
];

export default function AdminDashboard() {
  const { fullName } = useAuthStore();
  const { data, isLoading } = useSchools({ page: 0, size: 10 });
  const schools = data?.data?.content || [];
  const totalSchools = data?.data?.totalElements || 0;

  // Process data for charts
  const cityCounts = schools.reduce((acc: Record<string, number>, school) => {
    const city = school.city || 'Unknown';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});
  
  const schoolData = Object.entries(cityCounts).map(([name, count]) => ({ name, count }));

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${fullName?.split(' ')[0] || 'Admin'}`}
        description="Here's an overview of all schools in your platform."
      >
        <Link href="/admin/schools/create">
          <Button className="gap-2">
            <School className="h-4 w-4" /> Add School
          </Button>
        </Link>
      </PageHeader>

      {/* KPI Cards */}
      <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Schools"
              value={totalSchools}
              subtitle="Registered on platform"
              icon={School}
              trend={{ value: 5, label: 'vs last month' }}
              iconClassName="bg-gradient-to-br from-indigo-500 to-violet-500"
            />
            <StatCard
              title="Total Users"
              value="4,280"
              subtitle="Across all schools"
              icon={Users}
              trend={{ value: 8, label: 'growth' }}
              iconClassName="bg-gradient-to-br from-cyan-500 to-blue-500"
            />
            <StatCard
              title="Revenue (MTD)"
              value="₹18.5L"
              subtitle="April 2026"
              icon={DollarSign}
              trend={{ value: 12, label: 'vs last month' }}
              iconClassName="bg-gradient-to-br from-emerald-500 to-teal-500"
            />
            <StatCard
              title="Active Subscriptions"
              value={33}
              subtitle="5 on trial"
              icon={TrendingUp}
              trend={{ value: 3, label: 'new' }}
              iconClassName="bg-gradient-to-br from-amber-500 to-orange-500"
            />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Schools by City</CardTitle>
            <CardDescription>Distribution of registered schools</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading chart...</div>
            ) : schoolData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={schoolData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subscription Plans</CardTitle>
            <CardDescription>Active subscriptions by plan</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={planData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                  {planData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-center gap-6">
              {planData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent schools */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Schools</CardTitle>
              <CardDescription>Latest school registrations</CardDescription>
            </div>
            <Link href="/admin/schools">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex justify-center p-4"><div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" /></div>
            ) : schools.length > 0 ? (
              schools.map((school) => (
                <div key={school.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-card p-4 transition-colors hover:bg-accent/30">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <School className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{school.name}</p>
                      <p className="text-xs text-muted-foreground">{school.code} • {school.city}</p>
                    </div>
                  </div>
                  <Badge variant={school.subscriptionStatus === 'ACTIVE' ? 'default' : 'secondary'} className="text-[10px]">
                    {school.subscriptionStatus}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-lg">No schools found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
