export type FeeType = 'TUITION' | 'TRANSPORT' | 'LIBRARY' | 'LABORATORY' | 'SPORTS' | 'EXAM' | 'ADMISSION' | 'OTHER';
export type FeeFrequency = 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'ANNUALLY' | 'ONE_TIME';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIAL';

export interface FeeStructureRequest {
  name: string;
  classRoomId: number;
  academicYear: string;
  type: FeeType;
  amount: number;
  frequency: FeeFrequency;
  dueDate: string;
}

export interface FeeStructureResponse {
  id: number;
  name: string;
  classRoomId: number;
  classRoomName: string;
  academicYear: string;
  type: FeeType;
  amount: number;
  frequency: FeeFrequency;
  dueDate: string;
  createdAt: string;
}

export interface FeeInvoiceRequest {
  studentId: number;
  structureId: number;
  dueDate: string;
  remarks?: string;
}

export interface FeeInvoiceResponse {
  id: number;
  invoiceNumber: string;
  studentId: number;
  studentName: string;
  structureName: string;
  amount: number;
  paidAmount: number;
  status: PaymentStatus;
  dueDate: string;
  createdAt: string;
}

export interface RazorpayOrderRequest {
  invoiceId: number;
  amount: number; // in INR
}

export interface PaymentVerifyRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  invoiceId: number;
}

export interface PaymentResponse {
  id: number;
  transactionId: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: string;
  paymentDate: string;
  invoiceId: number;
}
