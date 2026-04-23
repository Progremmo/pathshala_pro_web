import api from '@/lib/axios';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';
import { FeeStructure, FeeStructureRequest, FeeInvoice, FeeInvoiceRequest, RazorpayOrderRequest, PaymentVerifyRequest, Payment, FeeReportSummary } from '@/types/fee.types';

export const feeService = {
  // Fee Structures
  createStructure: (schoolId: number, data: FeeStructureRequest) =>
    api.post<ApiResponse<FeeStructure>>(`/schools/${schoolId}/fees/structures`, data).then((r) => r.data),

  getStructures: (schoolId: number, params?: PaginationParams) =>
    api.get<ApiResponse<PaginatedResponse<FeeStructure>>>(`/schools/${schoolId}/fees/structures`, { params }).then((r) => r.data),

  // Fee Invoices
  createInvoice: (schoolId: number, data: FeeInvoiceRequest) =>
    api.post<ApiResponse<FeeInvoice>>(`/schools/${schoolId}/fees/invoices`, data).then((r) => r.data),

  getInvoices: (schoolId: number, params?: PaginationParams) =>
    api.get<ApiResponse<PaginatedResponse<FeeInvoice>>>(`/schools/${schoolId}/fees/invoices`, { params }).then((r) => r.data),

  getStudentInvoices: (schoolId: number, studentId: number, params?: PaginationParams) =>
    api.get<ApiResponse<PaginatedResponse<FeeInvoice>>>(`/schools/${schoolId}/fees/invoices/student/${studentId}`, { params }).then((r) => r.data),

  // Razorpay
  createPaymentOrder: (schoolId: number, data: RazorpayOrderRequest) =>
    api.post<ApiResponse<Record<string, unknown>>>(`/schools/${schoolId}/fees/payment/create-order`, data).then((r) => r.data),

  verifyPayment: (schoolId: number, data: PaymentVerifyRequest) =>
    api.post<ApiResponse<Payment>>(`/schools/${schoolId}/fees/payment/verify`, data).then((r) => r.data),

  // Reports
  getReport: (schoolId: number, year: number) =>
    api.get<ApiResponse<FeeReportSummary>>(`/schools/${schoolId}/fees/report/summary`, { params: { year } }).then((r) => r.data),
};
