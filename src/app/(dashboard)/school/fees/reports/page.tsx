'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { formatCurrency } from '@/utils/format';
import { StatCard } from '@/components/shared/stat-card';
import { DollarSign, TrendingUp, TrendingDown, Users } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', collected: 450000, pending: 85000, students: 856 },
  { month: 'Feb', collected: 520000, pending: 65000, students: 856 },
  { month: 'Mar', collected: 480000, pending: 90000, students: 860 },
  { month: 'Apr', collected: 610000, pending: 40000, students: 862 },
];

export default function FeeReportsPage() {
  const totalCollected = monthlyData.reduce((s, m) => s + m.collected, 0);
  const totalPending = monthlyData.reduce((s, m) => s + m.pending, 0);

  return (
    <div className="space-y-8">
      <PageHeader title="Fee Reports" description="Financial analytics and fee collection insights" />
      <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Collected" value={formatCurrency(totalCollected)} icon={DollarSign} iconClassName="bg-gradient-to-br from-emerald-500 to-teal-500" />
        <StatCard title="Outstanding" value={formatCurrency(totalPending)} icon={TrendingDown} iconClassName="bg-gradient-to-br from-red-500 to-rose-500" />
        <StatCard title="Collection Rate" value="88%" icon={TrendingUp} iconClassName="bg-gradient-to-br from-blue-500 to-cyan-500" />
        <StatCard title="Students" value={862} icon={Users} iconClassName="bg-gradient-to-br from-violet-500 to-purple-500" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Monthly Collection</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${v/1000}K`} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="collected" fill="#10b981" radius={[4, 4, 0, 0]} name="Collected" />
                <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Collection Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${v/1000}K`} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="collected" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
