// Matches OnlineClassRequest.java
export interface OnlineClassRequest {
  title: string;
  description?: string;
  meetingLink?: string;
  meetingId?: string;
  meetingPassword?: string;
  platform?: string;
  scheduledAt: string;
  durationMinutes?: number;
  isRecurring?: boolean;
  recurrencePattern?: string;
  classRoomId: number;
  subjectId?: number;
  teacherId: number;
}

// OnlineClass entity
export interface OnlineClass {
  id: number;
  title: string;
  description: string | null;
  meetingLink: string | null;
  meetingId: string | null;
  meetingPassword: string | null;
  platform: string | null;
  scheduledAt: string;
  durationMinutes: number | null;
  isRecurring: boolean;
  recurrencePattern: string | null;
  status: string;
  recordingUrl: string | null;
  schoolId: number;
  classRoomId: number;
  subjectId: number | null;
  teacherId: number;
  createdAt: string;
  updatedAt: string | null;
}
