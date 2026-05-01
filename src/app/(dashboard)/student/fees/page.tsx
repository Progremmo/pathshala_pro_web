'use client';
import { CreditCard, CheckCircle2, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import { useAuthStore } from '@/store/auth-store';
import { formatCurrency } from '@/utils/format';
import { PAYMENT_STATUS_COLORS } from '@/lib/constants';
import { loadRazorpay } from '@/lib/razorpay';
import { useFeeInvoices, useCreatePaymentOrder, useVerifyPayment } from '@/hooks/use-fees';
import { toast } from 'sonner';
import { useMemo } from 'react';

export default function StudentFeesPage() {
  const { schoolId, userId, fullName, email } = useAuthStore();
  
  const { data: invoicesResponse, isLoading } = useFeeInvoices(schoolId!, userId!);
  const invoices = invoicesResponse?.data?.content || [];

  const createOrder = useCreatePaymentOrder(schoolId!);
  const verifyPayment = useVerifyPayment(schoolId!);

  const stats = useMemo(() => {
    return invoices.reduce((acc, inv) => {
      if (inv.status === 'PAID') {
        acc.paid += inv.amount;
      } else if (inv.status === 'PENDING' || inv.status === 'PARTIAL') {
        acc.due += (inv.amount - inv.paidAmount);
      }
      acc.total += inv.amount;
      return acc;
    }, { paid: 0, due: 0, total: 0 });
  }, [invoices]);

  const handlePayment = async (invoiceId: number, amount: number) => {
    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error('Failed to load payment gateway');
      return;
    }

    createOrder.mutate({ invoiceId, amount }, {
      onSuccess: (orderResponse) => {
        const orderData = orderResponse.data;
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rzp = new (window as any).Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: amount * 100, // paise
          currency: 'INR',
          name: 'PathshalaPro',
          description: `Fee payment for ${fullName}`,
          order_id: orderData.razorpayOrderId || orderData.orderId,
          handler: async (response: any) => {
            verifyPayment.mutate({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              invoiceId,
            });
          },
          prefill: {
            name: fullName || '',
            email: email || '',
          },
          theme: { color: '#6366f1' },
        });
        rzp.open();
      }
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader title="My Fees" description="View and pay your fee invoices" />

      <div className="stagger-children grid gap-4 sm:grid-cols-3">
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Due Now</p>
              <p className="text-xl font-bold">{formatCurrency(stats.due)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paid This Year</p>
              <p className="text-xl font-bold">{formatCurrency(stats.paid)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total This Year</p>
              <p className="text-xl font-bold">{formatCurrency(stats.total)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fee Invoices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : invoices.length > 0 ? (
            invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between rounded-lg border border-border/50 p-4 hover:bg-accent/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{inv.structureName || 'General Fee'}</p>
                    <p className="text-xs text-muted-foreground">
                      {inv.invoiceNumber} • Due: {inv.dueDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right mr-4">
                    <p className="text-sm font-bold">{formatCurrency(inv.amount)}</p>
                    {inv.paidAmount > 0 && (
                      <p className="text-[10px] text-emerald-600">Paid: {formatCurrency(inv.paidAmount)}</p>
                    )}
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${PAYMENT_STATUS_COLORS[inv.status] || ''}`}>
                    {inv.status}
                  </Badge>
                  {inv.status !== 'PAID' && (
                    <Button 
                      size="sm" 
                      className="gap-1.5 text-xs" 
                      disabled={createOrder.isPending}
                      onClick={() => handlePayment(inv.id, inv.amount - inv.paidAmount)}
                    >
                      {createOrder.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CreditCard className="h-3 w-3" />}
                      Pay Now
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-muted-foreground border rounded-lg border-dashed">
              No invoices found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
