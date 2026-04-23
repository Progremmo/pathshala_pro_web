'use client';

import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSubscriptionPlansAdmin } from '@/hooks/use-subscriptions';
import { Loader2, Check, Shield, Star, Rocket, Zap } from 'lucide-react';

const PLAN_ICONS: Record<string, any> = {
  BASIC: Star,
  STARTER: Star,
  PRO: Rocket,
  ENTERPRISE: Zap,
};

export default function SubscriptionsPage() {
  const { data, isLoading } = useSubscriptionPlansAdmin();
  const plans = data?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Subscription Management" 
        description="Configure platform subscription plans and monitoring."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : plans.length === 0 ? (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            No subscription plans found.
          </div>
        ) : (
          plans.map((plan) => {
            const Icon = PLAN_ICONS[plan.name.toUpperCase()] || Shield;
            return (
              <Card key={plan.id} className={plan.isActive ? 'border-primary/20 relative overflow-hidden' : 'opacity-70'}>
                {plan.isActive && (
                  <div className="absolute top-0 right-0 p-2">
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px]">Active</Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl uppercase tracking-wider">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description || 'Standard platform tier.'}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">₹{plan.priceMonthly}</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">Limits</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Up to {plan.maxStudents} Students</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Up to {plan.maxTeachers} Teachers</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{plan.maxClasses} Classrooms</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{plan.storageGb}GB Storage</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">Edit Plan</Button>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
