import { ApiResponse } from './api.types';

export interface FeeHead {
  id: number;
  name: string;
  description?: string;
  isMandatory: boolean;
  createdAt: string;
}

export interface FeeHeadRequest {
  name: string;
  description?: string;
  isMandatory: boolean;
}

export interface FeeGroupItem {
  id: number;
  feeHeadId: number;
  feeHeadName: string;
  amount: number;
}

export interface FeeGroup {
  id: number;
  name: string;
  description?: string;
  grade?: string;
  items: FeeGroupItem[];
}

export interface FeeGroupRequest {
  name: string;
  description?: string;
  grade?: string;
  items: {
    feeHeadId: number;
    amount: number;
  }[];
}

export interface FeeInvoice {
  id: number;
  invoiceNumber: string;
  totalAmount: number;
  discountAmount: number;
  fineAmount: number;
  netAmount: number;
  paidAmount: number;
  paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID' | 'FAILED';
  dueDate: string;
  periodMonth?: number;
  periodYear?: number;
  academicYear: string;
  studentId: number;
  studentName: string;
  admissionNumber: string;
  feeStructureName?: string;
  createdAt: string;
  items?: {
    id: number;
    feeHeadName: string;
    amount: number;
  }[];
}

export interface FeeAllocationRequest {
  groupId: number;
  classId?: number;
  studentId?: number;
  academicYear: string;
}
