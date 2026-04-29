'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useFeeReport } from '@/hooks/use-reports';
import { useAuthStore } from '@/store/auth-store';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

const AVAILABLE_YEARS = [2025, 2026, 2027];

export default function ReportsPage() {
  const { schoolId } = useAuthStore();
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const { data: feeReportRes, isLoading } = useFeeReport(schoolId || 0, year);

  // The fee report API returns an object keyed by month name (e.g. { JANUARY: { totalCollected, totalPending }, ... })
  const rawReport = (feeReportRes?.data as Record<string, any>) ?? {};

  const MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const chartData = MONTHS.map((m, i) => {
    const entry = rawReport[m] || {};
    return {
      month: MONTH_SHORT[i],
      collected: entry.totalCollected ?? 0,
      pending: entry.totalPending ?? 0,
    };
  });

  const totalCollected = chartData.reduce((acc, d) => acc + d.collected, 0);
  const totalPending = chartData.reduce((acc, d) => acc + d.pending, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <PageHeader title="Reports" description="View analytics and performance reports" />
        <div className="flex items-center gap-2">
          <Label className="text-sm">Year</Label>
          <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
            <SelectContent>
              {AVAILABLE_YEARS.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Total Collected ({year})</p>
            <p className="text-2xl font-bold text-emerald-500 mt-1">
              ₹{(totalCollected / 1000).toFixed(1)}K
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Total Pending ({year})</p>
            <p className="text-2xl font-bold text-amber-500 mt-1">
              ₹{(totalPending / 1000).toFixed(1)}K
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fee Collection Report – {year}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${v / 1000}K`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, undefined]}
                />
                <Legend />
                <Bar dataKey="collected" fill="#10b981" radius={[4, 4, 0, 0]} name="Collected" />
                <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
