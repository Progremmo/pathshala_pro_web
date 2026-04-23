'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/format';
import { PAYMENT_STATUS_COLORS } from '@/lib/constants';

const invoices = [
  { id: 1, name: 'May 2026 - Tuition', amount: 5000, status: 'PENDING', dueDate: '2026-05-10' },
  { id: 2, name: 'April 2026 - Tuition', amount: 5000, status: 'PAID', dueDate: '2026-04-10' },
  { id: 3, name: 'March 2026 - Tuition', amount: 5000, status: 'PAID', dueDate: '2026-03-10' },
];

export default function ParentFees() {
  return (
    <div className="space-y-6">
      <PageHeader title="Fee Payments" description="View and pay your child's fees" />
      <Card>
        <CardHeader><CardTitle className="text-base">Invoices</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {invoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between rounded-lg border border-border/50 p-4 hover:bg-accent/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><CreditCard className="h-5 w-5 text-primary" /></div>
                <div><p className="text-sm font-medium">{inv.name}</p><p className="text-xs text-muted-foreground">Due: {inv.dueDate}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold">{formatCurrency(inv.amount)}</p>
                <Badge className={`text-[10px] ${PAYMENT_STATUS_COLORS[inv.status] || ''}`}>{inv.status}</Badge>
                {inv.status === 'PENDING' && <Button size="sm" className="gap-1 text-xs"><CreditCard className="h-3 w-3" /> Pay</Button>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
