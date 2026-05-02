import api from '@/lib/axios';
import { ApiResponse, PaginationParams } from '@/types/api.types';
import {
  FeeHead, FeeHeadRequest,
  FeeGroup, FeeGroupRequest,
  FeeInvoice, FeeAllocationRequest
} from '@/types/fee.types';

export const feeService = {
  // Heads
  getHeads: (schoolId: number) =>
    api.get<ApiResponse<FeeHead[]>>(`/schools/${schoolId}/fees/heads`),

  createHead: (schoolId: number, data: FeeHeadRequest) =>
    api.post<ApiResponse<FeeHead>>(`/schools/${schoolId}/fees/heads`, data),

  // Groups
  getGroups: (schoolId: number) =>
    api.get<ApiResponse<FeeGroup[]>>(`/schools/${schoolId}/fees/groups`),

  createGroup: (schoolId: number, data: FeeGroupRequest) =>
    api.post<ApiResponse<FeeGroup>>(`/schools/${schoolId}/fees/groups`, data),

  // Allocations
  getAllocations: (schoolId: number) =>
    api.get<ApiResponse<FeeAllocation[]>>(`/schools/${schoolId}/fees/allocations`),

  createAllocation: (schoolId: number, data: FeeAllocationRequest) =>
    api.post<ApiResponse<void>>(`/schools/${schoolId}/fees/allocations`, null, { params: data }),

  // Structures (Legacy/Simple)
  getStructures: (schoolId: number, params?: PaginationParams) =>
    api.get<ApiResponse<any>>(`/schools/${schoolId}/fees/structures`, { params }),

  createStructure: (schoolId: number, data: any) =>
    api.post<ApiResponse<any>>(`/schools/${schoolId}/fees/structures`, data),

  updateStructure: (schoolId: number, id: number, data: any) =>
    api.put<ApiResponse<any>>(`/schools/${schoolId}/fees/structures/${id}`, data),

  deleteStructure: (schoolId: number, id: number) =>
    api.delete<ApiResponse<void>>(`/schools/${schoolId}/fees/structures/${id}`),

  // Invoices
  getInvoices: (schoolId: number, params?: PaginationParams) =>
    api.get<ApiResponse<any>>(`/schools/${schoolId}/fees/invoices`, { params }),

  deleteInvoice: (schoolId: number, id: number) =>
    api.delete<ApiResponse<void>>(`/schools/${schoolId}/fees/invoices/${id}`),

  generateInvoices: (schoolId: number, params: {
    classId: number;
    academicYear: string;
    month: number;
    year: number;
    dueDate: string;
  }) => api.post<ApiResponse<void>>(`/schools/${schoolId}/fees/generate-class-invoices`, null, { params }),

  notifyParents: (schoolId: number, params: {
    classId?: number;
    academicYear: string;
  }) => api.post<ApiResponse<void>>(`/schools/${schoolId}/fees/notify-parents`, null, { params }),

  getStudentInvoices: (schoolId: number, studentId: number) =>
    api.get<ApiResponse<any>>(`/schools/${schoolId}/fees/invoices/student/${studentId}`),

  // Razorpay
  createOrder: (schoolId: number, data: { invoiceId: number; amount: number; notes?: string }) =>
    api.post<ApiResponse<any>>(`/schools/${schoolId}/fees/payment/create-order`, data),

  verifyPayment: (schoolId: number, data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => api.post<ApiResponse<any>>(`/schools/${schoolId}/fees/payment/verify`, data),

  // Reports
  getSummary: (schoolId: number, year: number) =>
    api.get<ApiResponse<any>>(`/schools/${schoolId}/fees/report/summary`, { params: { year } }),
};
