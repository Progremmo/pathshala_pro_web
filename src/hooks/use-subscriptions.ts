import { useQuery } from '@tanstack/react-query';
import { subscriptionService } from '@/services/subscription.service';

export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  plans: () => [...subscriptionKeys.all, 'plans'] as const,
  plansAdmin: () => [...subscriptionKeys.all, 'plans-admin'] as const,
};

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: subscriptionKeys.plans(),
    queryFn: () => subscriptionService.getAllPlans(),
  });
}

export function useSubscriptionPlansAdmin() {
  return useQuery({
    queryKey: subscriptionKeys.plansAdmin(),
    queryFn: () => subscriptionService.getAllPlansAdmin(),
  });
}
