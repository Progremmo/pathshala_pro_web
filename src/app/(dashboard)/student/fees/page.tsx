'use client';

import { CreditCard, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { useAuthStore } from '@/store/auth-store';
import { formatCurrency } from '@/utils/format';
import { PAYMENT_STATUS_COLORS } from '@/lib/constants';
import { loadRazorpay } from '@/lib/razorpay';
import { feeService } from '@/services/fee.service';
import { toast } from 'sonner';

const mockInvoices = [
  { id: 1, invoiceNumber: 'INV-2024-005', name: 'Tuition Fee - May 2026', netAmount: 5000, paymentStatus: 'PENDING', dueDate: '2026-05-10' },
  { id: 2, invoiceNumber: 'INV-2024-004', name: 'Tuition Fee - April 2026', netAmount: 5000, paymentStatus: 'PAID', dueDate: '2026-04-10' },
  { id: 3, invoiceNumber: 'INV-2024-003', name: 'Tuition Fee - March 2026', netAmount: 5000, paymentStatus: 'PAID', dueDate: '2026-03-10' },
];

export default function StudentFeesPage() {
  const { schoolId, fullName, email } = useAuthStore();

  const handlePayment = async (invoiceId: number, amount: number) => {
    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error('Failed to load payment gateway');
      return;
    }

    try {
      const orderResponse = await feeService.createPaymentOrder(schoolId!, {
        invoiceId,
        amount,
        notes: `Fee payment for invoice ${invoiceId}`,
      });

      const orderData = orderResponse.data as Record<string, string>;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: 'INR',
        name: 'PathshalaPro',
        description: 'Fee Payment',
        order_id: orderData.razorpayOrderId || orderData.orderId,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await feeService.verifyPayment(schoolId!, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              invoiceId,
            });
            toast.success('Payment successful!');
          } catch {
            toast.error('Payment verification failed');
          }
        },
        prefill: { name: fullName || '', email: email || '' },
        theme: { color: '#6366f1' },
      });
      rzp.open();
    } catch {
      toast.error('Failed to create payment order');
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader title="My Fees" description="View and pay your fee invoices" />

      <div className="stagger-children grid gap-4 sm:grid-cols-3">
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10"><AlertTriangle className="h-6 w-6 text-amber-500" /></div>
            <div><p className="text-sm text-muted-foreground">Due Now</p><p className="text-xl font-bold">{formatCurrency(5000)}</p></div>
          </CardContent>
        </Card>
        <Card><CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10"><CheckCircle2 className="h-6 w-6 text-emerald-500" /></div>
          <div><p className="text-sm text-muted-foreground">Paid This Year</p><p className="text-xl font-bold">{formatCurrency(10000)}</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10"><Clock className="h-6 w-6 text-blue-500" /></div>
          <div><p className="text-sm text-muted-foreground">Total This Year</p><p className="text-xl font-bold">{formatCurrency(15000)}</p></div>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Fee Invoices</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {mockInvoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between rounded-lg border border-border/50 p-4 hover:bg-accent/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><CreditCard className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="text-sm font-medium">{inv.name}</p>
                  <p className="text-xs text-muted-foreground">{inv.invoiceNumber} • Due: {inv.dueDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold">{formatCurrency(inv.netAmount)}</p>
                <Badge className={`text-[10px] ${PAYMENT_STATUS_COLORS[inv.paymentStatus] || ''}`}>{inv.paymentStatus}</Badge>
                {inv.paymentStatus === 'PENDING' && (
                  <Button size="sm" className="gap-1.5 text-xs" onClick={() => handlePayment(inv.id, inv.netAmount)}>
                    <CreditCard className="h-3 w-3" /> Pay Now
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
