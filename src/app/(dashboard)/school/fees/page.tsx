'use client';

import { useState } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  Users, 
  Layers, 
  Plus, 
  BarChart3, 
  FileText, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  MoreVertical,
  Search,
  Filter,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/page-header';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/shared/stat-card';
import { useAuthStore } from '@/store/auth-store';
import { useFeeInvoices, useFeeSummary } from '@/hooks/use-fees';
import { formatCurrency } from '@/utils/format';
import { PAYMENT_STATUS_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function SchoolFeesDashboard() {
  const { schoolId } = useAuthStore();
  const currentYear = new Date().getFullYear();
  
  const { data: summaryRes } = useFeeSummary(schoolId || 1, currentYear);
  const { data: invoicesRes, isLoading: isLoadingInvoices } = useFeeInvoices(schoolId || 1, { page: 0, size: 5 });

  const summary = summaryRes?.data || { totalCollected: 0, totalOutstanding: 0 };
  const recentInvoices = invoicesRes?.data?.content || [];

  const quickLinks = [
    { title: 'Fee Heads', desc: 'Define individual fee components', href: '/admin/fees/heads', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Fee Groups', desc: 'Bundle heads by class/grade', href: '/admin/fees/groups', icon: Layers, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Allocations', desc: 'Assign fees to classes', href: '/admin/fees/allocations', icon: Users, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { title: 'Bulk Generate', desc: 'Generate monthly invoices', href: '/admin/fees/generate', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <PageHeader 
        title="Fee Management" 
        description="Standardized fee structures and billing management for your school."
      >
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Link href="/admin/fees/generate" className={cn(buttonVariants(), "gap-2")}>
            <Plus className="h-4 w-4" /> New Billing Cycle
          </Link>
        </div>
      </PageHeader>

      {/* Primary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Collection" 
          value={formatCurrency(summary.totalCollected)} 
          subtitle="+12.5% from last month"
          icon={DollarSign}
          iconClassName="bg-emerald-500 text-white"
        />
        <StatCard 
          title="Outstanding Balance" 
          value={formatCurrency(summary.totalOutstanding)} 
          subtitle="42 pending invoices"
          icon={ArrowUpRight}
          iconClassName="bg-rose-500 text-white"
        />
        <StatCard 
          title="Active Allocations" 
          value="12 Classes" 
          subtitle="2024-25 Session"
          icon={Users}
          iconClassName="bg-blue-500 text-white"
        />
        <StatCard 
          title="Collection Rate" 
          value="84%" 
          subtitle="Target: 90%"
          icon={BarChart3}
          iconClassName="bg-violet-500 text-white"
        />
      </div>

      {/* Management Modules */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => (
          <Link key={link.title} href={link.href}>
            <Card className="h-full hover:shadow-xl transition-all duration-300 group border-none shadow-md">
              <CardContent className="p-6">
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", link.bg)}>
                  <link.icon className={cn("h-6 w-6", link.color)} />
                </div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{link.title}</h3>
                <p className="text-sm text-muted-foreground">{link.desc}</p>
                <div className="mt-4 flex items-center text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Manage Now <ChevronRight className="h-3 w-3 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Invoices Table */}
        <Card className="lg:col-span-2 border-none shadow-lg overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30">
            <div>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>Track the latest fee bills generated.</CardDescription>
            </div>
            <Link href="/admin/fees/invoices">
              <Button variant="ghost" size="sm" className="text-primary font-bold">View All</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/20 text-muted-foreground">
                    <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider text-[10px]">Student</th>
                    <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider text-[10px]">Invoice #</th>
                    <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider text-[10px]">Amount</th>
                    <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider text-[10px]">Status</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {isLoadingInvoices ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={5} className="px-6 py-4 h-16 bg-muted/10"></td>
                      </tr>
                    ))
                  ) : recentInvoices.length > 0 ? (
                    recentInvoices.map((inv: any) => (
                      <tr key={inv.id} className="hover:bg-accent/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold">{inv.studentName}</span>
                            <span className="text-[10px] text-muted-foreground">{inv.admissionNumber}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs">{inv.invoiceNumber}</td>
                        <td className="px-6 py-4 font-black text-primary">{formatCurrency(inv.netAmount)}</td>
                        <td className="px-6 py-4">
                          <Badge className={cn("text-[10px] font-bold uppercase", PAYMENT_STATUS_COLORS[inv.paymentStatus])}>
                            {inv.paymentStatus}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger render={
                              <Button variant="ghost" size="icon" className="h-8 w-8" />
                            }>
                              <MoreVertical className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Print Receipt</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Void Invoice</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                        No recent invoices found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Collection Trend / Insights */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Collection Insights</CardTitle>
            <CardDescription>Monthly performance overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tuition Fees</span>
                <span className="font-bold">92%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Transport Fees</span>
                <span className="font-bold">64%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '64%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Extracurricular</span>
                <span className="font-bold">45%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-violet-500 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="rounded-xl bg-primary/5 p-4 border border-primary/10">
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-primary uppercase">Quick Insight</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Collection is up by 8% this month compared to the last academic cycle.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
