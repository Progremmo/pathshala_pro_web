import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feeService } from '@/services/fee.service';
import { FeeHeadRequest, FeeGroupRequest, FeeAllocationRequest } from '@/types/fee.types';
import { toast } from 'sonner';

export const feeKeys = {
  all: ['fees'] as const,
  heads: (schoolId: number) => [...feeKeys.all, 'heads', schoolId] as const,
  groups: (schoolId: number) => [...feeKeys.all, 'groups', schoolId] as const,
  structures: (schoolId: number) => [...feeKeys.all, 'structures', schoolId] as const,
  invoices: (schoolId: number) => [...feeKeys.all, 'invoices', schoolId] as const,
  summary: (schoolId: number, year: number) => [...feeKeys.all, 'summary', schoolId, year] as const,
};

export function useFeeStructures(schoolId: number, params?: any) {
  return useQuery({
    queryKey: [...feeKeys.structures(schoolId), params],
    queryFn: () => feeService.getStructures(schoolId, params),
    enabled: !!schoolId,
  });
}

export function useCreateFeeStructure(schoolId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => feeService.createStructure(schoolId, data),
    onSuccess: () => {
      toast.success('Fee structure created');
      queryClient.invalidateQueries({ queryKey: feeKeys.structures(schoolId) });
    },
  });
}

export function useUpdateFeeStructure(schoolId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => feeService.updateStructure(schoolId, id, data),
    onSuccess: () => {
      toast.success('Fee structure updated');
      queryClient.invalidateQueries({ queryKey: feeKeys.structures(schoolId) });
    },
  });
}

export function useDeleteFeeStructure(schoolId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => feeService.deleteStructure(schoolId, id),
    onSuccess: () => {
      toast.success('Fee structure deleted');
      queryClient.invalidateQueries({ queryKey: feeKeys.structures(schoolId) });
    },
  });
}

export function useFeeInvoices(schoolId: number, params?: any) {
  return useQuery({
    queryKey: [...feeKeys.invoices(schoolId), params],
    queryFn: () => feeService.getInvoices(schoolId, params),
    enabled: !!schoolId,
  });
}

export function useDeleteFeeInvoice(schoolId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => feeService.deleteInvoice(schoolId, id),
    onSuccess: () => {
      toast.success('Invoice deleted');
      queryClient.invalidateQueries({ queryKey: feeKeys.invoices(schoolId) });
    },
  });
}

export function useFeeHeads(schoolId: number) {
  return useQuery({
    queryKey: feeKeys.heads(schoolId),
    queryFn: () => feeService.getHeads(schoolId),
    enabled: !!schoolId,
  });
}

export function useCreateFeeHead(schoolId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FeeHeadRequest) => feeService.createHead(schoolId, data),
    onSuccess: () => {
      toast.success('Fee head created');
      queryClient.invalidateQueries({ queryKey: feeKeys.heads(schoolId) });
    },
  });
}

export function useFeeGroups(schoolId: number) {
  return useQuery({
    queryKey: feeKeys.groups(schoolId),
    queryFn: () => feeService.getGroups(schoolId),
    enabled: !!schoolId,
  });
}

export function useCreateFeeGroup(schoolId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FeeGroupRequest) => feeService.createGroup(schoolId, data),
    onSuccess: () => {
      toast.success('Fee group created');
      queryClient.invalidateQueries({ queryKey: feeKeys.groups(schoolId) });
    },
  });
}

export function useCreateFeeAllocation(schoolId: number) {
  return useMutation({
    mutationFn: (data: FeeAllocationRequest) => feeService.createAllocation(schoolId, data),
    onSuccess: () => {
      toast.success('Fee allocated successfully');
    },
  });
}

export function useGenerateInvoices(schoolId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: any) => feeService.generateInvoices(schoolId, params),
    onSuccess: () => {
      toast.success('Invoice generation started');
      queryClient.invalidateQueries({ queryKey: feeKeys.invoices(schoolId) });
    },
  });
}

export function useNotifyParents(schoolId: number) {
  return useMutation({
    mutationFn: (params: { classId?: number; academicYear: string }) => feeService.notifyParents(schoolId, params),
    onSuccess: () => {
      toast.success('Notification requests sent');
    },
  });
}

export function useFeeSummary(schoolId: number, year: number) {
  return useQuery({
    queryKey: feeKeys.summary(schoolId, year),
    queryFn: () => feeService.getSummary(schoolId, year),
    enabled: !!schoolId && !!year,
  });
}

export function useCreatePaymentOrder(schoolId: number) {
  return useMutation({
    mutationFn: (data: { invoiceId: number; amount: number; notes?: string }) => feeService.createOrder(schoolId, data),
  });
}

export function useVerifyPayment(schoolId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
      invoiceId: number;
    }) => feeService.verifyPayment(schoolId, data),
    onSuccess: () => {
      toast.success('Payment verified successfully');
      queryClient.invalidateQueries({ queryKey: feeKeys.invoices(schoolId) });
    },
  });
}
