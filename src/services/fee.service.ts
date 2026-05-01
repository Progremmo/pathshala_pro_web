import api from '@/lib/axios';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';
import { 
  FeeStructureRequest, FeeStructureResponse, 
  FeeInvoiceRequest, FeeInvoiceResponse,
  RazorpayOrderRequest, PaymentVerifyRequest, PaymentResponse 
} from '@/types/fee.types';

export const feeService = {
  // Structures
  createStructure: (schoolId: number, data: FeeStructureRequest) =>
    api.post<ApiResponse<FeeStructureResponse>>(`/schools/${schoolId}/fees/structures`, data).then((r) => r.data),

  getStructures: (schoolId: number, params?: PaginationParams) =>
    api.get<ApiResponse<PaginatedResponse<FeeStructureResponse>>>(`/schools/${schoolId}/fees/structures`, { params }).then((r) => r.data),

  updateStructure: (schoolId: number, structureId: number, data: FeeStructureRequest) =>
    api.put<ApiResponse<FeeStructureResponse>>(`/schools/${schoolId}/fees/structures/${structureId}`, data).then((r) => r.data),

  deleteStructure: (schoolId: number, structureId: number) =>
    api.delete<ApiResponse<void>>(`/schools/${schoolId}/fees/structures/${structureId}`).then((r) => r.data),

  // Invoices
  createInvoice: (schoolId: number, data: FeeInvoiceRequest) =>
    api.post<ApiResponse<FeeInvoiceResponse>>(`/schools/${schoolId}/fees/invoices`, data).then((r) => r.data),

  getInvoicesBySchool: (schoolId: number, params?: PaginationParams) =>
    api.get<ApiResponse<PaginatedResponse<FeeInvoiceResponse>>>(`/schools/${schoolId}/fees/invoices`, { params }).then((r) => r.data),

  getInvoicesByStudent: (schoolId: number, studentId: number, params?: PaginationParams) =>
    api.get<ApiResponse<PaginatedResponse<FeeInvoiceResponse>>>(`/schools/${schoolId}/fees/invoices/student/${studentId}`, { params }).then((r) => r.data),

  deleteInvoice: (schoolId: number, invoiceId: number) =>
    api.delete<ApiResponse<void>>(`/schools/${schoolId}/fees/invoices/${invoiceId}`).then((r) => r.data),

  // Payments
  createOrder: (schoolId: number, data: RazorpayOrderRequest) =>
    api.post<ApiResponse<any>>(`/schools/${schoolId}/fees/payment/create-order`, data).then((r) => r.data),

  verifyPayment: (schoolId: number, data: PaymentVerifyRequest) =>
    api.post<ApiResponse<PaymentResponse>>(`/schools/${schoolId}/fees/payment/verify`, data).then((r) => r.data),
};
