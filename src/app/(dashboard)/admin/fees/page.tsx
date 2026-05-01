'use client';

import { 
  DollarSign, 
  Receipt, 
  Settings, 
  Users, 
  Calendar,
  CreditCard,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/shared/stat-card';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useFeeSummary } from '@/hooks/use-fees';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const collectionData = [
  { month: 'Jan', collected: 450000, expected: 500000 },
  { month: 'Feb', collected: 480000, expected: 500000 },
  { month: 'Mar', collected: 520000, expected: 500000 },
  { month: 'Apr', collected: 410000, expected: 550000 },
];

export default function FeesDashboard() {
  const { schoolId } = useAuthStore();
  const currentYear = new Date().getFullYear();
  const { data: summary, isLoading } = useFeeSummary(schoolId || 1, currentYear);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Fee Management"
        description="Configure fee structures, track collections, and generate invoices."
      >
        <div className="flex gap-3">
          <Link href="/admin/fees/collection">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" /> Collect Fee
            </Button>
          </Link>
          <Link href="/admin/fees/generate">
            <Button className="gap-2">
              <Calendar className="h-4 w-4" /> Generate Invoices
            </Button>
          </Link>
        </div>
      </PageHeader>

      {/* KPI Cards */}
      <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Collected"
          value="₹12.4L"
          subtitle="This academic year"
          icon={DollarSign}
          trend={{ value: 12, label: 'vs last year' }}
          iconClassName="bg-gradient-to-br from-emerald-500 to-teal-500"
        />
        <StatCard
          title="Outstanding"
          value="₹3.2L"
          subtitle="Pending invoices"
          icon={Receipt}
          trend={{ value: -5, label: 'improving' }}
          iconClassName="bg-gradient-to-br from-amber-500 to-orange-500"
        />
        <StatCard
          title="Defaulters"
          value="42"
          subtitle="Students with overdue"
          icon={Users}
          iconClassName="bg-gradient-to-br from-rose-500 to-pink-500"
        />
        <StatCard
          title="Online Payments"
          value="85%"
          subtitle="Paid via Razorpay"
          icon={CreditCard}
          iconClassName="bg-gradient-to-br from-indigo-500 to-violet-500"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Collection Chart */}
        <Card className="lg:col-span-2 overflow-hidden border-none shadow-xl bg-gradient-to-b from-card to-card/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Monthly Collection Trend</CardTitle>
            <CardDescription>Actual collection vs Expected for this year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-100%">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={collectionData}>
                  <defs>
                    <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                  <Tooltip 
                    cursor={{fill: 'hsl(var(--muted)/0.2)'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="collected" fill="url(#colorCollected)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Shortcuts */}
        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Configuration</CardTitle>
            <CardDescription>Setup fee rules and structures</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/admin/fees/heads">
              <div className="flex items-center justify-between rounded-xl border border-border/50 p-4 transition-all hover:bg-accent hover:border-primary/50 group">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <Settings className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Fee Heads</p>
                    <p className="text-xs text-muted-foreground">Tuition, Transport, etc.</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/admin/fees/groups">
              <div className="flex items-center justify-between rounded-xl border border-border/50 p-4 transition-all hover:bg-accent hover:border-primary/50 group">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500 group-hover:scale-110 transition-transform">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Fee Groups</p>
                    <p className="text-xs text-muted-foreground">Class-wise structures</p>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/admin/fees/allocations">
              <div className="flex items-center justify-between rounded-xl border border-border/50 p-4 transition-all hover:bg-accent hover:border-primary/50 group">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Allocations</p>
                    <p className="text-xs text-muted-foreground">Assign to classes</p>
                  </div>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card className="border-none shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Recent Payments</CardTitle>
            <CardDescription>Latest fee transactions across the school</CardDescription>
          </div>
          <Button variant="ghost" size="sm">View All Transactions</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: 1, student: 'Aarav Sharma', class: '10-A', amount: '₹5,500', method: 'Online', date: '10 mins ago', status: 'Success' },
              { id: 2, student: 'Ishani Patel', class: '8-B', amount: '₹4,200', method: 'Cash', date: '2 hours ago', status: 'Success' },
              { id: 3, student: 'Rohan Gupta', class: '12-C', amount: '₹8,000', method: 'Online', date: '5 hours ago', status: 'Success' },
            ].map((p: any) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{p.student}</p>
                    <p className="text-xs text-muted-foreground">{p.class} • {p.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{p.amount}</p>
                  <p className="text-[10px] text-muted-foreground">{p.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
