import api from '@/lib/axios';
import { ApiResponse, PaginationParams } from '@/types/api.types';
import {
  FeeHead, FeeHeadRequest,
  FeeGroup, FeeGroupRequest,
  FeeInvoice, FeeAllocationRequest,
  FeeAllocation
} from '@/types/fee.types';

export const feeService = {
  // Heads
  getHeads: (schoolId: number) =>
    api.get<ApiResponse<FeeHead[]>>(`/schools/${schoolId}/fees/heads`).then((r) => r.data),

  createHead: (schoolId: number, data: FeeHeadRequest) =>
    api.post<ApiResponse<FeeHead>>(`/schools/${schoolId}/fees/heads`, data).then((r) => r.data),

  // Groups
  getGroups: (schoolId: number) =>
    api.get<ApiResponse<FeeGroup[]>>(`/schools/${schoolId}/fees/groups`).then((r) => r.data),

  createGroup: (schoolId: number, data: FeeGroupRequest) =>
    api.post<ApiResponse<FeeGroup>>(`/schools/${schoolId}/fees/groups`, data).then((r) => r.data),

  // Allocations
  getAllocations: (schoolId: number) =>
    api.get<ApiResponse<FeeAllocation[]>>(`/schools/${schoolId}/fees/allocations`).then((r) => r.data),

  createAllocation: (schoolId: number, data: FeeAllocationRequest) =>
    api.post<ApiResponse<void>>(`/schools/${schoolId}/fees/allocations`, null, { params: data }).then((r) => r.data),

  // Structures (Legacy/Simple)
  getStructures: (schoolId: number, params?: PaginationParams) =>
    api.get<ApiResponse<any>>(`/schools/${schoolId}/fees/structures`, { params }).then((r) => r.data),

  createStructure: (schoolId: number, data: any) =>
    api.post<ApiResponse<any>>(`/schools/${schoolId}/fees/structures`, data).then((r) => r.data),

  updateStructure: (schoolId: number, id: number, data: any) =>
    api.put<ApiResponse<any>>(`/schools/${schoolId}/fees/structures/${id}`, data).then((r) => r.data),

  deleteStructure: (schoolId: number, id: number) =>
    api.delete<ApiResponse<void>>(`/schools/${schoolId}/fees/structures/${id}`).then((r) => r.data),

  // Invoices
  getInvoices: (schoolId: number, params?: PaginationParams) =>
    api.get<ApiResponse<any>>(`/schools/${schoolId}/fees/invoices`, { params }).then((r) => r.data),

  deleteInvoice: (schoolId: number, id: number) =>
    api.delete<ApiResponse<void>>(`/schools/${schoolId}/fees/invoices/${id}`).then((r) => r.data),

  generateInvoices: (schoolId: number, params: {
    classId: number;
    academicYear: string;
    month: number;
    year: number;
    dueDate: string;
  }) => api.post<ApiResponse<void>>(`/schools/${schoolId}/fees/generate-class-invoices`, null, { params }).then((r) => r.data),

  notifyParents: (schoolId: number, params: {
    classId?: number;
    academicYear: string;
  }) => api.post<ApiResponse<void>>(`/schools/${schoolId}/fees/notify-parents`, null, { params }).then((r) => r.data),

  getStudentInvoices: (schoolId: number, studentId: number, params?: PaginationParams) =>
    api.get<ApiResponse<any>>(`/schools/${schoolId}/fees/invoices/student/${studentId}`, { params }).then((r) => r.data),

  // Razorpay
  createOrder: (schoolId: number, data: { invoiceId: number; amount: number; notes?: string }) =>
    api.post<ApiResponse<any>>(`/schools/${schoolId}/fees/payment/create-order`, data).then((r) => r.data),

  verifyPayment: (schoolId: number, data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => api.post<ApiResponse<any>>(`/schools/${schoolId}/fees/payment/verify`, data).then((r) => r.data),

  // Reports
  getSummary: (schoolId: number, year: number) =>
    api.get<ApiResponse<any>>(`/schools/${schoolId}/fees/report/summary`, { params: { year } }).then((r) => r.data),
};
