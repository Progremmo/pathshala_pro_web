export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIAL';

// Matches FeeStructureRequest.java
export interface FeeStructureRequest {
  name: string;
  feeType: string;
  amount: number;
  frequency: string;
  grade?: string;
  academicYear: string;
  description?: string;
  dueDay?: number;
}

// Fee Structure entity
export interface FeeStructure {
  id: number;
  name: string;
  feeType: string;
  amount: number;
  frequency: string;
  grade: string | null;
  academicYear: string;
  description: string | null;
  dueDay: number | null;
  schoolId: number;
  createdAt: string;
  updatedAt: string | null;
}

// Matches FeeInvoiceRequest.java
export interface FeeInvoiceRequest {
  studentId: number;
  feeStructureId: number;
  dueDate: string;
  totalAmount: number;
  discountAmount?: number;
  fineAmount?: number;
  periodMonth?: number;
  periodYear?: number;
  academicYear?: string;
  remarks?: string;
}

// Fee Invoice entity
export interface FeeInvoice {
  id: number;
  invoiceNumber: string;
  totalAmount: number;
  discountAmount: number;
  fineAmount: number;
  netAmount: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  dueDate: string;
  periodMonth: number | null;
  periodYear: number | null;
  academicYear: string | null;
  remarks: string | null;
  schoolId: number;
  studentId: number;
  feeStructureId: number;
  createdAt: string;
  updatedAt: string | null;
}

// Matches RazorpayOrderRequest.java
export interface RazorpayOrderRequest {
  invoiceId: number;
  amount: number;
  notes?: string;
}

// Matches PaymentVerifyRequest.java
export interface PaymentVerifyRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  invoiceId: number;
}

// Payment entity
export interface Payment {
  id: number;
  amount: number;
  currency: string;
  status: PaymentStatus;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  paymentMethod: string | null;
  paymentDate: string | null;
  failureReason: string | null;
  receiptNumber: string | null;
  notes: string | null;
  schoolId: number;
  feeInvoiceId: number;
  paidBy: number;
  createdAt: string;
}

// Fee report summary
export interface FeeReportSummary {
  totalCollected: number;
  totalOutstanding: number;
  year: number;
  currency: string;
}
