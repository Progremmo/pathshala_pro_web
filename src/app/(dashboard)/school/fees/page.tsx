'use client';

import { useState } from 'react';
import { DollarSign, Plus, FileText, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/shared/stat-card';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/store/auth-store';
import { FEE_TYPES, FEE_FREQUENCIES, ACADEMIC_YEARS, PAYMENT_STATUS_COLORS } from '@/lib/constants';
import { formatCurrency } from '@/utils/format';
import { useFeeStructures, useFeeInvoices, useCreateFeeStructure } from '@/hooks/use-fees';
import { useDashboardStats } from '@/hooks/use-dashboard';

export default function FeeManagementPage() {
  const { schoolId } = useAuthStore();
  const [createOpen, setCreateOpen] = useState(false);
  
  const { data: dashboardData, isLoading: isDashboardLoading } = useDashboardStats(schoolId || 0);
  const { data: structuresData, isLoading: isLoadingStructures } = useFeeStructures(schoolId || 0, { page: 0, size: 50 });
  const { data: invoicesData, isLoading: isLoadingInvoices } = useFeeInvoices(schoolId || 0, { page: 0, size: 50 });
  
  const stats = dashboardData?.data;
  const structures = structuresData?.data?.content || [];
  const invoices = invoicesData?.data?.content || [];

  const [formData, setFormData] = useState({
    name: '',
    feeType: 'TUITION',
    amount: '',
    frequency: 'MONTHLY',
    grade: '',
    academicYear: '2024-25',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) return;
    
    createStructure.mutate({
      schoolId,
      data: {
        ...formData,
        amount: Number(formData.amount),
        grade: formData.grade || undefined,
      }
    }, {
      onSuccess: () => {
        setCreateOpen(false);
      }
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Fee Management" description="Manage fee structures, invoices, and track payments">
        <Link href="/school/fees/reports"><Button variant="outline" className="gap-2"><BarChart3 className="h-4 w-4" /> Reports</Button></Link>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger render={<Button className="gap-2"><Plus className="h-4 w-4" /> New Structure</Button>} />
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create Fee Structure</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="e.g. Tuition Fee - Class 10" /></div>
                <div className="space-y-2"><Label>Fee Type</Label>
                  <Select value={formData.feeType || ''} onValueChange={(v) => setFormData({...formData, feeType: v || ''})}><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>{FEE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Amount (₹)</Label><Input value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} type="number" required placeholder="5000" /></div>
                <div className="space-y-2"><Label>Frequency</Label>
                  <Select value={formData.frequency || ''} onValueChange={(v) => setFormData({...formData, frequency: v || ''})}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{FEE_FREQUENCIES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Grade (Optional)</Label><Input value={formData.grade} onChange={(e) => setFormData({...formData, grade: e.target.value})} placeholder="10" /></div>
                <div className="space-y-2"><Label>Academic Year</Label>
                  <Select value={formData.academicYear || ''} onValueChange={(v) => setFormData({...formData, academicYear: v || ''})}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{ACADEMIC_YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createStructure.isPending}>
                  {createStructure.isPending ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="stagger-children grid gap-4 sm:grid-cols-3">
        <StatCard 
          title="Monthly Collected" 
          value={isDashboardLoading ? '...' : formatCurrency(stats?.monthlyCollection || 0)} 
          subtitle="This month" 
          icon={DollarSign} 
          iconClassName="bg-gradient-to-br from-emerald-500 to-teal-500" 
        />
        <StatCard 
          title="Monthly Pending" 
          value={isDashboardLoading ? '...' : formatCurrency(stats?.monthlyPending || 0)} 
          subtitle="Outstanding" 
          icon={FileText} 
          iconClassName="bg-gradient-to-br from-amber-500 to-orange-500" 
        />
        <StatCard 
          title="Fee Structures" 
          value={isLoadingStructures ? '...' : structures.length} 
          subtitle="Active structures" 
          icon={BarChart3} 
          iconClassName="bg-gradient-to-br from-violet-500 to-purple-500" 
        />
      </div>

      <Tabs defaultValue="structures">
        <TabsList><TabsTrigger value="structures">Fee Structures</TabsTrigger><TabsTrigger value="invoices">Invoices</TabsTrigger></TabsList>

        <TabsContent value="structures" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-muted/30">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Frequency</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Grade</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Year</th>
                  </tr></thead>
                  <tbody>
                    {isLoadingStructures ? (
                      <tr><td colSpan={6} className="p-8 text-center"><div className="flex justify-center"><div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" /></div></td></tr>
                    ) : structures.length === 0 ? (
                      <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No fee structures found</td></tr>
                    ) : structures.map((s) => (
                      <tr key={s.id} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{s.name}</td>
                        <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">{s.feeType}</Badge></td>
                        <td className="px-4 py-3 font-semibold">{formatCurrency(s.amount)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{s.frequency}</td>
                        <td className="px-4 py-3">{s.grade || '—'}</td>
                        <td className="px-4 py-3 text-muted-foreground">{s.academicYear}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-muted/30">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Invoice #</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Student ID</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Due Date</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  </tr></thead>
                  <tbody>
                    {isLoadingInvoices ? (
                      <tr><td colSpan={5} className="p-8 text-center"><div className="flex justify-center"><div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" /></div></td></tr>
                    ) : invoices.length === 0 ? (
                      <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No invoices found</td></tr>
                    ) : invoices.map((inv) => (
                      <tr key={inv.id} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs">{inv.invoiceNumber}</td>
                        <td className="px-4 py-3 font-medium">#{inv.studentId}</td>
                        <td className="px-4 py-3 font-semibold">{formatCurrency(inv.netAmount)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{new Date(inv.dueDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <Badge className={`text-[10px] ${PAYMENT_STATUS_COLORS[inv.paymentStatus] || ''}`}>{inv.paymentStatus}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
