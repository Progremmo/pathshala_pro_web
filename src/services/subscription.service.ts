import { api } from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';

export interface SubscriptionPlanResponse {
  id: number;
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnually: number;
  maxStudents: number;
  maxTeachers: number;
  maxClasses: number;
  storageGb: number;
  isActive: boolean;
}

export const subscriptionService = {
  getAllPlans: () =>
    api.get<ApiResponse<SubscriptionPlanResponse[]>>('/subscriptions/plans').then((r) => r.data),

  getAllPlansAdmin: () =>
    api.get<ApiResponse<SubscriptionPlanResponse[]>>('/subscriptions/plans/admin').then((r) => r.data),
};
