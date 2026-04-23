export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'PathshalaPro';
export const API_URL = process.env.NEXT_PUBLIC_API_URL_PROD || 'http://localhost:8080/api/v1';

export const ROLE_ROUTES = {
  PROJECT_ADMIN: '/admin',
  SCHOOL_ADMIN: '/school',
  TEACHER: '/teacher',
  STUDENT: '/student',
  PARENT: '/parent',
} as const;

export const ROLE_LABELS = {
  PROJECT_ADMIN: 'Project Admin',
  SCHOOL_ADMIN: 'School Admin',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
  PARENT: 'Parent',
} as const;

export const ACADEMIC_YEARS = ['2024-25', '2025-26', '2026-27'] as const;

export const FEE_TYPES = ['TUITION', 'TRANSPORT', 'LIBRARY', 'LABORATORY', 'SPORTS', 'EXAM', 'ADMISSION', 'OTHER'] as const;
export const FEE_FREQUENCIES = ['MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'ANNUALLY', 'ONE_TIME'] as const;

export const EXAM_TYPE_LABELS: Record<string, string> = {
  UNIT_TEST: 'Unit Test',
  MID_TERM: 'Mid Term',
  FINAL_TERM: 'Final Term',
  INTERNAL: 'Internal',
  PRACTICAL: 'Practical',
  QUIZ: 'Quiz',
  ASSIGNMENT: 'Assignment',
};

export const ATTENDANCE_STATUS_COLORS: Record<string, string> = {
  PRESENT: 'bg-emerald-500/10 text-emerald-500',
  ABSENT: 'bg-red-500/10 text-red-500',
  LATE: 'bg-amber-500/10 text-amber-500',
  HALF_DAY: 'bg-orange-500/10 text-orange-500',
  HOLIDAY: 'bg-blue-500/10 text-blue-500',
  LEAVE: 'bg-purple-500/10 text-purple-500',
};

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  PAID: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  FAILED: 'bg-red-500/10 text-red-500 border-red-500/20',
  REFUNDED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  PARTIAL: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
};

export const DAYS_OF_WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;
