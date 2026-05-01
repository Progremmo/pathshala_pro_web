import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { feeService } from '@/services/fee.service';
import { RazorpayOrderRequest, PaymentVerifyRequest } from '@/types/fee.types';
import { toast } from 'sonner';

export const feeKeys = {
  all: ['fees'] as const,
  structures: (schoolId: number) => [...feeKeys.all, 'structures', schoolId] as const,
  invoices: (schoolId: number) => [...feeKeys.all, 'invoices', schoolId] as const,
  studentInvoices: (schoolId: number, studentId: number) => [...feeKeys.all, 'student-invoices', schoolId, studentId] as const,
};

export function useFeeInvoices(schoolId: number, arg2?: number | any, arg3?: any) {
  const studentId = typeof arg2 === 'number' ? arg2 : undefined;
  const params = typeof arg2 === 'object' ? arg2 : arg3;

  return useQuery({
    queryKey: studentId 
      ? feeKeys.studentInvoices(schoolId, studentId) 
      : [...feeKeys.invoices(schoolId), params],
    queryFn: () => studentId 
      ? feeService.getInvoicesByStudent(schoolId, studentId, params)
      : feeService.getInvoicesBySchool(schoolId, params),
    enabled: !!schoolId,
  });
}

export function useStudentInvoices(schoolId: number, studentId: number, params?: any) {
  return useFeeInvoices(schoolId, studentId, params);
}

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
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create fee structure');
    },
  });
}

export function useUpdateFeeStructure(schoolId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      feeService.updateStructure(schoolId, id, data),
    onSuccess: () => {
      toast.success('Fee structure updated');
      queryClient.invalidateQueries({ queryKey: feeKeys.structures(schoolId) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update fee structure');
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
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete fee structure');
    },
  });
}

export function useCreateInvoice(schoolId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => feeService.createInvoice(schoolId, data),
    onSuccess: () => {
      toast.success('Invoice created');
      queryClient.invalidateQueries({ queryKey: feeKeys.invoices(schoolId) });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create invoice');
    },
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
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete invoice');
    },
  });
}

export function useCreatePaymentOrder(schoolId: number) {
  return useMutation({
    mutationFn: (data: RazorpayOrderRequest) => feeService.createOrder(schoolId, data),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create payment order');
    },
  });
}

export function useVerifyPayment(schoolId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PaymentVerifyRequest) => feeService.verifyPayment(schoolId, data),
    onSuccess: () => {
      toast.success('Payment verified successfully');
      queryClient.invalidateQueries({ queryKey: feeKeys.all });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Payment verification failed');
    },
  });
}
