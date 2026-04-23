import { z } from 'zod';

// Login form schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type LoginFormData = z.infer<typeof loginSchema>;

// School creation schema
export const schoolSchema = z.object({
  name: z.string().min(1, 'School name is required').max(200),
  code: z
    .string()
    .min(3, 'Code must be at least 3 characters')
    .max(50)
    .regex(/^[A-Z0-9_-]+$/, 'Code must be uppercase letters, digits, underscores, or hyphens'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  phone: z.string().regex(/^[+]?[0-9]{10,15}$/, 'Invalid phone number').optional().or(z.literal('')),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  website: z.string().optional(),
});
export type SchoolFormData = z.infer<typeof schoolSchema>;

// Register user schema
export const registerUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(60)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, 'Must have uppercase, lowercase, and digit'),
  phone: z.string().regex(/^[+]?[0-9]{10,15}$/, 'Invalid phone number').optional().or(z.literal('')),
  role: z.enum(['PROJECT_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT']),
  schoolId: z.number().optional(),
  classRoomId: z.number().optional(),
  admissionNo: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  employeeId: z.string().optional(),
  qualification: z.string().optional(),
  joiningDate: z.string().optional(),
  parentId: z.number().optional(),
});
export type RegisterUserFormData = z.infer<typeof registerUserSchema>;

// Fee structure schema
export const feeStructureSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  feeType: z.string().min(1, 'Fee type is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  frequency: z.string().min(1, 'Frequency is required'),
  grade: z.string().optional(),
  academicYear: z.string().min(1, 'Academic year is required'),
  description: z.string().optional(),
  dueDay: z.number().min(1).max(31).optional(),
});
export type FeeStructureFormData = z.infer<typeof feeStructureSchema>;

// Fee invoice schema
export const feeInvoiceSchema = z.object({
  studentId: z.number().min(1, 'Student is required'),
  feeStructureId: z.number().min(1, 'Fee structure is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  totalAmount: z.number().min(0.01, 'Amount must be positive'),
  discountAmount: z.number().min(0).optional(),
  fineAmount: z.number().min(0).optional(),
  periodMonth: z.number().min(1).max(12).optional(),
  periodYear: z.number().optional(),
  academicYear: z.string().optional(),
  remarks: z.string().optional(),
});
export type FeeInvoiceFormData = z.infer<typeof feeInvoiceSchema>;

// Exam schema
export const examSchema = z.object({
  name: z.string().min(1, 'Exam name is required'),
  examType: z.enum(['UNIT_TEST', 'MID_TERM', 'FINAL_TERM', 'INTERNAL', 'PRACTICAL', 'QUIZ', 'ASSIGNMENT']),
  examDate: z.string().min(1, 'Exam date is required'),
  startTime: z.string().optional(),
  durationMinutes: z.number().optional(),
  totalMarks: z.number().min(1, 'Total marks must be at least 1'),
  passingMarks: z.number().min(0, 'Passing marks cannot be negative'),
  academicYear: z.string().min(1, 'Academic year is required'),
  instructions: z.string().optional(),
  classRoomId: z.number().min(1, 'Classroom is required'),
  subjectId: z.number().min(1, 'Subject is required'),
});
export type ExamFormData = z.infer<typeof examSchema>;

// Marks entry schema
export const marksEntrySchema = z.object({
  studentId: z.number(),
  examId: z.number(),
  marksObtained: z.number().min(0).optional(),
  grade: z.string().optional(),
  remarks: z.string().optional(),
  isAbsent: z.boolean().optional(),
});

// Notes schema
export const notesSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  contentUrl: z.string().url('Must be a valid URL').max(500),
  contentType: z.string().min(1, 'Content type is required'),
  subjectId: z.number().min(1, 'Subject is required'),
  grade: z.string().optional(),
  academicYear: z.string().optional(),
  isVisible: z.boolean().optional(),
});
export type NotesFormData = z.infer<typeof notesSchema>;

// Timetable entry schema
export const timetableSchema = z.object({
  dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  periodNumber: z.number().optional(),
  academicYear: z.string().min(1, 'Academic year is required'),
  classRoomId: z.number().min(1, 'Classroom is required'),
  subjectId: z.number().min(1, 'Subject is required'),
  teacherId: z.number().min(1, 'Teacher is required'),
});
export type TimetableFormData = z.infer<typeof timetableSchema>;

// Announcement schema
export const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  targetAudience: z.string().optional(),
  targetGrade: z.string().optional(),
  isPinned: z.boolean().optional(),
  expiresAt: z.string().optional(),
  attachmentUrl: z.string().optional(),
});
export type AnnouncementFormData = z.infer<typeof announcementSchema>;

// Notification schema
export const notificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  notificationType: z.enum([
    'ANNOUNCEMENT', 'FEE_REMINDER', 'EXAM_SCHEDULE', 'ATTENDANCE_ALERT',
    'RESULT_PUBLISHED', 'CLASS_SCHEDULED', 'GENERAL',
  ]),
  recipientId: z.number().optional(),
  scheduledAt: z.string().optional(),
  referenceId: z.number().optional(),
  referenceType: z.string().optional(),
});
export type NotificationFormData = z.infer<typeof notificationSchema>;

// Online class schema
export const onlineClassSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  meetingLink: z.string().optional(),
  meetingId: z.string().optional(),
  meetingPassword: z.string().optional(),
  platform: z.string().optional(),
  scheduledAt: z.string().min(1, 'Schedule time is required'),
  durationMinutes: z.number().optional(),
  isRecurring: z.boolean().optional(),
  recurrencePattern: z.string().optional(),
  classRoomId: z.number().min(1, 'Classroom is required'),
  subjectId: z.number().optional(),
  teacherId: z.number().min(1, 'Teacher is required'),
});
export type OnlineClassFormData = z.infer<typeof onlineClassSchema>;
