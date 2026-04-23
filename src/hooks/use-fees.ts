import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feeService } from '@/services/fee.service';
import { FeeStructureRequest, FeeInvoiceRequest, RazorpayOrderRequest, PaymentVerifyRequest } from '@/types/fee.types';
import { PaginationParams } from '@/types/api.types';
import { toast } from 'sonner';

export const feeKeys = {
  all: ['fees'] as const,
  structures: (schoolId: number) => [...feeKeys.all, 'structures', schoolId] as const,
  invoices: (schoolId: number) => [...feeKeys.all, 'invoices', schoolId] as const,
  studentInvoices: (schoolId: number, studentId: number) => [...feeKeys.all, 'invoices', 'student', schoolId, studentId] as const,
  report: (schoolId: number, year: number) => [...feeKeys.all, 'report', schoolId, year] as const,
};

// --- Queries ---

export function useFeeStructures(schoolId: number, params?: PaginationParams) {
  return useQuery({
    queryKey: [...feeKeys.structures(schoolId), params],
    queryFn: () => feeService.getStructures(schoolId, params),
    enabled: !!schoolId,
  });
}

export function useFeeInvoices(schoolId: number, params?: PaginationParams) {
  return useQuery({
    queryKey: [...feeKeys.invoices(schoolId), params],
    queryFn: () => feeService.getInvoices(schoolId, params),
    enabled: !!schoolId,
  });
}

export function useStudentInvoices(schoolId: number, studentId: number, params?: PaginationParams) {
  return useQuery({
    queryKey: [...feeKeys.studentInvoices(schoolId, studentId), params],
    queryFn: () => feeService.getStudentInvoices(schoolId, studentId, params),
    enabled: !!schoolId && !!studentId,
  });
}

export function useFeeReport(schoolId: number, year: number) {
  return useQuery({
    queryKey: feeKeys.report(schoolId, year),
    queryFn: () => feeService.getReport(schoolId, year),
    enabled: !!schoolId && !!year,
  });
}

// --- Mutations ---

export function useCreateFeeStructure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, data }: { schoolId: number; data: FeeStructureRequest }) =>
      feeService.createStructure(schoolId, data),
    onSuccess: (res, variables) => {
      toast.success('Fee structure created successfully');
      queryClient.invalidateQueries({ queryKey: feeKeys.structures(variables.schoolId) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create fee structure');
    },
  });
}

export function useCreateFeeInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, data }: { schoolId: number; data: FeeInvoiceRequest }) =>
      feeService.createInvoice(schoolId, data),
    onSuccess: (res, variables) => {
      toast.success('Fee invoice created successfully');
      queryClient.invalidateQueries({ queryKey: feeKeys.invoices(variables.schoolId) });
      queryClient.invalidateQueries({ queryKey: feeKeys.studentInvoices(variables.schoolId, variables.data.studentId) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create invoice');
    },
  });
}

export function useCreatePaymentOrder() {
  return useMutation({
    mutationFn: ({ schoolId, data }: { schoolId: number; data: RazorpayOrderRequest }) =>
      feeService.createPaymentOrder(schoolId, data),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to initiate payment');
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, data }: { schoolId: number; data: PaymentVerifyRequest }) =>
      feeService.verifyPayment(schoolId, data),
    onSuccess: (res, variables) => {
      toast.success('Payment verified successfully!');
      // Invalidate invoices to reflect updated status
      queryClient.invalidateQueries({ queryKey: feeKeys.invoices(variables.schoolId) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Payment verification failed');
    },
  });
}
