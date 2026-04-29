'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Plus, FileText, BarChart3, Edit2, Trash2, Loader2, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { StatCard } from '@/components/shared/stat-card';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/auth-store';
import { FEE_TYPES, FEE_FREQUENCIES, ACADEMIC_YEARS, PAYMENT_STATUS_COLORS } from '@/lib/constants';
import { formatCurrency } from '@/utils/format';
import { 
  useFeeStructures, 
  useFeeInvoices, 
  useCreateFeeStructure, 
  useUpdateFeeStructure, 
  useDeleteFeeStructure,
  useDeleteFeeInvoice
} from '@/hooks/use-fees';
import { useDashboardStats } from '@/hooks/use-dashboard';
import { toast } from 'sonner';

const structureSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  feeType: z.string().min(1, 'Type is required'),
  amount: z.coerce.number().min(0, 'Amount must be positive'),
  frequency: z.string().min(1, 'Frequency is required'),
  grade: z.string().optional(),
  academicYear: z.string().min(1, 'Academic year is required'),
  description: z.string().optional(),
});

type StructureFormData = z.infer<typeof structureSchema>;

export default function FeeManagementPage() {
  const { schoolId } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [editingStructure, setEditingStructure] = useState<any>(null);
  
  const { data: dashboardData, isLoading: isDashboardLoading } = useDashboardStats(schoolId || 0);
  const { data: structuresData, isLoading: isLoadingStructures } = useFeeStructures(schoolId || 0, { page: 0, size: 50 });
  const { data: invoicesData, isLoading: isLoadingInvoices } = useFeeInvoices(schoolId || 0, { page: 0, size: 50 });
  
  const stats = dashboardData?.data;
  const structures = structuresData?.data?.content || [];
  const invoices = invoicesData?.data?.content || [];

  const { mutate: createStructure, isPending: isCreating } = useCreateFeeStructure();
  const { mutate: updateStructure, isPending: isUpdating } = useUpdateFeeStructure();
  const { mutate: deleteStructure } = useDeleteFeeStructure();
  const { mutate: deleteInvoice } = useDeleteFeeInvoice();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<any>({
    resolver: zodResolver(structureSchema),
    defaultValues: {
      feeType: 'TUITION',
      frequency: 'MONTHLY',
      academicYear: '2024-25',
    }
  });

  useEffect(() => {
    if (editingStructure) {
      reset({
        name: editingStructure.name,
        feeType: editingStructure.feeType,
        amount: editingStructure.amount,
        frequency: editingStructure.frequency,
        grade: editingStructure.grade || '',
        academicYear: editingStructure.academicYear,
        description: editingStructure.description || '',
      });
    } else {
      reset({
        name: '',
        feeType: 'TUITION',
        amount: 0,
        frequency: 'MONTHLY',
        grade: '',
        academicYear: '2024-25',
        description: '',
      });
    }
  }, [editingStructure, reset]);

  const onSubmit = (data: StructureFormData) => {
    if (!schoolId) return;
    
    if (editingStructure) {
      updateStructure({ schoolId, structureId: editingStructure.id, data }, {
        onSuccess: () => {
          setOpen(false);
          setEditingStructure(null);
        }
      });
    } else {
      createStructure({ schoolId, data }, {
        onSuccess: () => {
          setOpen(false);
        }
      });
    }
  };

  const handleEdit = (s: any) => {
    setEditingStructure(s);
    setOpen(true);
  };

  const handleDeleteStructure = (id: number) => {
    if (!schoolId) return;
    if (confirm('Are you sure you want to delete this fee structure?')) {
      deleteStructure({ schoolId, structureId: id });
    }
  };

  const handleDeleteInvoice = (id: number) => {
    if (!schoolId) return;
    if (confirm('Are you sure you want to delete this invoice? Only pending invoices can be deleted.')) {
      deleteInvoice({ schoolId, invoiceId: id });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Fee Management" description="Manage fee structures, invoices, and track payments">
        <Link href="/school/fees/reports"><Button variant="outline" className="gap-2"><BarChart3 className="h-4 w-4" /> Reports</Button></Link>
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setEditingStructure(null); }}>
          <DialogTrigger render={<Button className="gap-2"><Plus className="h-4 w-4" /> New Structure</Button>} />
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editingStructure ? 'Edit Fee Structure' : 'Create Fee Structure'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input {...register('name')} placeholder="e.g. Tuition Fee - Class 10" />
                  {errors.name && <p className="text-xs text-red-500">{(errors.name as any).message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Fee Type</Label>
                  <Controller
                    name="feeType"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>{FEE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Amount (₹)</Label>
                  <Input {...register('amount')} type="number" placeholder="5000" />
                  {errors.amount && <p className="text-xs text-red-500">{(errors.amount as any).message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Controller
                    name="frequency"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>{FEE_FREQUENCIES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Grade (Optional)</Label>
                  <Input {...register('grade')} placeholder="10" />
                </div>
                <div className="space-y-2">
                  <Label>Academic Year</Label>
                  <Controller
                    name="academicYear"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>{ACADEMIC_YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={() => { setOpen(false); setEditingStructure(null); }}>Cancel</Button>
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {(isCreating || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingStructure ? 'Update' : 'Create'}
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
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground text-right">Actions</th>
                  </tr></thead>
                  <tbody>
                    {isLoadingStructures ? (
                      <tr><td colSpan={6} className="p-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></td></tr>
                    ) : structures.length === 0 ? (
                      <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No fee structures found</td></tr>
                    ) : structures.map((s: any) => (
                      <tr key={s.id} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{s.name}</td>
                        <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">{s.feeType}</Badge></td>
                        <td className="px-4 py-3 font-semibold text-primary">{formatCurrency(s.amount)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{s.frequency}</td>
                        <td className="px-4 py-3">{s.grade || '—'}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => handleEdit(s)}><Edit2 className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteStructure(s.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </td>
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
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Student</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Due Date</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                  </tr></thead>
                  <tbody>
                    {isLoadingInvoices ? (
                      <tr><td colSpan={6} className="p-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></td></tr>
                    ) : invoices.length === 0 ? (
                      <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No invoices found</td></tr>
                    ) : invoices.map((inv: any) => (
                      <tr key={inv.id} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-bold">{inv.invoiceNumber}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{inv.studentName}</span>
                            <span className="text-[10px] text-muted-foreground">{inv.admissionNumber || `ID: ${inv.studentId}`}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-primary">{formatCurrency(inv.netAmount)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{new Date(inv.dueDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <Badge className={`text-[10px] ${PAYMENT_STATUS_COLORS[inv.paymentStatus as keyof typeof PAYMENT_STATUS_COLORS] || ''}`}>{inv.paymentStatus}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive" 
                            disabled={inv.paymentStatus !== 'PENDING'}
                            onClick={() => handleDeleteInvoice(inv.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
